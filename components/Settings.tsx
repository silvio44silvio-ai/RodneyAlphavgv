
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { verifyPaymentTransaction } from '../services/billingService';
import { validateApiKey } from '../services/geminiService';
import { 
  Save, Zap, Crown, CheckCircle, CreditCard, Lock, ArrowRight, 
  Globe, Database, Key, Info, XCircle, 
  MessageCircle, Loader2, Sparkles, ShieldCheck, Trophy,
  Star, Layers, Rocket, Cpu, Terminal, ExternalLink, ShieldAlert, Clock, Calendar, Mail, Briefcase, Check, AlertTriangle
} from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  initialTab?: 'perfil' | 'faturamento' | 'integracoes' | 'performance';
}

export const Settings = ({ profile, onSave, initialTab = 'perfil' }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'faturamento' | 'integracoes' | 'performance'>(initialTab);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [txid, setTxid] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationMsg, setActivationMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'M' | 'T' | 'S' | 'A' | 'C'>('S');

  // Rodney Alpha: Estado para feedback da chave de IA
  const [keyStatus, setKeyStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [keyFeedback, setKeyFeedback] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSave = () => {
    onSave(formData);
    alert('PROTOCOLO ATUALIZADO NO NÓ CENTRAL.');
  };

  // Rodney Alpha: Handler exclusivo para ativação da chave com feedback visual
  const handleActivateInfrastructure = async () => {
    if (!formData.userGeminiApiKey?.trim()) {
      setKeyStatus('error');
      setKeyFeedback("ERRO: Insira uma chave antes de ativar.");
      return;
    }

    setKeyStatus('testing');
    setKeyFeedback("TESTANDO CONEXÃO COM SATÉLITE...");

    try {
      const result = await validateApiKey(formData.userGeminiApiKey);
      if (result.success) {
        setKeyStatus('success');
        setKeyFeedback(result.message);
        onSave(formData); // Salva automaticamente ao validar
        setTimeout(() => setKeyStatus('idle'), 5000);
      } else {
        setKeyStatus('error');
        setKeyFeedback(result.message);
      }
    } catch (e) {
      setKeyStatus('error');
      setKeyFeedback("FALHA NA IGNIÇÃO: Tente outra vez.");
    }
  };

  const handleActivateToken = async () => {
    if (!txid.trim()) return;
    setIsActivating(true);
    setActivationMsg(null);
    try {
      const result = await verifyPaymentTransaction(txid);
      if (result.success && result.token) {
        const updatedProfile = { 
          ...formData, 
          proToken: result.token, 
          activationDate: new Date().toISOString() 
        };
        setFormData(updatedProfile);
        onSave(updatedProfile);
        setActivationMsg({ text: result.message, type: 'success' });
        setTxid('');
      } else {
        setActivationMsg({ text: result.message, type: 'error' });
      }
    } catch (e) {
      setActivationMsg({ text: "Erro na sincronização.", type: 'error' });
    } finally {
      setIsActivating(false);
    }
  };

  const planOptions = [
    { id: 'M', label: 'Mensal', price: 'R$ 149,90', icon: <Clock size={18} />, color: 'border-blue-500/20' },
    { id: 'T', label: 'Trimestral', price: 'R$ 397', icon: <Layers size={18} />, color: 'border-indigo-500/20' },
    { id: 'S', label: 'Semestral', price: 'R$ 697', icon: <Zap size={22} />, color: 'border-indigo-500', isHighlight: true },
    { id: 'A', label: 'Anual', price: 'R$ 1.197', icon: <Calendar size={18} />, color: 'border-emerald-500/20' },
    { id: 'C', label: 'Contratos', price: 'Consultar', icon: <Briefcase size={18} />, color: 'border-amber-500/20', isCustom: true },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 text-left animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Central de Comando</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">v66.6 Alpha • Configurações & Infraestrutura Rodney</p>
        </div>
      </div>

      <div className="flex bg-slate-950 p-2 rounded-[32px] border border-white/5 shadow-inner overflow-x-auto no-scrollbar">
        {[
          { id: 'perfil', label: 'Identidade' },
          { id: 'performance', label: 'Alta Performance' },
          { id: 'integracoes', label: 'Sincronização' },
          { id: 'faturamento', label: 'Planos Alpha' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex-1 min-w-[120px] py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'perfil' && (
        <div className="glass p-10 rounded-[56px] border border-white/5 space-y-8 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Operador</label>
                 <input type="text" value={formData.brokerName} onChange={e => setFormData({...formData, brokerName: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Agência / Node</label>
                 <input type="text" value={formData.agencyName} onChange={e => setFormData({...formData, agencyName: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" />
              </div>
           </div>
           <button onClick={handleSave} className="w-full py-6 bg-white text-slate-900 rounded-[32px] font-black text-xs uppercase tracking-[0.3em]">Salvar Identidade</button>
        </div>
      )}

      {activeTab === 'faturamento' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
           {/* Status do Operador */}
           <div className="glass p-10 rounded-[56px] border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 via-slate-950 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                 <Crown size={200} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40">
                    <Crown size={44} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Status de Operador</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <div className={`w-2 h-2 rounded-full ${formData.proToken ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-bounce'}`}></div>
                       <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">
                          {formData.proToken ? 'OPERADOR ALPHA VALIDADO' : 'AGUARDANDO ATIVAÇÃO PRO'}
                       </p>
                    </div>
                 </div>
              </div>
              <div className="text-center md:text-right relative z-10">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">NODE ID</p>
                 <p className="text-xs font-mono text-indigo-400 bg-slate-950 px-4 py-2 rounded-xl border border-white/5 truncate max-w-[250px]">
                    {formData.proToken || 'RODNEY-EXPERIMENTAL'}
                 </p>
              </div>
           </div>

           {/* Catálogo de Planos Alpha */}
           <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                   <Star className="text-indigo-400" size={24} /> Catálogo de Planos Alpha
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                 {planOptions.map((plan) => (
                   <button 
                     key={plan.id}
                     onClick={() => {
                        setSelectedPlan(plan.id as any);
                        if(plan.isCustom) window.location.href = "mailto:silvio4.4silvio@gmail.com?subject=Proposta Robustas AgentPulse AI";
                     }}
                     className={`glass p-8 rounded-[40px] border flex flex-col items-center text-center gap-4 transition-all group relative overflow-hidden ${selectedPlan === plan.id ? 'bg-indigo-600/20 border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.2)] scale-105' : 'border-white/5 hover:border-white/20'} ${plan.isHighlight ? 'shadow-[0_0_30px_rgba(99,102,241,0.15)] bg-slate-900/40' : ''}`}
                   >
                     {plan.isHighlight && (
                        <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white text-[7px] font-black uppercase py-1.5 tracking-[0.2em]">Custo Benefício Alpha</div>
                     )}
                     
                     <div className={`p-4 rounded-2xl bg-slate-950 border border-white/5 group-hover:scale-110 transition-transform ${selectedPlan === plan.id ? 'text-indigo-400 shadow-lg' : 'text-slate-500'} ${plan.isHighlight ? 'text-indigo-400 border-indigo-500/30' : ''}`}>
                        {plan.icon}
                     </div>

                     <div className="space-y-1">
                        <div className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === plan.id ? 'text-white' : 'text-slate-500'}`}>{plan.label}</div>
                        <div className={`text-xl font-black tracking-tighter ${plan.isHighlight ? 'text-indigo-400 scale-110' : 'text-white'}`}>{plan.price}</div>
                     </div>

                     {plan.isCustom ? (
                        <div className="mt-2 text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">Negociar Contrato</div>
                     ) : (
                        <div className={`mt-2 text-[7px] font-black uppercase tracking-widest transition-all ${selectedPlan === plan.id ? 'text-indigo-400 animate-pulse' : 'text-slate-700'}`}>
                           {selectedPlan === plan.id ? 'Selecionado' : 'Ver Detalhes'}
                        </div>
                     )}
                   </button>
                 ))}
              </div>

              <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-[32px] text-center max-w-2xl mx-auto space-y-3">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-3">
                    <Info size={16} /> Para propostas robustas e contratos corporativos, contate a central Rodney.
                 </p>
                 <a href="mailto:silvio4.4silvio@gmail.com" className="text-white font-mono text-[11px] hover:text-indigo-400 transition-colors">silvio4.4silvio@gmail.com</a>
              </div>
           </div>

           {/* Inserção de Token */}
           <div className="glass p-10 rounded-[56px] border border-white/10 space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                 <div className="p-4 bg-white/5 rounded-3xl text-indigo-400 border border-white/10 shadow-inner"><Lock size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Token de Ativação</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Insira o código recebido após a assinatura</p>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                 <input 
                    type="text" 
                    value={txid}
                    onChange={e => setTxid(e.target.value.toUpperCase())}
                    placeholder="EX: AGENT-PRO-S-XXXXXX"
                    className="w-full bg-slate-950 border border-white/10 rounded-[32px] py-8 px-8 text-xl font-black text-indigo-400 outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner tracking-widest text-center" 
                 />

                 {activationMsg && (
                    <div className={`p-6 rounded-3xl border flex items-center gap-4 animate-in shake duration-500 ${activationMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                       <p className="text-xs font-bold uppercase tracking-widest leading-relaxed text-center w-full">{activationMsg.text}</p>
                    </div>
                 )}

                 <button 
                    onClick={handleActivateToken}
                    disabled={isActivating || !txid.trim()}
                    className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[32px] font-black text-xs uppercase tracking-tighter lg:tracking-[0.4em] shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 disabled:opacity-30 transition-all active:scale-95"
                 >
                    {isActivating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    {isActivating ? 'VALIDANDO COM SATÉLITE...' : 'REIVINDICAR ACESSO ALPHA'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="glass p-10 rounded-[56px] border border-indigo-500/30 bg-indigo-500/5 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Cpu size={240} />
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-600/20"><Zap size={24} /></div>
                <div>
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Modo Ultra Performance</h3>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Infraestrutura Rodney OSINT</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-6">
                   <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     Para ter buscas ilimitadas no Radar Social e Market Analysis, você deve configurar sua própria **Gemini API Key**. Isso elimina o compartilhamento de cota e garante velocidade máxima.
                   </p>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 font-black text-[10px]">1</div>
                         <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[10px] font-black uppercase text-indigo-400 hover:underline flex items-center gap-2">Gerar Chave no Google AI Studio <ExternalLink size={12} /></a>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 font-black text-[10px]">2</div>
                         <p className="text-[10px] font-black uppercase text-slate-500">Ative o "Pay-as-you-go" para uso ilimitado.</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 font-black text-[10px]">3</div>
                         <p className="text-[10px] font-black uppercase text-slate-500">Cole sua chave no campo ao lado.</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sua Gemini API Key</label>
                      <div className="relative">
                         <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                         <input 
                           type="password" 
                           value={formData.userGeminiApiKey || ''} 
                           onChange={e => {
                             setFormData({...formData, userGeminiApiKey: e.target.value});
                             setKeyStatus('idle'); // Reseta status ao mudar texto
                           }} 
                           placeholder="AIzaSy..." 
                           className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-mono text-indigo-400 outline-none" 
                         />
                      </div>
                   </div>
                   
                   {keyFeedback && (
                      <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${keyStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : keyStatus === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                         {keyStatus === 'testing' ? <Loader2 size={14} className="animate-spin" /> : keyStatus === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
                         <span className="text-[9px] font-black uppercase tracking-widest">{keyFeedback}</span>
                      </div>
                   )}
                   
                   <div className={`p-4 rounded-2xl border flex items-center gap-3 ${formData.userGeminiApiKey ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-950 border-white/5'}`}>
                      <div className={`w-2 h-2 rounded-full ${formData.userGeminiApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                        {formData.userGeminiApiKey ? 'MODO ULTRA ATIVO' : 'MODO COMPARTILHADO (COM LIMITES)'}
                      </span>
                   </div>
                </div>
             </div>
             
             <button 
                onClick={handleActivateInfrastructure} 
                disabled={keyStatus === 'testing'}
                className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl relative z-10 flex items-center justify-center gap-4 active:scale-95 transition-all ${keyStatus === 'success' ? 'bg-emerald-600' : keyStatus === 'error' ? 'bg-rose-600' : 'bg-indigo-600'} text-white`}
             >
                {keyStatus === 'testing' ? <Loader2 className="animate-spin" size={20} /> : keyStatus === 'success' ? <Check size={20} /> : <Rocket size={20} />}
                {keyStatus === 'testing' ? 'PROCESSANDO...' : keyStatus === 'success' ? 'APLICAÇÃO BEM SUCEDIDA' : keyStatus === 'error' ? 'FALHA NA IGNIÇÃO / TENTE OUTRA VEZ' : 'ATIVAR INFRAESTRUTURA ALPHA'}
             </button>
          </div>
        </div>
      )}

      {activeTab === 'integracoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-500">
           <div className="glass p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-600/20"><MessageCircle size={24} fill="currentColor" /></div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">WhatsApp Bridge</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Ponte de Disparo MRT</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none" placeholder="Ex: 5512999998888" />
                 <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed italic">Número que o Rodney usará para abrir o canal de contato.</p>
              </div>
           </div>

           <div className="glass p-10 rounded-[56px] border border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-white/5 rounded-3xl text-indigo-400 border border-white/10"><Globe size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Linguagem Alpha</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Regionalização Rodney</p>
                 </div>
              </div>
              <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value as any})} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase text-white outline-none">
                 <option value="pt">Português (Brasil)</option>
                 <option value="en">English (US)</option>
                 <option value="es">Español</option>
              </select>
           </div>
           <button onClick={handleSave} className="md:col-span-2 w-full py-6 bg-white text-slate-900 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl">Sincronizar Protocolos</button>
        </div>
      )}
    </div>
  );
};
