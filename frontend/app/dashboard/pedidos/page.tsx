"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
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
import { usePedidos } from "@/hooks/usePedidos"
import { useClientes } from "@/hooks/useClientes"
import { useProdutos } from "@/hooks/useProdutos"
import { useAuth } from "@/contexts/AuthContext"

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluido" },
  { value: "cancelado", label: "Cancelado" },
]

export default function PedidosPage() {
  const { pedidos, isLoading, create, update, remove } = usePedidos()
  const { clientes } = useClientes()
  const { produtos } = useProdutos()
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [editingPedido, setEditingPedido] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    cliente_id: "",
    produto_id: "",
    quantidade: "1",
    valor_total: "",
    status: "pendente",
    observacoes: "",
  })

  const filteredPedidos = pedidos.filter((pedido: any) => {
    const matchesSearch =
      pedido.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id?.toString().includes(searchTerm) ||
      pedido.produto?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const pedidoData = {
        cliente_id: parseInt(formData.cliente_id),
        produto_id: parseInt(formData.produto_id),
        quantidade: parseInt(formData.quantidade),
        valor_total: parseFloat(formData.valor_total),
        status: formData.status as any,
        observacoes: formData.observacoes,
      }

      if (editingPedido) {
        await update(editingPedido.id, pedidoData)
      } else {
        await create(pedidoData)
      }
      setFormData({ cliente_id: "", produto_id: "", quantidade: "1", valor_total: "", status: "pendente", observacoes: "" })
      setIsNewOrderOpen(false)
      setEditingPedido(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (pedido: any) => {
    setEditingPedido(pedido)
    setFormData({
      cliente_id: String(pedido.cliente_id),
      produto_id: String(pedido.produto_id),
      quantidade: String(pedido.quantidade),
      valor_total: String(pedido.valor_total),
      status: pedido.status,
      observacoes: pedido.observacoes || "",
    })
    setIsNewOrderOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      await remove(id)
    }
  }

  const stats = {
    total: pedidos.length,
    pendente: pedidos.filter((p: any) => p.status === "pendente").length,
    emAndamento: pedidos.filter((p: any) => p.status === "em_andamento").length,
    concluido: pedidos.filter((p: any) => p.status === "concluido").length,
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: "Pendente",
      em_andamento: "Em andamento",
      concluido: "Concluido",
      cancelado: "Cancelado",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    if (status === "concluido") return "bg-green-100 text-green-800"
    if (status === "em_andamento") return "bg-blue-100 text-blue-800"
    if (status === "cancelado") return "bg-red-100 text-red-800"
    return "bg-yellow-100 text-yellow-800"
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
        title="Pedidos"
        description="Gerencie todos os pedidos e servicos"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Aguardando</p>
              <p className="text-2xl font-bold text-yellow-600">{isLoading ? "..." : stats.pendente}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Em Andamento</p>
              <p className="text-2xl font-bold text-blue-600">{isLoading ? "..." : stats.emAndamento}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Concluidos</p>
              <p className="text-2xl font-bold text-green-600">{isLoading ? "..." : stats.concluido}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Pedidos</CardTitle>
              <CardDescription>Visualize e gerencie todos os pedidos</CardDescription>
            </div>
            <Dialog open={isNewOrderOpen} onOpenChange={(open) => {
              setIsNewOrderOpen(open)
              if (!open) {
                setEditingPedido(null)
                setFormData({ cliente_id: "", produto_id: "", quantidade: "1", valor_total: "", status: "pendente", observacoes: "" })
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingPedido ? "Editar Pedido" : "Novo Pedido"}</DialogTitle>
                  <DialogDescription>Cadastre um novo pedido no sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((client: any) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product">Produto/Servico</Label>
                    <Select value={formData.produto_id} onValueChange={(value) => setFormData({ ...formData, produto_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto: any) => (
                          <SelectItem key={produto.id} value={String(produto.id)}>
                            {produto.nome} - R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="value">Valor Total</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.valor_total}
                        onChange={(e) => setFormData({ ...formData, valor_total: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_andamento">Em andamento</SelectItem>
                        <SelectItem value="concluido">Concluido</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observacoes</Label>
                    <Input
                      id="notes"
                      placeholder="Observacoes sobre o pedido..."
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !formData.cliente_id || !formData.produto_id}>
                    {isSubmitting ? "Salvando..." : "Salvar Pedido"}
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
                  placeholder="Buscar por cliente, pedido ou servico..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
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
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredPedidos.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Produto</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Valor</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Data</th>
                      <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPedidos.map((pedido: any) => (
                      <tr key={pedido.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-2 text-sm font-medium text-foreground">#{String(pedido.id).padStart(3, "0")}</td>
                        <td className="py-3 px-2 text-sm text-foreground">{pedido.cliente?.nome || `Cliente #${pedido.cliente_id}`}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">
                          {pedido.produto?.nome || `Produto #${pedido.produto_id}`}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                            {getStatusLabel(pedido.status)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-foreground hidden sm:table-cell">
                          R$ {Number(pedido.valor_total).toFixed(2).replace(".", ",")}
                        </td>
                        <td className="py-3 px-2 text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(pedido)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(pedido.id)}>
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
