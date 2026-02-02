
import React from 'react';
import { 
  LayoutDashboard, 
  Radar, 
  Users, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Calculator,
  Building,
  Trophy,
  ShieldCheck,
  Briefcase,
  BarChart3,
  Send,
  Globe,
  Share2,
  Mail,
  Zap,
  Cpu,
  Radio,
  BarChart4
} from 'lucide-react';
import { Lead, AppLanguage, NavSection, ChatContact } from './types';

export const RODNEY_MOTIVATION = [
  "O mercado não dorme, Comandante. Seus leads também não. Vá pra cima.",
  "VGV é o oxigênio do Squad. Qual a sua cota hoje?",
  "Radar Social detectou anomalias positivas. Tem dinheiro na mesa no Urbanova.",
  "Protocolo Alpha: Menos desculpa, mais captação.",
  "A diferença entre o corretor e o Comandante é a persistência no Radar.",
  "Alvo identificado é alvo contactado. Não deixe o lead esfriar.",
  "Foco total nos Hot Leads. Eles são o caminho mais curto para o fechamento.",
  "Soberania de dados é poder. Use o Rodney a seu favor."
];

// Added missing languages to satisfy AppLanguage type
export const LANG_OPTIONS: { code: AppLanguage; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: 'BR' },
  { code: 'en', label: 'English', flag: 'US' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'zh', label: '中文', flag: 'CN' },
  { code: 'hi', label: 'हिन्दी', flag: 'IN' },
  { code: 'fr', label: 'Français', flag: 'FR' },
];

// Added missing translations for es, zh, hi, fr to resolve Record<AppLanguage, any> error
export const TRANSLATIONS: Record<AppLanguage, any> = {
  pt: {
    dashboard: 'Painel Geral',
    radar: 'Social Radar',
    leads: 'Meus Leads',
    senior_command: 'Comando Sênior',
    market: 'Análise de Mercado',
    appraisal: 'Avaliação Pró',
    jobs: 'Mural Oportunidades',
    chat: 'Chat IA Alpha',
    messenger: 'Messenger Alpha',
    settings: 'Configurações',
    launches: 'Lançamentos',
    performance: 'Performance',
    ecosystem: 'Ecossistema',
    email: 'Email Marketing'
  },
  en: {
    dashboard: 'Dashboard',
    radar: 'Social Radar',
    leads: 'My Leads',
    senior_command: 'Senior Command',
    market: 'Market Analysis',
    appraisal: 'Appraisal Pro',
    jobs: 'Job Board',
    chat: 'AI Chat',
    messenger: 'Messenger',
    settings: 'Settings',
    launches: 'Launches',
    performance: 'Performance',
    ecosystem: 'Ecosystem',
    email: 'Email Marketing'
  },
  es: {
    dashboard: 'Tablero',
    radar: 'Radar Social',
    leads: 'Mis Leads',
    senior_command: 'Mando Senior',
    market: 'Análisis de Mercado',
    appraisal: 'Evaluación Pro',
    jobs: 'Bolsa de Trabajo',
    chat: 'Chat IA',
    messenger: 'Messenger',
    settings: 'Configuración',
    launches: 'Lanzamientos',
    performance: 'Rendimiento',
    ecosystem: 'Ecosistema',
    email: 'Email Marketing'
  },
  zh: {
    dashboard: '仪表板',
    radar: '社会雷达',
    leads: '我的线索',
    senior_command: '高级指挥部',
    market: '市场分析',
    appraisal: '专业评估',
    jobs: '招聘板块',
    chat: '人工智能聊天',
    messenger: '信使',
    settings: '设置',
    launches: '发布',
    performance: '性能',
    ecosystem: '生态系统',
    email: '电子邮件营销'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    radar: 'सोशल रडार',
    leads: 'मेरे लीड्स',
    senior_command: 'सीनियर कमांड',
    market: 'बाज़ार विश्लेषण',
    appraisal: 'प्रशंसा प्रो',
    jobs: 'जॉब बोर्ड',
    chat: 'एआई चैट',
    messenger: 'मैसेंजर',
    settings: 'सेटिंग्स',
    launches: 'लॉन्च',
    performance: 'प्रदर्शन',
    ecosystem: 'पारिस्थितिकी तंत्र',
    email: 'ईमेल मार्केटिंग'
  },
  fr: {
    dashboard: 'Tableau de bord',
    radar: 'Radar Social',
    leads: 'Mes Leads',
    senior_command: 'Commandement Senior',
    market: 'Analyse du Marché',
    appraisal: 'Évaluation Pro',
    jobs: 'Tableau d\'Emploi',
    chat: 'Chat IA',
    messenger: 'Messenger',
    settings: 'Paramètres',
    launches: 'Lancements',
    performance: 'Performance',
    ecosystem: 'Écosystème',
    email: 'Email Marketing'
  }
};

