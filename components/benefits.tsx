import { CheckCircle2, TrendingUp, Shield, Clock, Leaf, Award } from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    title: "Economia de até 70%",
    description: "Recarregar seus cartuchos é muito mais econômico que comprar novos. Economize sem perder qualidade.",
  },
  {
    icon: Shield,
    title: "Garantia Total",
    description: "Todos os nossos serviços e produtos possuem garantia. Sua satisfação é nossa prioridade.",
  },
  {
    icon: Clock,
    title: "Entrega Rápida",
    description: "Receba seus produtos em casa ou retire na loja. Entrega expressa para toda a região metropolitana.",
  },
  {
    icon: Award,
    title: "+15 Anos de Experiência",
    description: "Somos especialistas no mercado de impressão há mais de 15 anos. Confie em quem entende do assunto.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Ao recarregar, você contribui para a preservação do meio ambiente, reduzindo o descarte de plástico.",
  },
  {
    icon: CheckCircle2,
    title: "Qualidade Comprovada",
    description: "Utilizamos tintas e toners de alta qualidade, garantindo impressões nítidas e duradouras.",
  },
]

export function Benefits() {
  return (
    <section id="vantagens" className="py-16 md:py-24 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Por que nos escolher</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl text-balance">
            Vantagens Ultraprint
          </h2>
          <p className="mt-4 text-background/70 max-w-2xl mx-auto">
            Descubra por que milhares de clientes confiam na Ultraprint para suas necessidades de impressão.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-background/70 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-background/10">
          {[
            { value: "+15", label: "Anos no mercado" },
            { value: "+50K", label: "Clientes atendidos" },
            { value: "+100K", label: "Recargas realizadas" },
            { value: "98%", label: "Satisfação" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-background/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
