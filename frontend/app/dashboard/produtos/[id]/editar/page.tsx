"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProductForm } from "@/components/products/product-form"
import { useProdutos, Produto } from "@/hooks/useProdutos"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"

export default function EditarProdutoPage() {
  const params = useParams()
  const id = Number(params.id)
  
  const { update } = useProdutos()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [produto, setProduto] = useState<Produto | undefined>(undefined)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduto() {
      setIsLoadingProduct(true)
      setError(null)
      try {
        const response = await api.get<any>(`/produtos/${id}`)
        if (response.error) {
          setError(response.error)
        } else if (response.data?.data) {
          setProduto(response.data.data)
        }
      } catch (err) {
        console.error(err)
        setError("Erro ao carregar produto")
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (id) {
      fetchProduto()
    }
  }, [id])

  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true)
    try {
      const res = await update(id, productData)
      if (res.success) {
        return true
      } else {
        alert(`Erro ao atualizar produto: ${res.error}`)
        return false
      }
    } catch (err) {
      console.error(err)
      alert("Ocorreu um erro ao atualizar o produto.")
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
        title="Editar Produto"
        description={produto ? `Editando: ${produto.nome}` : "Edite as variações e galeria do produto"}
      />
      <div className="p-6 max-w-5xl">
        {isLoadingProduct ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            <p>{error}</p>
          </div>
        ) : produto ? (
          <ProductForm initialData={produto} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Produto não encontrado.</p>
          </div>
        )}
      </div>
    </>
  )
}
