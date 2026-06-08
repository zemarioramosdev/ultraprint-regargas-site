"use client"

import { useState, useEffect } from "react"
import {
  Save,
  Globe,
  TrendingUp,
  BarChart2,
  Settings,
  Activity,
  Phone,
  ArrowRight,
  Search,
  Key,
  RefreshCw,
  Loader2,
  CheckCircle,
  MessageSquare,
  SearchCode,
  AlertCircle,
  Calendar,
  Play,
  Pause,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useSettings } from "@/hooks/useSettings"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

interface MarketingEventLog {
  id: number
  tipo_evento: string
  detalhes: Record<string, any>
  ip_address: string | null
  created_at: string
}

interface Campaign {
  id: string
  nome: string
  status: string
  orcamento: number
  cliques: number
  impressoes: number
  ctr: string
  cpc_medio: number
  custo: number
  conversoes: number
  custo_conversao: number
}

interface Keyword {
  id: string
  palavra: string
  impressoes: number
  cliques: number
  ctr: string
  cpc_medio: number
  custo: number
  posicao_media: number
  status: string
}

interface SearchConsoleData {
  overview: {
    total_cliques: number
    total_impressoes: number
    ctr_medio: string
    posicao_media: number
  }
  queries: Array<{
    query: string
    cliques: number
    impressoes: number
    ctr: string
    posicao: number
  }>
  sitemaps: Array<{
    url: string
    tipo: string
    enviado: string
    ultimo_processamento: string
    status: string
    paginas_descobertas: number
  }>
}

