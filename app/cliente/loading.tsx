import Skeleton from "@/components/ui/skeleton-loader"

export default function ClienteLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Two column layout skeleton */}
        <div className="grid lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>

              <Skeleton className="h-64 w-full rounded-xl" />

              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
