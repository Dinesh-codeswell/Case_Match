"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"

type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  direction?: "horizontal" | "vertical"
  reverse?: boolean
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (durationOnHover && isHovered) {
      setCurrentDuration(durationOnHover)
    } else {
      setCurrentDuration(duration)
    }
  }, [isHovered, duration, durationOnHover])

  const hoverProps = durationOnHover
    ? {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      }
    : {}

  return (
    <div className={cn("overflow-hidden", className)} {...hoverProps}>
      <div
        ref={containerRef}
        className="flex w-max animate-scroll-left"
        style={{
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
          animationDuration: `${currentDuration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
