
import React from 'react';
import { Book, Shield, Zap, Globe, CheckCircle2, ShieldAlert, MessageSquare, ExternalLink, Cpu, Rocket } from 'lucide-react';

export const HelpCenter = () => {
  const steps = [
    {
      title: 'Configurar Sua Chave',
      description: 'Como Operador Pro, você pode usar sua própria Gemini API Key. Isso garante que o Rodney nunca pare por limites de cota.',
      icon: <Cpu className="text-indigo-400" />
    },
    {
      title: 'O Radar OSINT',
      description: 'O Radar scaneia a web pública em busca de intenções de compra. Seja específico nos termos para leads mais quentes.',
      icon: <Zap className="text-orange-400" />
    },
    {
      title: 'Proteção Anti-Ban',
      description: 'O Rodney gera variações linguísticas (polimorfismo) para que o WhatsApp não detecte sua mensagem como spam.',
      icon: <Shield className="text-emerald-400" />
    },
    {
      title: 'Alta Performance',
      description: 'Combine o Radar Social com a Análise de Mercado (CMA) para quebrar as objeções de preço do proprietário na hora.',
      icon: <Rocket className="text-purple-400" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20 text-left">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Manual do Comandante</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Táticas de Elite & Infraestrutura Rodney v66</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[48px] border border-indigo-500/30 bg-indigo-500/5 space-y-6">
          <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
            <Cpu className="text-indigo-400" size={24} />
            Configurando Sua API Key
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            O Google oferece um nível gratuito robusto e um nível pago (Billing) acessível. Para Rodney rodar sem limites:
          </p>
          <ol className="space-y-4 text-xs font-bold text-slate-300">
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] shrink-0">01</span>
              <span>Acesse o <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 underline">Google AI Studio</a>.</span>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] shrink-0">02</span>
              <span>Clique em "Create API Key in new project".</span>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] shrink-0">03</span>
              <span>Copie a chave e cole em **Configurações > Performance**.</span>
            </li>
          </ol>
          <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex items-center gap-3">
             <ShieldAlert size={16} className="text-amber-500" />
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ativar o Billing no Cloud Console remove o erro de 60s.</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[48px] border border-emerald-500/30 bg-emerald-500/5 space-y-6">
          <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
            <Shield className="text-emerald-400" size={24} />
            Protocolo Anti-Ban
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            O WhatsApp bane por comportamento repetitivo. Siga o Protocolo Rodney:
          </p>
          <ul className="space-y-4 text-xs font-bold text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>**Nunca envie o mesmo texto**: Clique em "Gerar Nova Versão" para cada lead.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>**Interação é Prioridade**: Se o lead responder "Quem é?", o risco de ban cai para quase zero.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>**Chips Novos**: Comece com no máximo 15 novos contatos por dia.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="glass p-10 rounded-[48px] border border-white/5 hover:bg-white/5 transition-all group">
            <div className="mb-6 h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-all">
              {step.icon}
            </div>
            <h3 className="text-xl font-black text-white italic mb-3 uppercase tracking-tight">{step.title}</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
