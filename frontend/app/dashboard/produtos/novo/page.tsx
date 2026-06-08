"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProductForm } from "@/components/products/product-form"
import { useProdutos } from "@/hooks/useProdutos"
import { useAuth } from "@/contexts/AuthContext"

export default function NovoProdutoPage() {
  const { create } = useProdutos()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true)
    try {
      const res = await create(productData)
      if (res.success) {
        return true
      } else {
        alert(`Erro ao criar produto: ${res.error}`)
        return false
      }
    } catch (err) {
      console.error(err)
      alert("Ocorreu um erro ao criar o produto.")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Novo Produto"
        description="Cadastre um novo produto com variações e galeria de fotos"
      />
      <div className="p-6 max-w-5xl">
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </>
  )
}
