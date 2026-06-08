"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface BannerItem {
  id: number
  titulo: string | null
  subtitulo: string | null
  descricao: string | null
  imagem: string | null
  link_url: string | null
  link_texto: string | null
  cor_fundo: string | null
  ordem: number
  ativo: boolean
}

export function BannerSlider() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/banners/public`)
        const json = await res.json()
        if (json?.data?.length > 0) {
          setBanners(json.data)
        }
      } catch {
        // fallback silencioso
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [banners.length, next])

  if (isLoading) {
    return (
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </section>
    )
  }

  if (banners.length === 0) return null

  const banner = banners[current]

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ backgroundColor: banner.cor_fundo || "#1a1a2e" }}
      >
        {banner.imagem && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${banner.imagem})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="relative h-full mx-auto max-w-7xl px-4 flex items-center">
        <div className="max-w-2xl text-white">
          {banner.subtitulo && (
            <p className="text-sm md:text-base font-medium text-primary-foreground/80 uppercase tracking-widest mb-3">
              {banner.subtitulo}
            </p>
          )}
          {banner.titulo && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {banner.titulo}
            </h1>
          )}
          {banner.descricao && (
            <p className="text-base md:text-lg text-white/80 max-w-xl mb-6">
              {banner.descricao}
            </p>
          )}
          {banner.link_url && (
            <Link
              href={banner.link_url}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {banner.link_texto || "Saiba mais"}
            </Link>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
