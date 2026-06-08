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
              <img 
                src="/logo-ultraprint.png" 
                alt="Ultraprint Recargas" 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
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
            <h3 className="font-semibold mb-4">Serviços e Soluções</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Recarga de Toner
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Venda de Toner
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Recarga de cartucho de tinta
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Venda de cartucho de tinta
                </Link>
              </li>
              <li>
                <Link href="#servicos" className="hover:text-primary transition-colors">
                  Locação de Impressoras
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Venda de tinta Epson
                </Link>
              </li>
              <li>
                <Link href="#produtos" className="hover:text-primary transition-colors">
                  Toner compatível
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <a href="https://wa.me/5531971447807" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  WhatsApp: (31) 97144-7807
                </a>
              </li>
              <li>
                <a href="mailto:contato@ultraprintrecargas.com.br" className="hover:text-primary transition-colors">
                  contato@ultraprintrecargas.com.br
                </a>
              </li>
              <li>Atendimento 100% Online & Delivery</li>
              <li>Betim - MG</li>
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
