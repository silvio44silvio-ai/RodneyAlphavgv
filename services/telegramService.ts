
import { Lead, UserProfile } from '../types';

/**
 * Rodney Alpha v55.0 - Telegram Alert System
 * Envia notificações de leads quentes diretamente para o Telegram do Comandante.
 */
export const sendTelegramNotification = async (lead: Lead, profile: UserProfile) => {
  if (!profile.telegramBotToken || !profile.telegramChatId || !profile.enableTelegramAlerts) return;

  const message = `
🚀 *NOVO LEAD IDENTIFICADO - RADAR ALPHA* 🚀
━━━━━━━━━━━━━━━━━━
👤 *Nome:* ${lead.name}
📍 *Local:* ${lead.location}
🔥 *Score:* ${lead.score}%
🏢 *Interesse:* ${lead.type === 'buyer' ? 'Compra' : 'Venda'}

📝 *Desejo:*
"${lead.need}"

🎯 *Triggers de IA:*
${lead.triggers.map(t => `• ${t}`).join('\n')}

━━━━━━━━━━━━━━━━━━
_Rodney Alpha Engine v55.0_
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${profile.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: profile.telegramChatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Rodney Error: Falha no alerta Telegram.', error);
    return false;
  }
};
