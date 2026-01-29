"use client"

import { useState } from "react"
import { 
  Plus,
  Search,
  MoreHorizontal,
  Eye,
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

const schedules = [
  { id: 1, client: "Roberto Almeida", phone: "(31) 99999-1111", service: "Manutencao Impressora HP", date: "30/01/2026", time: "09:00", status: "Confirmado", notes: "Impressora nao liga" },
  { id: 2, client: "Lucia Ferreira", phone: "(31) 99999-2222", service: "Recarga Toner HP CF283A", date: "30/01/2026", time: "10:30", status: "Confirmado", notes: "" },
  { id: 3, client: "Fernando Souza", phone: "(31) 99999-3333", service: "Recarga Cartucho Epson", date: "30/01/2026", time: "14:00", status: "Pendente", notes: "Ligar para confirmar" },
  { id: 4, client: "Patricia Lima", phone: "(31) 99999-4444", service: "Manutencao Impressora Epson", date: "31/01/2026", time: "09:00", status: "Confirmado", notes: "Borrao na impressao" },
  { id: 5, client: "Marcos Silva", phone: "(31) 99999-5555", service: "Recarga Toner Brother", date: "31/01/2026", time: "11:00", status: "Pendente", notes: "" },
  { id: 6, client: "Carla Mendes", phone: "(31) 99999-6666", service: "Recarga Cartucho HP 664", date: "31/01/2026", time: "15:00", status: "Confirmado", notes: "" },
  { id: 7, client: "Andre Costa", phone: "(31) 99999-7777", service: "Manutencao Impressora Samsung", date: "01/02/2026", time: "10:00", status: "Cancelado", notes: "Cliente cancelou" },
  { id: 8, client: "Juliana Santos", phone: "(31) 99999-8888", service: "Recarga Cartucho Canon", date: "01/02/2026", time: "14:30", status: "Pendente", notes: "" },
]

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "cancelado", label: "Cancelado" },
]

export default function AgendamentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false)

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || 
                          schedule.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  // Group by date
  const groupedSchedules = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.date]) {
      acc[schedule.date] = []
    }
    acc[schedule.date].push(schedule)
    return acc
  }, {} as Record<string, typeof schedules>)

  return (
    <>
      <DashboardHeader 
        title="Agendamentos" 
        description="Gerencie os agendamentos de servicos"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Agendados</p>
              <p className="text-2xl font-bold text-foreground">{schedules.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Confirmados</p>
              <p className="text-2xl font-bold text-green-600">{schedules.filter(s => s.status === "Confirmado").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{schedules.filter(s => s.status === "Pendente").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Cancelados</p>
              <p className="text-2xl font-bold text-red-600">{schedules.filter(s => s.status === "Cancelado").length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedules List */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Proximos Agendamentos</CardTitle>
              <CardDescription>Visualize e gerencie todos os agendamentos</CardDescription>
            </div>
            <Dialog open={isNewScheduleOpen} onOpenChange={setIsNewScheduleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>Cadastre um novo agendamento de servico</DialogDescription>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Data</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Horario</Label>
                      <Input id="time" type="time" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Observacoes</Label>
                    <Textarea id="notes" placeholder="Observacoes sobre o servico..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewScheduleOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setIsNewScheduleOpen(false)}>Salvar Agendamento</Button>
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

            {/* Schedule Groups by Date */}
            <div className="space-y-6">
              {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{date}</h3>
                    <span className="text-xs text-muted-foreground">({daySchedules.length} agendamentos)</span>
                  </div>
                  <div className="grid gap-3">
                    {daySchedules.map((schedule) => (
                      <div 
                        key={schedule.id} 
                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                          schedule.status === "Cancelado" ? "bg-muted/50 opacity-60" : "bg-background"
                        }`}
                      >
                        <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                          <div className="text-center">
                            <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                            <span className="text-sm font-bold text-primary">{schedule.time}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{schedule.client}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              schedule.status === "Confirmado" ? "bg-green-100 text-green-800" :
                              schedule.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {schedule.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{schedule.service}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {schedule.phone}
                            </span>
                            {schedule.notes && (
                              <span className="text-xs text-muted-foreground italic">"{schedule.notes}"</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {schedule.status === "Pendente" && (
                            <>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 bg-transparent">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 bg-transparent">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredSchedules.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
