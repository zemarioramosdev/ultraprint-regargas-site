"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Produto, ProdutoVariacao, ProdutoImagem } from "@/hooks/useProdutos"
import { api } from "@/lib/api"
import { normalizeImageUrl } from "@/lib/utils"

interface ProductFormProps {
  initialData?: Produto
  onSubmit: (data: any) => Promise<boolean>
  isSubmitting: boolean
}

interface ImagemItem {
  id?: number
  url: string // Object URL temporária ou URL real
  file?: File // Definido apenas se for uma nova imagem local
  ordem: number
  principal: boolean
  path?: string | null
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("info")

  // Informações Gerais & Preço
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    sku: "",
    ativo: true,
    preco: "",
    estoque: "",
    estoque_minimo: "5",
  })

  // Variações
  const [variacoes, setVariacoes] = useState<ProdutoVariacao[]>([])
  const [novaVariacao, setNovaVariacao] = useState({
    nome: "",
    sku: "",
    preco: "",
    estoque: 0,
    cor: "",
    tamanho: "",
  })

  // Galeria de Imagens Unificada
  const [itensGaleria, setItensGaleria] = useState<ImagemItem[]>([])
  
  // Mensagens de erro/validação
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  // Carregar dados iniciais (se for edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        descricao: initialData.descricao || "",
        categoria: initialData.categoria,
        sku: initialData.sku || "",
        ativo: initialData.ativo !== false,
        preco: String(initialData.preco),
        estoque: String(initialData.estoque),
        estoque_minimo: String(initialData.estoque_minimo || 5),
      })
      setVariacoes(initialData.variacoes || [])
      
      const galeriaInicial: ImagemItem[] = (initialData.galeria || []).map((img, idx) => ({
        id: img.id,
        url: normalizeImageUrl(img.url),
        ordem: img.ordem ?? idx,
        principal: img.principal ?? false,
        path: img.path
      }))
      setItensGaleria(galeriaInicial)
    }
  }, [initialData])

  // --- MÉTODOS DE CONTROLE DA GALERIA UNIFICADA ---
  
  // Lidar com seleção de arquivos
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      // Limitar o tamanho da imagem até 2.7MB (2.7 * 1024 * 1024 = 2831155 bytes)
      const MAX_SIZE = 2.7 * 1024 * 1024
      const invalidFiles = files.filter(file => file.size > MAX_SIZE)
      
      if (invalidFiles.length > 0) {
        alert("Uma ou mais imagens excedem o tamanho máximo permitido de 2,7MB e foram ignoradas.")
      }
      
      const validFiles = files.filter(file => file.size <= MAX_SIZE)
      
      const novosItens: ImagemItem[] = validFiles.map((file, idx) => ({
        url: URL.createObjectURL(file),
        file: file,
        ordem: itensGaleria.length + idx,
        principal: itensGaleria.length === 0 && idx === 0, // Define como principal se a galeria estiver vazia
        path: null
      }))
      
      setItensGaleria([...itensGaleria, ...novosItens])
    }
  }

  // Remover imagem (seja local ou existente)
  const removeImage = (index: number) => {
    const itemRemovido = itensGaleria[index]
    const novaGaleria = itensGaleria.filter((_, i) => i !== index)
    
    // Se removeu a imagem principal, definir outra como principal
    if (itemRemovido.principal && novaGaleria.length > 0) {
      novaGaleria[0].principal = true
    }
    
    // Reordenar a lista para manter a consistência da ordem
    const reordered = novaGaleria.map((img, idx) => ({
      ...img,
      ordem: idx
    }))
    
    setItensGaleria(reordered)
  }

  // Definir imagem como principal (Destaque)
  const setAsPrincipal = (index: number) => {
    const updated = itensGaleria.map((img, i) => ({
      ...img,
      principal: i === index
    }))
    setItensGaleria(updated)
  }

  // Mover imagem na galeria (reordenação)
  const moveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return
    if (direction === "right" && index === itensGaleria.length - 1) return

    const newIndex = direction === "left" ? index - 1 : index + 1
    const updated = [...itensGaleria]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Reatribuir a ordem com base nos novos índices
    const reordered = updated.map((img, idx) => ({
      ...img,
      ordem: idx
    }))

    setItensGaleria(reordered)
  }

  // --- MÉTODOS DE CONTROLE DE VARIAÇÕES ---
  
  const handleAddVariacao = () => {
    if (!novaVariacao.nome) {
      if (novaVariacao.cor || novaVariacao.tamanho) {
        const partes = []
        if (novaVariacao.cor) partes.push(novaVariacao.cor)
        if (novaVariacao.tamanho) partes.push(novaVariacao.tamanho)
        novaVariacao.nome = partes.join(" - ")
      } else {
        alert("Digite um nome ou informe atributos para a variação")
        return
      }
    }

    const nova: ProdutoVariacao = {
      nome: novaVariacao.nome,
      sku: novaVariacao.sku || null,
      preco: novaVariacao.preco ? parseFloat(novaVariacao.preco) : null,
      estoque: Number(novaVariacao.estoque) || 0,
      atributos: {
        cor: novaVariacao.cor,
        tamanho: novaVariacao.tamanho,
      },
      ativo: true
    }

    setVariacoes([...variacoes, nova])
    setNovaVariacao({
      nome: "",
      sku: "",
      preco: "",
      estoque: 0,
      cor: "",
      tamanho: "",
    })
  }

  const handleRemoveVariacao = (index: number) => {
    setVariacoes(variacoes.filter((_, i) => i !== index))
  }

  const handleToggleVariacao = (index: number) => {
    const updated = [...variacoes]
    updated[index].ativo = !updated[index].ativo
    setVariacoes(updated)
  }

  // --- SUBMISSÃO DO FORMULÁRIO ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validações básicas
    if (!formData.nome) {
      setFormError("O nome do produto é obrigatório")
      setActiveTab("info")
      return
    }
    if (!formData.categoria) {
      setFormError("A categoria do produto é obrigatória")
      setActiveTab("info")
      return
    }
    if (!formData.preco || isNaN(parseFloat(formData.preco))) {
      setFormError("Informe um preço base válido")
      setActiveTab("price")
      return
    }
    if (!formData.estoque || isNaN(parseInt(formData.estoque))) {
      setFormError("Informe um estoque base válido")
      setActiveTab("price")
      return
    }

    setUploadingImages(true)
    try {
      const galeriaFinal: ProdutoImagem[] = []
      
      // Processar cada imagem (se local, fazer upload. Se existente, apenas repassar)
      for (let i = 0; i < itensGaleria.length; i++) {
        const item = itensGaleria[i]
        
        if (item.file) {
          // Enviar arquivo local
          const res = await api.upload<{ url: string; path: string }>("/upload", item.file)
          if (res.data?.url) {
            galeriaFinal.push({
              url: res.data.url,
              path: res.data.path || null,
              ordem: item.ordem,
              principal: item.principal
            })
          } else {
            throw new Error(res.error || "Erro ao fazer upload da imagem")
          }
        } else {
          // Manter imagem existente
          galeriaFinal.push({
            id: item.id,
            url: item.url,
            path: item.path,
            ordem: item.ordem,
            principal: item.principal
          })
        }
      }

      // Garantir que temos uma imagem principal selecionada
      const temPrincipal = galeriaFinal.some(img => img.principal)
      if (!temPrincipal && galeriaFinal.length > 0) {
        galeriaFinal[0].principal = true
      }

      const productData = {
        nome: formData.nome,
        descricao: formData.descricao,
        categoria: formData.categoria,
        sku: formData.sku || null,
        ativo: formData.ativo,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque),
        estoque_minimo: parseInt(formData.estoque_minimo) || 5,
        variacoes: variacoes,
        galeria: galeriaFinal
      }

      const success = await onSubmit(productData)
      if (success) {
        router.push("/dashboard/produtos")
      }
    } catch (err: any) {
      console.error(err)
      setFormError(err.message || "Erro ao salvar produto. Verifique os campos e tente novamente.")
    } finally {
      setUploadingImages(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {formError && (
        <Card className="border-destructive/50 bg-destructive/10 text-destructive text-sm p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{formError}</p>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-6">
          <TabsTrigger value="info">
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Informações</span>
          </TabsTrigger>
          <TabsTrigger value="price">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Preço e Estoque</span>
          </TabsTrigger>
          <TabsTrigger value="variations">
            <Layers className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Variações</span>
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <ImageIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Galeria</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INFORMAÇÕES GERAIS */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Cadastre os dados básicos do seu produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Cartucho HP 664XL Preto"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU / Código do Produto</Label>
                  <Input
                    id="sku"
                    placeholder="Ex: HP-664XL-PR"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={val => setFormData({ ...formData, categoria: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cartuchos">Cartuchos</SelectItem>
                      <SelectItem value="Toners">Toners</SelectItem>
                      <SelectItem value="Impressoras">Impressoras</SelectItem>
                      <SelectItem value="Acessorios">Acessórios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição Completa</Label>
                <Textarea
                  id="descricao"
                  placeholder="Detalhes sobre compatibilidade, rendimento e especificações técnicas..."
                  rows={5}
                  value={formData.descricao}
                  onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={checked => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo" className="cursor-pointer">
                  Disponível para venda no site (Ativo)
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/produtos")}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => setActiveTab("price")}>
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* TAB 2: PREÇO E ESTOQUE BASE */}
        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preço e Estoque Base</CardTitle>
              <CardDescription>Defina as informações de valores e estoque principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="preco">Preço de Venda (R$) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      className="pl-9"
                      value={formData.preco}
                      onChange={e => setFormData({ ...formData, preco: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estoque">Estoque Atual *</Label>
                  <Input
                    id="estoque"
                    type="number"
                    placeholder="0"
                    value={formData.estoque}
                    onChange={e => setFormData({ ...formData, estoque: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estoque_minimo">Estoque Mínimo (Alerta)</Label>
                  <Input
                    id="estoque_minimo"
                    type="number"
                    placeholder="5"
                    value={formData.estoque_minimo}
                    onChange={e => setFormData({ ...formData, estoque_minimo: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab("info")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button type="button" onClick={() => setActiveTab("variations")}>
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* TAB 3: VARIAÇÕES DE PRODUTO */}
        <TabsContent value="variations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variações do Produto</CardTitle>
              <CardDescription>
                Se o seu produto tem variações (ex: cores diferentes, tamanhos, modelos), cadastre-as abaixo.
                Cada variação tem controle independente de preço e estoque.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para adicionar nova variação */}
              <div className="border rounded-lg p-4 bg-muted/20 space-y-4">
                <h4 className="font-semibold text-sm">Adicionar Variação</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="var_cor">Cor (opcional)</Label>
                    <Input
                      id="var_cor"
                      placeholder="Ex: Preto, Colorido"
                      value={novaVariacao.cor}
                      onChange={e => setNovaVariacao({ ...novaVariacao, cor: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="var_tamanho">Modelo / Tamanho (opcional)</Label>
                    <Input
                      id="var_tamanho"
                      placeholder="Ex: XL, 2ml, Original"
                      value={novaVariacao.tamanho}
                      onChange={e => setNovaVariacao({ ...novaVariacao, tamanho: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="var_nome">Nome Customizado</Label>
                    <Input
                      id="var_nome"
                      placeholder="Ex: Preto - XL (ou deixe em branco)"
                      value={novaVariacao.nome}
                      onChange={e => setNovaVariacao({ ...novaVariacao, nome: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="var_sku">SKU da Variação</Label>
                    <Input
                      id="var_sku"
                      placeholder="Ex: HP-664XL-PR-V1"
                      value={novaVariacao.sku}
                      onChange={e => setNovaVariacao({ ...novaVariacao, sku: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="var_preco">Preço Diferenciado (opcional)</Label>
                    <Input
                      id="var_preco"
                      type="number"
                      step="0.01"
                      placeholder="Usa preço padrão se vazio"
                      value={novaVariacao.preco}
                      onChange={e => setNovaVariacao({ ...novaVariacao, preco: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="var_estoque">Estoque da Variação *</Label>
                    <Input
                      id="var_estoque"
                      type="number"
                      placeholder="0"
                      value={novaVariacao.estoque}
                      onChange={e => setNovaVariacao({ ...novaVariacao, estoque: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <Button type="button" onClick={handleAddVariacao} className="w-full sm:w-auto mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Incluir Variação
                </Button>
              </div>

              {/* Tabela de Variações Existentes */}
              {variacoes.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-muted-foreground text-sm">Este produto não possui variações cadastradas.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground font-medium text-left">
                        <th className="p-3">Nome / Descrição</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Preço</th>
                        <th className="p-3">Estoque</th>
                        <th className="p-3">Ativo</th>
                        <th className="p-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variacoes.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/10">
                          <td className="p-3 font-medium text-foreground">{item.nome}</td>
                          <td className="p-3 text-muted-foreground">{item.sku || "-"}</td>
                          <td className="p-3">
                            {item.preco ? `R$ ${Number(item.preco).toFixed(2)}` : <span className="text-xs text-muted-foreground italic">Padrão</span>}
                          </td>
                          <td className="p-3">{item.estoque} unid.</td>
                          <td className="p-3">
                            <Switch
                              checked={item.ativo !== false}
                              onCheckedChange={() => handleToggleVariacao(idx)}
                            />
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive h-8 w-8 hover:bg-destructive/10"
                              onClick={() => handleRemoveVariacao(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab("price")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button type="button" onClick={() => setActiveTab("gallery")}>
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        {/* TAB 4: GALERIA DE IMAGENS */}
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Imagens</CardTitle>
              <CardDescription>
                Adicione fotos do produto (tamanho máximo: 2,7MB por arquivo). Defina qual imagem será exibida como destaque (principal).
                Ordene as fotos conforme deseja que apareçam.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag & Drop Upload Container */}
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center bg-muted/10 hover:bg-muted/20 transition-all relative">
                <label className="flex flex-col items-center justify-center gap-3 cursor-pointer group">
                  <div className="p-3 rounded-full bg-background border shadow-xs group-hover:scale-105 transition-transform">
                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Arraste e solte arquivos aqui ou clique para buscar</p>
                    <p className="text-xs text-muted-foreground mt-1">Imagens no formato JPEG, PNG, WEBP ou GIF (Limite de 2,7MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Lista/Grid de Fotos */}
              {itensGaleria.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Visualização da Galeria</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {itensGaleria.map((img, index) => (
                      <div
                        key={`galeria-item-${index}`}
                        className={`relative aspect-square border rounded-xl overflow-hidden group bg-muted flex flex-col justify-between ${
                          img.principal ? "ring-2 ring-primary border-primary" : ""
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Galeria ${index}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Indicador de Imagem Destaque (Principal) */}
                        {img.principal && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 shadow-sm">
                            <Star className="h-3 w-3 fill-current" />
                            Destaque
                          </div>
                        )}

                        {/* Indicador se a imagem é nova (ainda local) */}
                        {img.file && (
                          <div className="absolute bottom-2 left-2 bg-yellow-500 text-black text-[9px] px-1.5 py-0.5 rounded-md font-bold shadow-sm opacity-80 group-hover:opacity-0 transition-opacity">
                            Novo
                          </div>
                        )}

                        {/* Ações Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between items-center w-full">
                            <button
                              type="button"
                              onClick={() => setAsPrincipal(index)}
                              className="bg-background/80 backdrop-blur-xs text-foreground p-1.5 rounded-lg hover:bg-background transition-colors text-xs font-semibold flex items-center gap-1"
                              title="Tornar Destaque"
                            >
                              <Star className={`h-3.5 w-3.5 ${img.principal ? "fill-yellow-500 text-yellow-500" : ""}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                              title="Excluir imagem"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex justify-center gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => moveImage(index, "left")}
                              disabled={index === 0}
                              className="bg-background/80 text-foreground p-1 rounded-md hover:bg-background disabled:opacity-50"
                            >
                              <ArrowLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, "right")}
                              disabled={index === itensGaleria.length - 1}
                              className="bg-background/80 text-foreground p-1 rounded-md hover:bg-background disabled:opacity-50"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab("variations")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingImages}
              className="bg-primary hover:bg-primary/95 text-primary-foreground min-w-[150px]"
            >
              {isSubmitting || uploadingImages ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Produto"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
