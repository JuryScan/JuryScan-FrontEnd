import SignupForm from "../../components/SignupForm"
import Footer from "../../components/Footer"
import Header from "@/components/Header"

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <SignupForm />
        </div>
      </div>

      <Footer />
    </div>
  )
}
