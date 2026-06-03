"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User,
  Save,
  Loader2,
  Phone,
  Mail,
  KeyRound,
  ShieldOff,
  ShieldEllipsis,
  ShieldCheck,
  Trash2,
  Camera,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { put, del } from "@/lib/api"
import { profileSchema, type ProfileSchema } from "@/lib/schemas"
import { TextInput } from "@/components/forms/TextInput"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { ApiResponse } from "@/lib/types"

export default function ClienteConfiguracoesPage() {
  const { user, refreshUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"perfil" | "seguranca" | "privacidade">("perfil")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })

  const profileMethods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nomeCompleto: user?.nomeCompleto || "",
      email: user?.email || "",
      telefone: String(user?.telefone || ""),
    },
  })

  const onProfileSubmit = async (data: ProfileSchema) => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const res = await put<ApiResponse<any>>(`/users/comum/${user.id}`, {
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        telefone: data.telefone,
      })
      if (res.success) {
        toast({ title: "Sucesso", description: "Perfil atualizado com sucesso!" })
        await refreshUser()
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.message || "Falha ao atualizar perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const res = await put<ApiResponse<any>>(`/users/${user?.id}/password`, {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      })
      if (res.success) {
        toast({ title: "Sucesso", description: "Senha alterada com sucesso!" })
        setPasswords({ current: "", new: "", confirm: "" })
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error?.message || "Falha ao alterar senha", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("foto", file)
      const res = await put<ApiResponse<any>>(`/users/${user.id}/avatar`, formData)
      if (res.success) {
        toast({ title: "Foto Atualizada", description: "Sua foto de perfil foi salva com sucesso." })
        await refreshUser()
      }
    } catch (error) {
      toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("TEM CERTEZA? Esta ação é irreversível e todos os seus dados serão apagados permanentemente.")) return
    setIsDeleting(true)
    try {
      const res = await del<ApiResponse<any>>(`/users/comum/${user?.id}`)
      if (res.success) {
        toast({ title: "Conta Excluída", description: "Sentimos muito em ver você partir." })
        logout()
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao excluir conta. Contate o suporte.", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1F30] mb-2">Configurações</h1>
        <p className="text-gray-500">Gerencie seus dados pessoais e a segurança da sua conta.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-8 max-w-xl overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "perfil" ? "bg-white text-[#A50064] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="size-4" /> Perfil
        </button>
        <button
          onClick={() => setActiveTab("seguranca")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "seguranca" ? "bg-white text-[#A50064] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <KeyRound className="size-4" /> Segurança
        </button>
        <button
          onClick={() => setActiveTab("privacidade")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "privacidade" ? "bg-white text-[#A50064] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ShieldOff className="size-4" /> Privacidade
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === "perfil" ? (
          <div className="p-8">
            <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
              <div className="relative group">
                <div className="size-24 bg-[#FFECF1] rounded-2xl flex items-center justify-center text-[#A50064] text-4xl font-bold overflow-hidden border-4 border-white shadow-sm">
                  {user?.fotoUrl ? (
                    <img src={user.fotoUrl} alt={user.nomeCompleto} className="size-full object-cover" />
                  ) : (
                    user?.nomeCompleto?.charAt(0) || "U"
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="size-4 text-[#633B48]" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A1F30]">{user?.nomeCompleto}</h2>
                <p className="text-sm text-gray-500">Cliente JuryScan</p>
              </div>
            </div>

            <FormProvider {...profileMethods}>
              <form onSubmit={profileMethods.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <TextInput name="nomeCompleto" label="Nome Completo" icon={<User className="size-4" />} />
                  <TextInput name="email" label="E-mail" icon={<Mail className="size-4" />} disabled />
                  <TextInput name="telefone" label="Telefone" icon={<Phone className="size-4" />} mask="(99) 99999-9999" />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-6 rounded-xl font-bold">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        ) : activeTab === "seguranca" ? (
          <div className="p-8 animate-in fade-in duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#0A1F30] mb-1">Configurações de Segurança</h3>
              <p className="text-sm text-gray-500">Proteja sua conta alterando sua senha periodicamente.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldEllipsis className="size-4 text-[#633B48]" /> Alterar Senha
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Senha Atual</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#633B48] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nova Senha</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#633B48] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#633B48] outline-none"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="bg-[#633B48] hover:bg-[#300117] text-white rounded-xl w-full py-6 font-bold">
                {isLoading ? <Loader2 className="animate-spin" /> : "Atualizar Senha"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-8 animate-in fade-in duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Proteção de Dados e LGPD</h3>
              <p className="text-gray-500 leading-relaxed">
                Na JuryScan, levamos sua privacidade a sério. Seus dados são criptografados e utilizados
                exclusivamente para as funcionalidades da plataforma. Você tem total controle sobre suas informações.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                <ShieldCheck className="size-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900">Seus dados estão seguros</h4>
                  <p className="text-sm text-blue-700">Utilizamos padrões bancários de segurança para proteger seu CNIS e informações pessoais.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-lg font-bold text-red-600 mb-2">Zona de Perigo</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Ao excluir sua conta, todas as suas análises e histórico serão apagados permanentemente.
                  Esta ação não pode ser desfeita.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  variant="destructive"
                  className="rounded-xl font-bold py-6 px-8 flex items-center gap-2"
                >
                  {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 className="size-4" />}
                  Excluir Minha Conta Permanentemente
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
