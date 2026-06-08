"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authService, User, LoginCredentials, RegisterData } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const response = await authService.me()
    if (response.data) {
      setUser(response.data)
    } else {
      authService.logout()
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)

    if (response.error) {
      return { success: false, error: response.error }
    }

    if (response.data) {
      setUser(response.data.user)
      return { success: true }
    }

    return { success: false, error: "Erro desconhecido" }
  }

  const register = async (data: RegisterData) => {
    const response = await authService.register(data)

    if (response.error) {
      return { success: false, error: response.error }
    }

    if (response.data) {
      setUser(response.data.user)
      return { success: true }
    }

    return { success: false, error: "Erro desconhecido" }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
