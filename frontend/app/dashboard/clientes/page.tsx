"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useClientes } from "@/hooks/useClientes"
import { useAuth } from "@/contexts/AuthContext"

const typeOptions = [
  { value: "todos", label: "Todos" },
  { value: "pf", label: "Pessoa Fisica" },
  { value: "pj", label: "Pessoa Juridica" },
]

export default function ClientesPage() {
  const { clientes, isLoading, create, update, remove } = useClientes()
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cpf: "",
  })

  const filteredClients = clientes.filter((client: any) => {
    const matchesSearch =
      client.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone?.includes(searchTerm)
    return matchesSearch
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (editingClient) {
        await update(editingClient.id, formData)
      } else {
        await create(formData)
      }
      setFormData({ nome: "", email: "", telefone: "", endereco: "", cpf: "" })
      setIsNewClientOpen(false)
      setEditingClient(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (client: any) => {
    setEditingClient(client)
    setFormData({
      nome: client.nome,
      email: client.email,
      telefone: client.telefone || "",
      endereco: client.endereco || "",
      cpf: client.cpf || "",
    })
    setIsNewClientOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await remove(id)
    }
  }

  const stats = {
    total: clientes.length,
    pf: clientes.filter((c: any) => c.cpf?.length <= 14).length,
    pj: clientes.filter((c: any) => c.cpf?.length > 14).length,
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <p>Voce precisa estar logado para acessar esta pagina.</p>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Clientes"
        description="Gerencie sua base de clientes"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pessoa Fisica</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.pf}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pessoa Juridica</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.pj}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Clientes Cadastrados</p>
              <p className="text-2xl font-bold text-primary">{isLoading ? "..." : stats.total}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Visualize e gerencie todos os clientes</CardDescription>
            </div>
            <Dialog open={isNewClientOpen} onOpenChange={(open) => {
              setIsNewClientOpen(open)
              if (!open) {
                setEditingClient(null)
                setFormData({ nome: "", email: "", telefone: "", endereco: "", cpf: "" })
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                  <DialogDescription>Cadastre um novo cliente</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome / Razao Social</Label>
                    <Input
                      id="name"
                      placeholder="Nome completo ou razao social"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document">CPF / CNPJ</Label>
                    <Input
                      id="document"
                      placeholder="000.000.000-00 ou 00.000.000/0001-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereco</Label>
                    <Input
                      id="address"
                      placeholder="Rua, numero - Bairro"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewClientOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !formData.nome || !formData.email}>
                    {isSubmitting ? "Salvando..." : "Salvar Cliente"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredClients.map((client: any) => (
                  <Card key={client.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{client.nome}</h3>
                            <p className="text-xs text-muted-foreground">
                              {client.cpf?.length > 14 ? "Pessoa Juridica" : "Pessoa Fisica"}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(client)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(client.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        {client.telefone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{client.telefone}</span>
                          </div>
                        )}
                        {client.endereco && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{client.endereco}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
