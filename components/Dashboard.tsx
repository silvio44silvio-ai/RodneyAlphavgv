
import React, { useMemo } from 'react';
import { Lead, UserProfile, NavSection } from '../types';
import { RODNEY_MOTIVATION } from '../constants';
import { TrendingUp, Zap, Flame, Target, Clock, Activity, ShieldCheck, Sparkles, MessageCircle, Send, Globe, Key, ArrowRight, AlertTriangle, Cpu, Fuel } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  profile: UserProfile;
  subscription?: { type: string, expired: boolean, daysLeft: number, planName: string };
  onNavigateToSettings?: (tab: 'perfil' | 'faturamento' | 'integracoes' | 'performance') => void;
}

export const Dashboard = ({ leads, profile, subscription, onNavigateToSettings }: DashboardProps) => {
  const hotLeads = useMemo(() => leads.filter(l => (l.score || 0) >= 80), [leads]);
  const isPro = subscription?.type === 'PRO';
  const hasUserKey = !!profile.userGeminiApiKey;

  const rodneyMessage = useMemo(() => {
    const hour = new Date().getHours();
    let greeting = hour < 12 ? "BOM DIA, COMANDANTE." : hour < 18 ? "BOA TARDE, COMANDANTE." : "OPERAÇÃO NOTURNA ATIVA.";
    const randomTip = RODNEY_MOTIVATION[Math.floor(Math.random() * RODNEY_MOTIVATION.length)];
    return { greeting, randomTip };
  }, []);

  const progress = useMemo(() => {
    const goal = profile.monthlyGoal || 1;
    const current = profile.totalClosedVGV || 0;
    return Math.min(100, (current / goal) * 100);
  }, [profile.monthlyGoal, profile.totalClosedVGV]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RODNEY DAILY PULSE */}
        <div className="lg:col-span-8 glass p-6 lg:p-10 rounded-[48px] border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <Activity size={240} />
           </div>
           <div className="w-16 h-16 lg:w-24 lg:h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20 shrink-0">
              <Sparkles size={32} />
           </div>
           <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="text-2xl lg:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{rodneyMessage.greeting}</h3>
              <p className="text-slate-400 text-xs lg:text-sm font-medium leading-relaxed italic max-w-lg">"{rodneyMessage.randomTip}"</p>
           </div>
           <div className="w-full md:w-64 space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="flex justify-between items-end">
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Alvo Global de VGV</span>
                 <span className="text-[10px] font-black text-indigo-400">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
           </div>
        </div>

        {/* STATUS CANAIS */}
        <div className="lg:col-span-4 glass p-8 rounded-[48px] border border-white/5 flex flex-col justify-center space-y-4 bg-slate-900/20">
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 text-center lg:text-left">Redes Táticas Alpha</p>
           <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><MessageCircle size={14} fill="currentColor" /></div>
                    <span className="text-[10px] font-black text-white uppercase">WhatsApp Ponte</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/10 text-sky-500 rounded-lg"><Send size={14} fill="currentColor" /></div>
                    <span className="text-[10px] font-black text-white uppercase">Telegram Radar</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${profile.enableTelegramAlerts ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* RODNEY ONBOARDING - INFRAESTRUTURA DO CLIENTE PRO */}
      {isPro && !hasUserKey && onNavigateToSettings && (
        <div className="glass p-10 rounded-[56px] border border-orange-500/30 bg-orange-500/5 animate-in slide-in-from-right-12 duration-1000 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Fuel size={120} className="text-orange-500" />
           </div>
           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-orange-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-orange-600/20 shrink-0">
                 <Cpu size={32} />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                 <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Instrução de Performance Alpha</h4>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   "Comandante, você agora é um **Operador Pro**. Para liberar o pós-combustor e ter buscas OSINT ilimitadas sem interrupções de cota, você deve configurar sua própria **Gemini API Key**. É o seu combustível tático exclusivo."
                 </p>
                 <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                       <ShieldCheck size={12} /> Cota Própria
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                       <Zap size={12} /> Velocidade Máxima
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => onNavigateToSettings('performance')}
                className="px-8 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95"
              >
                Configurar Combustível <ArrowRight size={18} />
              </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Capturas Radar', value: leads.length, icon: <Zap size={16} className="text-indigo-400" />, color: 'bg-indigo-500/10' },
          { label: 'Hot Leads (80%+)', value: hotLeads.length, icon: <Flame size={16} className="text-orange-400" />, color: 'bg-orange-500/10' },
          { label: 'VGV Fechado', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(profile.totalClosedVGV || 0), icon: <TrendingUp size={16} className="text-emerald-400" />, color: 'bg-emerald-500/10' },
          { label: 'Licença Rodney', value: isPro ? 'ALPHA' : 'TRIAL', icon: <ShieldCheck size={16} className="text-amber-400" />, color: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/40 transition-all group hover:bg-slate-900/40">
            <div className={`p-3 w-fit rounded-2xl ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
            <h3 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
            <p className="text-3xl lg:text-4xl font-black tracking-tighter text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
