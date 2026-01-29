"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, ShoppingCart } from "lucide-react"

const categories = ["Todos", "Cartuchos de Tinta", "Toners", "Refis", "Impressoras"]

const products = [
  {
    id: 1,
    name: "Cartucho HP 664XL Preto",
    category: "Cartuchos de Tinta",
    price: "R$ 89,90",
    originalPrice: "R$ 129,90",
    badge: "Mais Vendido",
    type: "Compatível",
  },
  {
    id: 2,
    name: "Toner Brother TN-1060",
    category: "Toners",
    price: "R$ 59,90",
    originalPrice: "R$ 89,90",
    badge: "Oferta",
    type: "Compatível",
  },
  {
    id: 3,
    name: "Kit Refil Epson T544",
    category: "Refis",
    price: "R$ 79,90",
    originalPrice: null,
    badge: "Original",
    type: "Original",
  },
  {
    id: 4,
    name: "Toner HP 85A CE285A",
    category: "Toners",
    price: "R$ 54,90",
    originalPrice: "R$ 79,90",
    badge: "Oferta",
    type: "Compatível",
  },
  {
    id: 5,
    name: "Cartucho Canon PG-145 Preto",
    category: "Cartuchos de Tinta",
    price: "R$ 69,90",
    originalPrice: null,
    badge: null,
    type: "Compatível",
  },
  {
    id: 6,
    name: "Impressora HP LaserJet Pro",
    category: "Impressoras",
    price: "R$ 1.299,00",
    originalPrice: "R$ 1.599,00",
    badge: "Novo",
    type: "Nova",
  },
  {
    id: 7,
    name: "Refil Tinta Epson 504 Magenta",
    category: "Refis",
    price: "R$ 32,90",
    originalPrice: null,
    badge: "Original",
    type: "Original",
  },
  {
    id: 8,
    name: "Toner Samsung MLT-D101S",
    category: "Toners",
    price: "R$ 64,90",
    originalPrice: "R$ 99,90",
    badge: "Oferta",
    type: "Compatível",
  },
]

export function Products() {
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <section id="produtos" className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Catálogo</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Produtos em Destaque
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Confira nossa seleção de cartuchos, toners e suprimentos com os melhores preços do mercado.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted/50 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="3" width="12" height="18" rx="2" />
                      <path d="M9 7h6" />
                      <path d="M12 11v6" />
                    </svg>
                  </div>
                  {product.badge && (
                    <Badge
                      className={`absolute top-3 right-3 ${
                        product.badge === "Oferta"
                          ? "bg-destructive text-destructive-foreground"
                          : product.badge === "Original"
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground text-background"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary" className="mr-2">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary">{product.type}</span>
                  <h3 className="font-semibold text-foreground mt-1 line-clamp-2">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" asChild>
                  <a href="https://wa.me/5531999999999?text=Olá! Gostaria de fazer uma cotação do produto: ${encodeURIComponent(product.name)}" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Fazer Cotação
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <a href="https://wa.me/5531999999999" target="_blank" rel="noopener noreferrer">
              Ver Todos os Produtos
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
