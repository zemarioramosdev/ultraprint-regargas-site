"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

export interface Agendamento {
  id: number
  cliente_id: number
  servico: string
  data_hora: string
  status: "agendado" | "em_andamento" | "concluido" | "cancelado"
  observacoes: string | null
  created_at: string
  updated_at: string
  cliente?: { id: number; nome: string; email: string }
}

interface UseAgendamentosReturn {
  agendamentos: Agendamento[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: Omit<Agendamento, "id" | "created_at" | "updated_at" | "cliente">) => Promise<{ success: boolean; error?: string }>
  update: (id: number, data: Partial<Agendamento>) => Promise<{ success: boolean; error?: string }>
  remove: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function useAgendamentos(): UseAgendamentosReturn {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<{ data: Agendamento[] }>("/agendamentos")
    if (response.error) {
      setError(response.error)
    } else if (response.data?.data) {
      setAgendamentos(response.data.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const create = async (data: Omit<Agendamento, "id" | "created_at" | "updated_at" | "cliente">) => {
    const response = await api.post<Agendamento>("/agendamentos", data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const update = async (id: number, data: Partial<Agendamento>) => {
    const response = await api.put<Agendamento>(`/agendamentos/${id}`, data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const remove = async (id: number) => {
    const response = await api.delete(`/agendamentos/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  return { agendamentos, isLoading, error, refetch, create, update, remove }
}
