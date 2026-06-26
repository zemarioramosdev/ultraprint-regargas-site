"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone, MapPin, Clock, Printer, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#servicos", label: "Serviços" },
    { href: "#produtos", label: "Produtos" },
    { href: "#agendamento", label: "Agendamento" },
    { href: "#vantagens", label: "Vantagens" },
    { href: "#contato", label: "Contato" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a href="tel:+5531971447807" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <Phone className="h-3.5 w-3.5" />
                <span>(31) 97144-7807</span>
              </a>
              <span className="hidden md:flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Seg-Sex: 8h às 18h</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Betim - MG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img 
              src="/logo-ultraprint.png" 
              alt="Ultraprint Recargas" 
              className="h-14 md:h-16 w-auto max-w-[65vw] sm:max-w-none object-contain" 
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">
                <Lock className="h-4 w-4 mr-2" />
                Acesso Restrito
              </Link>
            </Button>
            <Button asChild>
              <a href="https://wa.me/5531971447807" target="_blank" rel="noopener noreferrer">
                Fale Conosco
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="outline" asChild className="mt-2 bg-transparent">
                <Link href="/login">
                  <Lock className="h-4 w-4 mr-2" />
                  Acesso Restrito
                </Link>
              </Button>
              <Button asChild className="mt-2">
                <a href="https://wa.me/5531971447807" target="_blank" rel="noopener noreferrer">
                  Fale Conosco
                </a>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