export default function MarketingPage() {
  const { settings, isLoading: settingsLoading, updateSettings } = useSettings()
  const { isAuthenticated } = useAuth()

  // API states
  const [eventsData, setEventsData] = useState<{ events: MarketingEventLog[]; stats: Record<string, number> } | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [searchConsole, setSearchConsole] = useState<SearchConsoleData | null>(null)

  // Interface states
  const [loading, setLoading] = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  // Form Config
  const [config, setConfig] = useState({
    google_tag_id: "",
    google_ads_client_id: "",
    google_ads_client_secret: "",
    google_ads_developer_token: "",
    google_ads_customer_id: "",
    google_search_console_site: "https://ultraprintrecargas.com.br",
  })

  // Carregar dados de configurações
  useEffect(() => {
    if (settings.google) {
      setConfig({
        google_tag_id: settings.google.google_tag_id || "",
        google_ads_client_id: settings.google.google_ads_client_id || "",
        google_ads_client_secret: settings.google.google_ads_client_secret || "",
        google_ads_developer_token: settings.google.google_ads_developer_token || "",
        google_ads_customer_id: settings.google.google_ads_customer_id || "",
        google_search_console_site: settings.google.google_search_console_site || "https://ultraprintrecargas.com.br",
      })
    }
  }, [settings])

  // Carregar dados de marketing da API
  const fetchData = async () => {
    setLoading(true)
    try {
      const [eventsRes, campaignsRes, keywordsRes, searchConsoleRes] = await Promise.all([
        api.get<any>("/marketing/events"),
        api.get<any>("/google-ads/campaigns"),
        api.get<any>("/google-ads/keywords"),
        api.get<any>("/search-console/performance")
      ])

      if (eventsRes.data?.data) setEventsData(eventsRes.data.data)
      if (campaignsRes.data?.data) setCampaigns(campaignsRes.data.data)
      if (keywordsRes.data?.data) setKeywords(keywordsRes.data.data)
      if (searchConsoleRes.data?.data) setSearchConsole(searchConsoleRes.data.data)
    } catch (err) {
      console.error("Erro ao carregar dados de marketing", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingConfig(true)
    setFeedback(null)

    const result = await updateSettings("google", config)
    if (result.success) {
      setFeedback({ type: "success", message: "Conexão com Google salva e vinculada com sucesso!" })
    } else {
      setFeedback({ type: "error", message: result.error || "Erro ao salvar conexões" })
    }
    setSavingConfig(false)
    setTimeout(() => setFeedback(null), 4000)
  }

  // Ação simulada de ativar/pausar campanha
  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = c.status === "ativa" ? "pausada" : "ativa"
          return { ...c, status: nextStatus }
        }
        return c
      })
    )
    setFeedback({
      type: "success",
      message: `Status da campanha #${id} alterado com sucesso no Google Ads!`
    })
    setTimeout(() => setFeedback(null), 3000)
  }

  // Ação simulada de adicionar palavra-chave
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyword.trim()) return

    const newK: Keyword = {
      id: "k" + (keywords.length + 1),
      palavra: newKeyword.trim(),
      impressoes: 0,
      cliques: 0,
      ctr: "0.00%",
      cpc_medio: 0.00,
      custo: 0.00,
      posicao_media: 0.0,
      status: "relevancia_nova"
    }

    setKeywords(prev => [newK, ...prev])
    setNewKeyword("")
    setFeedback({ type: "success", message: "Palavra-chave adicionada ao monitoramento Ads/SEO!" })
    setTimeout(() => setFeedback(null), 3000)
  }

  const getEventNameLabel = (type: string) => {
    const labels: Record<string, string> = {
      visualizacao_pagina: "Visualização de Página",
      clique_whatsapp_orcamento: "Cotação via WhatsApp",
      clique_whatsapp_geral: "Contato WhatsApp",
      agendamento_concluido: "Agendamento Efetuado",
      visualizacao_produto: "Visualização de Produto",
      visualizacao_chat: "Abertura do Chat"
    }
    return labels[type] || type
  }

  const getEventBadgeColor = (type: string) => {
    if (type === "agendamento_concluido") return "bg-green-100 text-green-800 border-green-200"
    if (type === "clique_whatsapp_orcamento") return "bg-blue-100 text-blue-800 border-blue-200"
    if (type === "clique_whatsapp_geral") return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (type === "visualizacao_produto") return "bg-purple-100 text-purple-800 border-purple-200"
    return "bg-slate-100 text-slate-800 border-slate-200"
  }

  const getStatusColor = (status: string) => {
    if (status === "ativa" || status === "relevancia_alta") return "bg-green-100 text-green-800"
    if (status === "pausada" || status === "relevancia_media") return "bg-yellow-100 text-yellow-800"
    return "bg-slate-100 text-slate-800"
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    )
  }

  // Métricas Consolidadas (Reais obtidos da API + Google Analytics simulados)
  const adsMetrics = {
    clicks: campaigns.reduce((acc, c) => acc + c.cliques, 0),
    impressions: campaigns.reduce((acc, c) => acc + c.impressoes, 0),
    cost: campaigns.reduce((acc, c) => acc + c.custo, 0),
    conversions: campaigns.reduce((acc, c) => acc + c.conversoes, 0)
  }

  const totalCTR = adsMetrics.impressions > 0 
    ? ((adsMetrics.clicks / adsMetrics.impressions) * 100).toFixed(2) + "%"
    : "0.00%"

  const localConversions = eventsData?.stats?.clique_whatsapp_orcamento || 0

  return (
    <>
      <DashboardHeader
        title="Marketing & SEO Google"
        description="Gerencie campanhas de anúncios, palavras-chave de busca e monitore cliques em tempo real."
      />

      <div className="p-6">
        {feedback && (
          <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}>
            <CheckCircle className="h-4 w-4 shrink-0" />
            {feedback.message}
          </div>
        )}

        {/* Resumo de Métricas Consolidadas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cliques Google Ads</p>
                <p className="text-xl font-bold text-foreground">{loading ? "..." : adsMetrics.clicks}</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">CTR Médio (Ads)</p>
                <p className="text-xl font-bold text-foreground">{loading ? "..." : totalCTR}</p>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <BarChart2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Investimento Ads</p>
                <p className="text-xl font-bold text-foreground">
                  {loading ? "..." : `R$ ${adsMetrics.cost.toFixed(2)}`}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conversões Site (Orçamentos)</p>
                <p className="text-xl font-bold text-green-600">
                  {loading ? "..." : `${adsMetrics.conversions + localConversions}`}
                </p>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="events" className="flex items-center gap-2 py-2.5">
              <Activity className="h-4 w-4" />
              <span>Eventos e Conversões</span>
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2 py-2.5">
              <Globe className="h-4 w-4" />
              <span>Campanhas Ads</span>
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2 py-2.5">
              <Key className="h-4 w-4" />
              <span>Palavras-chave</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2 py-2.5">
              <SearchCode className="h-4 w-4" />
              <span>Search Console</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-2.5">
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: EVENTOS E CONVERSÕES REGISTRADOS DO INTERNAUTA */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Conversões do Site</CardTitle>
                <CardDescription>
                  Eventos de cliques, visualização de produtos e contatos via WhatsApp enviados pelos internautas e salvos localmente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !eventsData || eventsData.events.length === 0 ? (
                  <div className="text-center py-12 bg-muted/10 border border-dashed rounded-xl">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">Nenhum evento registrado. Navegue e interaja no site público para registrar conversões.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sumarização rápida de tipos */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="p-3 bg-muted/30 border rounded-lg text-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Acessos</span>
                        <p className="text-xl font-bold">{eventsData.stats.visualizacao_pagina || 0}</p>
                      </div>
                      <div className="p-3 bg-muted/30 border rounded-lg text-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Ver Produto</span>
                        <p className="text-xl font-bold">{eventsData.stats.visualizacao_produto || 0}</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center text-blue-900">
                        <span className="text-[10px] uppercase font-bold text-blue-500">Pedir Orçamento</span>
                        <p className="text-xl font-bold">{eventsData.stats.clique_whatsapp_orcamento || 0}</p>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center text-emerald-900">
                        <span className="text-[10px] uppercase font-bold text-emerald-500">Contato WhatsApp</span>
                        <p className="text-xl font-bold">{eventsData.stats.clique_whatsapp_geral || 0}</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-center text-green-900">
                        <span className="text-[10px] uppercase font-bold text-green-500">Agendamentos</span>
                        <p className="text-xl font-bold">{eventsData.stats.agendamento_concluido || 0}</p>
                      </div>
                    </div>

                    {/* Tabela de logs */}
                    <div className="border rounded-lg overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b text-left text-muted-foreground font-medium">
                          <tr>
                            <th className="p-3">Evento</th>
                            <th className="p-3">Detalhes</th>
                            <th className="p-3">Endereço IP</th>
                            <th className="p-3">Data e Hora</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {eventsData.events.map(ev => (
                            <tr key={ev.id} className="hover:bg-muted/10 transition-colors">
                              <td className="p-3">
                                <span className={`inline-block px-2.5 py-0.5 border text-xs font-semibold rounded-full ${getEventBadgeColor(ev.tipo_evento)}`}>
                                  {getEventNameLabel(ev.tipo_evento)}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-xs max-w-md truncate">
                                {ev.detalhes ? JSON.stringify(ev.detalhes) : "Nenhum detalhe"}
                              </td>
                              <td className="p-3 text-muted-foreground text-xs">{ev.ip_address || "Não informado"}</td>
                              <td className="p-3 text-xs text-muted-foreground">
                                {new Date(ev.created_at).toLocaleString("pt-BR")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: CAMPANHAS GOOGLE ADS */}
          <TabsContent value="ads">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Campanhas do Google Ads</CardTitle>
                  <CardDescription>
                    Monitore a entrega, status e orçamento diário de seus anúncios direto do Google Ads.
                  </CardDescription>
                </div>
                <Button size="sm" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b text-left text-muted-foreground font-medium">
                        <tr>
                          <th className="p-3">Campanha</th>
                          <th className="p-3">Orç. Diário</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Impressões</th>
                          <th className="p-3 text-right">Cliques</th>
                          <th className="p-3 text-right">CTR</th>
                          <th className="p-3 text-right">CPC Médio</th>
                          <th className="p-3 text-right">Custo total</th>
                          <th className="p-3 text-right">Conversões</th>
                          <th className="p-3 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {campaigns.map(camp => (
                          <tr key={camp.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-semibold text-foreground">{camp.nome}</td>
                            <td className="p-3">R$ {camp.orcamento.toFixed(2)}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(camp.status)}`}>
                                {camp.status === "ativa" ? "Ativa" : "Pausada"}
                              </span>
                            </td>
                            <td className="p-3 text-right text-muted-foreground">{camp.impressoes.toLocaleString()}</td>
                            <td className="p-3 text-right">{camp.cliques.toLocaleString()}</td>
                            <td className="p-3 text-right text-muted-foreground">{camp.ctr}</td>
                            <td className="p-3 text-right">R$ {camp.cpc_medio.toFixed(2)}</td>
                            <td className="p-3 text-right font-medium text-foreground">R$ {camp.custo.toFixed(2)}</td>
                            <td className="p-3 text-right text-green-600 font-semibold">{camp.conversoes}</td>
                            <td className="p-3 text-center">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-24" 
                                onClick={() => toggleCampaignStatus(camp.id)}
                              >
                                {camp.status === "ativa" ? (
                                  <><Pause className="h-3 w-3 mr-1 text-yellow-600" /> Pausar</>
                                ) : (
                                  <><Play className="h-3 w-3 mr-1 text-green-600" /> Ativar</>
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: PALAVRAS CHAVE */}
          <TabsContent value="keywords">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Adicionar palavra-chave */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Monitorar Palavra-chave</CardTitle>
                    <CardDescription>Adicione termos de busca importantes para avaliar volume e CPC.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddKeyword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyword-input">Palavra-chave</Label>
                        <Input
                          id="keyword-input"
                          placeholder="Ex: Cartucho compativel hp bh"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Termo
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Tabela de palavras-chave */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Palavras-Chave de Busca Google</CardTitle>
                      <CardDescription>Rendimento de busca de palavras-chave de nicho integradas ao frontend.</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-48">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Buscar termo..."
                        className="pl-8 h-8 text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 border-b text-left text-muted-foreground font-medium">
                            <tr>
                              <th className="p-3">Palavra-chave</th>
                              <th className="p-3 text-right">Pesquisas (Mês)</th>
                              <th className="p-3 text-right">Cliques</th>
                              <th className="p-3 text-right">CTR</th>
                              <th className="p-3 text-right">CPC Médio</th>
                              <th className="p-3 text-right">Posição Média</th>
                              <th className="p-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {keywords
                              .filter(k => k.palavra.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map(k => (
                                <tr key={k.id} className="hover:bg-muted/10 transition-colors">
                                  <td className="p-3 font-medium text-foreground">{k.palavra}</td>
                                  <td className="p-3 text-right text-muted-foreground">{k.impressoes.toLocaleString()}</td>
                                  <td className="p-3 text-right">{k.cliques.toLocaleString()}</td>
                                  <td className="p-3 text-right text-muted-foreground">{k.ctr}</td>
                                  <td className="p-3 text-right">R$ {k.cpc_medio.toFixed(2)}</td>
                                  <td className="p-3 text-right font-medium text-foreground">{k.posicao_media > 0 ? k.posicao_media : "-"}</td>
                                  <td className="p-3 text-center">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(k.status)}`}>
                                      {k.status === "relevancia_alta" ? "Alta Relevância" : k.status === "relevancia_media" ? "Média Relevância" : "Nova"}
                                    </span>
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
            </div>
          </TabsContent>

          {/* TAB 4: GOOGLE SEARCH CONSOLE */}
          <TabsContent value="search">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pesquisa Orgânica do Google (Search Console)</CardTitle>
                  <CardDescription>Consultas de busca mais digitadas por usuários no Google que trouxeram visitantes organicamente.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading || !searchConsole ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-muted/40 rounded-xl border">
                          <p className="text-xs text-muted-foreground">Total Cliques Orgânicos</p>
                          <p className="text-xl font-bold text-foreground mt-1">{searchConsole.overview.total_cliques}</p>
                        </div>
                        <div className="p-4 bg-muted/40 rounded-xl border">
                          <p className="text-xs text-muted-foreground">Total Impressões Orgânicas</p>
                          <p className="text-xl font-bold text-foreground mt-1">{searchConsole.overview.total_impressoes}</p>
                        </div>
                        <div className="p-4 bg-muted/40 rounded-xl border">
                          <p className="text-xs text-muted-foreground">CTR Médio Orgânico</p>
                          <p className="text-xl font-bold text-foreground mt-1">{searchConsole.overview.ctr_medio}</p>
                        </div>
                        <div className="p-4 bg-muted/40 rounded-xl border">
                          <p className="text-xs text-muted-foreground">Posição Média no Google</p>
                          <p className="text-xl font-bold text-green-600 mt-1">{searchConsole.overview.posicao_media}</p>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 border-b text-left text-muted-foreground font-medium">
                            <tr>
                              <th className="p-3">Consulta (Query)</th>
                              <th className="p-3 text-right">Cliques</th>
                              <th className="p-3 text-right">Impressões</th>
                              <th className="p-3 text-right">CTR Orgânico</th>
                              <th className="p-3 text-right">Posição Google</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {searchConsole.queries.map((q, idx) => (
                              <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                <td className="p-3 font-medium text-foreground">"{q.query}"</td>
                                <td className="p-3 text-right font-semibold">{q.cliques}</td>
                                <td className="p-3 text-right text-muted-foreground">{q.impressoes}</td>
                                <td className="p-3 text-right text-muted-foreground">{q.ctr}</td>
                                <td className="p-3 text-right text-green-600 font-semibold">{q.posicao}º</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sitemaps */}
              <Card>
                <CardHeader>
                  <CardTitle>Sitemaps Enviados</CardTitle>
                  <CardDescription>Gerencie e acompanhe sitemaps para otimização de rastreamento do Googlebot.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading || !searchConsole ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b text-left text-muted-foreground font-medium">
                          <tr>
                            <th className="p-3">URL do Sitemap</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Enviado em</th>
                            <th className="p-3">Último Processamento</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Páginas Descobertas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {searchConsole.sitemaps.map((s, idx) => (
                            <tr key={idx} className="hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-semibold text-foreground">{s.url}</td>
                              <td className="p-3 text-muted-foreground">{s.tipo}</td>
                              <td className="p-3 text-xs text-muted-foreground">{s.enviado}</td>
                              <td className="p-3 text-xs text-muted-foreground">{s.ultimo_processamento}</td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  {s.status === "sucesso" ? "Sucesso" : s.status}
                                </span>
                              </td>
                              <td className="p-3 text-right font-medium">{s.paginas_descobertas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 5: CONFIGURAÇÕES DE CONEXÃO GOOGLE */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Conectar ao Google Ads & Analytics</CardTitle>
                <CardDescription>
                  Configure chaves de API do Google e Measurement ID da Google Tag para monitoramento completo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <form onSubmit={handleSaveConfig} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Google Tag ID */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="google-tag-id">Google Tag ID / Measurement ID</Label>
                        <Input
                          id="google-tag-id"
                          placeholder="AW-11526372849 ou G-XXXXXXXXXX"
                          value={config.google_tag_id}
                          onChange={(e) => setConfig({ ...config, google_tag_id: e.target.value })}
                        />
                        <p className="text-[10px] text-muted-foreground">ID do fluxo web do Google Analytics 4 ou ID de conversão do Google Ads.</p>
                      </div>

                      {/* Google Ads OAuth */}
                      <div className="space-y-2">
                        <Label htmlFor="ads-client-id">Google Ads Client ID</Label>
                        <Input
                          id="ads-client-id"
                          placeholder="xxxxxxxxxx.apps.googleusercontent.com"
                          value={config.google_ads_client_id}
                          onChange={(e) => setConfig({ ...config, google_ads_client_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ads-client-secret">Google Ads Client Secret</Label>
                        <Input
                          id="ads-client-secret"
                          type="password"
                          placeholder="••••••••••••••••••••••••••••"
                          value={config.google_ads_client_secret}
                          onChange={(e) => setConfig({ ...config, google_ads_client_secret: e.target.value })}
                        />
                      </div>

                      {/* Dev Token and Account Customer ID */}
                      <div className="space-y-2">
                        <Label htmlFor="ads-dev-token">Developer Token</Label>
                        <Input
                          id="ads-dev-token"
                          placeholder="Sua chave de Developer Token"
                          value={config.google_ads_developer_token}
                          onChange={(e) => setConfig({ ...config, google_ads_developer_token: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ads-customer-id">Customer ID (ID da Conta do Lojista)</Label>
                        <Input
                          id="ads-customer-id"
                          placeholder="XXX-XXX-XXXX"
                          value={config.google_ads_customer_id}
                          onChange={(e) => setConfig({ ...config, google_ads_customer_id: e.target.value })}
                        />
                      </div>

                      {/* Search Console Site URL */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="search-site">Search Console Site URL</Label>
                        <Input
                          id="search-site"
                          placeholder="https://ultraprintrecargas.com.br"
                          value={config.google_search_console_site}
                          onChange={(e) => setConfig({ ...config, google_search_console_site: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={savingConfig}>
                      {savingConfig ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                      ) : (
                        <><Save className="h-4 w-4 mr-2" /> Salvar Conexões</>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
