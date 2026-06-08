"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Printer, Mail, Lock, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function EsqueciSenhaPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  
  // Security checks
  const [hpValue, setHpValue] = useState("") // Honeypot
  const [sliderVal, setSliderVal] = useState(0) // Slider human check
  const [isUnlocked, setIsUnlocked] = useState(false)
  
  // UI States
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setSliderVal(val)
    if (val >= 100) {
      setIsUnlocked(true)
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Protection: Honeypot check (if filled, reject silently or show mock success to confuse bots)
    if (hpValue.trim() !== "") {
      console.warn("[Security] Bot honeypot filled.")
      setSuccess("Se o e-mail estiver cadastrado, um código de verificação foi enviado.")
      setStep(2)
      return
    }

    // Protection: Slider check
    if (!isUnlocked) {
      setError("Por favor, deslize o validador até o fim para provar que você não é um robô.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/esqueci-senha/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          recaptcha_check: true // passes required 'recaptcha_check'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erro ao solicitar código de recuperação.")
      } else {
        setSuccess("Código de segurança enviado com sucesso! Verifique seu e-mail.")
        setStep(2)
      }
    } catch (err) {
      setError("Erro de rede. Verifique sua conexão e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password.length < 8) {
      setError("A senha deve conter pelo menos 8 caracteres.")
      return
    }

    if (password !== passwordConfirmation) {
      setError("As senhas informadas não coincidem.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/esqueci-senha/redefinir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          password,
          password_confirmation: passwordConfirmation
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erro ao redefinir a senha.")
      } else {
        setSuccess("Senha redefinida com sucesso! Redirecionando...")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo-ultraprint.png" 
                alt="Ultraprint Recargas" 
                className="h-10 w-auto object-contain" 
              />
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Recuperação de Senha</CardTitle>
            <CardDescription>
              {step === 1
                ? "Solicite um código temporário para redefinir seu acesso"
                : "Insira o código de 6 dígitos enviado por e-mail para cadastrar a nova senha"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-800 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {step === 1 ? (
              /* ETAPA 1 - SOLICITAÇÃO */
              <form onSubmit={handleSendCode} className="space-y-4">
                {/* Honeypot field (hidden from humans) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="phone_verification_hp"
                    value={hpValue}
                    onChange={(e) => setHpValue(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Cadastrado</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@ultraprint.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Slider Robot protection */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs text-muted-foreground flex justify-between">
                    <span>Validador de Segurança</span>
                    <span className="font-semibold text-primary">
                      {isUnlocked ? "✓ Verificado" : "Deslize para liberar"}
                    </span>
                  </Label>
                  <div className={`relative h-11 rounded-lg border flex items-center justify-center overflow-hidden transition-all select-none ${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-muted'}`}>
                    <span className={`text-xs font-medium ${isUnlocked ? 'text-green-700' : 'text-muted-foreground'}`}>
                      {isUnlocked ? "Humano Confirmado" : ">>> Deslize até o fim >>>"}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderVal}
                      onChange={handleSliderChange}
                      disabled={isUnlocked || isLoading}
                      className="absolute inset-0 w-full h-full opacity-30 cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading || !isUnlocked || !email}>
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando código...</>
                  ) : (
                    "Enviar Código"
                  )}
                </Button>
              </form>
            ) : (
              /* ETAPA 2 - RESET PASSWORD */
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Segurança (6 dígitos)</Label>
                  <Input
                    id="code"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="text-center text-lg font-mono tracking-widest"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-[10px] text-muted-foreground text-center">Verifique a caixa de entrada ou logs do e-mail.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="No mínimo 8 caracteres"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passwordConfirmation"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repita a senha criada"
                      className="pl-10"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading || code.length !== 6 || !password}>
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redefinindo senha...</>
                  ) : (
                    "Redefinir Senha"
                  )}
                </Button>
                
                <Button variant="outline" type="button" className="w-full" onClick={() => setStep(1)} disabled={isLoading}>
                  Voltar
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-border/50 py-4">
            <p className="text-xs text-muted-foreground text-center">
              Proteção contra robôs habilitada. Códigos expiram após 15 minutos.
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ultraprint Recargas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
