"use client"

import { useState, useEffect, useCallback } from "react"
import { Coins, Loader2, Check } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, post } from "@/lib/api"
import type { ApiResponse } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface PlanType {
    id: number;
    titulo: string;
    preco: number;
    creditos: number | string;
    tipo: string;
}

export default function PurchasePanel() {

    const plans: PlanType[] = [
        {
            id: 1,
            titulo: "Análise Única",
            preco: 20,
            creditos: 1,
            tipo: "Avulso"
        },
        {
            id: 2,
            titulo: "Pacote 50 Análises",
            preco: 400,
            creditos: 50,
            tipo: "Pacote"
        },
        {
            id: 3,
            titulo: "Premium Ilimitado",
            preco: 1200,
            creditos: "Ilimitado",
            tipo: "Assinatura"
        }
    ];

    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [discount, setDiscount] = useState<number>(0);

    const finalPrice = selectedPlan
        ? selectedPlan.preco - (selectedPlan.preco * discount) / 100
        : 0;

    return (
        <div className="flex flex-col gap-10 w-full">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan as any}
                        selected={selectedPlan?.id === plan.id}
                        onSelect={() => setSelectedPlan(plan)}
                    />
                ))}
            </div>


            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                <CouponInput setDiscount={setDiscount} />

                <OrderSummary
                    selectedPlan={selectedPlan}
                    discount={discount}
                    finalPrice={finalPrice}
                />
            </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Pagamento processado com segurança pela Stripe.
        </p>
      </div>
    </div>
  )
}
