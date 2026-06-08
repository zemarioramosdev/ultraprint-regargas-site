const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function trackEvent(eventType: string, details?: Record<string, any>) {
  console.log(`[Analytics] Event tracked: ${eventType}`, details)

  // 1. Enviar evento para gravar no banco de dados local da Ultraprint
  try {
    const res = await fetch(`${API_URL}/marketing/events/public`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo_evento: eventType,
        detalhes: details || {}
      }),
    })
    if (!res.ok) {
      console.warn("[Analytics] Local tracking endpoint returned status " + res.status)
    }
  } catch (err) {
    console.error("[Analytics] Error sending tracking event to local backend", err)
  }

  // 2. Disparar evento para Google Tag se estiver carregado
  if (typeof window !== "undefined" && (window as any).gtag) {
    try {
      (window as any).gtag("event", eventType, details || {})
    } catch (err) {
      console.error("[Analytics] Error sending event to Google Tag", err)
    }
  }
}
