"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProdutos } from "@/hooks/useProdutos"
import { useAuth } from "@/contexts/AuthContext"
import { normalizeImageUrl } from "@/lib/utils"

const categories = ["Todos", "Cartuchos", "Toners", "Impressoras", "Acessorios"]

export default function ProdutosPage() {
  const { produtos, isLoading, remove } = useProdutos()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")

  const filteredProducts = produtos.filter((product: any) => {
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "Todos" || product.categoria === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await remove(id)
    }
  }

  const stats = {
    total: produtos.length,
    cartuchos: produtos.filter((p: any) => p.categoria === "Cartuchos").length,
    toners: produtos.filter((p: any) => p.categoria === "Toners").length,
    estoqueBaixo: produtos.filter((p: any) => p.estoque <= 5).length,
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
        title="Produtos"
        description="Gerencie seu catalogo de produtos"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Produtos</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Cartuchos</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.cartuchos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Toners</p>
              <p className="text-2xl font-bold text-foreground">{isLoading ? "..." : stats.toners}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Estoque Baixo</p>
              <p className="text-2xl font-bold text-red-600">{isLoading ? "..." : stats.estoqueBaixo}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Visualize e gerencie todos os produtos</CardDescription>
            </div>
            <Button onClick={() => router.push("/dashboard/produtos/novo")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produto..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden flex flex-col justify-between h-full">
                    <div>
                      <div className="aspect-square bg-muted flex items-center justify-center relative">
                        {product.imagens && product.imagens.length > 0 ? (
                          <img
                            src={normalizeImageUrl(product.imagens[0])}
                            alt={product.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-muted-foreground/50" />
                        )}
                        {product.imagens && product.imagens.length > 1 && (
                          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                            +{product.imagens.length - 1}
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-foreground text-sm line-clamp-2">{product.nome}</h3>
                            <div className="flex flex-wrap gap-1 mt-1 items-center">
                              <span className="text-xs text-muted-foreground">{product.categoria}</span>
                              {product.sku && (
                                <span className="text-[10px] text-muted-foreground border px-1 rounded bg-muted/30">
                                  {product.sku}
                                </span>
                              )}
                              {product.variacoes && product.variacoes.length > 0 && (
                                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  {product.variacoes.length} var.
                                </span>
                              )}
                              {!product.ativo && (
                                <span className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  Inativo
                                </span>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/produtos/editar?id=${product.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </div>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-primary">
                          R$ {Number(product.preco).toFixed(2).replace(".", ",")}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          product.estoque === 0
                            ? "bg-red-100 text-red-800"
                            : product.estoque <= 5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {product.estoque === 0 ? "Sem estoque" : `${product.estoque} unid.`}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
