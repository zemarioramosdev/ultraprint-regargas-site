"use client"

import { useState, useMemo } from "react"
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/header"
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

export default function RelatoriosPage() {
  const { pedidos, isLoading: loadingPedidos } = usePedidos()
  const { clientes, isLoading: loadingClientes } = useClientes()
  const { produtos, isLoading: loadingProdutos } = useProdutos()
  const { isAuthenticated } = useAuth()
  const [period, setPeriod] = useState("mes")

  const isLoading = loadingPedidos || loadingClientes || loadingProdutos

  const safePedidos = Array.isArray(pedidos) ? pedidos : []
  const safeClientes = Array.isArray(clientes) ? clientes : []
  const safeProdutos = Array.isArray(produtos) ? produtos : []

  const stats = useMemo(() => {
    const totalFaturamento = safePedidos
      .filter((p: any) => p.status === "concluido")
      .reduce((acc: number, p: any) => acc + Number(p.valor_total), 0)

    const totalPedidos = safePedidos.length
    const pedidosConcluidos = safePedidos.filter((p: any) => p.status === "concluido").length
    const ticketMedio = pedidosConcluidos > 0 ? totalFaturamento / pedidosConcluidos : 0

    return {
      faturamento: totalFaturamento,
      pedidos: totalPedidos,
      clientes: safeClientes.length,
      ticketMedio,
    }
  }, [safePedidos, safeClientes])

  const monthlyRevenue = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const currentMonth = new Date().getMonth()

    const revenueByMonth = months.map((month, index) => {
      const monthOrders = safePedidos.filter((p: any) => {
        if (p.status !== "concluido") return false
        const orderMonth = new Date(p.created_at).getMonth()
        const orderYear = new Date(p.created_at).getFullYear()
        const currentYear = new Date().getFullYear()

        if (period === "ano") {
          return orderYear === currentYear && orderMonth === index
        }

        const monthsAgo = period === "mes" ? 1 : period === "trimestre" ? 3 : period === "semana" ? 0 : 1
        const targetMonth = (currentMonth - monthsAgo + 12) % 12
        return orderYear === currentYear && orderMonth === targetMonth
      })

      return {
        month,
        value: monthOrders.reduce((acc: number, p: any) => acc + Number(p.valor_total), 0),
      }
    })

    return revenueByMonth
  }, [safePedidos, period])

  const serviceBreakdown = useMemo(() => {
    const result: Record<string, { count: number; value: number }> = {}
    safeProdutos.forEach((p: any) => {
      const cat = p.categoria || "Outros"
      if (!result[cat]) result[cat] = { count: 0, value: 0 }
      result[cat].count += 1
      result[cat].value += Number(p.preco) * p.estoque
    })

    const total = Object.values(result).reduce((acc, cat) => acc + cat.value, 0)

    return Object.entries(result).map(([service, data]) => ({
      service,
      percentage: total > 0 ? (data.value / total) * 100 : 0,
      value: `R$ ${data.value.toFixed(2).replace(".", ",")}`,
      color: "bg-primary",
    }))
  }, [safeProdutos])

  const topProducts = useMemo(() => {
    const productSales: Record<number, { name: string; sales: number; revenue: number }> = {}

    safePedidos.forEach((pedido: any) => {
      if (!productSales[pedido.produto_id]) {
        productSales[pedido.produto_id] = {
          name: pedido.produto?.nome || `Produto #${pedido.produto_id}`,
          sales: 0,
          revenue: 0,
        }
      }
      productSales[pedido.produto_id].sales += pedido.quantidade
      productSales[pedido.produto_id].revenue += Number(pedido.valor_total)
    })

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        sales: p.sales,
        revenue: `R$ ${p.revenue.toFixed(2).replace(".", ",")}`,
      }))
  }, [safePedidos])

  const topClients = useMemo(() => {
    const clientSales: Record<number, { name: string; orders: number; revenue: number }> = {}

    safePedidos.forEach((pedido: any) => {
      if (!clientSales[pedido.cliente_id]) {
        clientSales[pedido.cliente_id] = {
          name: pedido.cliente?.nome || `Cliente #${pedido.cliente_id}`,
          orders: 0,
          revenue: 0,
        }
      }
      clientSales[pedido.cliente_id].orders += 1
      clientSales[pedido.cliente_id].revenue += Number(pedido.valor_total)
    })

    return Object.values(clientSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        orders: c.orders,
        revenue: `R$ ${c.revenue.toFixed(2).replace(".", ",")}`,
      }))
  }, [safePedidos])

  const maxRevenue = Math.max(...monthlyRevenue.map((m: any) => m.value), 1)

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
        title="Relatorios"
        description="Analise o desempenho do seu negocio"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Selecione o periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Ultima Semana</SelectItem>
              <SelectItem value="mes">Ultimo Mes</SelectItem>
              <SelectItem value="trimestre">Ultimo Trimestre</SelectItem>
              <SelectItem value="ano">Ultimo Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatorio
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faturamento</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? "..." : `R$ ${stats.faturamento.toFixed(2).replace(".", ",")}`}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                Total acumulado
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? "..." : stats.pedidos}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                {stats.pedidos} pedidos totais
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? "..." : stats.clientes}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                Clientes cadastrados
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Medio</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? "..." : `R$ ${stats.ticketMedio.toFixed(2).replace(".", ",")}`}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                Por pedido concluido
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Faturamento Mensal
              </CardTitle>
              <CardDescription>Evolucao do faturamento por mes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <div className="flex items-end justify-between gap-2 h-48">
                  {monthlyRevenue.map((month: any) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                        style={{ height: `${(month.value / maxRevenue) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{month.month}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Distribuicao por Servico
              </CardTitle>
              <CardDescription>Categorias de produtos mais vendidos</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : serviceBreakdown.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  Nenhum dado disponivel
                </div>
              ) : (
                <div className="space-y-3">
                  {serviceBreakdown.map((item: any) => (
                    <div key={item.service} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.service}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription>Top 5 produtos por receita</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : topProducts.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  Nenhum produto vendido ainda
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                      </div>
                      <span className="font-bold text-primary">{product.revenue}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Clientes Mais Ativos
              </CardTitle>
              <CardDescription>Top 5 clientes por receita</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : topClients.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  Nenhum cliente com pedidos ainda
                </div>
              ) : (
                <div className="space-y-3">
                  {topClients.map((client: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.orders} pedidos</p>
                      </div>
                      <span className="font-bold text-primary">{client.revenue}</span>
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
