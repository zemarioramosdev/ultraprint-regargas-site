import React from "react"
import { Printer, Droplets, RotateCcw, ShieldCheck, Landmark, CheckCircle } from "lucide-react"

const specialties = [
  {
    keyword: "Recarga de Toner",
    description: "Serviço profissional de recarga de toners laser para marcas como HP, Brother, Samsung e Xerox. Economia inteligente com garantia de rendimento igual ao original.",
    icon: RotateCcw,
  },
  {
    keyword: "Venda de Toner",
    description: "Fornecemos toners novos para diversos modelos de impressoras laser. Opções originais e compatíveis com excelente custo-benefício.",
    icon: Printer,
  },
  {
    keyword: "Recarga de cartucho de tinta",
    description: "Recargas expressas de cartuchos pretos e coloridos HP e Canon. Processo especializado com tintas importadas de alta densidade.",
    icon: Droplets,
  },
  {
    keyword: "Venda de cartucho de tinta",
    description: "Ampla variedade de cartuchos originais de alto rendimento. Suprimentos prontos para garantir o máximo desempenho do seu equipamento.",
    icon: ShieldCheck,
  },
  {
    keyword: "Locação de Impressoras",
    description: "Soluções de outsourcing de impressão sob medida para empresas. Multifuncionais modernas com manutenção inclusa e redução real de custos operacionais.",
    icon: Landmark,
  },
  {
    keyword: "Venda de tinta Epson",
    description: "Temos tintas originais e compatíveis de alta performance para impressoras Epson EcoTank (L3150, L3250, L4260 e outros modelos).",
    icon: Droplets,
  },
  {
    keyword: "Toner compatível",
    description: "Adquira toners compatíveis 100% novos, lacrados e com certificação de qualidade. Mesma capacidade de páginas do original por uma fração do preço.",
    icon: CheckCircle,
  },
]

export function SeoKeywords() {
  return (
    <section className="py-16 bg-muted/20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Especialidades</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Soluções completas de Impressão em Betim
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Referência em Betim e região metropolitana para recargas, suprimentos e outsourcing de impressão.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specialties.map((specialty, idx) => {
            const Icon = specialty.icon
            return (
              <div 
                key={idx} 
                className="p-5 bg-background rounded-xl border border-border/80 hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2">
                    {specialty.keyword}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {specialty.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-muted/50 text-[10px] text-primary/80 font-medium flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                  Atendimento Delivery em Betim
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
