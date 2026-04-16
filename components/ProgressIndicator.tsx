"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"

interface ProgressIndicatorProps {
  value: number
  label?: string
}

export default function ProgressIndicator({ value, label }: ProgressIndicatorProps) {
  return (
    <div className="w-full space-y-2">

      {label && (
        <p className="text-sm text-gray-600">
          {label}
        </p>
      )}

      <Progress value={value} />

      <p className="text-xs text-gray-500">
        {value}%
      </p>

    </div>
  )
}
