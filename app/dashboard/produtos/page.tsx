"use client"

import { useState } from "react"
import { 
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const products = [
  { id: 1, name: "Cartucho HP 664 Preto", category: "Cartuchos", price: "R$ 45,00", stock: 25, status: "Ativo" },
  { id: 2, name: "Cartucho HP 664 Colorido", category: "Cartuchos", price: "R$ 55,00", stock: 18, status: "Ativo" },
  { id: 3, name: "Toner Samsung MLT-D101", category: "Toners", price: "R$ 120,00", stock: 12, status: "Ativo" },
  { id: 4, name: "Toner HP CF283A", category: "Toners", price: "R$ 85,00", stock: 8, status: "Ativo" },
  { id: 5, name: "Toner Brother TN-1060", category: "Toners", price: "R$ 95,00", stock: 15, status: "Ativo" },
  { id: 6, name: "Cartucho Canon PG-145 Preto", category: "Cartuchos", price: "R$ 50,00", stock: 0, status: "Inativo" },
  { id: 7, name: "Cartucho Canon CL-146 Color", category: "Cartuchos", price: "R$ 60,00", stock: 10, status: "Ativo" },
  { id: 8, name: "Cartucho Epson T664 Preto", category: "Cartuchos", price: "R$ 35,00", stock: 30, status: "Ativo" },
  { id: 9, name: "Impressora HP DeskJet 2774", category: "Impressoras", price: "R$ 450,00", stock: 3, status: "Ativo" },
  { id: 10, name: "Impressora Epson L3250", category: "Impressoras", price: "R$ 1.200,00", stock: 2, status: "Ativo" },
]

const categories = ["Todos", "Cartuchos", "Toners", "Impressoras", "Acessorios"]

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "Todos" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <DashboardHeader 
        title="Produtos" 
        description="Gerencie seu catalogo de produtos"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total de Produtos</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Cartuchos</p>
              <p className="text-2xl font-bold text-foreground">{products.filter(p => p.category === "Cartuchos").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Toners</p>
              <p className="text-2xl font-bold text-foreground">{products.filter(p => p.category === "Toners").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Estoque Baixo</p>
              <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock <= 5).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Visualize e gerencie todos os produtos</CardDescription>
            </div>
            <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Produto</DialogTitle>
                  <DialogDescription>Cadastre um novo produto no catalogo</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input id="name" placeholder="Ex: Cartucho HP 664 Preto" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cartuchos">Cartuchos</SelectItem>
                        <SelectItem value="toners">Toners</SelectItem>
                        <SelectItem value="impressoras">Impressoras</SelectItem>
                        <SelectItem value="acessorios">Acessorios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Preco</Label>
                      <Input id="price" placeholder="R$ 0,00" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Estoque</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descricao</Label>
                    <Textarea id="description" placeholder="Descricao do produto..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewProductOpen(false)}>Cancelar</Button>
                  <Button onClick={() => setIsNewProductOpen(false)}>Salvar Produto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-foreground text-sm line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        product.stock === 0 
                          ? "bg-red-100 text-red-800" 
                          : product.stock <= 5 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {product.stock === 0 ? "Sem estoque" : `${product.stock} unid.`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
