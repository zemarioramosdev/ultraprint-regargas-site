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

const stats = [
  {
    title: "Pedidos Hoje",
    value: "12",
    change: "+20%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Agendamentos",
    value: "8",
    change: "Proximos 7 dias",
    trend: "neutral",
    icon: Calendar,
  },
  {
    title: "Clientes Ativos",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Faturamento",
    value: "R$ 4.580",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
  },
]

const recentOrders = [
  { id: "#001", client: "Joao Silva", service: "Recarga Cartucho HP", status: "Concluido", value: "R$ 45,00", date: "Hoje, 14:30" },
  { id: "#002", client: "Maria Santos", service: "Recarga Toner Samsung", status: "Em andamento", value: "R$ 120,00", date: "Hoje, 11:00" },
  { id: "#003", client: "Carlos Oliveira", service: "Manutencao Impressora", status: "Aguardando", value: "R$ 150,00", date: "Ontem, 16:45" },
  { id: "#004", client: "Ana Costa", service: "Recarga Cartucho Canon", status: "Concluido", value: "R$ 55,00", date: "Ontem, 10:20" },
  { id: "#005", client: "Pedro Lima", service: "Recarga Toner Brother", status: "Concluido", value: "R$ 95,00", date: "Ontem, 09:15" },
]

const upcomingSchedules = [
  { client: "Roberto Almeida", service: "Manutencao Impressora", time: "09:00", date: "Amanha" },
  { client: "Lucia Ferreira", service: "Recarga Toner HP", time: "10:30", date: "Amanha" },
  { client: "Fernando Souza", service: "Recarga Cartucho Epson", time: "14:00", date: "Amanha" },
]

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader 
        title="Dashboard" 
        description="Bem-vindo de volta! Aqui esta o resumo de hoje."
      />

      <div className="p-6">
        {/* Stats */}
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
          {/* Recent Orders */}
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Pedido</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Servico</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-2 text-sm font-medium text-foreground">{order.id}</td>
                        <td className="py-3 px-2 text-sm text-foreground">{order.client}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">{order.service}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "Concluido"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Em andamento"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-foreground hidden sm:table-cell">{order.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Schedules */}
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
              <div className="space-y-4">
                {upcomingSchedules.map((schedule, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{schedule.client}</p>
                      <p className="text-xs text-muted-foreground truncate">{schedule.service}</p>
                      <p className="text-xs text-primary mt-1">{schedule.date} as {schedule.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
