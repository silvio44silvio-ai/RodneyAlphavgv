
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavSection, UserProfile, Lead } from './types';
import { MOCK_LEADS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SeniorCommand } from './components/SeniorCommand';
import { SocialRadar } from './components/SocialRadar';
import { LeadList } from './components/LeadList';
import { IAAssistant } from './components/IAAssistant';
import { Settings } from './components/Settings';
import { HelpCenter } from './components/HelpCenter';
import { MarketAnalysis } from './components/MarketAnalysis';
import { AppraisalCalculator } from './components/AppraisalCalculator';
import { OpportunityBoard } from './components/OpportunityBoard';
import { Messenger } from './components/Messenger';
import { AdminPanel } from './components/AdminPanel';
import { LaunchCenter } from './components/LaunchCenter';
import { EmailMarketing } from './components/EmailMarketing';
import { TeamPerformance } from './components/TeamPerformance';
import { EcosystemBoard } from './components/EcosystemBoard';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { Logo } from './components/Logo';
import { ShieldCheck, Activity, Lock, ArrowRight, Clock, AlertTriangle, Trophy } from 'lucide-react';

const TRIAL_DAYS = 7;

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.Dashboard);
  const [settingsTab, setSettingsTab] = useState<'perfil' | 'faturamento' | 'integracoes' | 'performance'>('perfil');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState<{leadName: string, value: number} | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [profile, setProfile] = useState<UserProfile>({
    brokerName: 'Corretor Alpha',
    agencyName: 'AgentPulse Command',
    welcomeMessage: 'Protocolo de Operação Ativo.',
    phone: '',
    proToken: '',
    language: 'pt',
    totalClosedVGV: 0,
    monthlyGoal: 5000000,
    enableTelegramAlerts: false
  });

  useEffect(() => {
    const initApp = () => {
      const savedProfile = localStorage.getItem('agentPulseProfile');
      const savedLeads = localStorage.getItem('agentPulseLeads');
      const savedTheme = localStorage.getItem('agentPulseTheme') as 'dark' | 'light';
      
      const params = new URLSearchParams(window.location.search);
      const isTrialLink = params.get('ref') === '7days';

      if (savedTheme) {
        setTheme(savedTheme);
        document.body.className = savedTheme;
      }

      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setIsAuthenticated(true);
          setHasStarted(true);
        } catch (e) { localStorage.removeItem('agentPulseProfile'); }
      } else if (isTrialLink) {
        const initialTrialDate = new Date().toISOString();
        setProfile(prev => ({ ...prev, trialStartDate: initialTrialDate }));
      }

      if (savedLeads) {
        try { setLeads(JSON.parse(savedLeads)); } catch (e) { setLeads(MOCK_LEADS); }
      } else { setLeads(MOCK_LEADS); }
      
      setIsReady(true);
    };
    initApp();
  }, []);

  const subscriptionStatus = useMemo(() => {
    const token = profile.proToken || '';
    const activationDate = profile.activationDate ? new Date(profile.activationDate).getTime() : Date.now();
    const now = Date.now();

    if (token.includes('-L-')) return { type: 'PRO', planName: 'Vitalício', expired: false, daysLeft: 9999 };
    
    let duration = 0;
    let name = "Experimental";
    
    if (token.includes('-M-')) { duration = 30; name = "Mensal"; }
    else if (token.includes('-T-')) { duration = 90; name = "Trimestral"; }
    else if (token.includes('-S-')) { duration = 180; name = "Semestral"; }
    else if (token.includes('-A-')) { duration = 365; name = "Anual"; }

    if (duration > 0) {
      const daysPassed = Math.floor((now - activationDate) / (1000 * 60 * 60 * 24));
      const remaining = duration - daysPassed;
      return { type: 'PRO', planName: name, expired: remaining <= 0, daysLeft: remaining };
    }

    if (!profile.trialStartDate) return { type: 'TRIAL', planName: 'Experimental', expired: false, daysLeft: TRIAL_DAYS };
    const start = new Date(profile.trialStartDate).getTime();
    const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, TRIAL_DAYS - daysPassed);
    return { type: 'TRIAL', planName: 'Experimental', expired: remaining <= 0, daysLeft: remaining };
  }, [profile.trialStartDate, profile.proToken, profile.activationDate]);

  const handleUpdateStatus = useCallback((id: string, status: Lead['status'], closedValue?: number) => {
    setLeads(prev => {
      const updated = prev.map(l => {
        if (l.id === id) {
          if (status === 'Negócio Fechado' && l.status !== 'Negócio Fechado') {
            const val = closedValue || l.value || 0;
            setShowCelebration({ leadName: l.name, value: val });
            setProfile(prevP => {
              const newP = { ...prevP, totalClosedVGV: (prevP.totalClosedVGV || 0) + val };
              localStorage.setItem('agentPulseProfile', JSON.stringify(newP));
              return newP;
            });
          }
          return { ...l, status, lastInteraction: new Date().toISOString(), closedValue };
        }
        return l;
      });
      localStorage.setItem('agentPulseLeads', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const renderContent = () => {
    if (subscriptionStatus.expired && activeSection !== NavSection.Settings && activeSection !== NavSection.Dashboard) {
      setActiveSection(NavSection.Dashboard);
    }
    switch (activeSection) {
      case NavSection.Dashboard: return <Dashboard leads={leads} profile={profile} subscription={subscriptionStatus} onNavigateToSettings={(tab) => { setSettingsTab(tab); setActiveSection(NavSection.Settings); }} />;
      case NavSection.SeniorCommand: return <SeniorCommand leads={leads} profile={profile} onUpdateGoal={(goal) => setProfile(p => ({...p, monthlyGoal: goal}))} />;
      case NavSection.SocialRadar: return <SocialRadar onLeadsFound={(newLeads) => setLeads(prev => [...newLeads, ...prev])} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.Leads: return <LeadList leads={leads} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.AIChat: return <IAAssistant profile={profile} />;
      case NavSection.MarketAnalysis: return <MarketAnalysis currentLang={profile.language || 'pt'} />;
      case NavSection.AppraisalCalc: return <AppraisalCalculator />;
      case NavSection.JobBoard: return <OpportunityBoard />;
      case NavSection.Messenger: return <Messenger />;
      case NavSection.Launches: return <LaunchCenter />;
      case NavSection.Performance: return <TeamPerformance />;
      case NavSection.Ecosystem: return <EcosystemBoard />;
      case NavSection.EmailMarketing: return <EmailMarketing />;
      case NavSection.Settings: return <Settings profile={profile} initialTab={settingsTab} onSave={(p) => { setProfile(p); localStorage.setItem('agentPulseProfile', JSON.stringify(p)); }} />;
      case NavSection.Admin: return <AdminPanel />;
      default: return <Dashboard leads={leads} profile={profile} subscription={subscriptionStatus} />;
    }
  };

  if (!isReady) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><Activity className="animate-spin text-indigo-500" size={48} /></div>;
  if (!hasStarted) return <LandingPage onStart={() => setHasStarted(true)} />;
  if (showOnboarding) return <Onboarding initialPhone={profile.phone} onComplete={(p) => { setProfile(p); localStorage.setItem('agentPulseProfile', JSON.stringify(p)); setIsAuthenticated(true); setShowOnboarding(false); }} />;
  if (!isAuthenticated) return <Login onLogin={(phone) => { setProfile(prev => ({ ...prev, phone, trialStartDate: prev.trialStartDate || new Date().toISOString() })); setShowOnboarding(true); }} />;

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-[#020617] text-slate-200' : 'bg-[#f8fafc] text-slate-900'} overflow-hidden`}>
      <Sidebar activeSection={activeSection} subscription={subscriptionStatus} isAdminUnlocked={true} onNavigate={(s) => { setActiveSection(s); setIsMobileMenuOpen(false); setSettingsTab('perfil'); }} onLogout={() => { localStorage.clear(); window.location.reload(); }} onLogoClick={() => setActiveSection(NavSection.Dashboard)} onLanguageChange={(lang) => setProfile(p => ({...p, language: lang}))} theme={theme} onToggleTheme={() => { const nt = theme === 'dark' ? 'light' : 'dark'; setTheme(nt); document.body.className = nt; localStorage.setItem('agentPulseTheme', nt); }} profile={profile} isOpen={isMobileMenuOpen} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto relative no-scrollbar">
        <header className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
           <div className="flex flex-col">
              <Logo size={28} showText={true} theme={theme} />
              <div className="mt-2 text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                 Plano: {subscriptionStatus.planName}
              </div>
           </div>
           <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">DIAS RESTANTES</p>
                 <p className={`text-sm font-black ${subscriptionStatus.daysLeft < 3 ? 'text-rose-500' : 'text-emerald-400'}`}>{subscriptionStatus.daysLeft} DIAS</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs">{profile.brokerName.charAt(0)}</div>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-3 glass rounded-xl text-indigo-400 border border-white/10"><Activity size={20} /></button>
        </header>
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
        {showCelebration && (
          <div className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
             <div className="max-w-md w-full glass p-12 rounded-[64px] border border-amber-500/40 text-center space-y-8 shadow-2xl relative">
                <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce"><Trophy size={48} /></div>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">VGV NA MESA!</h2>
                <button onClick={() => setShowCelebration(null)} className="w-full py-5 bg-white text-slate-900 rounded-[28px] font-black text-xs uppercase tracking-[0.3em]">Sincronizar Vitória</button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
