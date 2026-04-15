"use client"

import { Progress } from "@/components/ui/progress"

export default function ProgressIndicator({ value, label }) {
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