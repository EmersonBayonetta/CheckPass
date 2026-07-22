# CheckPass

Sistema full-stack para confirmação digital de presença e controle de entrada em eventos.

## Problema resolvido

Organizadores de eventos precisam confirmar convidados, controlar acompanhantes e impedir entradas duplicadas sem depender de planilhas ou listas em papel. O CheckPass centraliza esse fluxo em uma aplicação web com área administrativa e páginas individuais para convidados.

## Principais funcionalidades

- Cadastro e gerenciamento de convidados
- Link único de confirmação por convidado
- Controle do limite de acompanhantes
- Painel com busca, filtros e indicadores do evento
- Confirmação pública sem acesso ao painel
- Validação de entrada com bloqueio de duplicidade
- Bloqueio de alterações por data ou configuração
- Autenticação do painel administrativo
- Persistência em PostgreSQL

## Tecnologias

- Next.js 15 com App Router
- React 19
- TypeScript
- API REST com Route Handlers
- PostgreSQL
- Sessão assinada para autenticação
- Vercel como plataforma de deploy

## Arquitetura

```text
app/
  admin/                 área protegida do organizador
  api/                   endpoints da aplicação
  confirmar/[token]/     confirmação pública do convidado
components/              componentes reutilizáveis
lib/                     autenticação, banco e regras de negócio
prisma/                  estrutura SQL
scripts/                 configuração inicial do banco
```

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

3. Configure as variáveis:

```env
DATABASE_URL="postgres://..."
ADMIN_PASSWORD="defina-uma-senha-segura"
AUTH_SECRET="gere-uma-chave-longa-e-aleatoria"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EVENT_DATE="2026-12-31T23:59:59-03:00"
CONFIRMATIONS_LOCKED="false"
```

4. Prepare o banco e inicie a aplicação:

```bash
npm run setup
npm run dev
```

## Rotas principais

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/api/auth/login` | autentica o organizador |
| POST | `/api/auth/logout` | encerra a sessão |
| GET | `/api/admin/guests?q=texto` | lista e pesquisa convidados |
| POST | `/api/admin/guests` | cadastra um convidado |
| PATCH | `/api/admin/guests/:id` | atualiza um convidado |
| POST | `/api/public/confirm` | registra uma confirmação |
| POST | `/api/admin/validate-entry` | valida a entrada no evento |

## Segurança

- Não publique arquivos `.env`.
- Use uma senha administrativa exclusiva em produção.
- Gere um `AUTH_SECRET` longo e aleatório.
- Mantenha as credenciais do banco somente nas variáveis de ambiente.

## Próximas melhorias

- Adicionar testes automatizados das regras críticas
- Registrar auditoria das validações
- Gerar QR Code para cada convite
- Criar níveis de acesso para organizadores
- Publicar uma demonstração com dados fictícios
