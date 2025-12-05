# Plataforma de Bootcamp - MVP

Plataforma completa de bootcamp de programação estilo TripleTen, focada em transição de carreira para trabalho remoto internacional.

## Stack Tecnológica

- **Frontend**: Next.js 16.0.7 (App Router), React 19.2.0, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js v5
- **Database**: MongoDB com Mongoose
- **Infra**: Vercel (deploy), MongoDB Atlas (database), Vercel Blob (files), Resend (email)

## Pré-requisitos

- Node.js 18+ instalado
- Conta no MongoDB Atlas (gratuita)
- Conta no Vercel (opcional, para deploy)

## Setup do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

#### MongoDB Atlas
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Em "Database Access", crie um usuário
4. Em "Network Access", adicione seu IP (ou 0.0.0.0/0 para desenvolvimento)
5. Clique em "Connect" → "Connect your application"
6. Copie a connection string e adicione no `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bootcamp?retryWrites=true&w=majority
```

#### NextAuth
Gere uma secret key segura:

```bash
openssl rand -base64 32
```

Adicione no `.env`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-secret-key-gerada
```

## Primeiro Acesso

### 1. Criar Conta
1. Acesse `http://localhost:3000`
2. Clique em "Cadastre-se"
3. Preencha o formulário
4. Por padrão, novos usuários são criados com role "aluno"

### 2. Criar Usuário Admin (via MongoDB)
Para criar um usuário admin, use o MongoDB Compass ou o shell:

```javascript
// No MongoDB shell ou Compass
db.users.updateOne(
  { email: "seu@email.com" },
  { $set: { role: "admin" } }
)
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint
```

## Funcionalidades Implementadas (Fase 1)

✅ Estrutura base do projeto
✅ Autenticação com NextAuth v5
✅ Sistema de roles (aluno, instrutor, admin)
✅ Middleware de proteção de rotas
✅ Layouts base para todos os dashboards
✅ Modelos de dados completos
✅ Páginas de login e cadastro
✅ Navegação por role

## Próximas Fases

**Fase 2**: Dashboard Admin (CRUD de conteúdo)
**Fase 3**: Dashboard Aluno (visualizar curso + submeter projetos)
**Fase 4**: Dashboard Instrutor (revisar submissões)
**Fase 5**: Métricas e notificações por email
