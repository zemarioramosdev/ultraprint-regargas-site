import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Products } from "@/components/products"
import { Scheduling } from "@/components/scheduling"
import { Benefits } from "@/components/benefits"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Products />
      <Scheduling />
      <Benefits />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  )
}
