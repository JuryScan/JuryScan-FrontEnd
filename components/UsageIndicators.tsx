interface UsageIndicatorsProps {
    used: number;
    remaining: number | string;
    isLoading?: boolean; // Adicionado para integração com a API
}

export default function UsageIndicators({ used, remaining, isLoading = false }: UsageIndicatorsProps) {


    if (isLoading) {
        return (
            <div className="flex justify-between gap-5 mb-5 w-full">
                <div className="flex-1 p-4 rounded-xl bg-[#FFF7F9] border border-[#FFECF1] animate-pulse text-center">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[#FFF7F9] border border-[#FFECF1] animate-pulse text-center">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-5 mb-5 w-full">

            <div className="flex-1 p-4 rounded-xl bg-[#FFF7F9] border border-[#FFECF1] shadow-sm text-center">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Usado este mês
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                    {used} {used === 1 ? 'crédito' : 'créditos'}
                </p>
            </div>


            <div className="flex-1 p-4 rounded-xl bg-[#FFF7F9] border border-[#FFECF1] shadow-sm text-center">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Restante no plano
                </h3>
                <p className="text-2xl font-bold text-[#633B48]">
                    {remaining} {remaining === 1 ? 'crédito' : 'créditos'}
                </p>
            </div>
        </div>
    );
}