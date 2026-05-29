"use client";

interface ClientType {
    photo?: string;
    name?: string;
    cpf?: string;
    email?: string;
    phone?: string;
    activities?: string[];
}

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    client: ClientType | null;
}

export default function Drawer({ open, onClose, client }: DrawerProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
        >
            <div
                className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl border-l border-gray-200 p-6 flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
                >
                    ×
                </button>

                <div className="text-center">
                    <img
                        src={client?.photo}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        alt={client?.name || "Foto do cliente"}
                    />
                    <h2 className="text-lg font-semibold text-gray-900">
                        {client?.name}
                    </h2>
                    <p className="text-sm text-gray-500">CPF: {client?.cpf}</p>
                    <p className="text-sm text-gray-500">{client?.email}</p>
                    <p className="text-sm text-gray-500">{client?.phone}</p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                        Atividades recentes
                    </h3>
                    <div className="flex flex-col gap-1">
                        {client?.activities?.slice(0, 3).map((act: string, i: number) => (
                            <p key={i} className="text-sm text-gray-600">
                                • {act}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                    <button className="bg-[#633b48] text-white rounded-md py-2 font-medium hover:opacity-90">
                        Gerar Relatório Completo
                    </button>

                    <button className="bg-gray-100 rounded-md py-2 text-gray-700 hover:bg-gray-200">
                        Enviar Mensagem
                    </button>
                </div>
            </div>
        </div>
    );
}