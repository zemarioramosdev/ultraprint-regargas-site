"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

export interface Mensagem {
  id: number
  telefone: string
  nome_cliente: string | null
  conteudo: string
  direcao: "entrada" | "saida"
  canal: "whatsapp" | "chat" | "admin"
  status: "recebida" | "lida" | "enviada" | "entregue"
  session_id: string | null
  created_at: string
  updated_at: string
}

export interface Conversa {
  telefone: string
  nome_cliente: string | null
  last_message_at: string
  total_messages: number
}

interface UseMensagensReturn {
  conversas: Conversa[]
  mensagens: Mensagem[]
  isLoading: boolean
  error: string | null
  unreadCount: number
  refetchConversas: () => Promise<void>
  refetchMensagens: (telefone: string) => Promise<void>
  sendMessage: (telefone: string, conteudo: string, canal: "whatsapp" | "chat") => Promise<{ success: boolean; error?: string }>
  markAsRead: (telefone: string) => Promise<void>
  fetchUnreadCount: () => Promise<void>
}

export function useMensagens(): UseMensagensReturn {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const refetchConversas = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<{ data: Conversa[] }>("/mensagens/conversas")
    if (response.error) {
      setError(response.error)
    } else if (response.data?.data) {
      setConversas(response.data.data)
    }
    setIsLoading(false)
  }, [])

  const refetchMensagens = useCallback(async (telefone: string) => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<{ data: Mensagem[] }>(`/mensagens/telefone/${telefone}`)
    if (response.error) {
      setError(response.error)
    } else if (response.data?.data) {
      setMensagens(response.data.data)
    }
    setIsLoading(false)
  }, [])

  const sendMessage = async (telefone: string, conteudo: string, canal: "whatsapp" | "chat") => {
    const response = await api.post<Mensagem>("/mensagens/enviar", {
      telefone,
      conteudo,
      canal,
    })

    if (response.error) {
      return { success: false, error: response.error }
    }

    await refetchMensagens(telefone)
    return { success: true }
  }

  const markAsRead = async (telefone: string) => {
    await api.post("/mensagens/marcar-lida", { telefone })
    await refetchConversas()
    await fetchUnreadCount()
  }

  const fetchUnreadCount = useCallback(async () => {
    const response = await api.get<{ count: number }>("/mensagens/nao-lidas")
    if (response.data?.count !== undefined) {
      setUnreadCount(response.data.count)
    }
  }, [])

  useEffect(() => {
    refetchConversas()
    fetchUnreadCount()
  }, [refetchConversas, fetchUnreadCount])

  return {
    conversas,
    mensagens,
    isLoading,
    error,
    unreadCount,
    refetchConversas,
    refetchMensagens,
    sendMessage,
    markAsRead,
    fetchUnreadCount,
  }
}
