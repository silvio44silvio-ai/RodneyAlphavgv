
import React, { useState, useEffect, useRef } from 'react';
import { Lead, UserProfile, SearchSchedule } from '../types';
import { searchLeadsDeep, generateTripleScript, getAIsuggestedKeywords } from '../services/geminiService';
import { Search, Loader2, Zap, MessageCircle, X, Check, Clock, Target, Briefcase, Sparkles, Terminal, Building2, AlertTriangle, ShieldCheck, Calendar, Play, MapPin, RefreshCw, Key, ChevronRight } from 'lucide-react';

interface SocialRadarProps {
  onLeadsFound: (leads: Lead[]) => void;
  profile: UserProfile;
  onUpdateStatus?: (id: string, status: Lead['status']) => void;
}

export const SocialRadar = ({ onLeadsFound, profile, onUpdateStatus }: SocialRadarProps) => {
  const [niche, setNiche] = useState('casa no Urbanova');
  const [location, setLocation] = useState('São José dos Campos, SP');
  const [searchMode, setSearchMode] = useState<'owner' | 'buyer' | 'schedule'>('buyer');
  const [isSearching, setIsSearching] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ leads: Lead[], sources: any[] } | null>(null);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  
  // Módulo de Agendamento
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Seg', 'Qua', 'Sex']);
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [manualEdit, setManualEdit] = useState('');
  const [reviewData, setReviewData] = useState<{ lead: Lead | null, phone: string }>({
    lead: null,
    phone: ''
  });

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    getAIsuggestedKeywords(niche, searchMode === 'schedule' ? 'buyer' : searchMode, profile)
      .then(setAiKeywords)
      .catch(() => setAiKeywords([niche]));
    setError(null);
  }, [niche, searchMode]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSearch = async () => {
    if (searchMode === 'schedule') {
      alert(`PROTOCOLO ATIVADO: Rodney agendou varreduras automáticas de ${startDate} até ${endDate} nos dias: ${selectedDays.join(', ')}.`);
      return;
    }

    if (cooldown > 0) return;
    
    setIsSearching(true);
    setError(null);
    setResults(null);
    
    try {
      const data = await searchLeadsDeep(niche, location, profile, searchMode);
      if (data.leads.length === 0) {
        setError("RODNEY: Nenhum lead validado com contato real nesta varredura.");
      } else {
        setResults(data);
        onLeadsFound(data.leads);
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Erro desconhecido na interceptação.";
      setError(errorMessage);
      if (errorMessage.includes('limite') || errorMessage.includes('429')) {
        setCooldown(60);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const openReviewPanel = async (lead: Lead) => {
    const phone = lead.contact?.replace(/\D/g, '') || '';
    if (phone.length < 10) {
      alert("⚠️ CONTATO INVÁLIDO: Fonte protegida.");
      return;
    }
    setReviewData({ lead, phone });
    setShowReviewModal(true);
    try {
      const generated = await generateTripleScript(lead, profile);
      setManualEdit(generated[0]);
    } catch (e) {
      setManualEdit(`Olá ${lead.name}, sou ${profile.brokerName}.`);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20 text-left">
      <div className="glass p-8 rounded-[48px] border border-white/10 bg-slate-900/40 relative overflow-hidden shadow-2xl">
        <div className="space-y-10 relative z-10">
          
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
             <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><Terminal size={24} /></div>
             <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Agente Pulse Alpha</h2>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Status: {isSearching ? 'Interceptando...' : searchMode === 'schedule' ? 'Configuração de Agenda' : 'Pronto para Varredura'}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 p-1.5 bg-slate-950 rounded-[32px] border border-white/5 gap-1.5">
            <button onClick={() => setSearchMode('owner')} className={`py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${searchMode === 'owner' ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}>
              <Building2 size={18} /> 
              <span>Proprietário</span>
            </button>
            <button onClick={() => setSearchMode('schedule')} className={`py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${searchMode === 'schedule' ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}>
              <Clock size={18} /> 
              <span>Agendar</span>
            </button>
            <button onClick={() => setSearchMode('buyer')} className={`py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${searchMode === 'buyer' ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-white'}`}>
              <Target size={18} /> 
              <span>Comprador</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-white uppercase ml-4 tracking-widest">Alvo da Busca</label>
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-[28px] py-6 pl-16 pr-8 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-white uppercase ml-4 tracking-widest">Localização Geográfica</label>
              <div className="relative group">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-[28px] py-6 pl-16 pr-8 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </div>
            </div>
          </div>

          {/* Módulo de Agendamento Dinâmico Restabelecido */}
          {searchMode === 'schedule' && (
            <div className="animate-in slide-in-from-top-4 duration-500 space-y-8 bg-indigo-500/5 p-8 rounded-[40px] border border-indigo-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-indigo-400" size={20} />
                <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Parâmetros de Cronometragem Rodney</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Data de Início do Ciclo</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-indigo-400 outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Data de Término do Ciclo</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Frequência Semanal Alpha</label>
                 <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button 
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedDays.includes(day) ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-950 border-white/5 text-slate-600 hover:text-white'}`}
                      >
                        {day}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button 
              onClick={handleSearch} 
              disabled={isSearching || cooldown > 0} 
              className={`w-full max-w-2xl py-8 rounded-[36px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 ${cooldown > 0 ? 'bg-amber-600/40 text-amber-200' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {isSearching ? <Loader2 className="animate-spin" /> : searchMode === 'schedule' ? <Clock size={20} /> : <Play size={20} fill="currentColor" />}
              {isSearching ? 'RODNEY INFILTRANDO...' : cooldown > 0 ? `AGUARDE ${cooldown}s` : searchMode === 'schedule' ? 'Ativar Ciclo de Busca' : 'Executar Radar'}
            </button>
          </div>
          
          {error && (
            <div className="p-8 bg-rose-500/10 border border-rose-500/30 rounded-[40px] text-rose-400 space-y-6 animate-in shake">
              <div className="flex items-start gap-4">
                <AlertTriangle className="shrink-0 mt-1" size={24} /> 
                <div className="space-y-2">
                   <p className="text-xs font-black uppercase tracking-widest">Protocolo de Erro Rodney</p>
                   <p className="text-sm font-bold leading-relaxed">{error}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <button onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl">
                   <Key size={14} /> Corrigir Chave no Google
                </button>
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                   <RefreshCw size={14} /> Reiniciar Sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results?.leads.map((lead: Lead) => (
          <div key={lead.id} className="glass rounded-[56px] border border-white/5 p-10 flex flex-col space-y-6 bg-slate-900/20 group hover:border-indigo-500/30 transition-all shadow-2xl">
             <div className="flex items-center justify-between">
               <div className="w-16 h-16 rounded-[24px] bg-slate-950 border border-white/10 flex items-center justify-center font-black text-2xl text-indigo-400">
                  {lead.name.charAt(0)}
               </div>
               <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase">Validado</span>
               </div>
             </div>
             <div className="space-y-1">
               <h4 className="font-black text-xl text-white uppercase tracking-tighter italic">{lead.name}</h4>
               <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{lead.profession || 'Ponta de Mercado'}</p>
             </div>
             <p className="text-xs text-slate-400 italic leading-relaxed bg-slate-950/50 p-6 rounded-[32px] border border-white/5 flex-1">"{lead.need}"</p>
             <button onClick={() => openReviewPanel(lead)} className="w-full py-5 rounded-[24px] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all">
                <MessageCircle size={18} /> Iniciar Abordagem
             </button>
          </div>
        ))}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 z-[500] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-xl w-full glass p-12 rounded-[64px] border border-indigo-500/30 space-y-8 shadow-2xl text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">WhatsApp Bridge</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Contato Interceptado</label>
                <div className="bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black text-indigo-400 text-center tracking-widest">{reviewData.phone}</div>
              </div>
              <textarea rows={6} value={manualEdit} onChange={e => setManualEdit(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-3xl px-6 py-6 text-xs text-slate-300 outline-none resize-none leading-relaxed" />
            </div>
            <button onClick={() => {
               const cleaned = reviewData.phone.replace(/\D/g, '');
               window.open(`https://api.whatsapp.com/send?phone=55${cleaned}&text=${encodeURIComponent(manualEdit)}`, '_blank');
               if (onUpdateStatus && reviewData.lead) onUpdateStatus(reviewData.lead.id, 'Em Contato');
               setShowReviewModal(false);
            }} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 transition-all">
              <MessageCircle size={20} /> Disparar Protocolo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
