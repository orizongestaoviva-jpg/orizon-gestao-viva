# 🚀 ORIZON SaaS — Guia de Setup

## 1️⃣ Configuração Inicial

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

**Variáveis obrigatórias:**
- `DATABASE_URL` - Conexão MySQL (ex: `mysql://user:pass@localhost:3306/orizon`)
- `OAUTH_SERVER_URL` - URL do servidor OAuth (Manus)
- `VITE_APP_ID` - ID da aplicação OAuth
- `JWT_SECRET` - Chave secreta para JWT (gere com: `openssl rand -base64 32`)
- `OWNER_OPEN_ID` - ID do proprietário (você)

### Banco de Dados

```bash
# Sincronizar schema com banco de dados
pnpm db:push
```

Isso vai:
1. Gerar migrações baseadas no schema
2. Executar migrações no banco de dados
3. Criar todas as tabelas necessárias

## 2️⃣ Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor vai rodar em `http://localhost:3000`

## 3️⃣ Estrutura de Dados

### Usuários
- Autenticação via Manus OAuth
- Roles: `user` ou `admin`
- Vinculados a empresas (companies)

### Empresas
- Planos: `starter`, `professional`, `enterprise`
- Status: `active`, `inactive`, `suspended`
- Proprietário (owner)

### Colaboradores
- Vinculados a empresas e departamentos
- Status: `active`, `inactive`, `on_leave`, `terminated`
- Relacionados com usuários do sistema

## 4️⃣ API tRPC

Todos os dados são acessados via tRPC. Exemplo:

```typescript
// Frontend
import { trpc } from "@/lib/trpc";

// Listar colaboradores
const { data: employees } = trpc.colaboradores.list.useQuery();

// Enviar mensagem para IA
const { mutate: sendMessage } = trpc.ia.chat.useMutation();
sendMessage({ message: "Qual é meu desempenho?" });
```

## 5️⃣ Testes

```bash
# Executar testes
pnpm test

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

## 6️⃣ Build & Deploy

```bash
# Build para produção
pnpm build

# Iniciar em produção
pnpm start
```

O build vai gerar:
- Frontend otimizado em `dist/`
- Servidor Node.js em `dist/index.js`

## 🔐 Segurança

- ✅ Cookies HTTP-only com CSRF protection
- ✅ JWT para autenticação stateless
- ✅ CORS configurado
- ✅ Variáveis sensíveis em `.env`
- ✅ Tipos TypeScript end-to-end

## 📊 Próximos Passos

1. **Configurar OAuth** - Obtenha credenciais do Manus
2. **Banco de Dados** - Configure MySQL e rode `pnpm db:push`
3. **Testar Login** - Acesse `http://localhost:3000/login`
4. **Explorar Módulos** - Navegue pelos 19 módulos
5. **Customizar** - Adapte para suas necessidades

## 🆘 Troubleshooting

### Erro: "DATABASE_URL not set"
```bash
# Verifique se .env existe e tem DATABASE_URL
cat .env | grep DATABASE_URL
```

### Erro: "Cannot find module '@trpc/server'"
```bash
# Reinstale dependências
pnpm install
```

### Erro: "JWT verification failed"
```bash
# Verifique se JWT_SECRET está correto em .env
# Regenere se necessário: openssl rand -base64 32
```

## 📚 Documentação

- [README.md](./README.md) - Visão geral do projeto
- [Drizzle ORM](https://orm.drizzle.team/) - Documentação do ORM
- [tRPC](https://trpc.io/) - Documentação da API
- [Tailwind CSS](https://tailwindcss.com/) - Documentação do CSS

---

**Pronto para começar?** Execute `pnpm dev` e abra `http://localhost:3000`! 🎉
