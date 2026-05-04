"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const params = useSearchParams()

  const plan = params.get("plan")
  const price = params.get("price")

  const [method, setMethod] = useState("card")
  const [status, setStatus] = useState("idle")

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })

  function handleChange(e) {
    const { name, value } = e.target
    setCard(prev => ({ ...prev, [name]: value }))
  }

  function handlePayment() {
    // validação simples
    if (method === "card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) {
        alert("Preencha todos os campos")
        return
      }
    }

    setStatus("loading")

    // simulação de backend
    setTimeout(() => {
      const success = Math.random() > 0.3
      setStatus(success ? "success" : "error")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-4">{plan} - {price}</p>

        {/* MÉTODO DE PAGAMENTO */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMethod("card")}
            className={`flex-1 p-2 border rounded ${method === "card" ? "bg-gray-200" : ""}`}
          >
            Cartão
          </button>

          <button
            onClick={() => setMethod("pix")}
            className={`flex-1 p-2 border rounded ${method === "pix" ? "bg-gray-200" : ""}`}
          >
            PIX
          </button>
        </div>

        {/* CARTÃO */}
        {method === "card" && status === "idle" && (
          <div className="flex flex-col gap-2">

            <input
              name="number"
              placeholder="Número do cartão"
              maxLength={19}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="name"
              placeholder="Nome do titular"
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <input
                name="expiry"
                placeholder="MM/AA"
                maxLength={5}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />

              <input
                name="cvv"
                placeholder="CVV"
                maxLength={4}
                type="password"
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              />
            </div>

            <button
              onClick={handlePayment}
              className="bg-green-600 text-white p-2 rounded mt-2"
            >
              Pagar com Cartão
            </button>
          </div>
        )}

        {/* PIX */}
        {method === "pix" && status === "idle" && (
          <div className="text-center">

            <img
              src="/qrcode-fake.png"
              alt="QR Code"
              className="mx-auto w-40"
            />

            <textarea
              readOnly
              value="00020126580014BR.GOV.BCB.PIX123456789"
              className="w-full border p-2 mt-2"
            />

            <button
              onClick={() => navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX123456789")}
              className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
            >
              Copiar código PIX
            </button>

            <button
              onClick={handlePayment}
              className="bg-green-600 text-white p-2 rounded mt-2 w-full"
            >
              Já paguei
            </button>

          </div>
        )}

        {/* STATUS */}
        {status === "loading" && (
          <p className="text-yellow-600 mt-4">Processando pagamento...</p>
        )}

        {status === "success" && (
          <p className="text-green-600 mt-4">Pagamento aprovado 🎉</p>
        )}

        {status === "error" && (
          <p className="text-red-600 mt-4">Falha no pagamento ❌</p>
        )}

      </div>
    </div>
  )
}