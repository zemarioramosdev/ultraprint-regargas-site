"use client"

import React from "react"
import { trackEvent } from "@/lib/analytics"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Clock, Printer, Droplets, Wrench, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"

const WHATSAPP_NUMBER = "5531971447807"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const services = [
  {
    id: "recarga-cartucho",
    name: "Recarga de Cartucho",
    icon: Droplets,
    duration: "30-60 min",
    description: "Recarga de cartuchos de tinta com qualidade garantida",
  },
  {
    id: "recarga-toner",
    name: "Recarga de Toner",
    icon: Printer,
    duration: "1-2 horas",
    description: "Recarga profissional de toners para impressoras laser",
  },
  {
    id: "manutencao",
    name: "Manutenção de Impressora",
    icon: Wrench,
    duration: "2-4 horas",
    description: "Limpeza, ajustes e reparos em impressoras",
  },
]

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
]

export function Scheduling() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    printerModel: "",
    observations: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const service = services.find((s) => s.id === selectedService)
    const dataHora = `${formData.date}T${formData.time || "09:00"}:00`

    try {
      // 1. Salvar o agendamento no banco de dados de forma definitiva
      await fetch(`${API_URL}/agendamentos/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          telefone: formData.phone,
          email: formData.email || null,
          servico: service?.name || "Serviço Geral",
          data_hora: dataHora,
          observacoes: `Modelo Impressora: ${formData.printerModel}. Obs: ${formData.observations || "Nenhuma"}`
        }),
      })

      // Registrar conversão no analytics e banco local
      await trackEvent("agendamento_concluido", {
        servico: service?.name || "Serviço Geral",
        cliente: formData.name,
        telefone: formData.phone,
        data_hora: dataHora
      })

      // 2. Salvar no chat de atendimento por histórico de compatibilidade
      await fetch(`${API_URL}/chat/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conteudo: `Novo agendamento via site:\nServiço: ${service?.name}\nNome: ${formData.name}\nTelefone: ${formData.phone}\nEmail: ${formData.email}\nData: ${formData.date}\nHorário: ${formData.time}\nImpressora: ${formData.printerModel}\nObs: ${formData.observations || "Nenhuma"}`,
          nome: formData.name,
          telefone: formData.phone,
        }),
      })
    } catch (err) {
      console.error("Erro ao registrar agendamento", err)
    }

    const message = `Olá! Gostaria de agendar um serviço:\n\n*Serviço:* ${service?.name}\n*Nome:* ${formData.name}\n*Telefone:* ${formData.phone}\n*Email:* ${formData.email}\n*Data:* ${formData.date}\n*Horário:* ${formData.time}\n*Modelo da Impressora:* ${formData.printerModel}\n*Observações:* ${formData.observations || "Nenhuma"}`

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const resetForm = () => {
    setSelectedService(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      printerModel: "",
      observations: "",
    })
    setIsSubmitted(false)
  }

  return (
    <section id="agendamento" className="py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Agendamento
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Agende seu Serviço Online
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Escolha o serviço, data e horário de sua preferência. Nossa equipe entrará em contato para confirmar.
          </p>
        </div>

        {isSubmitted ? (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Agendamento Enviado!
              </h3>
              <p className="text-muted-foreground mb-6">
                Seu pedido de agendamento foi enviado via WhatsApp. Nossa equipe confirmará em breve.
              </p>
              <Button onClick={resetForm}>Fazer Novo Agendamento</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                1. Escolha o Serviço
              </h3>
              <div className="space-y-3">
                {services.map((service) => {
                  const Icon = service.icon
                  return (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedService === service.id
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedService === service.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {service.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    2. Preencha seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                        <Input
                          id="phone"
                          placeholder="(31) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">Data Preferida *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Horário Preferido *</Label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) => handleInputChange("time", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="printerModel">Modelo da Impressora *</Label>
                      <Input
                        id="printerModel"
                        placeholder="Ex: HP DeskJet 2774, Brother HL-1212W"
                        value={formData.printerModel}
                        onChange={(e) => handleInputChange("printerModel", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observations">Observações</Label>
                      <Textarea
                        id="observations"
                        placeholder="Descreva o problema ou necessidade..."
                        value={formData.observations}
                        onChange={(e) => handleInputChange("observations", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!selectedService || isSubmitting}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
                      ) : (
                        <>
                          Confirmar Agendamento via WhatsApp
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {!selectedService && (
                      <p className="text-sm text-muted-foreground text-center">
                        Selecione um serviço para continuar
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
