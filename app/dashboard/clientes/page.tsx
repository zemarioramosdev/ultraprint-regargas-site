"use client"

import { useState } from "react"
import { 
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar
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

const clients = [
  { id: 1, name: "Joao Silva", email: "joao.silva@email.com", phone: "(31) 99999-1111", address: "Rua das Flores, 123 - Centro", orders: 15, lastOrder: "29/01/2026", type: "Pessoa Fisica" },
  { id: 2, name: "Maria Santos", email: "maria.santos@email.com", phone: "(31) 99999-2222", address: "Av. Brasil, 456 - Savassi", orders: 8, lastOrder: "29/01/2026", type: "Pessoa Fisica" },
  { id: 3, name: "Empresa ABC Ltda", email: "contato@abc.com.br", phone: "(31) 3333-4444", address: "Rua dos Negocios, 789 - Funcionarios", orders: 45, lastOrder: "28/01/2026", type: "Pessoa Juridica" },
  { id: 4, name: "Carlos Oliveira", email: "carlos.oliveira@email.com", phone: "(31) 99999-3333", address: "Rua das Palmeiras, 321 - Lourdes", orders: 12, lastOrder: "28/01/2026", type: "Pessoa Fisica" },
  { id: 5, name: "Ana Costa", email: "ana.costa@email.com", phone: "(31) 99999-4444", address: "Av. Amazonas, 654 - Centro", orders: 6, lastOrder: "28/01/2026", type: "Pessoa Fisica" },
  { id: 6, name: "Tech Solutions ME", email: "contato@techsolutions.com", phone: "(31) 3333-5555", address: "Rua da Tecnologia, 100 - Santa Efigenia", orders: 32, lastOrder: "27/01/2026", type: "Pessoa Juridica" },
  { id: 7, name: "Pedro Lima", email: "pedro.lima@email.com", phone: "(31) 99999-5555", address: "Rua dos Ipes, 222 - Gutierrez", orders: 9, lastOrder: "27/01/2026", type: "Pessoa Fisica" },
  { id: 8, name: "Escritorio Contabil XYZ", email: "contato@xyz.com.br", phone: "(31) 3333-6666", address: "Av. Afonso Pena, 888 - Centro", orders: 28, lastOrder: "26/01/2026", type: "Pessoa Juridica" },
]

const typeOptions = [
  { value: "todos", label: "Todos" },
  { value: "pf", label: "Pessoa Fisica" },
  { value: "pj", label: "Pessoa Juridica" },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.phone.includes(searchTerm)
    const matchesType = typeFilter === "todos" || 
                        (typeFilter === "pf" && client.type === "Pessoa Fisica") ||
                        (typeFilter === "pj" && client.type === "Pessoa Juridica")
    return matchesSearch && matchesType
  })

  return (
    <>
      <DashboardHeader 
        title="Clientes" 
        description="Gerencie sua base de clientes"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold text-foreground">{clients.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pessoa Fisica</p>
              <p className="text-2xl font-bold text-foreground">{clients.filter(c => c.type === "Pessoa Fisica").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pessoa Juridica</p>
              <p className="text-2xl font-bold text-foreground">{clients.filter(c => c.type === "Pessoa Juridica").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-2xl font-bold text-primary">{clients.reduce((acc, c) => acc + c.orders, 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Visualize e gerencie todos os clientes</CardDescription>
            </div>
            <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>Cadastre um novo cliente</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pf">Pessoa Fisica</SelectItem>
                        <SelectItem value="pj">Pessoa Juridica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome / Razao Social</Label>
                    <Input id="name" placeholder="Nome completo ou razao social" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document">CPF / CNPJ</Label>
                    <Input id="document" placeholder="000.000.000-00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Endereco</Label>
                    <Input id="address" placeholder="Rua, numero - Bairro" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewClientOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setIsNewClientOpen(false)}>Salvar Cliente</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
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

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{client.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            client.type === "Pessoa Juridica" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {client.type}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{client.orders}</p>
                        <p className="text-xs text-muted-foreground">Pedidos</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Ultimo: {client.lastOrder}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
