"use client"

import { useState } from "react"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Clock
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

const orders = [
  { id: "#001", client: "Joao Silva", phone: "(31) 99999-1111", service: "Recarga Cartucho HP 664", status: "Concluido", value: "R$ 45,00", date: "29/01/2026 14:30", payment: "Pix" },
  { id: "#002", client: "Maria Santos", phone: "(31) 99999-2222", service: "Recarga Toner Samsung MLT-D101", status: "Em andamento", value: "R$ 120,00", date: "29/01/2026 11:00", payment: "Cartao" },
  { id: "#003", client: "Carlos Oliveira", phone: "(31) 99999-3333", service: "Manutencao Impressora HP", status: "Aguardando", value: "R$ 150,00", date: "28/01/2026 16:45", payment: "Dinheiro" },
  { id: "#004", client: "Ana Costa", phone: "(31) 99999-4444", service: "Recarga Cartucho Canon PG-145", status: "Concluido", value: "R$ 55,00", date: "28/01/2026 10:20", payment: "Pix" },
  { id: "#005", client: "Pedro Lima", phone: "(31) 99999-5555", service: "Recarga Toner Brother TN-1060", status: "Concluido", value: "R$ 95,00", date: "28/01/2026 09:15", payment: "Cartao" },
  { id: "#006", client: "Fernanda Rocha", phone: "(31) 99999-6666", service: "Recarga Cartucho HP 662", status: "Cancelado", value: "R$ 40,00", date: "27/01/2026 15:30", payment: "-" },
  { id: "#007", client: "Ricardo Mendes", phone: "(31) 99999-7777", service: "Recarga Toner HP CF283A", status: "Em andamento", value: "R$ 85,00", date: "27/01/2026 11:45", payment: "Pix" },
  { id: "#008", client: "Juliana Dias", phone: "(31) 99999-8888", service: "Manutencao Impressora Epson", status: "Aguardando", value: "R$ 180,00", date: "27/01/2026 09:00", payment: "Cartao" },
]

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "aguardando", label: "Aguardando" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluido" },
  { value: "cancelado", label: "Cancelado" },
]

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || 
                          order.status.toLowerCase().replace(" ", "-") === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <DashboardHeader 
        title="Pedidos" 
        description="Gerencie todos os pedidos e servicos"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-2xl font-bold text-foreground">248</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Aguardando</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Concluidos</p>
              <p className="text-2xl font-bold text-green-600">228</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Pedidos</CardTitle>
              <CardDescription>Visualize e gerencie todos os pedidos</CardDescription>
            </div>
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Pedido</DialogTitle>
                  <DialogDescription>Cadastre um novo pedido no sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input id="client" placeholder="Nome do cliente" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="service">Servico</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o servico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recarga-cartucho">Recarga de Cartucho</SelectItem>
                        <SelectItem value="recarga-toner">Recarga de Toner</SelectItem>
                        <SelectItem value="manutencao">Manutencao de Impressora</SelectItem>
                        <SelectItem value="venda">Venda de Produto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="value">Valor</Label>
                    <Input id="value" placeholder="R$ 0,00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment">Forma de Pagamento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">Pix</SelectItem>
                        <SelectItem value="cartao">Cartao</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setIsNewOrderOpen(false)}>Salvar Pedido</Button>
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
                  placeholder="Buscar por cliente, pedido ou servico..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Pedido</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Telefone</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Servico</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Valor</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm font-medium text-foreground">{order.id}</td>
                      <td className="py-3 px-2 text-sm text-foreground">{order.client}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden lg:table-cell">{order.phone}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">{order.service}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Concluido"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Em andamento"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Cancelado"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-foreground hidden sm:table-cell">{order.value}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden lg:table-cell">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.date}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
