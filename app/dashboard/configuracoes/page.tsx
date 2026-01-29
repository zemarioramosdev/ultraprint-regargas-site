"use client"

import { useState } from "react"
import { 
  Save,
  User,
  Building,
  Bell,
  Lock,
  Palette,
  Globe,
  MessageSquare,
  CreditCard,
  Mail
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

export default function ConfiguracoesPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    newOrders: true,
    schedules: true,
    marketing: false,
  })

  return (
    <>
      <DashboardHeader 
        title="Configuracoes" 
        description="Gerencie as configuracoes do sistema"
      />

      <div className="p-6">
        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="usuario" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Usuario</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificacoes</span>
            </TabsTrigger>
            <TabsTrigger value="integracao" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Integracoes</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Seguranca</span>
            </TabsTrigger>
          </TabsList>

          {/* Empresa Tab */}
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
                    <Input id="company-name" defaultValue="Ultraprint Recargas" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" defaultValue="00.000.000/0001-00" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(31) 3333-4444" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" defaultValue="(31) 99999-9999" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contato@ultraprint.com.br" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereco</Label>
                  <Input id="address" defaultValue="Rua Example, 123 - Centro, Belo Horizonte - MG" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Horario de Funcionamento</Label>
                    <Input id="hours" defaultValue="Segunda a Sexta: 08h - 18h | Sabado: 08h - 12h" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horario</Label>
                    <Select defaultValue="america-sao-paulo">
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
                  <Textarea 
                    id="description" 
                    rows={3}
                    defaultValue="Especialistas em recarga de cartuchos e toners. Qualidade garantida, economia de ate 70% e entrega rapida."
                  />
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alteracoes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuario Tab */}
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

          {/* Notificacoes Tab */}
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificacoes</CardTitle>
                <CardDescription>Escolha como deseja receber alertas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Notificacoes por Email</p>
                        <p className="text-sm text-muted-foreground">Receber alertas por email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Notificacoes por WhatsApp</p>
                        <p className="text-sm text-muted-foreground">Receber alertas por WhatsApp</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.whatsapp}
                      onCheckedChange={(checked) => setNotifications({...notifications, whatsapp: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Novos Pedidos</p>
                        <p className="text-sm text-muted-foreground">Alerta quando um novo pedido for criado</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.newOrders}
                      onCheckedChange={(checked) => setNotifications({...notifications, newOrders: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Agendamentos</p>
                        <p className="text-sm text-muted-foreground">Lembrete de agendamentos proximos</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.schedules}
                      onCheckedChange={(checked) => setNotifications({...notifications, schedules: checked})}
                    />
                  </div>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integracao Tab */}
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
                    <Input id="whatsapp-number" placeholder="5531999999999" defaultValue="5531999999999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-message">Mensagem Padrao</Label>
                    <Textarea 
                      id="whatsapp-message" 
                      rows={2}
                      defaultValue="Ola! Obrigado por entrar em contato com a Ultraprint Recargas. Como posso ajudar?"
                    />
                  </div>
                  <Button>Salvar Configuracao</Button>
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
                    <Input id="n8n-url" placeholder="https://seu-n8n.com/webhook/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n8n-key">Chave de API (opcional)</Label>
                    <Input id="n8n-key" type="password" placeholder="Sua chave de API" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button>Salvar Configuracao</Button>
                    <Button variant="outline">Testar Conexao</Button>
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
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium">Pix</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium">Cartao de Credito</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium">Cartao de Debito</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <span className="font-medium">Dinheiro</span>
                      <Switch defaultChecked />
                    </div>
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

          {/* Seguranca Tab */}
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

                <div className="border-t pt-6">
                  <h3 className="font-medium text-foreground mb-4">Autenticacao em Dois Fatores</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-foreground">2FA via SMS</p>
                      <p className="text-sm text-muted-foreground">Receba um codigo por SMS ao fazer login</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-foreground mb-4">Sessoes Ativas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium text-foreground">Chrome - Windows</p>
                        <p className="text-xs text-muted-foreground">Ultimo acesso: Hoje, 14:30</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Atual</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium text-foreground">Safari - iPhone</p>
                        <p className="text-xs text-muted-foreground">Ultimo acesso: Ontem, 18:45</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive">Encerrar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
