"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  XCircle
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
import { Textarea } from "@/components/ui/textarea"
import { useAgendamentos } from "@/hooks/useAgendamentos"
import { useClientes } from "@/hooks/useClientes"
import { useAuth } from "@/contexts/AuthContext"

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "agendado", label: "Agendado" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluido" },
  { value: "cancelado", label: "Cancelado" },
]

export default function AgendamentosPage() {
  const { agendamentos, isLoading, create, update, remove } = useAgendamentos()
  const { clientes } = useClientes()
  const { isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false)
  const [editingAgendamento, setEditingAgendamento] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    cliente_id: "",
    servico: "",
    data_hora: "",
    status: "agendado",
    observacoes: "",
  })

  const filteredAgendamentos = agendamentos.filter((agendamento: any) => {
    const matchesSearch =
      agendamento.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.servico?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || agendamento.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const groupedSchedules = filteredAgendamentos.reduce((acc: any, agendamento: any) => {
    const date = new Date(agendamento.data_hora).toLocaleDateString("pt-BR")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(agendamento)
    return acc
  }, {})

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const agendamentoData = {
        cliente_id: parseInt(formData.cliente_id),
        servico: formData.servico,
        data_hora: formData.data_hora,
        status: formData.status as any,
        observacoes: formData.observacoes,
      }

      if (editingAgendamento) {
        await update(editingAgendamento.id, agendamentoData)
      } else {
        await create(agendamentoData)
      }
      setFormData({ cliente_id: "", servico: "", data_hora: "", status: "agendado", observacoes: "" })
      setIsNewScheduleOpen(false)
      setEditingAgendamento(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (agendamento: any) => {
    setEditingAgendamento(agendamento)
    setFormData({
      cliente_id: String(agendamento.cliente_id),
      servico: agendamento.servico,
      data_hora: agendamento.data_hora.slice(0, 16),
      status: agendamento.status,
      observacoes: agendamento.observacoes || "",
    })
    setIsNewScheduleOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      await remove(id)
    }
  }

  const stats = {
    total: agendamentos.length,
    agendado: agendamentos.filter((a: any) => a.status === "agendado").length,
    emAndamento: agendamentos.filter((a: any) => a.status === "em_andamento").length,
    concluido: agendamentos.filter((a: any) => a.status === "concluido").length,
    cancelado: agendamentos.filter((a: any) => a.status === "cancelado").length,
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      agendado: "Agendado",
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
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
        title="Agendamentos"
        description="Gerencie os agendamentos de servicos"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Agendados</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Agendados</p>
              <p className="text-2xl font-bold text-yellow-600">{isLoading ? "..." : stats.agendado}</p>
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
              <CardTitle>Proximos Agendamentos</CardTitle>
              <CardDescription>Visualize e gerencie todos os agendamentos</CardDescription>
            </div>
            <Dialog open={isNewScheduleOpen} onOpenChange={(open) => {
              setIsNewScheduleOpen(open)
              if (!open) {
                setEditingAgendamento(null)
                setFormData({ cliente_id: "", servico: "", data_hora: "", status: "agendado", observacoes: "" })
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingAgendamento ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
                  <DialogDescription>Cadastre um novo agendamento de servico</DialogDescription>
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
                    <Label htmlFor="service">Servico</Label>
                    <Select value={formData.servico} onValueChange={(value) => setFormData({ ...formData, servico: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o servico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Recarga de Cartucho">Recarga de Cartucho</SelectItem>
                        <SelectItem value="Recarga de Toner">Recarga de Toner</SelectItem>
                        <SelectItem value="Manutencao de Impressora">Manutencao de Impressora</SelectItem>
                        <SelectItem value="Venda de Produto">Venda de Produto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.data_hora.split("T")[0] || ""}
                        onChange={(e) => {
                          const time = formData.data_hora.split("T")[1] || "09:00"
                          setFormData({ ...formData, data_hora: `${e.target.value}T${time}` })
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Horario</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.data_hora.split("T")[1] || "09:00"}
                        onChange={(e) => {
                          const date = formData.data_hora.split("T")[0] || new Date().toISOString().split("T")[0]
                          setFormData({ ...formData, data_hora: `${date}T${e.target.value}` })
                        }}
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
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="em_andamento">Em andamento</SelectItem>
                        <SelectItem value="concluido">Concluido</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observacoes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Observacoes sobre o servico..."
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewScheduleOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !formData.cliente_id || !formData.servico || !formData.data_hora}>
                    {isSubmitting ? "Salvando..." : "Salvar Agendamento"}
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
                  placeholder="Buscar por cliente ou servico..."
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
            ) : filteredAgendamentos.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSchedules).map(([date, schedules]: [string, any]) => (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
                    <div className="space-y-3">
                      {schedules.map((agendamento: any) => (
                        <div key={agendamento.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{agendamento.cliente?.nome || `Cliente #${agendamento.cliente_id}`}</p>
                              <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                              <p className="text-xs text-primary mt-1">{formatTime(agendamento.data_hora)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                              {getStatusLabel(agendamento.status)}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(agendamento)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(agendamento.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
