"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

export interface Banner {
  id: number
  titulo: string | null
  subtitulo: string | null
  descricao: string | null
  imagem: string | null
  link_url: string | null
  link_texto: string | null
  cor_fundo: string | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface UseBannersReturn {
  banners: Banner[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (data: Omit<Banner, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string }>
  update: (id: number, data: Partial<Banner>) => Promise<{ success: boolean; error?: string }>
  remove: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function useBanners(): UseBannersReturn {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<Banner[]>("/banners")
    if (response.error) {
      setError(response.error)
    } else if ((response.data as any)?.data) {
      setBanners((response.data as any).data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const create = async (data: Omit<Banner, "id" | "created_at" | "updated_at">) => {
    const response = await api.post<Banner>("/banners", data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const update = async (id: number, data: Partial<Banner>) => {
    const response = await api.put<Banner>(`/banners/${id}`, data)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  const remove = async (id: number) => {
    const response = await api.delete(`/banners/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  return { banners, isLoading, error, refetch, create, update, remove }
}
