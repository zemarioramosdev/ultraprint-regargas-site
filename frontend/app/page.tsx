import { Header } from "@/components/header"
import { BannerSlider } from "@/components/banner-slider"
import { Services } from "@/components/services"
import { Products } from "@/components/products"
import { Scheduling } from "@/components/scheduling"
import { Benefits } from "@/components/benefits"
import { SeoKeywords } from "@/components/seo-keywords"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <BannerSlider />
      <Services />
      <Products />
      <Scheduling />
      <Benefits />
      <SeoKeywords />
      <Contact />
      <Footer />
      <ChatWidget />
    </main>
  )
}

