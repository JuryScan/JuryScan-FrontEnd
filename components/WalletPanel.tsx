"use client";

import { useRouter } from "next/navigation";


export interface ClienteType {
    nome: string;
    imagemPerfil: string | null;
}

export interface WalletDataType {
    creditos: number;
    valorReais: number;
    usado: number;
    restante: number;
    plano: string;
}

interface WalletPanelProps {
    cliente?: ClienteType | null;
    walletData?: WalletDataType | null;
}


export default function WalletPanel({
    cliente = { nome: "Fulano", imagemPerfil: null },
    walletData = { creditos: 400, valorReais: 200, usado: 50, restante: 350, plano: "Básico" }
}: WalletPanelProps) {
    const router = useRouter();

    const handleUpgrade = () => {
        router.push("/plans");
    };

    // Tela de carregamento teste para dados não injetados 
    if (!cliente || !walletData) {
        return <p style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif", color: "#666" }}>Carregando dados da carteira...</p>;
    }


    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    return (
        <div style={{
            maxWidth: "700px",
            margin: "50px auto",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            fontFamily: "sans-serif"
        }}>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: "#f0f0f0",
                    border: "2px solid #633B48",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                }}>
                    {cliente.imagemPerfil ? (
                        <img src={cliente.imagemPerfil} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ color: "#633B48", fontWeight: "bold", fontSize: "24px" }}>
                            {cliente.nome[0]?.toUpperCase() || "C"}
                        </span>
                    )}
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Olá, {cliente.nome}!</h2>
            </div>


            <div style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: "20px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                gap: "25px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>

                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Saldo Atual</p>
                        <p style={{ fontWeight: "bold", fontSize: "22px", color: "#633B48" }}>{walletData.creditos} créditos</p>
                        <p style={{ fontSize: "14px", color: "#999" }}>({formatarMoeda(walletData.valorReais)})</p>
                    </div>

                    <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 20px" }} />


                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Usado Este Mês</p>
                        <p style={{ fontWeight: "bold", fontSize: "22px", color: "#633B48" }}>{walletData.usado} créditos</p>
                    </div>

                    <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 20px" }} />


                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Restante no Plano</p>
                        <p style={{ fontWeight: "bold", fontSize: "22px", color: "#633B48" }}>{walletData.restante} créditos</p>
                    </div>
                </div>

                <div style={{
                    width: "100%",
                    padding: "15px 0",
                    borderTop: "1px solid #eee",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#633B48"
                }}>
                    Plano Atual: {walletData.plano}
                </div>


                <button
                    onClick={handleUpgrade}
                    style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: "#633B48",
                        color: "#fff",
                        fontSize: "18px",
                        fontWeight: "bold",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Fazer Upgrade / Ver Outros Planos
                </button>
            </div>
        </div>
    );
}