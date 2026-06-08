"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

export interface Pedido {
  id: number
  cliente_id: number
  produto_id: number
  quantidade: number
  valor_total: number
  status: "pendente" | "em_andamento" | "concluido" | "cancelado"
  observacoes: string | null
  created_at: string
  updated_at: string
  cliente?: { id: number; nome: string; email: string }
  produto?: { id: number; nome: string; preco: number }
}

interface UsePedidosReturn {
  pedidos: Pedido[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: Omit<Pedido, "id" | "created_at" | "updated_at" | "cliente" | "produto">) => Promise<{ success: boolean; error?: string }>
  update: (id: number, data: Partial<Pedido>) => Promise<{ success: boolean; error?: string }>
  remove: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function usePedidos(): UsePedidosReturn {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<{ data: Pedido[] }>("/pedidos")
    if (response.error) {
      setError(response.error)
    } else if (response.data?.data) {
      setPedidos(response.data.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const create = async (data: Omit<Pedido, "id" | "created_at" | "updated_at" | "cliente" | "produto">) => {
    const response = await api.post<Pedido>("/pedidos", data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const update = async (id: number, data: Partial<Pedido>) => {
    const response = await api.put<Pedido>(`/pedidos/${id}`, data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const remove = async (id: number) => {
    const response = await api.delete(`/pedidos/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  return { pedidos, isLoading, error, refetch, create, update, remove }
}
