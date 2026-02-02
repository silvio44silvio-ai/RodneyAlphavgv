
import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, Key, Loader2, Cpu, Activity, Globe, Wifi, Zap, Lock, Fingerprint } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (phone: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (val: string) => {
    let cleaned = val.replace(/\D/g, '');
    if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);
    return cleaned;
  };

  const handleLogin = (e?: React.FormEvent, customPhone?: string) => {
    if (e) e.preventDefault();
    const finalPhone = customPhone || phone;
    if (finalPhone.length < 10) return alert("Identificador de Operador Inválido.");
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin(finalPhone);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 lg:p-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Background FX Alpha v32.5 */}
      <div className="absolute top-[-25%] left-[-15%] w-[1200px] h-[1200px] bg-indigo-600/10 blur-[220px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[800px] bg-purple-600/5 blur-[180px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10 flex flex-col items-center">
        {/* Logo Heróico Centralizado - Ajustado para mobile */}
        <div className="mb-12 lg:mb-20 animate-in fade-in slide-in-from-top-12 duration-1000 overflow-visible">
           <Logo size={64} showText={true} theme="dark" className="justify-center" />
        </div>

        <div className="w-full glass p-8 lg:p-20 rounded-[48px] lg:rounded-[72px] border border-white/10 shadow-[0_50px_200px_-50px_rgba(0,0,0,0.9)] space-y-10 lg:space-y-16 animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tighter">Comando Central</h2>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Link: Secured</span>
               </div>
               <div className="flex items-center gap-2">
                  <Fingerprint size={12} className="text-indigo-400" />
                  <span className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Rodney_V32.5</span>
               </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8 lg:space-y-12">
            <div className="space-y-4 lg:space-y-6">
              <label className="text-[9px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 flex items-center gap-3">
                 <Cpu size={14} className="text-indigo-500" /> ID_AGENT_OPERATOR
              </label>
              <div className="relative group">
                <Phone className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-950/90 border border-white/10 rounded-[24px] lg:rounded-[40px] py-6 lg:py-10 pl-16 lg:pl-24 pr-6 lg:pr-10 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-xl lg:text-2xl font-black text-white placeholder:text-slate-800 shadow-inner transition-all"
                />
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <button 
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full py-6 lg:py-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[24px] lg:rounded-[48px] flex items-center justify-center gap-4 lg:gap-6 transition-all active:scale-95 text-lg lg:text-xl uppercase tracking-[0.4em] disabled:opacity-30 shadow-[0_30px_70px_rgba(79,70,229,0.5)] group"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    Sincronizar IA
                    <ArrowRight size={24} className="group-hover:translate-x-4 transition-transform" />
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => handleLogin(undefined, '11999999999')}
                className="w-full bg-slate-950/50 border border-white/5 text-slate-600 hover:text-indigo-400 py-6 lg:py-8 rounded-[24px] lg:rounded-[40px] text-[10px] lg:text-[12px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all hover:bg-indigo-500/10"
              >
                <Lock size={16} className="text-indigo-600" />
                Emergency_Root_Access
              </button>
            </div>
          </form>

          <div className="pt-8 lg:pt-12 border-t border-white/10 flex items-center justify-between opacity-50">
            <div className="flex items-center gap-2 lg:gap-3">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[9px] lg:text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">ALPHA_ENCRYPTION</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
               <Activity size={16} className="text-indigo-500 animate-pulse" />
               <span className="text-[9px] lg:text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Rodney_Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
