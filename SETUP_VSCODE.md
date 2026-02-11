# PerformaceFit+ - Instalação Fácil via VS Code

## 🎯 Resumo Rápido

1. Extrair ZIP
2. Abrir no VS Code
3. Abrir Terminal
4. Rodar 3 comandos
5. Pronto! 🚀

---

## 📖 Passo a Passo Detalhado

### 1️⃣ Extrair o ZIP

- Clique com botão direito no arquivo `performancefit-plus-final.zip`
- Selecione **"Extrair Tudo..."**
- Escolha a pasta onde quer extrair
- Clique em **"Extrair"**

### 2️⃣ Abrir no VS Code

**Opção A - Arrastar e Soltar:**
- Abra o VS Code
- Arraste a pasta `performancefit-plus` para dentro do VS Code
- Pronto!

**Opção B - Abrir Pasta:**
- Abra VS Code
- Clique em **File → Open Folder**
- Selecione a pasta `performancefit-plus`
- Clique em **Select Folder**

### 3️⃣ Abrir o Terminal no VS Code

Clique em **Terminal → New Terminal** (ou pressione `Ctrl + Backtick`)

Você verá um terminal na parte inferior do VS Code.

### 4️⃣ Rodar os Comandos

**Comando 1 - Instalar dependências:**
```
pnpm install
```
Pressione **Enter** e aguarde (pode levar 5-10 minutos)

**Comando 2 - Configurar banco de dados:**
```
pnpm db:push
```
Pressione **Enter**

**Comando 3 - Iniciar o servidor:**
```
pnpm dev
```
Pressione **Enter**

Você verá:
```
Server running on http://localhost:3000/
```

### 5️⃣ Acessar a Plataforma

Abra seu navegador e vá para:

- **Home**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin/login
  - Usuário: `matheus`
  - Senha: `1926`

---

## 🎨 Explorando o Projeto no VS Code

### Estrutura de Pastas (lado esquerdo)

```
performancefit-plus/
├── client/              ← Frontend (React)
│   └── src/
│       ├── pages/       ← Páginas (Home, Dashboard, etc)
│       ├── components/  ← Componentes reutilizáveis
│       └── index.css    ← Tema roxo elegante
├── server/              ← Backend (Express + tRPC)
├── drizzle/             ← Banco de dados
└── package.json         ← Dependências
```

### Editar Páginas

Para editar a página inicial:
1. Abra a pasta `client/src/pages`
2. Clique em `Home.tsx`
3. Edite o conteúdo
4. Salve com `Ctrl + S`
5. O navegador atualiza automaticamente!

---

## 🛑 Parar o Servidor

No terminal do VS Code, pressione:
```
Ctrl + C
```

Você verá:
```
Terminate batch job (Y/N)? Y
```

Pressione `Y` e **Enter**

---

## 🔄 Reiniciar o Servidor

Se o servidor parar ou você fizer mudanças importantes:

1. Pressione `Ctrl + C` para parar
2. Digite `pnpm dev` novamente
3. Pressione **Enter**

---

## 📝 Dicas Úteis no VS Code

### Atalhos Importantes

| Atalho | Função |
|--------|--------|
| `Ctrl + S` | Salvar arquivo |
| `Ctrl + Backtick` | Abrir/Fechar terminal |
| `Ctrl + /` | Comentar/Descomentar |
| `Ctrl + Shift + P` | Paleta de comandos |
| `Ctrl + F` | Buscar no arquivo |
| `Ctrl + H` | Buscar e substituir |

### Extensões Recomendadas

Instale no VS Code para melhor experiência:

1. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
2. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
3. **Thunder Client** (rangav.vscode-thunder-client) - para testar APIs
4. **Prettier** (esbenp.prettier-vscode) - formatar código

---

## 🐛 Problemas Comuns

### Erro: "pnpm: O termo não é reconhecido"

**Solução:**
```
npm install -g pnpm
```

### Erro: "Porta 3000 já está em uso"

**Solução 1 - Usar porta diferente:**
```
$env:PORT=3001
pnpm dev
```
Depois acesse: http://localhost:3001

**Solução 2 - Liberar a porta:**
- Feche outros programas usando a porta 3000
- Ou reinicie o computador

### Mudanças não aparecem no navegador

**Solução:**
1. Salve o arquivo com `Ctrl + S`
2. Aguarde 2-3 segundos
3. Atualize o navegador com `F5` ou `Ctrl + R`

### Erro ao instalar dependências

**Solução:**
1. Feche o VS Code
2. Delete a pasta `node_modules`
3. Delete o arquivo `pnpm-lock.yaml`
4. Abra VS Code novamente
5. Execute `pnpm install`

---

## 🎯 Próximos Passos

### 1. Explorar o Painel Admin
- Acesse: http://localhost:3000/admin/login
- Usuário: `matheus`
- Senha: `1926`
- Cadastre profissionais e planos

### 2. Criar Alunos
- No dashboard, vá para "Students"
- Cadastre um novo aluno
- Crie uma avaliação física

### 3. Montar Treino
- Vá para "Workouts"
- Crie um novo treino
- Adicione exercícios

### 4. Criar Dieta
- Vá para "Nutrition"
- Crie um plano nutricional
- Adicione refeições e alimentos

### 5. Aluno Acessar
- Na home, clique "Portal do Aluno"
- Digite o CPF
- Veja treino, dieta e receitas

---

## 💡 Customizar o Projeto

### Mudar Cores (Tema Roxo)

Arquivo: `client/src/index.css`

Procure por `--accent:` e mude o valor OKLCH

Exemplo:
```css
--accent: oklch(0.62 0.22 270);  /* Roxo */
--accent: oklch(0.62 0.22 0);    /* Vermelho */
--accent: oklch(0.62 0.22 120);  /* Verde */
```

### Mudar Nome da Plataforma

Arquivo: `client/src/pages/Home.tsx`

Procure por `PerformaceFit+` e mude para seu nome

### Mudar Credenciais Admin

Arquivo: `client/src/pages/AdminLogin.tsx`

Procure por:
```typescript
if (username === "matheus" && password === "1926")
```

E mude para suas credenciais

---

## 🚀 Deploy (Depois)

Quando estiver pronto para publicar:

1. Execute: `pnpm build`
2. Faça upload para um servidor
3. Configure variáveis de ambiente
4. Pronto!

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. Verifique se Node.js está instalado: `node --version`
2. Verifique se pnpm está instalado: `pnpm --version`
3. Feche e abra o VS Code novamente
4. Limpe cache: Delete `node_modules` e `pnpm-lock.yaml`
5. Reinstale: `pnpm install`

---

## ✨ Parabéns!

Você tem um projeto profissional de gestão para Personal Trainers e Nutricionistas rodando localmente!

**Aproveite e bom sucesso!** 🎉
