import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, CircleDot, Printer, Recycle, Package, Wrench } from "lucide-react"

const services = [
  {
    icon: Droplets,
    title: "Recarga de Cartuchos de Tinta",
    description: "Recarga profissional para todas as marcas: HP, Epson, Canon, Brother e Lexmark. Tintas de alta qualidade.",
    brands: ["HP", "Epson", "Canon", "Brother"],
  },
  {
    icon: CircleDot,
    title: "Recarga de Toner",
    description: "Especialistas em toner para impressoras laser. Rendimento garantido igual ao original.",
    brands: ["HP", "Samsung", "Brother", "Xerox"],
  },
  {
    icon: Package,
    title: "Cartuchos Compatíveis",
    description: "Cartuchos novos compatíveis com garantia. Qualidade premium com preço acessível.",
    brands: ["Todas as marcas"],
  },
  {
    icon: Printer,
    title: "Venda de Impressoras",
    description: "Impressoras novas e seminovas das melhores marcas. Jato de tinta e laser.",
    brands: ["HP", "Epson", "Brother"],
  },
  {
    icon: Wrench,
    title: "Manutenção",
    description: "Serviço técnico especializado para sua impressora. Diagnóstico e reparo.",
    brands: ["Todas as marcas"],
  },
  {
    icon: Recycle,
    title: "Sustentabilidade",
    description: "Contribua com o meio ambiente. Recarregar é economizar e reciclar.",
    brands: ["Eco-friendly"],
  },
]

export function Services() {
  return (
    <section id="servicos" className="py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Nossos Serviços</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Soluções completas em impressão
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Oferecemos serviços especializados para atender todas as suas necessidades de impressão, 
            sempre com qualidade e preço justo.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {service.brands.map((brand, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
