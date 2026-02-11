# PerformaceFit+ - Guia de Instalação no Windows (PowerShell)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior): https://nodejs.org/
- **Git** (opcional): https://git-scm.com/
- **VS Code**: https://code.visualstudio.com/

## 🚀 Passo a Passo - PowerShell

### 1️⃣ Extrair o Arquivo ZIP

Abra o **PowerShell** e execute:

```powershell
# Navegue até a pasta onde baixou o ZIP
cd $env:USERPROFILE\Downloads

# Extraia o arquivo (substitua pelo caminho correto se necessário)
Expand-Archive -Path performancefit-plus-final.zip -DestinationPath .

# Entre na pasta do projeto
cd performancefit-plus
```

### 2️⃣ Instalar Dependências

```powershell
# Instale o pnpm globalmente (gerenciador de pacotes)
npm install -g pnpm

# Instale todas as dependências do projeto
pnpm install
```

**Isso pode levar 5-10 minutos na primeira vez.**

### 3️⃣ Configurar o Banco de Dados

```powershell
# Gere as migrações e configure o banco de dados
pnpm db:push
```

### 4️⃣ Iniciar o Servidor

```powershell
# Inicie o servidor de desenvolvimento
pnpm dev
```

Você verá uma mensagem como:
```
Server running on http://localhost:3000/
```

### 5️⃣ Acessar a Plataforma

Abra seu navegador e acesse:

- **Home**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin/login
- **Credenciais Admin**: 
  - Usuário: `matheus`
  - Senha: `1926`

---

## 🔧 Comandos Úteis

### Verificar Erros de TypeScript
```powershell
pnpm check
```

### Compilar para Produção
```powershell
pnpm build
```

### Rodar Testes
```powershell
pnpm test
```

### Formatar Código
```powershell
pnpm format
```

### Parar o Servidor
```powershell
# Pressione Ctrl + C no PowerShell
```

---

## 🐛 Solução de Problemas

### Erro: "pnpm: O termo 'pnpm' não é reconhecido"

**Solução:**
```powershell
# Instale pnpm globalmente
npm install -g pnpm

# Ou use npm diretamente
npm install
npm run dev
```

### Erro: "Porta 3000 já está em uso"

**Solução:**
```powershell
# Use uma porta diferente
$env:PORT=3001
pnpm dev
```

Ou acesse: http://localhost:3001

### Erro: "Banco de dados não conectado"

**Solução:**
```powershell
# Verifique se o banco está configurado
pnpm db:push

# Se ainda não funcionar, limpe cache
Remove-Item -Path .\node_modules -Recurse -Force
Remove-Item -Path .\pnpm-lock.yaml
pnpm install
pnpm db:push
```

### Erro: "Module not found"

**Solução:**
```powershell
# Reinstale as dependências
Remove-Item -Path .\node_modules -Recurse -Force
pnpm install
pnpm dev
```

---

## 📁 Estrutura do Projeto

```
performancefit-plus/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Dashboard, etc)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── App.tsx        # Rotas principais
│   │   └── index.css      # Tema roxo elegante
│   └── public/            # Arquivos estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Rotas da API
│   ├── db.ts              # Queries do banco
│   └── _core/             # Configuração interna
├── drizzle/               # Schema do banco de dados
│   └── schema.ts          # Definição das tabelas
├── shared/                # Código compartilhado
├── package.json           # Dependências
├── pnpm-lock.yaml         # Lock file
└── README.md              # Documentação
```

---

## 🎯 Próximos Passos

1. **Acessar o Painel Admin**
   - URL: http://localhost:3000/admin/login
   - Usuário: `matheus`
   - Senha: `1926`

2. **Cadastrar Profissionais**
   - Vá para o painel admin
   - Cadastre personal trainers ou nutricionistas
   - Defina os planos de assinatura

3. **Gerenciar Alunos**
   - Cada profissional pode cadastrar seus alunos
   - Criar avaliações físicas
   - Montar treinos e dietas

4. **Alunos Acessarem**
   - Clique em "Portal do Aluno" na home
   - Digite o CPF
   - Visualize treino, dieta e receitas

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se o Node.js está instalado: `node --version`
2. Verifique se o pnpm está instalado: `pnpm --version`
3. Limpe cache e reinstale: `Remove-Item node_modules -Recurse; pnpm install`
4. Verifique a porta 3000: `netstat -ano | findstr :3000`

---

## 🎉 Pronto!

Seu projeto PerformaceFit+ está 100% funcional e pronto para uso!

**Aproveite a plataforma e bom sucesso com seu negócio!** 🚀
