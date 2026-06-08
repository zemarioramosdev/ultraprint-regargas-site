"use client"

import { useState } from "react"
import {
  Plus,
  GripVertical,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBanners, Banner } from "@/hooks/useBanners"

const corOptions = [
  { value: "#1a1a2e", label: "Azul Escuro" },
  { value: "#0f3460", label: "Azul Marinho" },
  { value: "#16213e", label: "Azul Petróleo" },
  { value: "#1a1a2e", label: "Preto Azulado" },
  { value: "#2d2d2d", label: "Cinza Escuro" },
  { value: "#3d0000", label: "Vinho Escuro" },
  { value: "#0d2137", label: "Azul Noite" },
]

const emptyForm = {
  titulo: "",
  subtitulo: "",
  descricao: "",
  imagem: "",
  link_url: "",
  link_texto: "Saiba mais",
  cor_fundo: "#1a1a2e",
  ordem: 0,
  ativo: true,
}

export default function BannersPage() {
  const { banners, isLoading, create, update, remove, refetch } = useBanners()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const openNew = () => {
    setEditing(null)
    setForm({ ...emptyForm, ordem: banners.length })
    setOpen(true)
  }

  const openEdit = (b: Banner) => {
    setEditing(b)
    setForm({
      titulo: b.titulo || "",
      subtitulo: b.subtitulo || "",
      descricao: b.descricao || "",
      imagem: b.imagem || "",
      link_url: b.link_url || "",
      link_texto: b.link_texto || "Saiba mais",
      cor_fundo: b.cor_fundo || "#1a1a2e",
      ordem: b.ordem,
      ativo: b.ativo,
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const payload = {
      titulo: form.titulo || null,
      subtitulo: form.subtitulo || null,
      descricao: form.descricao || null,
      imagem: form.imagem || null,
      link_url: form.link_url || null,
      link_texto: form.link_texto || "Saiba mais",
      cor_fundo: form.cor_fundo || "#1a1a2e",
      ordem: form.ordem,
      ativo: form.ativo,
    }

    const result = editing
      ? await update(editing.id, payload)
      : await create(payload as any)

    if (result.success) {
      setOpen(false)
      setEditing(null)
    }
    setSubmitting(false)
  }

  const toggleAtivo = async (b: Banner) => {
    await update(b.id, { ativo: !b.ativo })
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este banner?")) {
      await remove(id)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Banners"
        description="Gerencie os banners rotativos da pagina inicial"
      >
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Banner
        </Button>
      </DashboardHeader>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : banners.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">Nenhum banner cadastrado</p>
              <Button onClick={openNew}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <Card key={banner.id} className={`border-l-4 ${banner.ativo ? "border-l-primary" : "border-l-muted"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: banner.cor_fundo || "#1a1a2e" }}>
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">
                          {banner.titulo || "Sem título"}
                        </p>
                        {!banner.ativo && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Inativo</span>
                        )}
                      </div>
                      {banner.subtitulo && (
                        <p className="text-sm text-muted-foreground truncate">{banner.subtitulo}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleAtivo(banner)} title={banner.ativo ? "Desativar" : "Ativar"}>
                        {banner.ativo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Banner" : "Novo Banner"}</DialogTitle>
            <DialogDescription>
              {editing ? "Edite as informacoes do banner" : "Preencha os dados para criar um novo banner"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titulo</Label>
                <Input value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} placeholder="Titulo do banner" />
              </div>
              <div className="space-y-2">
                <Label>Subtitulo</Label>
                <Input value={form.subtitulo} onChange={(e) => setForm({...form, subtitulo: e.target.value})} placeholder="Subtitulo" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descricao</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} placeholder="Descricao do banner" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input value={form.imagem} onChange={(e) => setForm({...form, imagem: e.target.value})} placeholder="https://exemplo.com/banner.jpg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link (opcional)</Label>
                <Input value={form.link_url} onChange={(e) => setForm({...form, link_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Texto do Link</Label>
                <Input value={form.link_texto} onChange={(e) => setForm({...form, link_texto: e.target.value})} placeholder="Saiba mais" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cor de Fundo</Label>
                <Select value={form.cor_fundo} onValueChange={(v) => setForm({...form, cor_fundo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {corOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.value }} />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input type="number" min={0} value={form.ordem} onChange={(e) => setForm({...form, ordem: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <Label>Ativo</Label>
                <Switch checked={form.ativo} onCheckedChange={(v) => setForm({...form, ativo: v})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Salvar" : "Criar Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
