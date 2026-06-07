interface AvatarWithInitialProps {
  name: string
  photoUrl?: string
  alt?: string
  size?: "xs" | "sm" | "md" | "lg"
  borderColor?: string
  rounded?: "full" | "lg" | "md" | "sm"
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

function getColorByInitial(initial: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    A: { bg: "bg-red-100", text: "text-red-700" },
    B: { bg: "bg-blue-100", text: "text-blue-700" },
    C: { bg: "bg-green-100", text: "text-green-700" },
    D: { bg: "bg-purple-100", text: "text-purple-700" },
    E: { bg: "bg-yellow-100", text: "text-yellow-700" },
    F: { bg: "bg-pink-100", text: "text-pink-700" },
    G: { bg: "bg-indigo-100", text: "text-indigo-700" },
    H: { bg: "bg-cyan-100", text: "text-cyan-700" },
    I: { bg: "bg-amber-100", text: "text-amber-700" },
    J: { bg: "bg-lime-100", text: "text-lime-700" },
    K: { bg: "bg-orange-100", text: "text-orange-700" },
    L: { bg: "bg-rose-100", text: "text-rose-700" },
    M: { bg: "bg-emerald-100", text: "text-emerald-700" },
    N: { bg: "bg-teal-100", text: "text-teal-700" },
    O: { bg: "bg-violet-100", text: "text-violet-700" },
    P: { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
    Q: { bg: "bg-sky-100", text: "text-sky-700" },
    R: { bg: "bg-slate-100", text: "text-slate-700" },
    S: { bg: "bg-zinc-100", text: "text-zinc-700" },
    T: { bg: "bg-stone-100", text: "text-stone-700" },
    U: { bg: "bg-red-200", text: "text-red-800" },
    V: { bg: "bg-blue-200", text: "text-blue-800" },
    W: { bg: "bg-green-200", text: "text-green-800" },
    X: { bg: "bg-purple-200", text: "text-purple-800" },
    Y: { bg: "bg-yellow-200", text: "text-yellow-800" },
    Z: { bg: "bg-pink-200", text: "text-pink-800" },
  }

  return colors[initial] || colors.A
}

const sizeClasses = {
  xs: { container: "w-8 h-8", text: "text-sm" },
  sm: { container: "w-12 h-12", text: "text-lg" },
  md: { container: "w-24 h-24", text: "text-3xl" },
  lg: { container: "w-32 h-32", text: "text-5xl" },
}

const roundedClasses = {
  full: "rounded-full",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded-sm",
}

export default function AvatarWithInitial({
  name,
  photoUrl,
  alt,
  size = "md",
  borderColor = "border-[#FFECF1]",
  rounded = "full",
}: AvatarWithInitialProps) {
  const initial = getInitial(name)
  const colors = getColorByInitial(initial)
  const sizes = sizeClasses[size]
  const borderRadius = roundedClasses[rounded]

  if (photoUrl) {
    return (
      <div className={`${sizes.container} ${borderRadius} border-4 ${borderColor} overflow-hidden`}>
        <img
          src={photoUrl}
          alt={alt || name}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizes.container} ${borderRadius} border-4 ${borderColor} flex items-center justify-center ${colors.bg}`}
    >
      <span className={`font-bold ${sizes.text} ${colors.text}`}>{initial}</span>
    </div>
  )
}
