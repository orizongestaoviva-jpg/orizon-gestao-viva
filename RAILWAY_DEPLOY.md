# 🚀 Guia de Deploy - ORIZON SaaS em Railway

## Passo 1: Criar Repositório GitHub

1. Acesse https://github.com/new
2. Crie um repositório chamado `orizon-gestao-viva`
3. **NÃO** inicialize com README (deixe vazio)
4. Clique em "Create repository"

## Passo 2: Push do Código para GitHub

Execute estes comandos no seu terminal (na pasta do projeto):

```bash
cd /home/ubuntu/orizon-gestao-viva

# Adicionar remote do GitHub (substitua SEU_USUARIO pelo seu usuário GitHub)
git remote add github https://github.com/SEU_USUARIO/orizon-gestao-viva.git

# Fazer push
git branch -M main
git push -u github main
```

## Passo 3: Conectar Railway ao GitHub

1. Acesse https://railway.app/dashboard
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Autorize o Railway a acessar sua conta GitHub
5. Selecione o repositório `orizon-gestao-viva`

## Passo 4: Configurar Variáveis de Ambiente

No painel do Railway, vá para "Variables" e adicione:

```
DATABASE_URL=seu_banco_de_dados_url
JWT_SECRET=sua_chave_secreta
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=seu_nome
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## Passo 5: Deploy Automático

Railway vai detectar o `Dockerfile` e fazer o deploy automaticamente!

Você pode acompanhar o progresso em https://railway.app/dashboard

---

**Tempo estimado:** 5-10 minutos para o deploy completar

**URL do seu app:** Railway vai gerar uma URL automática (ex: `https://orizon-gestao-viva-production.up.railway.app`)
