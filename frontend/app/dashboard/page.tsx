"use client"

import Link from "next/link"
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
import { usePedidos } from "@/hooks/usePedidos"
import { useAgendamentos } from "@/hooks/useAgendamentos"
import { useClientes } from "@/hooks/useClientes"

export default function DashboardPage() {
  const { pedidos, isLoading: loadingPedidos } = usePedidos()
  const { agendamentos, isLoading: loadingAgendamentos } = useAgendamentos()
  const { clientes, isLoading: loadingClientes } = useClientes()

  const isLoading = loadingPedidos || loadingAgendamentos || loadingClientes

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const safePedidos = Array.isArray(pedidos) ? pedidos : []
  const safeAgendamentos = Array.isArray(agendamentos) ? agendamentos : []
  const safeClientes = Array.isArray(clientes) ? clientes : []

  const pedidosToday = safePedidos.filter((p: any) => {
    const date = new Date(p.created_at)
    return date >= today
  })

  const agendamentosProximos = safeAgendamentos.filter((a: any) => {
    const date = new Date(a.data_hora)
    return date >= today && date <= nextWeek
  }).slice(0, 5)

  const clientesAtivos = safeClientes.length

  const faturamentoTotal = safePedidos.reduce((acc: number, p: any) => {
    if (p.status === "concluido") {
      return acc + Number(p.valor_total)
    }
    return acc
  }, 0)

  const recentOrders = safePedidos.slice(0, 5)

  const stats = [
    {
      title: "Pedidos Hoje",
      value: String(pedidosToday.length),
      change: `${pedidos.length} total`,
      trend: "up",
      icon: ShoppingBag,
    },
    {
      title: "Agendamentos",
      value: String(agendamentosProximos.length),
      change: "Proximos 7 dias",
      trend: "neutral",
      icon: Calendar,
    },
    {
      title: "Clientes Ativos",
      value: String(clientesAtivos),
      change: "Cadastrados",
      trend: "up",
      icon: Users,
    },
    {
      title: "Faturamento",
      value: `R$ ${faturamentoTotal.toFixed(2).replace(".", ",")}`,
      change: "Total concluido",
      trend: "up",
      icon: TrendingUp,
    },
  ]

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const isToday = date.toDateString() === new Date().toDateString()
    const isTomorrow = new Date(date.getTime() + 86400000).toDateString() === new Date().toDateString()

    if (isToday) return "Hoje"
    if (isTomorrow) return "Amanha"
    return date.toLocaleDateString("pt-BR")
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader
          title="Dashboard"
          description="Carregando..."
        />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Bem-vindo de volta! Aqui esta o resumo de hoje."
      />

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-600" />}
                  {stat.trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-600" />}
                  <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>Ultimos pedidos e servicos solicitados</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/pedidos">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum pedido cadastrado ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">ID</th>
                        <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Cliente</th>
                        <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Valor</th>
                        <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-2 text-sm font-medium text-foreground">#{String(order.id).padStart(3, "0")}</td>
                          <td className="py-3 px-2 text-sm text-foreground">{order.cliente?.nome || `Cliente #${order.cliente_id}`}</td>
                          <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">
                            R$ {Number(order.valor_total).toFixed(2).replace(".", ",")}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground hidden sm:table-cell">
                            {new Date(order.created_at).toLocaleDateString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Proximos Agendamentos</CardTitle>
                <CardDescription>Servicos agendados</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/agendamentos">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {agendamentosProximos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum agendamento proximo.
                </p>
              ) : (
                <div className="space-y-4">
                  {agendamentosProximos.map((schedule) => (
                    <div key={schedule.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{schedule.cliente?.nome || `Cliente #${schedule.cliente_id}`}</p>
                        <p className="text-xs text-muted-foreground truncate">{schedule.servico}</p>
                        <p className="text-xs text-primary mt-1">
                          {formatDate(schedule.data_hora)} as {formatTime(schedule.data_hora)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
