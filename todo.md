# ORIZON SaaS — Todo List

## Fase 1: Setup Full-Stack ✅
- [x] Criar schema MySQL com Drizzle ORM
- [x] Configurar tRPC com Express
- [x] Implementar autenticação Manus OAuth
- [x] Criar routers tRPC para módulos
- [x] Configurar variáveis de ambiente
- [x] Instalar dependências

## Fase 2: Integração Frontend-Backend 🔄
- [ ] Conectar cliente tRPC ao servidor
- [ ] Migrar Login.tsx para usar tRPC real
- [ ] Migrar Dashboard para usar dados do banco
- [ ] Implementar useAuth hook com tRPC
- [ ] Testar fluxo de login completo

## Fase 3: Módulos Principais 📋
- [ ] Colaboradores - Listar, criar, editar
- [ ] Vendas - Dashboard e CRUD
- [ ] Ponto Eletrônico - Registros e relatórios
- [ ] Metas & OKRs - Criar e acompanhar
- [ ] Avaliações - Ciclo de avaliação 360°

## Fase 4: Módulos de Comunicação 💬
- [ ] Feed Corporativo - Posts e comentários
- [ ] Reuniões - Agenda e participantes
- [ ] Kanban - Tarefas e status
- [ ] IA Assistente - Integração com LLM

## Fase 5: Funcionalidades Avançadas 🚀
- [ ] Notificações em tempo real
- [ ] Relatórios customizáveis
- [ ] Exportação PDF/Excel
- [ ] Integração com calendários
- [ ] Analytics e dashboards

## Fase 6: Testes & Deploy 🧪
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Documentação API
- [ ] Deploy em produção

## Notas
- Database URL precisa ser configurada antes de rodar `pnpm db:push`
- OAuth credentials devem estar nas variáveis de ambiente
- S3 bucket precisa estar configurado para upload de arquivos
