"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  User, 
  MapPin, 
  Briefcase, 
  Save, 
  Loader2, 
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  ShieldOff,
  Trash2,
  Camera
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { get, put, post, del } from "@/lib/api"
import { profileSchema, addressSchema, type ProfileSchema, type AddressSchema } from "@/lib/schemas"
import { TextInput } from "@/components/forms/TextInput"
import { TextAreaInput } from "@/components/forms/TextAreaInput"
import { SelectInput } from "@/components/forms/SelectInput"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { ApiResponse } from "@/lib/types"

export default function ConfiguracoesPage() {
  const { user, refreshUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"perfil" | "endereco" | "privacidade">("perfil")
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const profileMethods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nomeCompleto: user?.nomeCompleto || "",
      email: user?.email || "",
      telefone: user?.telefone || "",
      numeroOab: user?.numeroOab || "",
      experiencia: user?.experiencia || "",
      descricao: user?.descricao || "",
    }
  })

  const addressMethods = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      tipoEndereco: "COMERCIAL",
      logradouro: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    }
  })

  useEffect(() => {
    if (user?.enderecoUrl) {
      get<ApiResponse<any>>(user.enderecoUrl).then(res => {
        if (res.success) {
          setAddress(res.data)
          addressMethods.reset(res.data)
        }
      })
    }
  }, [user?.enderecoUrl, addressMethods])

  // 2. Upload de Foto
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

  // 3. LGPD: Excluir Conta
  const handleDeleteAccount = async () => {
    if (!confirm("TEM CERTEZA? Esta ação é irreversível e todos os seus dados serão apagados permanentemente.")) return
    
    setIsDeleting(true)
    try {
      const res = await del<ApiResponse<any>>(`/users/${user?.id}`)
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

  const onProfileSubmit = async (data: ProfileSchema) => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const res = await put<ApiResponse<any>>(`/users/advogado/${user.id}`, data)
      if (res.success) {
        toast({ title: "Sucesso", description: "Perfil atualizado com sucesso!" })
        await refreshUser()
      }
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Falha ao atualizar perfil", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onAddressSubmit = async (data: AddressSchema) => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const res = await post<ApiResponse<any>>(`/addresses/users/${user.id}`, data)
      if (res.success) {
        toast({ title: "Sucesso", description: "Endereço atualizado com sucesso!" })
        setAddress(res.data)
        await refreshUser()
      }
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Falha ao salvar endereço", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1F30] mb-2">Configurações</h1>
        <p className="text-gray-500">Gerencie suas informações pessoais e profissionais.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-8 max-w-lg">
        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === "perfil" ? "bg-white text-[#A50064] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="size-4" /> Perfil
        </button>
        <button
          onClick={() => setActiveTab("endereco")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === "endereco" ? "bg-white text-[#A50064] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MapPin className="size-4" /> Endereço
        </button>
        <button
          onClick={() => setActiveTab("privacidade")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
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
                    user?.nomeCompleto?.charAt(0) || "A"
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="size-4 text-[#633B48]" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A1F30]">{user?.nomeCompleto}</h2>
                <p className="text-sm text-gray-500">Advogado(a) Parceiro(a)</p>
                <div className="flex items-center gap-2 mt-1 text-green-600 font-medium text-xs">
                  <ShieldCheck className="size-3" /> Conta Verificada
                </div>
              </div>
            </div>

            <FormProvider {...profileMethods}>
              <form onSubmit={profileMethods.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <TextInput name="nomeCompleto" label="Nome Completo" icon={<User className="size-4" />} />
                  <TextInput name="email" label="E-mail" icon={<Mail className="size-4" />} disabled />
                  <TextInput name="telefone" label="Telefone" icon={<Phone className="size-4" />} mask="(99) 99999-9999" />
                  <TextInput name="numeroOab" label="Número da OAB" icon={<Briefcase className="size-4" />} placeholder="000000/UF" />
                </div>
                
                <TextInput name="experiencia" label="Experiência Profissional" placeholder="Ex: Especialista em Direito Previdenciário há 10 anos" />
                
                <TextAreaInput name="descricao" label="Sobre você (Bio)" placeholder="Conte um pouco sobre sua trajetória e especialidades..." rows={4} />

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-6 rounded-xl font-bold">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        ) : activeTab === "endereco" ? (
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#0A1F30] mb-1">Endereço de Atendimento</h3>
              <p className="text-sm text-gray-500">Este endereço será exibido para clientes que buscam atendimento.</p>
            </div>

            <FormProvider {...addressMethods}>
              <form onSubmit={addressMethods.handleSubmit(onAddressSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <SelectInput 
                    name="tipoEndereco" 
                    label="Tipo de Endereço" 
                    options={[
                      { value: "COMERCIAL", label: "Comercial" },
                      { value: "RESIDENCIAL", label: "Residencial" }
                    ]} 
                  />
                  <TextInput name="cep" label="CEP" mask="99999-999" />
                </div>

                <TextInput name="logradouro" label="Logradouro (Rua, Nº, Compl.)" icon={<Building2 className="size-4" />} />

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <TextInput name="bairro" label="Bairro" />
                  </div>
                  <div className="md:col-span-1">
                    <TextInput name="cidade" label="Cidade" />
                  </div>
                  <div className="md:col-span-1">
                    <TextInput name="estado" label="Estado (UF)" placeholder="EX: PE" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-[#633B48] hover:bg-[#300117] text-white px-8 py-6 rounded-xl font-bold">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                    {address ? "Atualizar Endereço" : "Cadastrar Endereço"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        ) : (
          <div className="p-8 animate-in fade-in duration-300">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#0A1F30] mb-2">Proteção de Dados e LGPD</h3>
              <p className="text-gray-500 leading-relaxed">
                Na JuryScan, levamos sua privacidade a sério. Seus dados são criptografados e utilizados exclusivamente para as funcionalidades da plataforma. 
                Você tem total controle sobre suas informações.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                <ShieldCheck className="size-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900">Seus dados estão seguros</h4>
                  <p className="text-sm text-blue-700">Utilizamos padrões bancários de segurança para proteger seu CNIS e informações financeiras.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h4 className="text-lg font-bold text-red-600 mb-2">Zona de Perigo</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Ao excluir sua conta, todas as suas auditorias, créditos e histórico de transações serão apagados permanentemente. 
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
