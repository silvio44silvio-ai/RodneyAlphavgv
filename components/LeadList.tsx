
import React, { useState, useCallback } from 'react';
import { Lead, UserProfile } from '../types';
// Fixed: Using generateTripleScript instead of non-existent generateWhatsAppScript
import { generateTripleScript } from '../services/geminiService';
import { 
  MessageCircle, Loader2, Search, MapPin, Target, X, Check, Edit3, PhoneCall, Zap, Fingerprint, Building2, ExternalLink, Copy
} from 'lucide-react';

// Rodney Alpha: Define props interface for LeadList component
interface LeadListProps {
  leads: Lead[];
  profile: UserProfile;
  onUpdateStatus: (id: string, status: Lead['status'], closedValue?: number) => void;
}

export const LeadList = ({ leads, profile, onUpdateStatus }: LeadListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [manualScript, setManualScript] = useState('');
  const [reviewData, setReviewData] = useState<{ lead: Lead | null, phone: string }>({
    lead: null,
    phone: ''
  });

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.need.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openReviewPanel = async (lead: Lead) => {
    // Rodney: Sanitização imediata ao abrir
    const phone = lead.contact?.replace(/\D/g, '') || '';
    setReviewData({ lead, phone });
    setManualScript('Rodney está redigindo o script polimórfico...');
    setShowReviewModal(true);
    setIsGeneratingScript(true);
    
    try {
      // Fixed: generateTripleScript returns string[], taking the first one
      const generated = await generateTripleScript(lead, profile);
      setManualScript(generated[0]);
    } catch (e) {
      setManualScript(`Olá ${lead.name}, sou ${profile.brokerName} da ${profile.agencyName}. Vi seu interesse em ${lead.need}.`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleWhatsAppConnect = () => {
    // Rodney Alpha: Sanitização final antes do disparo
    let cleaned = reviewData.phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    
    let finalPhone = (cleaned.length === 10 || cleaned.length === 11) ? '55' + cleaned : cleaned;
    
    // Protocolo de Alta Performance (api.whatsapp.com/send)
    const waUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(manualScript)}`;
    window.open(waUrl, '_blank');
    
    if (reviewData.lead) {
      onUpdateStatus(reviewData.lead.id, 'Em Contato');
    }
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      <div className="glass p-8 rounded-[40px] border border-white/5 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar alvos no radar..." 
            className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="glass rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group p-8 space-y-6 flex flex-col h-full bg-slate-900/20">
            <div className="flex justify-between items-start">
               <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${lead.status === 'Novo' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                  {lead.status}
               </div>
               <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                  <Zap size={10} className="text-amber-400" />
                  <span className="text-[10px] font-black">{lead.score}%</span>
               </div>
            </div>

            <div className="flex-1 space-y-4">
               <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">{lead.name}</h4>
               <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-white/5 italic">
                 "{lead.need}"
               </p>
            </div>

            <button 
              onClick={() => openReviewPanel(lead)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all"
            >
              <MessageCircle size={18} /> Protocolo WhatsApp
            </button>
          </div>
        ))}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 z-[500] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="max-w-xl w-full glass p-10 rounded-[56px] border border-indigo-500/30 space-y-8 relative overflow-hidden text-left shadow-2xl">
              <div>
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">MRT: Briefing de Abordagem</h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Revisão Humana v56.3</p>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp (Dígitos Limpos)</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={reviewData.phone} 
                         onChange={e => setReviewData({...reviewData, phone: e.target.value.replace(/\D/g, '')})} 
                         className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none" 
                       />
                       <button 
                         onClick={() => { navigator.clipboard.writeText(reviewData.phone); alert("COPIADO."); }}
                         className="p-4 bg-white/5 rounded-2xl text-slate-400"
                       >
                         <Copy size={18} />
                       </button>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Script Polimórfico Rodney</label>
                    <div className="relative">
                      <textarea 
                        rows={6} 
                        value={manualScript} 
                        onChange={e => setManualScript(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-3xl px-6 py-6 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                      />
                      {isGeneratingScript && <div className="absolute inset-0 bg-slate-950/60 rounded-3xl flex items-center justify-center"><Loader2 className="animate-spin text-indigo-400" /></div>}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowReviewModal(false)} className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-slate-500">Abortar</button>
                 <button onClick={handleWhatsAppConnect} className="flex-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                    <Check size={18} /> INICIAR PROTOCOLO OFF-AGENDA
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
