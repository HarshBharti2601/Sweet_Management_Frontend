"use client"

import { useEffect, useState } from "react"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { createPortal } from "react-dom"

interface NotificationProps {
  title: string
  description: string
  variant?: "default" | "destructive" | "success"
  duration?: number
  onClose: () => void
}

export function Notification({ title, description, variant = "default", duration = 5000, onClose }: NotificationProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!mounted) return null

  const bgColor = variant === "destructive" ? "bg-red-600" : variant === "success" ? "bg-green-600" : "bg-primary"
  const Icon = variant === "destructive" ? AlertCircle : CheckCircle

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2 duration-300">
      <div className={`${bgColor} text-white rounded-lg shadow-lg p-4 pr-12 max-w-md min-w-[300px]`}>
        <button onClick={onClose} className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-sm mb-1">{title}</div>
            <div className="text-sm text-white/90">{description}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
