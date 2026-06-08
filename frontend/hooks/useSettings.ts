"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"

interface Settings {
  [group: string]: {
    [key: string]: string
  }
}

interface UseSettingsReturn {
  settings: Settings
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateSettings: (group: string, data: Record<string, string>) => Promise<{ success: boolean; error?: string }>
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const response = await api.get<Settings>("/settings")
    if (response.error) {
      setError(response.error)
    } else if ((response.data as any)?.data) {
      setSettings((response.data as any).data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const updateSettings = async (group: string, data: Record<string, string>) => {
    const response = await api.put(`/settings/${group}`, { settings: data })
    if (response.error) {
      return { success: false, error: response.error }
    }
    await refetch()
    return { success: true }
  }

  return { settings, isLoading, error, refetch, updateSettings }
}