export const getNavItems = (lang: AppLanguage) => [
  { id: NavSection.Dashboard, label: TRANSLATIONS[lang].dashboard, icon: <LayoutDashboard size={20} /> },
  { id: NavSection.SeniorCommand, label: TRANSLATIONS[lang].senior_command, icon: <ShieldCheck size={20} /> },
  { id: NavSection.SocialRadar, label: TRANSLATIONS[lang].radar, icon: <Radar size={20} /> },
  { id: NavSection.Leads, label: TRANSLATIONS[lang].leads, icon: <Users size={20} /> },
  { id: NavSection.AIChat, label: TRANSLATIONS[lang].chat, icon: <Cpu size={20} /> },
  { id: NavSection.MarketAnalysis, label: TRANSLATIONS[lang].market, icon: <BarChart4 size={20} /> },
  { id: NavSection.AppraisalCalc, label: TRANSLATIONS[lang].appraisal, icon: <Calculator size={20} /> },
  { id: NavSection.JobBoard, label: TRANSLATIONS[lang].jobs, icon: <Briefcase size={20} /> },
  { id: NavSection.Launches, label: TRANSLATIONS[lang].launches, icon: <Building size={20} /> },
  { id: NavSection.Performance, label: TRANSLATIONS[lang].performance, icon: <BarChart3 size={20} /> },
  { id: NavSection.Ecosystem, label: TRANSLATIONS[lang].ecosystem, icon: <Globe size={20} /> },
  { id: NavSection.EmailMarketing, label: TRANSLATIONS[lang].email, icon: <Mail size={20} /> },
  { id: NavSection.Settings, label: TRANSLATIONS[lang].settings, icon: <SettingsIcon size={20} /> },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    need: 'Apartamento 3 dormitórios no Urbanova',
    location: 'SJC, SP',
    score: 85,
    triggers: ['FGTS'],
    foundAt: 'Twitter/X',
    status: 'Novo',
    type: 'buyer',
    lastInteraction: new Date().toISOString(),
    value: 850000
  }
];

export const MOCK_CONTACTS: ChatContact[] = [
  { id: 'c1', name: 'Ricardo Santos', role: 'Corretor Sênior', online: true, lastMessage: 'Opa, o script funcionou!' },
  { id: 'c2', name: 'Amanda Oliveira', role: 'Captadora', online: false, lastMessage: 'Vou cadastrar o imóvel agora.' }
];

export const MOCK_PERFORMANCE = [
  { id: 'p1', name: 'Silvio Lima', role: 'Comandante Alpha', dealsClosed: 12, conversionRate: 18.5, responseTime: '12min', isTeam: false },
  { id: 'p2', name: 'Tropa de Elite SJC', role: 'Unidade Principal', dealsClosed: 45, conversionRate: 14.2, leadsCaptured: 320, isTeam: true },
  { id: 'p3', name: 'Ricardo Silva', role: 'Corretor', dealsClosed: 8, conversionRate: 15.1, responseTime: '15min', isTeam: false }
];
