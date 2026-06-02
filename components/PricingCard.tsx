"use client";

interface PlanType {
    id: number;
    titulo: string;
    preco: number;
    creditos: number | string;
    tipo: string;
}

interface PricingCardProps {
    plan: PlanType;
    selected: boolean;
    onSelect: () => void;
}

export default function PricingCard({ plan, selected, onSelect }: PricingCardProps) {

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    return (
        <div
            onClick={onSelect}
            className={`bg-white rounded-2xl p-7 cursor-pointer shadow-md transition-all duration-200 flex flex-col items-start gap-4 transform active:scale-[0.99] hover:shadow-lg
                ${selected
                    ? "border-3 border-[#633B48] ring-2 ring-[#633B48]/10"
                    : "border-2 border-gray-100 hover:border-gray-200"
                }`}
        >

            <h2 className="text-xl font-bold text-gray-800">
                {plan.titulo}
            </h2>

            <p className="text-4xl font-extrabold text-[#633B48]">
                {formatarMoeda(plan.preco)}
            </p>


            <p className="text-sm text-gray-500 font-medium">
                {plan.creditos}{" "}
                {typeof plan.creditos === "number"
                    ? plan.creditos === 1 ? "crédito" : "créditos"
                    : " de análises"}
            </p>


            <span className="mt-2 inline-block bg-[#f3e7ec] text-[#633B48] px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                {plan.tipo}
            </span>
        </div>
    );
}