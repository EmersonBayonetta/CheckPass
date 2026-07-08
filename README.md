# Confirma Presenca

Sistema web para confirmação digital de presença e validação de entrada em eventos.

## Stack

- Next.js com App Router
- API REST no proprio Next.js
- Postgres externo, pronto para Vercel
- Autenticação simples por senha para o painel administrativo

## Funcionalidades

- Cadastro manual de convidados
- Token e link único por convidado
- Página pública de confirmação por link
- Limite de acompanhantes por convidado
- Painel com filtros e totais do evento
- Busca por nome ou telefone no dia do evento
- Validação de entrada com bloqueio de duplicidade
- Bloqueio de edição por variável de ambiente ou data do evento

## Rodando localmente

1. Instale as dependencias:

```bash
npm install
```

2. Configure o ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

3. Configure `DATABASE_URL` com uma URL Postgres.

Para publicar na Vercel, use um banco externo como Neon, Supabase ou outra integração Postgres do Marketplace.

4. Crie a tabela e dados iniciais:

```bash
npm run setup
```

5. Inicie o servidor:

```bash
npm run dev
```

6. Acesse:

- Painel administrativo: `http://localhost:3000/admin`
- Senha padrão: `admin123`

## Variaveis de ambiente

- `DATABASE_URL`: URL de conexao Postgres
- `ADMIN_PASSWORD`: senha do organizador
- `AUTH_SECRET`: chave usada para assinar a sessao
- `NEXT_PUBLIC_APP_URL`: base para gerar links publicos
- `EVENT_DATE`: data limite para edição da confirmação
- `CONFIRMATIONS_LOCKED`: use `true` para bloquear edicoes manualmente

## Estrutura

```text
app/
  admin/                 telas protegidas do organizador
  api/                   rotas REST
  confirmar/[token]/     página pública do convidado
components/              componentes reutilizaveis
lib/                     autenticação, banco, formatação e regras
prisma/                  schema SQL do banco Postgres
scripts/                 seed inicial
```

## Publicando na Vercel

1. Suba o projeto para um repositorio GitHub.
2. Crie um banco Postgres em Neon, Supabase ou pelo Marketplace da Vercel.
3. No banco, rode o script localmente com a `DATABASE_URL` real:

```bash
npm run setup
```

4. Importe o repositorio na Vercel.
5. Configure as variaveis de ambiente no projeto da Vercel:

```env
DATABASE_URL="postgres://..."
ADMIN_PASSWORD="troque-esta-senha"
AUTH_SECRET="gere-uma-chave-grande-e-aleatoria"
NEXT_PUBLIC_APP_URL="https://seu-projeto.vercel.app"
EVENT_DATE="2026-12-31T23:59:59-03:00"
CONFIRMATIONS_LOCKED="false"
```

6. Use o build padrão da Vercel para Next.js: `npm run build`.

## Rotas REST principais

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/admin/guests?q=texto`
- `POST /api/admin/guests`
- `PATCH /api/admin/guests/:id`
- `POST /api/public/confirm`
- `POST /api/admin/validate-entry`
