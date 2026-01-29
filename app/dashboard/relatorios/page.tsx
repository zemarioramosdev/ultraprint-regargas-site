"use client"

import { useState } from "react"
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

const monthlyRevenue = [
  { month: "Jan", value: 12500 },
  { month: "Fev", value: 14200 },
  { month: "Mar", value: 13800 },
  { month: "Abr", value: 15600 },
  { month: "Mai", value: 16200 },
  { month: "Jun", value: 14900 },
  { month: "Jul", value: 17500 },
  { month: "Ago", value: 18200 },
  { month: "Set", value: 16800 },
  { month: "Out", value: 19500 },
  { month: "Nov", value: 21000 },
  { month: "Dez", value: 23500 },
]

const serviceBreakdown = [
  { service: "Recarga de Cartucho", percentage: 45, value: "R$ 45.000", color: "bg-primary" },
  { service: "Recarga de Toner", percentage: 30, value: "R$ 30.000", color: "bg-blue-500" },
  { service: "Manutencao", percentage: 15, value: "R$ 15.000", color: "bg-green-500" },
  { service: "Venda de Produtos", percentage: 10, value: "R$ 10.000", color: "bg-yellow-500" },
]

const topProducts = [
  { name: "Toner HP CF283A", sales: 156, revenue: "R$ 13.260" },
  { name: "Cartucho HP 664 Preto", sales: 142, revenue: "R$ 6.390" },
  { name: "Toner Samsung MLT-D101", sales: 98, revenue: "R$ 11.760" },
  { name: "Cartucho Canon PG-145", sales: 87, revenue: "R$ 4.350" },
  { name: "Toner Brother TN-1060", sales: 76, revenue: "R$ 7.220" },
]

const topClients = [
  { name: "Empresa ABC Ltda", orders: 45, revenue: "R$ 8.500" },
  { name: "Tech Solutions ME", orders: 32, revenue: "R$ 6.200" },
  { name: "Escritorio Contabil XYZ", orders: 28, revenue: "R$ 5.100" },
  { name: "Joao Silva", orders: 15, revenue: "R$ 1.200" },
  { name: "Carlos Oliveira", orders: 12, revenue: "R$ 980" },
]

export default function RelatoriosPage() {
  const [period, setPeriod] = useState("mes")

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value))

  return (
    <>
      <DashboardHeader 
        title="Relatorios" 
        description="Analise o desempenho do seu negocio"
      />

      <div className="p-6">
        {/* Period Filter */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faturamento</p>
                  <p className="text-2xl font-bold text-foreground">R$ 23.500</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +18% vs mes anterior
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">248</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +12% vs mes anterior
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Novos Clientes</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +8% vs mes anterior
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Medio</p>
                  <p className="text-2xl font-bold text-foreground">R$ 94,76</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                <TrendingDown className="h-3 w-3" />
                -3% vs mes anterior
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Faturamento Mensal
              </CardTitle>
              <CardDescription>Evolucao do faturamento ao longo do ano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-48">
                {monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                      style={{ height: `${(month.value / maxRevenue) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Distribuicao por Servico
              </CardTitle>
              <CardDescription>Faturamento por tipo de servico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceBreakdown.map((service) => (
                  <div key={service.service}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{service.service}</span>
                      <span className="text-sm text-muted-foreground">{service.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${service.color} rounded-full`}
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{service.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription>Ranking de produtos por quantidade vendida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-800" :
                      index === 1 ? "bg-gray-200 text-gray-800" :
                      index === 2 ? "bg-orange-100 text-orange-800" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">{product.revenue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Melhores Clientes
              </CardTitle>
              <CardDescription>Ranking de clientes por faturamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={client.name} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-800" :
                      index === 1 ? "bg-gray-200 text-gray-800" :
                      index === 2 ? "bg-orange-100 text-orange-800" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.orders} pedidos</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">{client.revenue}</span>
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
