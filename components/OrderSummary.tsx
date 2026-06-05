"use client";

interface PlanType {
    titulo: string;
    creditos: number | string;
    preco: number;
}

interface OrderSummaryProps {
    selectedPlan: PlanType | null;
    discount: number;
    finalPrice: number;
}

export default function OrderSummary({ selectedPlan, discount, finalPrice }: OrderSummaryProps) {


    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    return (
        <div className="bg-white rounded-2xl p-7 shadow-md border border-gray-100 max-w-full">
            <h2 className="text-xl font-bold text-[#633B48] mb-6">
                Resumo do Pedido
            </h2>

            {!selectedPlan ? (
                <p className="text-gray-500 text-sm">
                    Selecione um plano para continuar com a compra.
                </p>
            ) : (
                <>
                    <div className="flex flex-col gap-4 text-sm text-gray-600">
                        <div className="flex justify-between items-center">
                            <span>Plano Selecionado</span>
                            <strong className="text-gray-900 font-semibold">{selectedPlan.titulo}</strong>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Créditos</span>
                            <strong className="text-gray-900 font-semibold">
                                {selectedPlan.creditos} {typeof selectedPlan.creditos === "number" && selectedPlan.creditos === 1 ? "crédito" : ""}
                            </strong>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Desconto</span>
                            <strong className="text-green-600 font-semibold">
                                {discount > 0 ? `-${discount}%` : "0%"}
                            </strong>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Preço Original</span>
                            <strong className="text-gray-900 font-semibold">{formatarMoeda(selectedPlan.preco)}</strong>
                        </div>

                        <hr className="border-gray-100 my-2" />

                        <div className="flex justify-between items-center text-lg font-bold text-[#633B48]">
                            <span>Total</span>
                            <span className="text-xl">{formatarMoeda(finalPrice)}</span>
                        </div>
                    </div>

                    <button className="mt-6 w-full py-4 px-6 rounded-xl bg-[#633B48] text-white font-bold text-base hover:bg-[#4d2d37] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#633B48] focus:ring-offset-2">
                        Ir para o Pagamento
                    </button>
                </>
            )}
        </div>
    );
}