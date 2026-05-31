"use client";

import { useState } from "react";

interface CouponInputProps {
    setDiscount: (discount: number) => void;
}

export default function CouponInput({ setDiscount }: CouponInputProps) {
    const [coupon, setCoupon] = useState<string>("");
    const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

    const handleCoupon = () => {

        const cleanCoupon = coupon.trim().toUpperCase();

        if (cleanCoupon === "JURY10") {
            setDiscount(10);
            setMessage({ text: "Cupom aplicado com sucesso! (10% de desconto)", isError: false });
        } else if (cleanCoupon === "") {
            setDiscount(0);
            setMessage({ text: "Por favor, digite um cupom.", isError: true });
        } else {
            setDiscount(0);
            setMessage({ text: "Cupom inválido ou expirado.", isError: true });
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-full">
            <h3 className="text-base font-semibold text-[#633B48] mb-4">
                Cupom de Desconto
            </h3>

            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Digite seu cupom"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:border-transparent text-gray-900 placeholder-gray-400"
                />

                <button
                    onClick={handleCoupon}
                    className="py-3.5 px-6 rounded-xl bg-[#633B48] text-white font-bold text-sm hover:bg-[#4d2d37] transition-colors shadow-sm focus:outline-none"
                >
                    Aplicar
                </button>
            </div>


            {message && (
                <p className={`mt-3 text-xs font-medium ${message.isError ? "text-red-500" : "text-green-600"}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}