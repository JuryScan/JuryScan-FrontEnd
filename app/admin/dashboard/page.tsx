"use client"

import React, { useEffect, useState } from "react"
import { 
  Users, UploadCloud, DollarSign, UserCheck, TrendingUp,
  ArrowUpRight, ArrowDownRight
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

const MOCK_STATS = {
  totalRevenue: 15420.50,
  totalUsers: 1240,
  totalUploads: 4500,
  activeNow: 85,
  monthlyData: [
    { name: 'Jan', uploads: 400, faturamento: 2400 },
    { name: 'Fev', uploads: 300, faturamento: 1398 },
    { name: 'Mar', uploads: 200, faturamento: 9800 },
    { name: 'Abr', uploads: 278, faturamento: 3908 },
    { name: 'Mai', uploads: 189, faturamento: 4800 },
    { name: 'Jun', uploads: 239, faturamento: 3800 },
  ],
  userTypes: [
    { name: 'Leigos', value: 850, color: '#633B48' },
    { name: 'Advogados', value: 390, color: '#A50064' },
  ]
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#0A1F30]">Dashboard Master</h1>
        <p className="text-gray-500">Visão global de métricas e performance da JuryScan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Faturamento Total" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(MOCK_STATS.totalRevenue)} icon={<DollarSign className="size-6" />} trend="+12.5%" trendType="up" />
        <MetricCard title="Usuários Ativos" value={MOCK_STATS.totalUsers.toString()} icon={<Users className="size-6" />} trend="+5.2%" trendType="up" />
        <MetricCard title="Uploads de CNIS" value={MOCK_STATS.totalUploads.toString()} icon={<UploadCloud className="size-6" />} trend="-2.4%" trendType="down" />
        <MetricCard title="Online Agora" value={MOCK_STATS.activeNow.toString()} icon={<UserCheck className="size-6" />} trend="Estável" trendType="neutral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#0A1F30] mb-6 flex items-center gap-2">
            <TrendingUp className="size-5 text-[#633B48]" />
            Performance Mensal
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="uploads" fill="#633B48" radius={[4, 4, 0, 0]} name="Uploads" />
                <Bar dataKey="faturamento" fill="#A50064" radius={[4, 4, 0, 0]} name="Faturamento (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#0A1F30] mb-6">Distribuição de Usuários</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_STATS.userTypes} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                  {MOCK_STATS.userTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            Total de <strong>{MOCK_STATS.totalUsers}</strong> usuários cadastrados
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, trendType }: { 
  title: string; value: string; icon: React.ReactNode; trend: string; trendType: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-50 text-[#633B48] rounded-xl">{icon}</div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-green-50 text-green-600' : trendType === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
          {trendType === 'up' && <ArrowUpRight className="size-3" />}
          {trendType === 'down' && <ArrowDownRight className="size-3" />}
          {trend}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-[#0A1F30] mt-1">{value}</h3>
    </div>
  )
}