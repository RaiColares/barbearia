# Barbearia Maraca — Google Sheets Edition

SPA full-stack para barbearia com **Google Sheets como banco de dados** (substituindo PostgreSQL).

## Stack

- **Frontend**: Vanilla TypeScript, HTML5, CSS3, SPA sem framework (Vite)
- **Backend**: Node.js, Express, TypeScript
- **Banco**: Google Sheets via Google Sheets API + Service Account

## Papéis

- Cliente
- Barbeiro
- Recepcionista
- Administrador

## Requisitos

- Node.js 20+
- Conta Google (para Service Account)
- Uma planilha Google Sheets criada e compartilhada

## Setup rápido

Veja [docs/SETUP_GOOGLE_SHEETS.md](docs/SETUP_GOOGLE_SHEETS.md) para as instruções completas.

### Resumo:

1. **Google Cloud Console**: habilitar Google Sheets API, criar Service Account, baixar JSON key
2. **Configurar `.env`** com `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`
3. **Criar planilha**, compartilhar com o email do Service Account
4. **Rodar setup**:
   ```bash
   cd backend
   npm install
   npm run sheets:init   # cria abas + cabeçalhos
   npm run sheets:seed   # dados demo (opcional)
   npm run dev
   ```

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm run sheets:init` | Cria as 7 abas da planilha com cabeçalhos |
| `npm run sheets:seed` | Popula dados demo (usuários, serviços, agendamentos) |

## Estrutura

```
backend/src/
├── database/
│   ├── connection.ts      # Exporta getDb() → SheetsClient
│   ├── sheets-client.ts   # Cliente Sheets (CRUD + cache 30s)
│   └── repository.ts      # Base abstrata de repositório
├── repositories/          # Acesso a dados (usuarios, servicos...)
├── services/              # Regras de negócio
├── controllers/           # Handlers HTTP
├── rotas/                 # Express routers
├── dtos/                  # Objetos de transferência
├── setup-sheets.ts        # Init da planilha
└── seed-sheets.ts         # Dados demo
```

## Segurança

- Service Account JSON **nunca** é commitado (no `.gitignore`)
- Validações de integridade (FK, UNIQUE, CHECK) implementadas no código
- `senha_hash` usando bcrypt

## Notas

- Google Sheets não tem FK/constraints nativas — validações são no nivel de aplicação
- Cache em memória (TTL 30s) para respeitar limiters da Sheets API
