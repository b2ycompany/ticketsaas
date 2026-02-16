"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Simulação de carregamento de engine para efeito visual de splash
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950">
          <div className="relative flex items-center justify-center">
            <div className="h-24 w-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute h-12 w-12 bg-blue-600 rounded-xl rotate-45 animate-pulse"></div>
          </div>
          <h2 className="mt-10 text-white font-black tracking-[0.5em] text-sm animate-pulse uppercase">
            TicketMaster Engine
          </h2>
          <p className="text-slate-500 text-[10px] font-bold mt-4 uppercase tracking-widest">
            Sincronizando protocolos de segurança...
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);