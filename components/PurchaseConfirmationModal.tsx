"use client"

import { Loader2, Info, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PurchaseConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: {
    tokens: number
    price: number
    label: string
  } | null
  onConfirm: () => void
  isLoading: boolean
}

export default function PurchaseConfirmationModal({
  open,
  onOpenChange,
  plan,
  onConfirm,
  isLoading,
}: PurchaseConfirmationModalProps) {
  if (!plan) return null

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#633B48]">Confirmar Compra de Créditos</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Summary Card */}
          <div className="bg-[#FFECF1]/30 border border-[#633B48]/20 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pacote</span>
              <span className="font-bold text-gray-900">{plan.label}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Créditos</span>
              <span className="font-bold text-gray-900">{plan.tokens}</span>
            </div>

            <hr className="border-[#633B48]/10" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Valor Total</span>
              <span className="text-xl font-bold text-[#633B48]">{formatarMoeda(plan.price)}</span>
            </div>
          </div>

          {/* Info Message - Next Steps */}
          <div className="bg-[#FFECF1]/40 border border-[#633B48]/15 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-[#633B48] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Próximos passos</p>
              <p className="text-xs text-gray-600 mt-1">
                Você será redirecionado para concluir o pagamento em uma nova guia. Caso feche esta janela, o processo de pagamento será cancelado.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#633B48] hover:bg-[#4A2C38] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processando...
              </>
            ) : (
              "Prosseguir para Pagamento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
