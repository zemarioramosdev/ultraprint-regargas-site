import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, CreditCard, Headphones, BadgePercent } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium w-fit">
              <BadgePercent className="h-4 w-4" />
              Economize até 70% na impressão
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Recarga de Cartuchos com{" "}
              <span className="text-primary">Qualidade Garantida</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Especialistas em recarga de cartuchos de tinta e toner. 
              Atendemos empresas e residências com agilidade e preços justos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" asChild>
                <a href="#servicos">
                  Nossos Serviços
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/5531999999999" target="_blank" rel="noopener noreferrer">
                  Solicitar Orçamento
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 lg:p-12">
              <div className="h-full w-full rounded-xl bg-card shadow-2xl shadow-primary/10 flex items-center justify-center border border-border">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                      <path d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2" />
                      <path d="M6 14h12" />
                      <path d="M10 18v4" />
                      <path d="M14 18v4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">+15 Anos</h3>
                  <p className="text-muted-foreground">de experiência no mercado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Entrega Rápida", desc: "Em toda região" },
            { icon: CreditCard, title: "Parcelamento", desc: "Em até 3x sem juros" },
            { icon: BadgePercent, title: "5% Desconto", desc: "No PIX ou Dinheiro" },
            { icon: Headphones, title: "Suporte", desc: "Atendimento dedicado" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border text-center hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
