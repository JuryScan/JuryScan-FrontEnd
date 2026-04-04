"use client";

export default function Drawer({ open, onClose, client }) {
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
                {/* botão fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
                >
                    ×
                </button>

                {/* 👤 PERFIL */}
                <div className="text-center">
                    <img
                        src={client?.photo}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h2 className="text-lg font-semibold text-gray-900">
                        {client?.name}
                    </h2>
                    <p className="text-sm text-gray-500">CPF: {client?.cpf}</p>
                    <p className="text-sm text-gray-500">{client?.email}</p>
                    <p className="text-sm text-gray-500">{client?.phone}</p>
                </div>

                {/* 📊 ATIVIDADES */}
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                        Atividades recentes
                    </h3>
                    <div className="flex flex-col gap-1">
                        {client?.activities?.slice(0, 3).map((act, i) => (
                            <p key={i} className="text-sm text-gray-600">
                                • {act}
                            </p>
                        ))}
                    </div>
                </div>

                {/* ⚡ AÇÕES */}
                <div className="mt-auto flex flex-col gap-3">
                    <button className="bg-[#6b3f46] text-white rounded-md py-2 font-medium hover:opacity-90">
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