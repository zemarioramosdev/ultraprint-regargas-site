import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (url.startsWith("http://localhost/storage")) {
    return url.replace("http://localhost/storage", "http://localhost:8080/storage")
  }
  return url
}
