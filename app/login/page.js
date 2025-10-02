import LoginForm from "../../components/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD8E4] to-[#EFB8C8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#633B48] rounded-full opacity-40 -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#986977] rounded-full opacity-30 translate-y-40 -translate-x-40"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <LoginForm />
      </div>
    </div>
  )
}
