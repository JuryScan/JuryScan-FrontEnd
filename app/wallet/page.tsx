"use client";

import Header from "@/components/shared/Header";
import WalletPanel from "../../components/WalletPanel";

export default function WalletPage() {

    const usuarioDeTeste = {
        nome: "Mariana Alencar",
        iniciais: "MA",
        imagemPerfil: null,
        creditos: 150,
        valorReais: 75,
        usado: 50,
        restante: 100,
        plano: "Básico"
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

            <Header mockUser={usuarioDeTeste} />

            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-2xl transform transition-all duration-300">

                    <WalletPanel
                        cliente={{ nome: usuarioDeTeste.nome, imagemPerfil: usuarioDeTeste.imagemPerfil }}
                        walletData={{
                            creditos: usuarioDeTeste.creditos,
                            valorReais: usuarioDeTeste.valorReais,
                            usado: usuarioDeTeste.usado,
                            restante: usuarioDeTeste.restante,
                            plano: usuarioDeTeste.plano
                        }}
                    />
                </div>
            </main>
        </div>
    );
}