
export type AppLanguage = 'pt' | 'en' | 'es' | 'zh' | 'hi' | 'fr';

export interface SearchSchedule {
  id: string;
  niche: string;
  location: string;
  type: 'buyer' | 'owner';
  days: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface JobOpportunity {
  id: string;
  type: 'agency_seeking' | 'broker_seeking';
  title: string;
  company: string;
  description: string;
  location: string;
  remuneration: string;
  postedAt: string;
  image?: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  role: string;
  experience: string;
  contact: string;
  location: string;
  type: 'professional' | 'specialist';
  image?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  online: boolean;
  lastMessage: string;
  isGroup?: boolean;
  membersCount?: number;
}

export interface EcosystemMember {
  id: string;
  name: string;
  category: string;
  role: string;
  specialty: string;
  location: string;
  rating: number;
  verified: boolean;
  contact: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  active: boolean;
  monthlyGoal?: number;
}

export interface Lead {
  id: string;
  name: string;
  need: string;
  location: string;
  score: number;
  triggers: string[];
  contact?: string;
  email?: string;
  foundAt: string;
  status: 'Novo' | 'Em Contato' | 'Agendado' | 'Negócio Fechado';
  type: 'buyer' | 'owner';
  value?: number;
  lastInteraction?: string;
  branchId?: string;
  brokerId?: string;
  profession?: string;
  closedValue?: number;
}

export interface UserProfile {
  brokerName: string;
  agencyName: string;
  welcomeMessage: string;
  phone: string;
  trialStartDate?: string;
  proToken?: string;
  activationDate?: string; 
  language?: AppLanguage;
  branches?: Branch[];
  monthlyGoal?: number;
  totalClosedVGV?: number;
  googleSheetsId?: string;
  googleCalendarId?: string;
  firebaseApiKey?: string;
  userGeminiApiKey?: string; // Chave própria do usuário para performance ilimitada
  hasAcceptedLegalTerms?: boolean;
  acceptedTermsDate?: string;
  schedules?: SearchSchedule[];
  telegramBotToken?: string;
  telegramChatId?: string;
  enableTelegramAlerts?: boolean;
}

export enum NavSection {
  Dashboard = 'dashboard',
  SocialRadar = 'radar',
  Leads = 'leads',
  SeniorCommand = 'senior_command',
  MarketAnalysis = 'market',
  AppraisalCalc = 'appraisal',
  JobBoard = 'jobs',
  AIChat = 'chat',
  Messenger = 'messenger',
  Settings = 'settings',
  Help = 'help',
  Admin = 'admin',
  Launches = 'launches',
  Performance = 'performance',
  Ecosystem = 'ecosystem',
  EmailMarketing = 'email_marketing'
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}
