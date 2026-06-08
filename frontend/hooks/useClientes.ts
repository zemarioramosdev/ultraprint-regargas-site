"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

export interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string | null
  endereco: string | null
  cpf: string | null
  created_at: string
  updated_at: string
}

interface UseClientesReturn {
  clientes: Cliente[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: Omit<Cliente, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string }>
  update: (id: number, data: Partial<Cliente>) => Promise<{ success: boolean; error?: string }>
  remove: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function useClientes(): UseClientesReturn {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<{ data: Cliente[] }>("/clientes")
    if (response.error) {
      setError(response.error)
    } else if (response.data?.data) {
      setClientes(response.data.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const create = async (data: Omit<Cliente, "id" | "created_at" | "updated_at">) => {
    const response = await api.post<Cliente>("/clientes", data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const update = async (id: number, data: Partial<Cliente>) => {
    const response = await api.put<Cliente>(`/clientes/${id}`, data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const remove = async (id: number) => {
    const response = await api.delete(`/clientes/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  return { clientes, isLoading, error, refetch, create, update, remove }
}
