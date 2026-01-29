import Link from "next/link"
import { Printer, Facebook, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Printer className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">Ultraprint</span>
                <span className="text-xs text-background/70 -mt-1">Recargas</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Especialistas em recarga de cartuchos e toners há mais de 15 anos. 
              Qualidade, economia e sustentabilidade para sua impressão.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="#inicio" className="hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="#vantagens" className="hover:text-primary transition-colors">
                  Vantagens
                </Link>
              </li>
              <li>
                <Link href="#contato" className="hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Recarga de Cartuchos
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Recarga de Toners
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Cartuchos Compatíveis
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Manutenção de Impressoras
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Venda de Impressoras
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <a href="tel:+5531999999999" className="hover:text-primary transition-colors">
                  (31) 99999-9999
                </a>
              </li>
              <li>
                <a href="tel:+553133333333" className="hover:text-primary transition-colors">
                  (31) 3333-3333
                </a>
              </li>
              <li>
                <a href="mailto:contato@ultraprint.com.br" className="hover:text-primary transition-colors">
                  contato@ultraprint.com.br
                </a>
              </li>
              <li>Rua das Impressoras, 123</li>
              <li>Centro - Belo Horizonte/MG</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/70">
            © {new Date().getFullYear()} Ultraprint Recargas. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-background/70">
            <Link href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
