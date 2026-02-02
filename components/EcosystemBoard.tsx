
import React, { useState, useEffect } from 'react';
import { EcosystemMember } from '../types';
import { 
  Users, ShieldCheck, Scale, Calculator, HardHat, Building2, 
  TrendingUp, Zap, Star, MessageCircle, Search, Plus, 
  MapPin, Globe, Briefcase, Award, ArrowUpRight, CheckCircle2,
  Cpu, HeartPulse, GraduationCap, Laptop, Share2, Phone
} from 'lucide-react';

const ECO_CATEGORIES = [
  { id: 'core', label: 'Núcleo Principal', icon: <Users size={20} />, color: 'text-indigo-400', desc: 'Corretores, Incorporadores e Gestores' },
  { id: 'legal_finance', label: 'Jurídico & Financeiro', icon: <Scale size={20} />, color: 'text-rose-400', desc: 'Advogados, Engenheiros Avaliadores e Bancos' },
  { id: 'construction', label: 'Construção & Projeto', icon: <HardHat size={20} />, color: 'text-amber-400', desc: 'Construtores, Arquitetos e Gerentes de Obra' },
  { id: 'mgmt', label: 'Gestão & Manutenção', icon: <Building2 size={20} />, color: 'text-emerald-400', desc: 'Síndicos Profissionais e Property Managers' },
  { id: 'investment', label: 'Investimentos', icon: <TrendingUp size={20} />, color: 'text-sky-400', desc: 'Gestores de FIIs e Analistas de Asset' },
  { id: 'tech', label: 'Tecnologia & Marketing', icon: <Laptop size={20} />, color: 'text-purple-400', desc: 'Proptechs e Gestores de Tráfego' },
  { id: 'niches', label: 'Especialidades & Nichos', icon: <Globe size={20} />, color: 'text-orange-400', desc: 'Rural, Corporativo e Internacional' },
  { id: 'education', label: 'Educação & Suporte', icon: <GraduationCap size={20} />, color: 'text-pink-400', desc: 'Mentores, Palestrantes e Pesquisadores' },
];

const INITIAL_MEMBERS: EcosystemMember[] = [
  { id: 'eco-1', name: 'Dr. Roberto Lemos', category: 'legal_finance', role: 'Advogado Imobiliário', specialty: 'Regularização de Áreas Rurais', location: 'SJC, SP', rating: 4.9, verified: true, contact: '12999998888' },
  { id: 'eco-2', name: 'Eng. Marcos Diniz', category: 'legal_finance', role: 'Engenheiro Avaliador', specialty: 'Laudos NBR 14653', location: 'SJC, SP', rating: 5.0, verified: true, contact: '12988887777' },
  { id: 'eco-3', name: 'Juliana Arq', category: 'construction', role: 'Arquiteta Premium', specialty: 'Projetos de Alto Padrão / Urbanova', location: 'SJC, SP', rating: 4.8, verified: true, contact: '12977776666' },
  { id: 'eco-4', name: 'Contador Gerente Sênior', category: 'legal_finance', role: 'Consultor Tributário', specialty: 'ITBI & Ganho de Capital', location: 'Alpha Node', rating: 5.0, verified: true, contact: '12966665555' },
];

export const EcosystemBoard = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<EcosystemMember[]>(INITIAL_MEMBERS);

  const filtered = members.filter(m => 
    (activeCategory === 'all' || m.category === activeCategory) &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Cpu size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocolo Rodney Alpha v52.9</span>
           </div>
           <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">ECOSSISTEMA IMOBILIÁRIO</h2>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Conexão Total: De Incorporadores a Síndicos Profissionais</p>
        </div>
        <button className="btn-premium px-10 py-5 rounded-[24px] text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
          <Plus size={20} /> ALISTAR-SE NO ECOSSISTEMA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Filtros */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass p-6 rounded-[32px] border border-white/10 space-y-4 shadow-xl">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Buscar parceiro..." 
                   className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[10px] font-black text-white uppercase outline-none focus:ring-1 focus:ring-indigo-500/30" 
                 />
              </div>

              <div className="space-y-1">
                 <button 
                   onClick={() => setActiveCategory('all')}
                   className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                 >
                    Ver Todos
                 </button>
                 {ECO_CATEGORIES.map((cat) => (
                   <button 
                     key={cat.id}
                     onClick={() => setActiveCategory(cat.id)}
                     className={`w-full text-left px-5 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                   >
                      <span className={activeCategory === cat.id ? 'text-white' : cat.color}>{cat.icon}</span>
                      {cat.label}
                   </button>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-[32px] space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                 <Share2 size={16} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Fluxo do Mercado</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                O Rodney conecta Incorporadores a Fotógrafos, e Advogados a Síndicos. Encontre o parceiro certo para o VGV do seu imóvel.
              </p>
           </div>
        </div>

        {/* Grid de Profissionais */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((member) => (
              <div key={member.id} className="glass p-8 rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col h-full hover:shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center font-black text-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                         {member.name.charAt(0)}
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors uppercase">{member.name}</h3>
                         <div className="flex items-center gap-2">
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{member.role}</span>
                           {member.verified && <CheckCircle2 size={12} className="text-emerald-500" title="Perfil Verificado Alpha" />}
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-amber-500">
                         <Star size={12} fill="currentColor" />
                         <span className="text-xs font-black">{member.rating}</span>
                      </div>
                      <span className="text-[7px] font-black text-slate-500 uppercase">Score Elite</span>
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                   <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 italic text-[11px] text-slate-400 leading-relaxed min-h-[60px] flex items-center">
                     "{member.specialty}"
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                         <MapPin size={14} className="text-indigo-500" /> {member.location}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                         <Briefcase size={14} className="text-indigo-400" /> {ECO_CATEGORIES.find(c => c.id === member.category)?.label}
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                   <button 
                     onClick={() => window.open(`https://wa.me/${member.contact}`, '_blank')}
                     className="flex-1 py-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                   >
                      <Phone size={14} /> CONTATO WHATSAPP
                   </button>
                   <button className="px-4 bg-white/5 hover:bg-indigo-600 text-slate-500 hover:text-white rounded-2xl transition-all border border-white/5">
                      <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
