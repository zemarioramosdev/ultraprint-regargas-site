"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check for auth token in cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login?redirect=/dashboard")
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return null // Or a loading spinner
  }

  return <>{children}</>
}
