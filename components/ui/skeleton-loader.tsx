import { cn } from "@/lib/utils"
import type { JSX } from "react"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

/**
 * Skeleton loading placeholder para conteúdo dinâmico.
 */
export default function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps): JSX.Element {
  const baseClasses = "animate-pulse bg-gray-200 rounded"

  const variantClasses = {
    text: "h-4 w-3/4",
    circular: "rounded-full",
    rectangular: "",
  }

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      aria-hidden="true"
    />
  )
}
