
# 🚀 AgentPulse AI - Rodney Alpha v66

Plataforma de inteligência imobiliária e LeadGen de alta performance.

## 🛡️ Guia de Implantação Vercel

Para garantir que o Rodney opere com 100% de potência, siga este protocolo de configuração no painel da Vercel:

### 1. Variáveis de Ambiente (Environment Variables)
Vá em **Settings > Environment Variables** e adicione:

| Chave | Valor | Descrição |
| :--- | :--- | :--- |
| `API_KEY` | `SUA_CHAVE_GEMINI` | Chave mestra do Google AI Studio (Combustível base). |
| `VITE_FIREBASE_API_KEY` | `CHAVE_FIREBASE` | Chave do seu projeto Firebase. |
| `NODE_ENV` | `production` | Define o ambiente como produção. |

### 2. Configurações de Build
O sistema detectará automaticamente o Vite, mas certifique-se de que:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3. Protocolo de Entrega ao Cliente
1. Após o deploy, envie o domínio gerado pela Vercel.
2. O link de convite padrão para trial é: `https://seu-app.vercel.app/?ref=7days`
3. Instrua os usuários Pro a inserirem suas próprias chaves em **Configurações > Alta Performance** para evitar gargalos na sua cota pessoal.

## 🛠️ Desenvolvimento Local
1. `npm install`
2. Crie um arquivo `.env` com sua `API_KEY`.
3. `npm run dev`

---
*AgentPulse AI: Soberania tática de dados imobiliários.*
