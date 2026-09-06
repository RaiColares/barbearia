# Setup do Projeto com Google Sheets

Este projeto usa **Google Sheets** como banco de dados (substituindo PostgreSQL) via **Service Account**.

## Pré-requisito

- Node.js 20+
- Uma conta Google

---

## 1. Google Cloud Console — Configurar Service Account

### 1.1 Criar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto (ou selecione existente)

### 1.2 Habilitar Google Sheets API
1. Menu → **APIs & Services** → **Library**
2. Busque **Google Sheets API**
3. Clique em **Enable**

### 1.3 Criar Service Account
1. Menu → **APIs & Services** → **Credentials**
2. Clique em **+ Create Credentials** → **Service Account**
3. Dê um nome (ex: `barbearia-maraca-bot`)
4. Clique em **Create** (pode pular permissões)
5. Na lista de service accounts, clique na que criou
6. Vá na aba **Keys** → **Add Key** → **Create New Key** → **JSON** → **Create**
7. Baixa um arquivo `.json` — **guarde com segurança** (não commit)

### 1.4 Variáveis de Ambiente
Do JSON baixado, copie:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY` (mantenha as `\n` ou use aspas)

Preencha no `backend/.env`:

```env
GOOGLE_SPREADSHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=sua-conta@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

> **IMPORTANTE**: Nunca commite o JSON ou o conteúdo da chave privada.

---

## 2. Criar a Planilha

### Opção A — Criar manualmente
1. Abra [sheets.new](https://sheets.new) (cria planilha em branco)
2. Copie o **ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/ABC123.../edit
   ```
   `ABC123...` é o `GOOGLE_SPREADSHEET_ID`
3. **Compartilhe** a planilha com o email do Service Account
   (clique em **Share** → coloque o email → **Editor**)

### Opção B — Automatizar com scripts

Depois de configurar o `.env` e **compartilhar a planilha com o Service Account**, execute:

```bash
# Cria as 7 abas da tabela + cabeçalhos
npm run sheets:init

# Popula dados demo (usuários, serviços, etc.)
npm run sheets:seed
```

---

## 3. Rodar o Backend

```bash
npm install
npm run dev
```

Servidor sobe em `http://localhost:3000`

Verificar health:
```bash
curl http://localhost:3000/api/health
# → { "status": "ok", "database": "connected" }
```

---

## 4. Estrutura de Abas na Planilha

| Aba | Colunas |
|-----|---------|
| `usuario` | id, email, senha_hash, tipo, google_id, avatar_url, created_at, updated_at |
| `cliente` | id, usuario_id, nome, telefone, created_at, updated_at |
| `funcionario` | id, usuario_id, nome, telefone, cargo, especialidade, foto, descricao, ativo, created_at, updated_at |
| `servico` | id, nome, descricao, duracao_minutos, preco, ativo, created_at, updated_at |
| `horario_trabalho` | id, funcionario_id, dia_semana, hora_inicio, hora_fim, ativo, created_at, updated_at |
| `horario_excecao` | id, funcionario_id, data, hora_inicio, hora_fim, tipo, motivo, created_at, updated_at |
| `agendamento` | id, cliente_id, funcionario_id, servico_id, data, hora, status, observacao, created_at, updated_at |

---

## 5. Limites da Google Sheets API

| Quota | Limite |
|-------|--------|
| Leituras/min (por projeto) | 300 |
| Leituras/min (por usuário) | 60 |
| Escritas/min (por projeto) | 300 |
| Escritas/min (por usuário) | 60 |

**Estratégia**: Já implementamos cache em memória (30s TTL) no `sheets-client.ts` para reduzir chamadas. Ao bater no limite, use backoff.

---

## 6. Seeds — Credenciais Demo

| Papel | Email | Senha |
|-------|-------|-------|
| Administrador | `admin@barbearia.com` | `senha123` |
| Barbeiro | `rafael@barbearia.com` | `senha123` |
| Recepcionista | `juliana@barbearia.com` | `senha123` |
| Cliente | `carlos@email.com` | `senha123` |

---

## 7. Estrutura dos Arquivos

```
backend/src/
├── database/
│   ├── connection.ts       # Ponto de acesso ao SheetsClient
│   ├── sheets-client.ts    # Cliente Google Sheets (CRUD + cache)
│   └── repository.ts       # Classe base abstrata de repositório
├── repositories/
│   ├── auth-repository.ts  # Operações de usuário/cliente/funcionario
│   └── servico-repository.ts
├── setup-sheets.ts         # Script: cria abas + cabeçalhos
├── seed-sheets.ts          # Script: popula dados demo
└── server.ts               # Express app
```

---

## 8. Notas importantes

- **Integridade referencial** (FK) e **constraints** (UNIQUE, CHECK) são implementadas **no código**, pois Google Sheets não oferece essas garantias.
- **Concorrência**: A checagem de duplicidade de agendamento deve ser feita no nível da aplicação com transação/sequência.
- **Segurança**: O Service Account JSON nunca deve ser exposto ou commitado.
