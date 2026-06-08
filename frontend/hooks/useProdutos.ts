"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

export interface ProdutoVariacao {
  id?: number
  produto_id?: number
  nome: string
  sku?: string | null
  preco?: number | null
  estoque: number
  atributos?: Record<string, string> | null
  ativo?: boolean
}

export interface ProdutoImagem {
  id?: number
  produto_id?: number
  url: string
  path?: string | null
  ordem?: number
  principal?: boolean
}

export interface Produto {
  id: number
  nome: string
  descricao: string | null
  categoria: string
  preco: number
  estoque: number
  estoque_minimo: number
  imagens?: string[]
  sku?: string | null
  ativo?: boolean
  variacoes?: ProdutoVariacao[]
  galeria?: ProdutoImagem[]
  created_at: string
  updated_at: string
}

interface UseProdutosReturn {
  produtos: Produto[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: Omit<Produto, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string }>
  update: (id: number, data: Partial<Produto>) => Promise<{ success: boolean; error?: string }>
  remove: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function useProdutos(): UseProdutosReturn {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<{ data: Produto[] }>("/produtos")
    if (response.error) {
      setError(response.error)
    } else if (response.data?.data) {
      setProdutos(response.data.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const create = async (data: Omit<Produto, "id" | "created_at" | "updated_at">) => {
    const response = await api.post<Produto>("/produtos", data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const update = async (id: number, data: Partial<Produto>) => {
    const response = await api.put<Produto>(`/produtos/${id}`, data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const remove = async (id: number) => {
    const response = await api.delete(`/produtos/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  return { produtos, isLoading, error, refetch, create, update, remove }
}
