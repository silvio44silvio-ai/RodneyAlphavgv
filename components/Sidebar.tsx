
import React from 'react';
import { NavSection, UserProfile, AppLanguage } from '../types';
import { getNavItems } from '../constants';
import { LogOut, Sun, Moon, RefreshCcw, MessageCircle, Send, Radio, Megaphone, Globe, ShieldAlert } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  activeSection: NavSection;
  subscription: { type: string, expired: boolean, daysLeft: number };
  onNavigate: (section: NavSection) => void;
  onLogout: () => void;
  isAdminUnlocked: boolean;
  onLogoClick: () => void;
  profile?: UserProfile;
  onLanguageChange: (lang: AppLanguage) => void;
  isOpen: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar = ({ 
  activeSection, 
  onNavigate, 
  onLogout, 
  isAdminUnlocked, 
  onLogoClick, 
  profile,
  onLanguageChange,
  isOpen,
  theme,
  onToggleTheme,
  subscription
}: SidebarProps) => {
  const currentLang = profile?.language || 'pt';
  const navItems = getNavItems(currentLang);

  const handleReset = () => {
    if (confirm("⚠️ PROTOCOLO DE EMERGÊNCIA: Isso apagará todos os dados locais e deslogará o Rodney. Confirmar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 glass z-[200] flex flex-col border-r border-white/10 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      
      <div className="p-6 pb-2 flex flex-col gap-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer active:scale-95 transition-transform" onClick={onLogoClick}>
            <Logo size={32} theme={theme} showText={true} />
          </div>
          <button onClick={onToggleTheme} className={`p-2 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-white/10 text-amber-400' : 'bg-slate-100 border-black/5 text-indigo-600'}`}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4 shrink-0">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 text-center">Canais Alpha</p>
        <div className="flex justify-between gap-3">
          <button onClick={() => window.open('https://web.whatsapp.com', '_blank')} className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-90"><MessageCircle size={20} fill="currentColor" /></button>
          <button onClick={() => window.open('https://web.telegram.org', '_blank')} className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-lg active:scale-90"><Send size={20} fill="currentColor" /></button>
          <button onClick={() => onNavigate(NavSection.Messenger)} className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-90"><Radio size={20} /></button>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1 custom-scrollbar text-left scroll-smooth">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as NavSection)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              activeSection === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-[1.02]' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={activeSection === item.id ? 'text-white' : 'text-indigo-400'}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
            </span>
            <span className="font-black text-[10px] tracking-widest uppercase">{item.label}</span>
          </button>
        ))}

        {isAdminUnlocked && (
          <button
            onClick={() => onNavigate(NavSection.Admin)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl mt-4 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-black text-[9px] uppercase tracking-[0.2em]"
          >
            <ShieldAlert size={16} /> Comando Alpha
          </button>
        )}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4 shrink-0 bg-slate-950/60">
        <div className="flex items-center justify-between text-slate-500">
          <div className="flex items-center gap-2">
             <Globe size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">PT-BR</span>
          </div>
          <button onClick={handleReset} className="hover:text-rose-400 transition-colors"><RefreshCcw size={14} /></button>
        </div>
        
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-rose-400 font-black text-[9px] uppercase tracking-widest transition-colors border border-white/5 rounded-2xl bg-white/5">
          <LogOut size={14} /> Encerrar Protocolo
        </button>
      </div>
    </aside>
  );
};
