"use client"

import { useState, useRef, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import { MessageCircle, X, Send, Phone, Bot, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const WHATSAPP_NUMBER = "5531971447807"
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || ""
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const quickReplies = [
  "Quero fazer um orçamento",
  "Preços de recarga",
  "Horário de funcionamento",
  "Prazo de entrega",
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<"options" | "chat" | "whatsapp">("options")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (view === "chat" && messages.length === 0) {
      // Mensagem inicial do bot
      setMessages([
        {
          id: "welcome",
          text: "Olá! Sou o assistente virtual da Ultraprint Recargas. Como posso ajudar você hoje?",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }, [view, messages.length])

  const getLocalResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes("orçamento") || lowerMessage.includes("orcamento")) {
      return "Para fazer um orçamento, preciso de algumas informações:\n\n1. Modelo da impressora\n2. Tipo de cartucho (original ou compatível)\n3. Quantidade\n\nPode me informar esses dados? Ou se preferir, clique no botão WhatsApp para falar diretamente com nossa equipe."
    }
    if (lowerMessage.includes("preço") || lowerMessage.includes("preco") || lowerMessage.includes("valor")) {
      return "Nossos preços de recarga variam de acordo com o modelo:\n\n• Cartuchos HP/Canon: a partir de R$ 25,00\n• Toners HP: a partir de R$ 45,00\n• Toners Samsung: a partir de R$ 55,00\n\nPara um valor exato, informe o modelo do seu cartucho ou toner."
    }
    if (lowerMessage.includes("horário") || lowerMessage.includes("horario") || lowerMessage.includes("funcionamento")) {
      return "Nosso horário de funcionamento:\n\n• Segunda a Sexta: 8h às 18h\n• Sábado: 8h às 12h\n• Domingo: Fechado\n\nAtendimento via WhatsApp disponível 24h!"
    }
    if (lowerMessage.includes("prazo") || lowerMessage.includes("entrega") || lowerMessage.includes("tempo")) {
      return "Nossos prazos de entrega:\n\n• Recarga expressa: até 2 horas\n• Recarga padrão: mesmo dia\n• Delivery: 24 a 48 horas úteis\n\nPara recargas urgentes, entre em contato pelo WhatsApp!"
    }
    if (lowerMessage.includes("endereço") || lowerMessage.includes("endereco") || lowerMessage.includes("localização") || lowerMessage.includes("localizacao")) {
      return "Nosso atendimento é 100% online e focado em delivery (coleta e entrega rápida) em Betim - MG e região metropolitana, sem necessidade de você se deslocar! 🚀\n\nEntre em contato pelo WhatsApp para agendarmos a busca ou entrega de seus cartuchos e toners."
    }
    return "Obrigado pela mensagem! Para um atendimento mais rápido e personalizado, recomendo falar com nossa equipe pelo WhatsApp. Clique no botão abaixo para ser atendido imediatamente."
  }

  const registerMessage = async (userMessage: string) => {
    try {
      await fetch(`${API_URL}/chat/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conteudo: userMessage,
          nome: "Visitante",
        }),
      })
    } catch {
      // falha silenciosa - não bloqueia o chat
    }
  }

  const sendToN8n = async (userMessage: string): Promise<string> => {
    await registerMessage(userMessage)

    if (N8N_WEBHOOK_URL) {
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            timestamp: new Date().toISOString(),
            source: "website_chat",
            phone: WHATSAPP_NUMBER,
          }),
        })
        if (response.ok) {
          const data = await response.json()
          return data.response || data.message || "Obrigado pela mensagem! Nossa equipe entrará em contato em breve."
        }
      } catch {
        console.error("Erro ao enviar para n8n")
      }
    }

    return getLocalResponse(userMessage)
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const botResponse = await sendToN8n(messageText)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, ocorreu um erro. Tente novamente ou entre em contato pelo WhatsApp.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppRedirect = (message?: string) => {
    const defaultMessage = message || "Olá! Vim pelo site e gostaria de mais informações."
    const encodedMessage = encodeURIComponent(defaultMessage)
    trackEvent("clique_whatsapp_geral", { mensagem: defaultMessage })
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank")
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      setView("options")
    }, 300)
  }

  const renderOptions = () => (
    <div className="p-6 space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">Como podemos ajudar?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha uma opção para iniciar o atendimento
        </p>
      </div>

      <Button
        onClick={() => setView("chat")}
        className="w-full h-14 justify-start gap-3 text-left"
        variant="outline"
      >
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium text-foreground">Chat com Assistente</div>
          <div className="text-xs text-muted-foreground">Atendimento automático 24h</div>
        </div>
      </Button>

      <Button
        onClick={() => handleWhatsAppRedirect()}
        className="w-full h-14 justify-start gap-3 text-left bg-[#25D366] hover:bg-[#20BD5A] text-white"
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
          <Phone className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium">WhatsApp</div>
          <div className="text-xs opacity-90">Fale com nossa equipe</div>
        </div>
      </Button>

      <p className="text-xs text-center text-muted-foreground pt-2">
        Atendimento de Seg a Sex, 8h às 18h
      </p>
    </div>
  )

  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-primary text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setView("options")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-medium">Assistente Ultraprint</div>
          <div className="text-xs opacity-80">Online agora</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card text-card-foreground shadow-sm rounded-bl-md"
              )}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card text-card-foreground shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 py-2 border-t bg-background">
          <p className="text-xs text-muted-foreground mb-2">Perguntas frequentes:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp CTA */}
      <div className="px-4 py-2 border-t bg-background">
        <button
          onClick={() => handleWhatsAppRedirect("Olá! Estava conversando no chat do site e gostaria de continuar o atendimento por aqui.")}
          className="w-full flex items-center justify-center gap-2 text-xs text-[#25D366] hover:underline py-1"
        >
          <Phone className="h-3.5 w-3.5" />
          Continuar no WhatsApp
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-background rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ height: view === "chat" ? "500px" : "auto" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {view === "options" && renderOptions()}
        {view === "chat" && renderChat()}
      </div>

      {/* Floating Button */}
      <button
        onClick={() => {
          const nextState = !isOpen
          setIsOpen(nextState)
          if (nextState) {
            trackEvent("visualizacao_chat", { origem: "botao_flutuante" })
          }
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
          isOpen
            ? "bg-muted text-muted-foreground rotate-0"
            : "bg-primary text-primary-foreground"
        )}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat de atendimento"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && (
        <span className="fixed bottom-[4.5rem] right-5 z-50 flex h-5 w-5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>
      )}
    </>
  )
}
