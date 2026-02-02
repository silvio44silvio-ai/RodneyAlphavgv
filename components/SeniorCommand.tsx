
import React, { useState, useMemo } from 'react';
import { Lead, UserProfile } from '../types';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Target, ShieldCheck, Lock, LayoutGrid, Building2, Save, Target as TargetIcon
} from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

interface SeniorCommandProps {
  leads: Lead[];
  profile: UserProfile;
  onUpdateGoal: (goal: number) => void;
}

export const SeniorCommand = ({ leads, profile, onUpdateGoal }: SeniorCommandProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [tempGoal, setTempGoal] = useState(profile.monthlyGoal || 5000000);
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'config'>('overview');
  
  const MASTER_PIN = "2025";

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4 && newPin === MASTER_PIN) setIsUnlocked(true);
      else if (newPin.length === 4) setTimeout(() => setPin(''), 500);
    }
  };

  const unitStats = useMemo(() => {
    return profile.branches?.map(unit => {
      const unitLeads = leads.filter(l => l.branchId === unit.id);
      const vgv = unitLeads.reduce((acc, curr) => acc + (curr.closedValue || 0), 0);
      const closed = unitLeads.filter(l => l.status === 'Negócio Fechado').length;
      return { id: unit.id, name: unit.name, leads: unitLeads.length, vgv, closed, goal: unit.monthlyGoal || 1000000 };
    }) || [];
  }, [leads, profile.branches]);

  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="glass max-w-sm w-full p-10 rounded-[48px] border border-indigo-500/30 text-center space-y-8 shadow-2xl relative overflow-hidden text-left">
          <div className="w-20 h-20 rounded-[32px] bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto"><Lock size={40} /></div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter text-center">Comando Central</h2>
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`w-12 h-16 rounded-2xl border flex items-center justify-center text-xl font-black ${pin.length > i ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-white/10 text-slate-700'}`}>
                {pin.length > i ? '•' : ''}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'X'].map((val, i) => (
              <button key={i} onClick={() => val === 'X' ? setPin(pin.slice(0, -1)) : val !== '' && handlePinInput(val)} className="h-14 rounded-2xl bg-white/5 text-white font-black hover:bg-white/10 active:scale-95 transition-all">{val}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Visão de Comandante</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Gestão de Metas e VGV do Squad</p>
        </div>
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-white/5">
          {['overview', 'units', 'config'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
              {tab === 'overview' ? 'Geral' : tab === 'units' ? 'Unidades' : 'Metas Alpha'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'config' && (
        <div className="glass p-10 rounded-[56px] border border-indigo-500/30 space-y-8 max-w-2xl">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20"><TargetIcon size={24} /></div>
              <div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Calibrar Alvo de VGV</h3>
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Defina a meta mensal para o dashboard global.</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="relative">
                 <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400" size={24} />
                 <input type="number" value={tempGoal} onChange={(e) => setTempGoal(Number(e.target.value))} className="w-full bg-slate-950 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-2xl font-black text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <button onClick={() => { onUpdateGoal(tempGoal); alert("ALVO ATUALIZADO NO RADAR."); }} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                 <Save size={18} /> SALVAR NOVA DIRETRIZ
              </button>
           </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 glass p-10 rounded-[56px] border border-white/5 space-y-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={18} className="text-indigo-400" /> VGV Fechado por Célula</h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={unitStats}>
                       <XAxis dataKey="name" stroke="#475569" fontSize={8} axisLine={false} tickLine={false} />
                       <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                       <Bar dataKey="vgv" radius={[10, 10, 0, 0]}>
                          {unitStats.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#a855f7' : '#ec4899'} />)}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           
           <div className="glass p-10 rounded-[56px] border border-white/5 flex flex-col justify-center items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-[32px] bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20"><TrendingUp size={48} /></div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status da Meta Alpha</p>
                 <h4 className="text-3xl font-black text-white tracking-tighter">{((profile.totalClosedVGV || 0) / (profile.monthlyGoal || 1) * 100).toFixed(1)}%</h4>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase"><ShieldCheck size={14} /> Tropa em Alerta Máximo</div>
           </div>
        </div>
      )}
    </div>
  );
};
