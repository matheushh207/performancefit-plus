# 🏋️ PerformanceFit Plus

Sistema SaaS completo para gestão de profissionais de educação física e nutrição, com portal dedicado para alunos.

## ✨ Características Principais

- 🔐 **Autenticação Segura**: Login de profissionais com JWT e bcrypt
- 🏢 **Multi-tenancy**: Isolamento completo de dados por profissional
- 📊 **Dashboard Profissional**: Estatísticas em tempo real
- 👥 **Gestão de Alunos**: Cadastro e acompanhamento completo
- 💪 **Treinos Personalizados**: Criação de programas de treino detalhados
- 🥗 **Planos Nutricionais**: Montagem de dietas completas com refeições
- 📱 **Portal do Aluno**: Acesso dedicado com receitas personalizadas (5 por dia)
- 📈 **Avaliações Físicas**: Registro e acompanhamento de evolução

## 🚀 Início Rápido

Consulte o arquivo [SETUP.md](./SETUP.md) para instruções detalhadas de configuração.

### Passos Básicos

1. Configure o arquivo `.env` com `DATABASE_URL` e `PROFESSIONAL_JWT_SECRET`
2. Execute `pnpm install`
3. Execute `pnpm db:push` para criar as tabelas
4. Execute `pnpm dev:win` (Windows) ou `pnpm dev` (Linux/Mac)
5. Acesse `/admin/login` para cadastrar o primeiro profissional

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, tRPC Client
- **Backend**: Node.js, Express, tRPC Server, Drizzle ORM
- **Banco de Dados**: MySQL 8.0+
- **Autenticação**: JWT (profissionais), bcryptjs

## 📋 Status do Projeto

✅ **Fase 1 - Fundações e Segurança**: Completa
- ✅ Schema do banco com foreign keys e índices
- ✅ Autenticação segura de profissionais
- ✅ Multi-tenancy implementado
- ✅ Cadastro de profissionais funcional

🔄 **Próximas Fases** (Opcional):
- Migração completa de localStorage para banco
- Login seguro de alunos
- Validação de CREA/CRN
- Sistema de pagamentos
- PWA para alunos

## 📝 Licença

MIT
