# 🚀 PerformanceFit Plus - Guia de Configuração

## Pré-requisitos

- Node.js 18+ instalado
- MySQL 8.0+ rodando
- pnpm instalado (`npm install -g pnpm`)

## Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```bash
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
PROFESSIONAL_JWT_SECRET="uma-string-secreta-muito-longa-e-aleatoria-aqui"
```

**Importante:**
- Substitua `usuario`, `senha`, `localhost:3306` e `nome_do_banco` pelos seus dados do MySQL
- O banco de dados deve existir (ou o MySQL deve ter permissão para criar)
- `PROFESSIONAL_JWT_SECRET` deve ser uma string longa e aleatória (ex: gere com `openssl rand -base64 32`)

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Criar Schema no Banco de Dados

```bash
pnpm db:push
```

**Nota:** Se o drizzle-kit perguntar sobre tabelas (ex: "Is bioimpedanceData table created or renamed?"), sempre escolha:
- **`+ nome_da_tabela create table`** (criar tabela nova)

### 4. Rodar o Sistema

**Windows:**
```bash
pnpm dev:win
```

**Linux/Mac:**
```bash
pnpm dev
```

O sistema estará disponível em `http://localhost:5173` (ou a porta indicada no terminal).

## Primeiro Acesso

### Cadastrar Primeiro Profissional

1. Acesse `/admin/login`
2. Use as credenciais do admin (configuradas no código):
   - Usuário: `matheus`
   - Senha: `1926`
3. No Painel Admin, clique em "Novo Profissional"
4. Preencha os dados e defina uma senha
5. O profissional poderá fazer login em `/professional/login` com o email e senha cadastrados

### Login do Profissional

1. Acesse `/professional/login`
2. Use o email e senha cadastrados no Painel Admin
3. Você será redirecionado para o Dashboard Profissional

## Estrutura do Sistema

- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Backend:** Node.js + Express + tRPC
- **Banco de Dados:** MySQL + Drizzle ORM
- **Autenticação:** JWT para profissionais, localStorage para alunos (temporário)

## Funcionalidades Implementadas

✅ Autenticação segura de profissionais (bcrypt + JWT)
✅ Multi-tenancy completo (isolamento de dados por profissional)
✅ Cadastro de profissionais via Painel Admin
✅ Gerenciamento de alunos (localStorage - migração pendente)
✅ Portal do aluno com receitas filtradas (5 por dia)
✅ Dashboard profissional com estatísticas reais

## Próximos Passos (Opcional)

- Migrar alunos/treinos/dietas do localStorage para banco
- Implementar login seguro de alunos
- Adicionar validação de CREA/CRN
- Implementar sistema de pagamentos
- Adicionar PWA para alunos

## Troubleshooting

### Erro: "DATABASE_URL is required"
- Verifique se o arquivo `.env` existe e está na raiz do projeto
- Confirme que `DATABASE_URL` está configurado corretamente

### Erro: "PROFESSIONAL_JWT_SECRET" não definido
- Adicione `PROFESSIONAL_JWT_SECRET` no arquivo `.env`
- Reinicie o servidor após adicionar

### Erro no `pnpm db:push`
- Verifique se o MySQL está rodando
- Confirme que o usuário tem permissão para criar tabelas
- Tente dropar o banco e criar novamente se necessário

### Profissional não consegue fazer login
- Verifique se o profissional foi cadastrado corretamente
- Confirme que `isActive` está como `true` no banco
- Verifique se a senha está correta
