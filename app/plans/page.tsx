"use client";

import PurchasePanel from "../../components/PurchasePanel";
import Header from "@/components/shared/Header";

export default function PlansPage() {

    const mockUser = {
        nome: "Mariana Alencar",
        iniciais: "MA",
        creditos: 15,
        isAdvogado: false
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 w-full">

            <Header mockUser={mockUser as any} />


            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 flex flex-col gap-10">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#633B48] mb-2">
                        Adquirir Créditos
                    </h1>
                    <p className="text-gray-500">
                        Selecione o plano ideal para as suas necessidades jurídicas.
                    </p>
                </div>


                <PurchasePanel />
            </main>
        </div>
    );
}