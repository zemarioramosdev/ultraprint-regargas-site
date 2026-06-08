"use client"

import { useState, useEffect } from "react"
import { 
  Save,
  User,
  Building,
  Bell,
  Lock,
  Globe,
  MessageSquare,
  CreditCard,
  Mail,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useSettings } from "@/hooks/useSettings"
import { useAuth } from "@/contexts/AuthContext"

export default function ConfiguracoesPage() {
  const { settings, isLoading, updateSettings, refetch } = useSettings()
  const { isAuthenticated } = useAuth()
  const [saving, setSaving] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [empresa, setEmpresa] = useState({
    nome: "Ultraprint Recargas",
    cnpj: "00.000.000/0001-00",
    telefone: "(31) 3333-4444",
    whatsapp: "(31) 99999-9999",
    email: "contato@ultraprint.com.br",
    endereco: "Rua Example, 123 - Centro, Betim - MG",
    horario: "Segunda a Sexta: 08h - 18h | Sabado: 08h - 12h",
    fuso: "america-sao-paulo",
    descricao: "Especialistas em recarga de cartuchos e toners.",
  })

  const [notificacoes, setNotificacoes] = useState({
    email: true,
    whatsapp: true,
    newOrders: true,
    schedules: true,
    marketing: false,
  })

  const [whatsappConfig, setWhatsappConfig] = useState({
    numero: "5531999999999",
    mensagem_padrao: "Ola! Obrigado por entrar em contato com a Ultraprint Recargas. Como posso ajudar?",
  })

  const [n8nConfig, setN8nConfig] = useState({
    webhook_url: "",
    api_key: "",
  })

  useEffect(() => {
    if (settings.empresa) {
      setEmpresa((prev) => ({
        ...prev,
        nome: settings.empresa.nome || prev.nome,
        cnpj: settings.empresa.cnpj || prev.cnpj,
        telefone: settings.empresa.telefone || prev.telefone,
        whatsapp: settings.empresa.whatsapp_telefone || prev.whatsapp,
        email: settings.empresa.email || prev.email,
        endereco: settings.empresa.endereco || prev.endereco,
        horario: settings.empresa.horario || prev.horario,
        fuso: settings.empresa.fuso || prev.fuso,
        descricao: settings.empresa.descricao || prev.descricao,
      }))
    }
    if (settings.notificacoes) {
      setNotificacoes((prev) => ({
        ...prev,
        email: settings.notificacoes.email !== "false",
        whatsapp: settings.notificacoes.whatsapp !== "false",
        newOrders: settings.notificacoes.newOrders !== "false",
        schedules: settings.notificacoes.schedules !== "false",
        marketing: settings.notificacoes.marketing === "true",
      }))
    }
    if (settings.integracao) {
      setWhatsappConfig((prev) => ({
        ...prev,
        numero: settings.integracao.whatsapp_numero || prev.numero,
        mensagem_padrao: settings.integracao.whatsapp_mensagem_padrao || prev.mensagem_padrao,
      }))
      setN8nConfig((prev) => ({
        ...prev,
        webhook_url: settings.integracao.n8n_webhook_url || "",
        api_key: settings.integracao.n8n_api_key || "",
      }))
    }
  }, [settings])

  const handleSave = async (group: string, data: Record<string, string>) => {
    setSaving(group)
    setFeedback(null)
    const result = await updateSettings(group, data)
    if (result.success) {
      setFeedback({ type: "success", message: "Configurações salvas com sucesso!" })
    } else {
      setFeedback({ type: "error", message: result.error || "Erro ao salvar" })
    }
    setSaving(null)
    setTimeout(() => setFeedback(null), 3000)
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <p>Voce precisa estar logado para acessar esta pagina.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Configuracoes" description="Carregando..." />
        <div className="p-6 flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader 
        title="Configuracoes" 
        description="Gerencie as configuracoes do sistema"
      />

      <div className="p-6">
        {feedback && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            feedback.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {feedback.message}
          </div>
        )}

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificacoes</span>
            </TabsTrigger>
            <TabsTrigger value="integracao" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Integracoes</span>
            </TabsTrigger>
            <TabsTrigger value="usuario" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Usuario</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Seguranca</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="empresa">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Informacoes exibidas no site e documentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" value={empresa.nome} onChange={(e) => setEmpresa({...empresa, nome: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" value={empresa.cnpj} onChange={(e) => setEmpresa({...empresa, cnpj: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={empresa.telefone} onChange={(e) => setEmpresa({...empresa, telefone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" value={empresa.whatsapp} onChange={(e) => setEmpresa({...empresa, whatsapp: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={empresa.email} onChange={(e) => setEmpresa({...empresa, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereco</Label>
                  <Input id="address" value={empresa.endereco} onChange={(e) => setEmpresa({...empresa, endereco: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Horario de Funcionamento</Label>
                    <Input id="hours" value={empresa.horario} onChange={(e) => setEmpresa({...empresa, horario: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horario</Label>
                    <Select value={empresa.fuso} onValueChange={(value) => setEmpresa({...empresa, fuso: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-sao-paulo">America/Sao_Paulo (GMT-3)</SelectItem>
                        <SelectItem value="america-manaus">America/Manaus (GMT-4)</SelectItem>
                        <SelectItem value="america-recife">America/Recife (GMT-3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descricao da Empresa</Label>
                  <Textarea id="description" rows={3} value={empresa.descricao} onChange={(e) => setEmpresa({...empresa, descricao: e.target.value})} />
                </div>
                <Button onClick={() => handleSave("empresa", {
                  nome: empresa.nome,
                  cnpj: empresa.cnpj,
                  telefone: empresa.telefone,
                  whatsapp_telefone: empresa.whatsapp,
                  email: empresa.email,
                  endereco: empresa.endereco,
                  horario: empresa.horario,
                  fuso: empresa.fuso,
                  descricao: empresa.descricao,
                })} disabled={saving === "empresa"}>
                  {saving === "empresa" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Alteracoes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificacoes</CardTitle>
                <CardDescription>Escolha como deseja receber alertas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Notificacoes por Email", desc: "Receber alertas por email", icon: Mail },
                    { key: "whatsapp", label: "Notificacoes por WhatsApp", desc: "Receber alertas por WhatsApp", icon: MessageSquare },
                    { key: "newOrders", label: "Novos Pedidos", desc: "Alerta quando um novo pedido for criado", icon: Bell },
                    { key: "schedules", label: "Agendamentos", desc: "Lembrete de agendamentos proximos", icon: Bell },
                    { key: "marketing", label: "Marketing", desc: "Receber novidades e promocoes", icon: Mail },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={(notificacoes as any)[item.key]}
                          onCheckedChange={(checked) => setNotificacoes({...notificacoes, [item.key]: checked})}
                        />
                      </div>
                    )
                  })}
                </div>
                <Button onClick={() => handleSave("notificacoes", Object.fromEntries(
                  Object.entries(notificacoes).map(([k, v]) => [k, String(v)])
                ))} disabled={saving === "notificacoes"}>
                  {saving === "notificacoes" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integracao">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    WhatsApp Business
                  </CardTitle>
                  <CardDescription>Configure a integracao com WhatsApp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-number">Numero do WhatsApp</Label>
                    <Input id="whatsapp-number" placeholder="5531999999999" value={whatsappConfig.numero} onChange={(e) => setWhatsappConfig({...whatsappConfig, numero: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-message">Mensagem Padrao</Label>
                    <Textarea id="whatsapp-message" rows={2} value={whatsappConfig.mensagem_padrao} onChange={(e) => setWhatsappConfig({...whatsappConfig, mensagem_padrao: e.target.value})} />
                  </div>
                  <Button onClick={() => handleSave("integracao", {
                    whatsapp_numero: whatsappConfig.numero,
                    whatsapp_mensagem_padrao: whatsappConfig.mensagem_padrao,
                  })} disabled={saving === "integracao"}>
                    {saving === "integracao" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Salvar Configuracao
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    n8n Webhook
                  </CardTitle>
                  <CardDescription>Configure a integracao com n8n para automacoes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="n8n-url">URL do Webhook</Label>
                    <Input id="n8n-url" placeholder="https://seu-n8n.com/webhook/..." value={n8nConfig.webhook_url} onChange={(e) => setN8nConfig({...n8nConfig, webhook_url: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n8n-key">Chave de API (opcional)</Label>
                    <Input id="n8n-key" type="password" placeholder="Sua chave de API" value={n8nConfig.api_key} onChange={(e) => setN8nConfig({...n8nConfig, api_key: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleSave("integracao", {
                      whatsapp_numero: whatsappConfig.numero,
                      whatsapp_mensagem_padrao: whatsappConfig.mensagem_padrao,
                      n8n_webhook_url: n8nConfig.webhook_url,
                      n8n_api_key: n8nConfig.api_key,
                    })} disabled={saving === "integracao"}>
                      {saving === "integracao" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Salvar Configuracao
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Pagamentos
                  </CardTitle>
                  <CardDescription>Configure os metodos de pagamento aceitos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Pix", "Cartao de Credito", "Cartao de Debito", "Dinheiro"].map((metodo) => (
                      <div key={metodo} className="flex items-center justify-between p-4 rounded-lg border">
                        <span className="font-medium">{metodo}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pix-key">Chave Pix</Label>
                    <Input id="pix-key" placeholder="CNPJ, Email ou Telefone" />
                  </div>
                  <Button>Salvar Configuracao</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usuario">
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Usuario</CardTitle>
                <CardDescription>Gerencie suas informacoes pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">A</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Alterar Foto</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Nome Completo</Label>
                    <Input id="user-name" defaultValue="Administrador" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" defaultValue="admin@ultraprint.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-phone">Telefone</Label>
                    <Input id="user-phone" defaultValue="(31) 99999-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Cargo</Label>
                    <Input id="user-role" defaultValue="Administrador" disabled />
                  </div>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alteracoes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Seguranca da Conta</CardTitle>
                <CardDescription>Gerencie a seguranca do seu acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Alterar Senha</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Alterar Senha</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
