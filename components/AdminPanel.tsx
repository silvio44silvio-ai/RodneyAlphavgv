
import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, Zap, Users, BarChart3, Plus, ExternalLink, CreditCard, Key, Calendar, Crown, Clock, AlertTriangle, Link2, Share2, Layers } from 'lucide-react';

export const AdminPanel = () => {
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [tokenType, setTokenType] = useState<'M' | 'T' | 'S' | 'A' | 'L'>('M');
  const [inviteCopied, setInviteCopied] = useState(false);

  const generateToken = () => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `AGENT-PRO-${tokenType}-${random}`;
    setGeneratedToken(token);
    setCopied(false);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInviteLink = () => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}?ref=7days`;
    navigator.clipboard.writeText(inviteUrl);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-24 text-left">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Painel do Comandante</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Controle de licenças e monetização Rodney Alpha.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gerador de Licenças Alpha (5 Planos Restabelecidos) */}
        <div className="glass p-10 rounded-[48px] border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase italic tracking-tighter">
            <Key className="text-indigo-400" size={20} /> Emissão de Licença
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-2">
               {[
                 { id: 'M', label: 'Mês', icon: <Clock size={14} /> },
                 { id: 'T', label: 'Trim', icon: <Layers size={14} /> },
                 { id: 'S', label: 'Sem', icon: <Layers size={14} /> },
                 { id: 'A', label: 'Ano', icon: <Calendar size={14} /> },
                 { id: 'L', label: 'Vit', icon: <Crown size={14} /> }
               ].map((type) => (
                 <button 
                   key={type.id}
                   onClick={() => setTokenType(type.id as any)} 
                   className={`py-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${tokenType === type.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-105' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-white'}`}
                 >
                   {type.icon}
                   <span className="text-[7px] font-black uppercase">{type.label}</span>
                 </button>
               ))}
            </div>

            <button 
              onClick={generateToken}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-[10px] tracking-[0.2em]"
            >
              <Zap size={16} /> Gerar Token {tokenType === 'L' ? 'Vitalício' : 'Pro'}
            </button>

            {generatedToken && (
              <div className="flex items-center gap-3 animate-in slide-in-from-left-4">
                <div className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-4 font-mono text-indigo-400 font-bold tracking-widest text-center text-xs truncate">
                  {generatedToken}
                </div>
                <button onClick={copyToken} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-all border border-white/10 shrink-0">
                  {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gerador de Convite Trial (7 Dias) */}
        <div className="glass p-10 rounded-[48px] border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
           <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase italic tracking-tighter">
              <Link2 className="text-emerald-400" size={20} /> Convite de Teste
           </h3>
           <div className="space-y-6">
              <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                Este link ativa automaticamente o protocolo de 7 dias grátis para o novo usuário.
              </p>
              <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 text-[10px] text-emerald-400 font-mono break-all leading-relaxed shadow-inner">
                {window.location.origin}/?ref=7days
              </div>
              <button 
                onClick={copyInviteLink}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {inviteCopied ? <Check size={18} /> : <Share2 size={18} />}
                {inviteCopied ? 'Link Copiado!' : 'Copiar Link Trial'}
              </button>
           </div>
        </div>
      </div>

      <div className="glass p-10 rounded-[48px] border border-white/5">
         <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase italic tracking-tighter">
            <BarChart3 className="text-indigo-400" size={20} /> Estatísticas do Nó
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Usuários Totais</span>
               <div className="text-3xl font-black text-white">1.042</div>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conversão Trial -{'>'} Pro</span>
               <div className="text-3xl font-black text-emerald-400">14.2%</div>
            </div>
         </div>
      </div>
    </div>
  );
};
