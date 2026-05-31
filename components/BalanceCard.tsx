interface BalanceCardProps {
    credits: number;
    value: number;
    isLoading?: boolean;
}

export default function BalanceCard({ credits, value, isLoading = false }: BalanceCardProps) {

    if (isLoading) {
        return (
            <div className="w-full p-5 rounded-xl bg-[#FFF7F9] border border-[#FFECF1] animate-pulse text-center mb-5">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
        );
    }

    const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);

    return (
        <div className="w-full p-5 rounded-xl bg-[#FFF7F9] border border-[#FFECF1] shadow-sm text-center mb-5">
            <h2 className="text-sm font-semibold text-[#633B48] uppercase tracking-wider mb-2">
                Saldo Atual
            </h2>
            <p className="text-3xl font-bold text-gray-950 my-1">
                {credits} {credits === 1 ? 'crédito' : 'créditos'}
            </p>
            <p className="text-sm text-gray-500 font-medium">
                ≈ {valorFormatado}
            </p>
        </div>
    );
}