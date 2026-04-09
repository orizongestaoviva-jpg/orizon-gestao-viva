# ORIZON — Gestão Viva SaaS

Sistema completo de gestão de pessoas e performance com 19 módulos, autenticação real, banco de dados MySQL e API tRPC.

## 🚀 Tecnologias

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Express + tRPC 11 + Node.js
- **Database:** MySQL + Drizzle ORM
- **Auth:** Manus OAuth + JWT
- **Storage:** AWS S3
- **Testing:** Vitest

## 📦 Módulos Implementados

### Gestão de Pessoas
- ✅ Dashboard (customizado por perfil)
- ✅ Colaboradores / Jornada do Colaborador
- ✅ Recrutamento & Seleção
- ✅ Onboarding 90 dias
- ✅ Treinamentos & Desenvolvimento
- ✅ Ponto Eletrônico
- ✅ DP Digital
- ✅ Férias & Licenças

### Performance & Cultura
- ✅ Metas & OKRs
- ✅ Avaliação 360°
- ✅ Clima Organizacional
- ✅ Saúde & NR-1
- ✅ Cultura & Valores

### Comunicação & Colaboração
- ✅ Feed Corporativo
- ✅ Reuniões & Agenda
- ✅ Kanban & Tarefas
- ✅ IA Assistente

### Administração
- ✅ Vendas & Resultados
- ✅ Admin Master (proprietário)

## 🔐 Perfis & Permissões

1. **Operacional** - Colaborador: Acesso a tarefas, ponto, notificações pessoais
2. **Tático** - Gestor/RH: Visão de time, performance, gestão
3. **Estratégico** - Diretor: Indicadores consolidados, OKRs estratégicos
4. **Admin Master** - Proprietário: Controle total, gestão de clientes

## 🛠️ Setup & Desenvolvimento

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- MySQL 8+

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Criar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Scripts Disponíveis

```bash
pnpm dev          # Iniciar servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Iniciar servidor em produção
pnpm check        # Verificar tipos TypeScript
pnpm test         # Executar testes Vitest
pnpm format       # Formatar código com Prettier
pnpm db:push      # Sincronizar schema com banco de dados
```

## 📁 Estrutura do Projeto

```
client/
  src/
    pages/          # Páginas dos módulos
    components/     # Componentes reutilizáveis
    contexts/       # React contexts
    hooks/          # Custom hooks
    lib/            # Utilitários
    _core/          # Hooks de autenticação

server/
  _core/            # Configuração do servidor
  routers.ts        # Procedimentos tRPC
  db.ts             # Queries do banco de dados
  storage.ts        # Integração S3

drizzle/
  schema.ts         # Schema do banco de dados
  migrations/       # Migrações

shared/
  const.ts          # Constantes compartilhadas
  types.ts          # Tipos TypeScript
```

## 🔌 API tRPC

Todos os dados são acessados via tRPC em `/api/trpc`:

```typescript
// Exemplo: Listar colaboradores
const { data } = trpc.colaboradores.list.useQuery();

// Exemplo: Enviar mensagem para IA
const { mutate } = trpc.ia.chat.useMutation();
mutate({ message: "Qual é meu desempenho?" });
```

## 🗄️ Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema
- `companies` - Empresas/clientes
- `employees` - Colaboradores
- `sales` - Vendas
- `goals` - Metas & OKRs
- `evaluations` - Avaliações
- `surveys` - Pesquisas de clima
- `candidates` - Candidatos
- `tasks` - Tarefas & Kanban
- `meetings` - Reuniões
- `posts` - Feed corporativo
- `vacationRequests` - Solicitações de férias

## 🔐 Autenticação

O sistema usa Manus OAuth com JWT. Fluxo:

1. Usuário clica em "Login com Manus"
2. Redireciona para `/api/oauth/callback`
3. Cria sessão com JWT
4. Armazena em cookie seguro

## 📊 Próximos Passos

- [ ] Integração com LLM para IA Assistente
- [ ] Notificações em tempo real (WebSocket)
- [ ] Relatórios customizáveis
- [ ] Integração com calendários (Google/Outlook)
- [ ] Mobile app (React Native)
- [ ] Análises avançadas com BI

## 📝 Licença

MIT

## 👥 Suporte

Para suporte, abra uma issue no repositório.
