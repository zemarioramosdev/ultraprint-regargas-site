"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Send,
  Phone,
  MessageCircle,
  User,
  Clock,
  CheckCircle,
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  File
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import { useMensagens, Conversa, Mensagem } from "@/hooks/useMensagens"
import { useAuth } from "@/contexts/AuthContext"

export default function AtendimentoPage() {
  const { conversas, mensagens, isLoading, unreadCount, refetchConversas, refetchMensagens, sendMessage, markAsRead, fetchUnreadCount } = useMensagens()
  const { isAuthenticated } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<Conversa | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedConversation) {
      refetchMensagens(selectedConversation.telefone)
      markAsRead(selectedConversation.telefone)
    }
  }, [selectedConversation, refetchMensagens, markAsRead])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversation) {
        refetchMensagens(selectedConversation.telefone)
      }
      fetchUnreadCount()
    }, 10000)
    return () => clearInterval(interval)
  }, [selectedConversation, refetchMensagens, fetchUnreadCount])

  const filteredConversas = conversas.filter((conversa) =>
    conversa.telefone.includes(searchTerm) ||
    conversa.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    const success = await sendMessage(selectedConversation.telefone, messageText.trim(), "whatsapp")
    if (success.success) {
      setMessageText("")
    }
    setIsSending(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Hoje"
    if (date.toDateString() === yesterday.toDateString()) return "Ontem"
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  const getMessageIcon = (canal: string) => {
    if (canal === "whatsapp") return <Phone className="h-3 w-3 text-green-600" />
    if (canal === "chat") return <MessageCircle className="h-3 w-3 text-blue-600" />
    return <User className="h-3 w-3 text-gray-600" />
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
        title="Atendimento"
        description="Gerencie suas conversas de chat e WhatsApp"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <CardDescription>
                {unreadCount > 0 && (
                  <span className="text-primary font-medium">{unreadCount} nao lidas</span>
                )}
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por telefone ou nome..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredConversas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma conversa encontrada</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversas.map((conversa) => (
                    <button
                      key={conversa.telefone}
                      onClick={() => setSelectedConversation(conversa)}
                      className={`w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${
                        selectedConversation?.telefone === conversa.telefone ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {conversa.nome_cliente || conversa.telefone}
                            </p>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatDate(conversa.last_message_at)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversa.total_messages} mensagens
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {selectedConversation.nome_cliente || selectedConversation.telefone}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {selectedConversation.telefone}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mensagens.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma mensagem nesta conversa</p>
                    </div>
                  ) : (
                    mensagens.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.direcao === "saida" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.direcao === "saida"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageIcon(msg.canal)}
                            <span className={`text-xs ${msg.direcao === "saida" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {msg.direcao === "saida" ? "Enviado" : "Recebido"}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
                          <div className={`flex items-center gap-1 mt-1 ${msg.direcao === "saida" ? "justify-end" : ""}`}>
                            <span className={`text-xs ${msg.direcao === "saida" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {formatTime(msg.created_at)}
                            </span>
                            {msg.direcao === "saida" && (
                              <CheckCircle className={`h-3 w-3 ${msg.status === "entregue" ? "text-green-300" : "text-primary-foreground/50"}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isSending}
                    />
                    <Button onClick={handleSendMessage} disabled={isSending || !messageText.trim()}>
                      {isSending ? (
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    A mensagem sera enviada via WhatsApp para {selectedConversation.telefone}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Selecione uma conversa</p>
                  <p className="text-sm">Escolha uma conversa ao lado para ver as mensagens</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
