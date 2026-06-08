"use client"

import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { MessageSquare, Eye, Loader2, Package, Check, HelpCircle } from "lucide-react"
import { normalizeImageUrl } from "@/lib/utils"

const WHATSAPP_NUMBER = "5531971447807"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const categories = ["Todos", "Cartuchos de Tinta", "Toners", "Refis", "Impressoras", "Cartuchos", "Acessorios"]

const fallbackProducts: Produto[] = [
  { id: 1, nome: "Cartucho HP 664XL Preto", categoria: "Cartuchos de Tinta", preco: 89.90, descricao: "Cartucho de tinta HP 664XL original de alto rendimento. Ideal para impressões diárias com qualidade profissional.", estoque: 10, badge: "Mais Vendido", imagens: [] },
  { id: 2, nome: "Toner Brother TN-1060", categoria: "Toners", preco: 59.90, descricao: "Toner compatível Brother TN-1060 de excelente rendimento e nitidez. Compatível com impressoras HL-1112, HL-1202, DCP-1602.", estoque: 10, badge: "Oferta", imagens: [] },
  { id: 3, nome: "Kit Refil Epson T544", categoria: "Refis", preco: 79.90, descricao: "Kit com 4 cores de refil de tinta Epson T544 (Preto, Ciano, Magenta, Amarelo) original para impressoras EcoTank.", estoque: 10, badge: "Original", imagens: [] },
  { id: 4, nome: "Toner HP 85A CE285A", categoria: "Toners", preco: 54.90, descricao: "Cartucho de Toner HP 85A compatível de alta qualidade. Excelente rendimento para escritórios e uso doméstico.", estoque: 10, badge: "Oferta", imagens: [] },
]

interface ProdutoVariacao {
  id?: number
  nome: string
  sku?: string | null
  preco?: number | null
  estoque: number
  atributos?: Record<string, string> | null
  ativo?: boolean
}

interface ProdutoImagem {
  id?: number
  url: string
  path?: string | null
  ordem?: number
  principal?: boolean
}

interface Produto {
  id: number
  nome: string
  descricao: string | null
  categoria: string
  preco: number
  estoque: number
  badge?: string | null
  imagens?: string[]
  variacoes?: ProdutoVariacao[]
  galeria?: ProdutoImagem[]
}

