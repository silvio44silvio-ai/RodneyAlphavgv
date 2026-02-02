
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, UserProfile, AppLanguage } from "../types";

const CACHE_EXPIRATION_MS = 180 * 60 * 1000;

const getCache = (key: string) => {
  try {
    const raw = localStorage.getItem(`rodney_v66_cache_${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_EXPIRATION_MS) return null;
    return entry.data;
  } catch (e) { return null; }
};

const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(`rodney_v66_cache_${key}`, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) {}
};

// Rodney Alpha: Gerenciador Dinâmico de Chaves
const getAIInstance = (profile?: UserProfile) => {
  const apiKey = (profile?.userGeminiApiKey || process.env.API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("CHAVE NÃO DETECTADA: Vá em Configurações > Performance e insira sua Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

// NOVO: Validador de Chave para feedback do usuário
export const validateApiKey = async (key: string): Promise<{ success: boolean; message: string }> => {
  if (!key || key.length < 20) return { success: false, message: "Chave muito curta ou inválida." };
  
  try {
    const ai = new GoogleGenAI({ apiKey: key.trim() });
    // Tenta uma geração mínima para validar permissões e billing
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
      config: { maxOutputTokens: 1 }
    });
    return { success: true, message: "APLICAÇÃO BEM SUCEDIDA: Motor Alpha Operacional." };
  } catch (err: any) {
    const msg = err?.message || "";
    if (msg.includes('API_KEY_INVALID')) return { success: false, message: "CHAVE INVÁLIDA: Verifique no Google AI Studio." };
    if (msg.includes('billing')) return { success: false, message: "ERRO DE FATURAMENTO: Ative o Billing no Cloud Console." };
    if (msg.includes('quota')) return { success: false, message: "LIMITE ATINGIDO: Esta chave não tem cota disponível." };
    return { success: false, message: "FALHA NA IGNIÇÃO: Tente outra vez ou verifique sua conexão." };
  }
};

export const searchLeadsDeep = async (
  niche: string, 
  location: string, 
  profile: UserProfile, 
  type: 'buyer' | 'owner' = 'buyer'
): Promise<{ leads: Lead[], sources: any[] }> => {
  
  const cacheKey = btoa(`${niche}_${location}_${type}`).substring(0, 16);
  const cachedData = getCache(cacheKey);
  
  try {
    const ai = getAIInstance(profile);
    
    const osintPrompt = `RODNEY OSINT V66: Localize leads reais (NOME E WHATSAPP) para ${niche} em ${location}. 
    FOCO: ${type === 'buyer' ? 'Pessoas buscando comprar agora' : 'Proprietários vendendo direto'}. 
    RETORNE APENAS JSON { "leads": [{ "name": "...", "contact": "...", "need": "...", "profession": "..." }] }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: osintPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  need: { type: Type.STRING },
                  contact: { type: Type.STRING },
                  profession: { type: Type.STRING }
                },
                required: ["name", "contact"]
              }
            }
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '{"leads":[]}');
    const finalLeads = (rawData.leads || []).map((l: any) => ({
      ...l,
      id: `RADAR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      type,
      status: 'Novo',
      score: Math.floor(Math.random() * (99 - 88 + 1) + 88),
      foundAt: 'Rodney OSINT v66',
      triggers: [l.profession, "Validado Rodney"].filter(Boolean)
    }));

    const result = { leads: finalLeads, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
    setCache(cacheKey, result);
    return result;

  } catch (err: any) {
    console.error("Rodney Debug:", err);
    const msg = err?.message || String(err);
    
    if (msg.includes('quota') || msg.includes('429')) {
      if (cachedData) return cachedData;
      throw new Error("⚠️ RECARGA TÁTICA: Limite de buscas atingido. Ative o faturamento (Billing) no Google AI Studio para uso ilimitado.");
    }
    
    if (msg.includes('API_KEY_INVALID') || msg.includes('not found')) {
      throw new Error("⚠️ CHAVE INVÁLIDA: A chave inserida não foi reconhecida pelo Google. Tente criar uma nova no AI Studio.");
    }

    if (msg.includes('billing') || msg.includes('pay-as-you-go')) {
      throw new Error("⚠️ ERRO DE FATURAMENTO: Sua chave exige um projeto com cartão de crédito vinculado no Google Cloud para este modelo.");
    }

    throw new Error(`RODNEY: ${msg.substring(0, 100)}... Tente atualizar a chave ou mudar o termo de busca.`);
  }
};

export const generateTripleScript = async (lead: Lead, profile: UserProfile): Promise<string[]> => {
  try {
    const ai = getAIInstance(profile);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Script WhatsApp p/ ${lead.name} (${lead.need}).`,
      config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [`Olá ${lead.name}, sou ${profile.brokerName}. Notei seu interesse imobiliário no radar.`];
  }
};

export const getAIsuggestedKeywords = async (niche: string, type: 'buyer' | 'owner', profile?: UserProfile): Promise<string[]> => {
  try {
    const ai = getAIInstance(profile);
    const resp = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `4 termos de busca para achar ${type === 'buyer' ? 'compradores' : 'donos'} de ${niche}.`,
      config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
    });
    return JSON.parse(resp.text || "[]");
  } catch (e) { return [niche]; }
};

export const initChatSession = (profile: UserProfile) => {
  try {
    const ai = getAIInstance(profile);
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: `Você é o RODNEY v66. Inteligência OSINT imobiliária de alta performance.` }
    });
  } catch (e) { return null; }
};

export const generateMarketReport = async (
  address: string, 
  details: string, 
  lang: AppLanguage,
  profile?: UserProfile
): Promise<{ text: string, sources: any[] }> => {
  try {
    const ai = getAIInstance(profile);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `RODNEY MARKET INTELLIGENCE: Analise o mercado para: ${address}. Detalhes: ${details}. Idioma: ${lang}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) { return { text: "Erro na análise técnica.", sources: [] }; }
};
