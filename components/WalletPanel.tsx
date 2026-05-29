"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ClienteType {
    name: string;
    profileImage: string | null;
}

interface WalletDataType {
    credits: number;
    value: number;
    used: number;
    remaining: number;
    plan: string;
}

export default function WalletPanel() {
    const router = useRouter();

    const [cliente, setCliente] = useState<ClienteType | null>(null);
    const [walletData, setWalletData] = useState<WalletDataType | null>(null);

    const handleUpgrade = () => {
        router.push("/plans");
    };

    useEffect(() => {
        const fetchData = async () => {
            const clienteMock = { name: "Fulano", profileImage: null };
            const walletMock = {
                credits: 400,
                value: 200,
                used: 50,
                remaining: 350,
                plan: "Basic"
            };
            await new Promise(res => setTimeout(res, 300));
            setCliente(clienteMock);
            setWalletData(walletMock);
        };
        fetchData();
    }, []);

    if (!cliente || !walletData) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

    return (
        <div style={{
            maxWidth: "700px",
            margin: "50px auto",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px"
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
                    {cliente.profileImage ? (
                        <img src={cliente.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ color: "#633B48", fontWeight: "bold", fontSize: "24px" }}>{cliente.name[0]?.toUpperCase() || "C"}</span>
                    )}
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Hi, {cliente.name}!</h2>
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
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Current Balance</p>
                        <p style={{ fontWeight: "bold", fontSize: "22px", color: "#633B48" }}>{walletData.credits} credits</p>
                        <p style={{ fontSize: "14px", color: "#999" }}>(${walletData.value})</p>
                    </div>
                    <div style={{
                        width: "1px",
                        backgroundColor: "#ccc",
                        margin: "0 20px"
                    }} />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Used This Month</p>
                        <p style={{ fontWeight: "bold", fontSize: "22px", color: "#633B48" }}>{walletData.used} credits</p>
                    </div>
                    <div style={{
                        width: "1px",
                        backgroundColor: "#ccc",
                        margin: "0 20px"
                    }} />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>Remaining in Plan</p>
                        <p style={{ fontWeight: "bold", fontSize: "22px", color: "#633B48" }}>{walletData.remaining} credits</p>
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
                    Current Plan: {walletData.plan}
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
                    Upgrade / See Other Plans
                </button>
            </div>
        </div>
    );
}