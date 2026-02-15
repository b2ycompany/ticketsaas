"use client";
import { useState } from "react";
import { ArrowLeft, Save, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SLASettings() {
  const [sla, setSla] = useState({ critical: 2, high: 4, medium: 12, low: 24 });

  return (
    <div className="min-h-screen bg-slate-50 p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition">
          <ArrowLeft size={20} /> Voltar ao Painel
        </Link>

        <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Políticas de SLA</h2>
              <p className="text-slate-500 text-sm font-medium">Defina os tempos de resposta por prioridade.</p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.keys(sla).map((level) => (
              <div key={level} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-blue-200 transition-all">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{level}</p>
                  <p className="text-slate-700 font-bold">Tempo máximo de resolução</p>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={sla[level as keyof typeof sla]}
                    onChange={(e) => setSla({...sla, [level]: e.target.value})}
                    className="w-20 p-3 bg-white rounded-xl border-2 border-slate-200 text-center font-black outline-none focus:border-blue-600"
                  />
                  <span className="font-bold text-slate-500 uppercase text-xs">Horas</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 bg-slate-900 text-white p-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            <Save size={18} /> Aplicar Novas Regras
          </button>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4 items-start">
          <Clock className="text-blue-600 shrink-0" size={20} />
          <p className="text-sm text-blue-800 leading-relaxed font-medium">
            <strong>Dica Pro:</strong> Alterar estas regras afetará apenas os novos tickets criados via Zabbix ou manualmente. Tickets em curso manterão o prazo original.
          </p>
        </div>
      </div>
    </div>
  );
}