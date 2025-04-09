"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestTimerProps {
  initialTime: number // in seconds
  onTimeUp: () => void
}

export function TestTimer({ initialTime, onTimeUp }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [timerWarning, setTimerWarning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Add warning when less than 5 minutes left
        if (prev <= 300 && prev > 299) {
          setTimerWarning(true)
        }

        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-full shadow-sm transition-all duration-300",
        timerWarning ? "bg-red-500 text-red-50 animate-pulse" : "bg-white text-primary",
      )}
    >
      <Clock className="h-5 w-5" />
      <span className="font-mono text-lg font-semibold tracking-wider">{formatTime(timeLeft)}</span>
    </div>
  )
}

