"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { 
  Ticket as TicketIcon, 
  LogOut, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  LayoutGrid, 
  Settings as SettingsIcon, 
  Activity,
  Bell,
  Search,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DASHBOARD MASTER LAYOUT - B2Y ENTERPRISE
 * Garante a persistência da Sidebar e do Contexto Operacional.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Bloqueio de Segurança Global
  if (authLoading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-blue-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Sincronizando B2Y System</span>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const menuItems = [
    { name: "Incidentes Live", href: "/dashboard", icon: <TicketIcon size={18} /> },
    { name: "Board Kanban", href: "/dashboard/kanban", icon: <LayoutGrid size={18} /> },
    { name: "Analytics Hub", href: "/dashboard/analytics", icon: <BarChart3 size={18} /> },
    { name: "Configurações", href: "/dashboard/settings", icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden selection:bg-blue-600/30">
      
      {/* SIDEBAR DE COMANDO PERMANENTE */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-[100] shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50" />
        
        <div className="flex items-center gap-4 mb-16 group cursor-pointer px-2">
          <div className="bg-blue-600 p-3 rounded-[20px] shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:rotate-12 transition-transform duration-500">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter italic uppercase text-white">TicketMaster</span>
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] leading-none mt-1">Enterprise Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 mb-6 italic">Gestão de Serviços</p>
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-5 w-full p-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest transition-all ${pathname === item.href ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
            >
              {item.icon} <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-8">
          <div className="bg-white/[0.03] p-6 rounded-[35px] border border-white/5 shadow-inner">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xs italic border-2 border-white/10">
                {user.email?.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-widest leading-none">{user.email?.split('@')[0]}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase italic mt-1 tracking-widest">Master Admin</p>
              </div>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="flex items-center justify-center gap-3 w-full p-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
            >
              <LogOut size={16} /> <span>Encerrar Terminal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA DE RENDERIZAÇÃO DE PÁGINAS */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-gradient-to-br from-[#020617] to-[#0a0f1e]">
        <header className="fixed top-0 right-0 left-80 h-24 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl z-50 flex items-center justify-between px-16">
          <div className="flex items-center gap-3 text-blue-500 italic">
            <ShieldAlert size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Compliance Protocol Active</span>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-slate-500 hover:text-blue-500 transition-colors"><Bell size={20} /></button>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <UserIcon size={18} className="text-blue-600" /> NOC_OPERATOR_01
            </div>
          </div>
        </header>
        
        <div className="pt-24 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}