export function Products() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [products, setProducts] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para controle do modal de detalhes
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [activeImage, setActiveImage] = useState<string>("")
  const [selectedVariation, setSelectedVariation] = useState<ProdutoVariacao | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/produtos/public`)
        const data = await response.json()
        if (data?.data?.length > 0) {
          setProducts(data.data.map((p: any) => ({ ...p, badge: null })))
          setIsLoading(false)
          return
        }
      } catch {
        // fallback below
      }
      setProducts(fallbackProducts)
      setIsLoading(false)
    }
    loadProducts()
  }, [])

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.categoria === activeCategory)

  const getBadgeStyle = (badge: string | null | undefined) => {
    if (!badge) return ""
    if (badge === "Oferta") return "bg-destructive text-destructive-foreground"
    if (badge === "Original") return "bg-primary text-primary-foreground"
    return "bg-foreground text-background"
  }

  const handleOpenDetails = (product: Produto) => {
    setSelectedProduct(product)
    setSelectedVariation(null)
    
    // Definir imagem inicial do modal
    if (product.galeria && product.galeria.length > 0) {
      const principal = product.galeria.find(img => img.principal) || product.galeria[0]
      setActiveImage(principal.url)
    } else if (product.imagens && product.imagens.length > 0) {
      setActiveImage(product.imagens[0])
    } else {
      setActiveImage("")
    }

    // Registrar visualização do produto
    trackEvent("visualizacao_produto", {
      produto_id: product.id,
      produto_nome: product.nome,
      categoria: product.categoria
    })
  }

  const getWhatsAppLink = (product: Produto, variation: ProdutoVariacao | null) => {
    let message = `Olá! Gostaria de fazer uma cotação/orçamento para o produto: *${product.nome}*`
    if (variation) {
      message += ` (Opção/Variação: *${variation.nome}*)`
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  return (
    <section id="produtos" className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Catálogo</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Produtos em Destaque
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Confira nossa seleção de cartuchos, toners e suprimentos. Solicite uma cotação ou orçamento instantâneo!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted/50 flex items-center justify-center cursor-pointer" onClick={() => handleOpenDetails(product)}>
                    {product.imagens && product.imagens.length > 0 ? (
                      <img
                        src={normalizeImageUrl(product.imagens[0])}
                        alt={product.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Package className="h-10 w-10 text-primary/60" />
                      </div>
                    )}
                    {product.badge && (
                      <Badge className={`absolute top-3 right-3 ${getBadgeStyle(product.badge)}`}>
                        {product.badge}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary" className="mr-2" onClick={(e) => { e.stopPropagation(); handleOpenDetails(product); }}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Características
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 cursor-pointer" onClick={() => handleOpenDetails(product)}>
                    <h3 className="font-semibold text-foreground mt-1 line-clamp-2 hover:text-primary transition-colors">{product.nome}</h3>
                    <div className="mt-2 flex flex-col gap-1">
                      <span className="text-sm font-semibold text-primary">Preço sob consulta</span>
                      {product.variacoes && product.variacoes.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {product.variacoes.length} {product.variacoes.length === 1 ? "opção disponível" : "opções disponíveis"}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" asChild>
                    <a 
                      href={getWhatsAppLink(product, null)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent("clique_whatsapp_orcamento", {
                          produto_id: product.id,
                          produto_nome: product.nome,
                          variacao: "nenhuma"
                        })
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Fazer Cotação
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              Falar com nossa equipe
            </a>
          </Button>
        </div>
      </div>

      {/* MODAL DE DETALHES E CARACTERÍSTICAS DO PRODUTO */}
      <Dialog open={selectedProduct !== null} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  {selectedProduct.nome}
                </DialogTitle>
                <DialogDescription>
                  Categoria: <span className="font-medium text-foreground">{selectedProduct.categoria}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Imagens / Galeria */}
                <div className="space-y-4">
                  <div className="aspect-square bg-muted/30 border border-border rounded-xl overflow-hidden flex items-center justify-center">
                    {activeImage ? (
                      <img
                        src={normalizeImageUrl(activeImage)}
                        alt={selectedProduct.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-24 w-24 text-muted-foreground/30" />
                    )}
                  </div>

                  {/* Miniaturas da Galeria */}
                  {selectedProduct.galeria && selectedProduct.galeria.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.galeria.map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveImage(img.url)}
                          className={`w-14 h-14 border rounded-lg overflow-hidden bg-muted/20 hover:opacity-85 transition-opacity ${
                            activeImage === img.url ? "ring-2 ring-primary border-primary" : ""
                          }`}
                        >
                          <img
                            src={normalizeImageUrl(img.url)}
                            alt={`Miniatura ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Características / Descrição */}
                <div className="flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Descrição</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {selectedProduct.descricao || "Nenhuma descrição fornecida para este produto."}
                      </p>
                    </div>

                    {/* Exibição de Variações */}
                    {selectedProduct.variacoes && selectedProduct.variacoes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                          Opções Disponíveis
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">Selecione uma opção para cotação:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.variacoes
                            .filter(v => v.ativo !== false)
                            .map((v, index) => {
                              const isSelected = selectedVariation?.nome === v.nome
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setSelectedVariation(isSelected ? null : v)}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                                    isSelected
                                      ? "bg-primary/10 border-primary text-primary shadow-xs"
                                      : "bg-background border-border text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                  {v.nome}
                                  {v.estoque === 0 && (
                                    <span className="text-[10px] text-destructive italic font-normal">(Sem estoque)</span>
                                  )}
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    )}

                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Sob Consulta / Orçamento</p>
                          <p className="text-xs text-muted-foreground">Preços e prazos definidos sob medida para sua necessidade.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-12 text-sm font-semibold gap-2 mt-4" asChild>
                    <a
                      href={getWhatsAppLink(selectedProduct, selectedVariation)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackEvent("clique_whatsapp_orcamento", {
                          produto_id: selectedProduct.id,
                          produto_nome: selectedProduct.nome,
                          variacao: selectedVariation?.nome || "nenhuma"
                        })
                      }}
                    >
                      <MessageSquare className="h-5 w-5" />
                      Solicitar Cotação / Orçamento
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
