# Histórico de Sessão — 07/09/2026

> Documento de continuidade. Resumo do que foi feito até aqui no repo
> `barbearia-maraca-googlesheets` e do que falta para amanhã.

---

## 1. Contexto do projeto

- **Repo ativo**: `/home/rai_colares/barbearia-maraca-googlesheets`
  (git `git@github.com:RaiColares/barbearia.git`, branch `main`, push direto).
- **Referência visual (modal/UI)**: repo `/home/rai_colares/barbearia-maraca-local`.
- **Stack**: Vanilla TS SPA (frontend) + Express + Google Sheets como "banco"
  (backend). Sem framework no front, sem ORM no backend.
- **Papéis**: `superusuario` | `admin` | `recepcionista` | `profissional` | `cliente`.
- **Armazenamento (design aprovado)**:
  - credenciais centralizadas na aba `usuario` (`email` + `senha_hash` bcrypt);
  - `funcionario`/`cliente` guardam perfil e linkam via `usuario_id`;
  - agendamentos na aba `agendamento`; serviços na aba `servico`.

### Produção (Vercel)
| Item | URL / Id |
|---|---|
| Backend | https://barbearia-backend-three.vercel.app (`prj_NLskCSM0ppg4uQr0gCDzmkv5T18r`) |
| Frontend | https://barbearia-frontend-ten.vercel.app (`prj_vpzuZuQqh91NSZkglzHoTWueBZlT`) |
| CLI | `npx --no-install vercel` (v59, login `jrcolares2012-6244`, scope `dev-rai`) |
| OAuth Client ID | `123151012264-k0dmgrqkueuh0irgm6bvibs0nv4bmdu6.apps.googleusercontent.com` |

> **ATENÇÃO CLI**: rodar comandos `vercel` sempre com `workdir` do
> `frontend/` ou `backend/` (há `.vercel/project.json` nesses dois dirs).
> Na raiz, vercel diz "not linked".

---

## 2. Linha do tempo (o que foi feito)

### 2.1 Planejamento e inspeção
- Comparado o modal "Novo/Editar serviço" do repo `-googlesheets` vs o `-local`
  (`frontend/admin.html:300-341`); mapeadas as diferenças.
- Esclarecido com o usuário onde dados de login/senha, agendamentos e serviços
  ficam armazenados (design da seção 1).

### 2.2 Schema da planilha e seed
- `npm run sheets:init` (`backend/src/setup-sheets.ts`) aplicado na planilha de
  produção: **7 abas** com cabeçalhos atualizados.
- `usuario` passou a ter **11 colunas**:
  `id, email, senha_hash, tipo, google_id, avatar_url, nome, telefone, professional_id, created_at, updated_at`.
- `servico` ganhou `categoria` e `icon`; `agendamento` ganhou `code`.
- **Caveat migração G/H**: linhas de `usuario` criadas antes do setup-sheets
  ficaram com `created_at/updated_at` parados nas colunas G/H (`nome`/`telefone`).
  Funcionalmente inofensivo (login/DTOs leem nome de cliente/funcionario), mas é
  sujeira conhecida para eventual reescrita.

### 2.3 Superusuário de produção
- Criado com script idempotente (checa e-mail antes):
  ```sh
  SUPER_EMAIL=super@maraca.com SUPER_SENHA=maraca123 SUPER_NOME="Super Maraca" \
  npx tsx src/criar-superusuario.ts
  ```
  → gerou `usuario` (tipo `funcionario`) + `funcionario` (cargo `superusuario`).
- Rodado **ANTES** do setup-sheets (script grava posicional `usuario!A:H`, 8 cols).

### 2.4 Segurança nas rotas de agendamento (backend)
Arquivos: `backend/src/rotas/agendamento-routes.ts`,
`backend/src/controllers/agendamento-controller.ts`,
`backend/src/repositories/profissional-repository.ts`.

- **`POST /agendamentos`** → público (criação/disponibilidade).
- **`GET /`**, **`GET /:code`**, **`PATCH /:code`**, **`PATCH /:code/cancelar`**,
  **`PATCH /:code/reagendar`** → exigem `requireAuth`.
- Escopo por papel (via `buildScope` a partir do JWT):
  - `cliente`: vê/cancela/reagenda **só os próprios** (por e-mail); **não**
    pode alterar status (ForbiddenError);
  - `profissional`: resolve `funcionario.usuario_id` → só a própria agenda e
    não altera agendamento de outro profissional;
  - `recepcionista`/`admin`/`superusuario`: plenos.
- Autorização checada **antes** de mutar (busca registro existente → valida
  propriedade → aplica operação) nos casos status/cancelar/reagendar.

### 2.5 Fix "super cria admin" (backend + frontend)
- `backend/src/services/usuario-service.ts`: `criarUsuario` agora:
  - grava `nome`/`telefone` na aba `usuario`;
  - quando `tipo` é de equipe **sem** `professionalId`, cria a linha
    `funcionario` com cargo correto (`CARGO_POR_TIPO`: admin→administrador,
    recepcao→recepcionista, superuser→superusuario, profissional/barbeiro→barbeiro)
    e vincula via `vincularUsuario`.
- `frontend/src/services/admins.ts`: `createAdmin` envia **`password: data.senha`**
  (antes enviava `"admin"` fixo).
- Testado fim-a-fim localmente (PORT 3002): criado `qa-admin@maraca.dev`,
  login retornou role `admin` (cargo administrador), depois removido.

### 2.6 Login com Google (OAuth)
- Fluxo GIS popup (só Client ID; sem secret/redirect no código).
- `backend/.env` atualizado: `GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID` =
  `123151012264-...googleusercontent.com` (estavam vazios).
- Envs na Vercel:
  - backend: `GOOGLE_CLIENT_ID` (Secret, Production);
  - frontend: `VITE_GOOGLE_CLIENT_ID` (Config, Production).
- **PENDENTE (ameaça à demo)**: configurar no Google Cloud Console a **OAuth
  consent screen** — origens JS autorizadas:
  `https://barbearia-frontend-ten.vercel.app` e `http://localhost:5173`, e incluir
  a conta Google da demo em **test users**. Sem isso o popup falha na demonstração.

### 2.7 Modal "Novo/Editar serviço" (frontend)
`frontend/src/views/manage.ts` (`openServiceModal`) alinhado com o `-local`:
- select de categoria + "＋ Adicionar Nova Categoria" (com campo extra);
- duração (+ min) e preço em linha, placeholders corretos;
- textarea de descrição;
- título "Novo serviço"/"Editar serviço", botão "Salvar serviço";
- ícone default `scissors` (preserva ao editar); seletor de ícone removido;
- `SERVICE_ICONS` removido (noUnusedLocals limpo).

### 2.8 Limpeza de dados QA na planilha (com confirmação do usuário)
Removidas (das abas `usuario`/`cliente`/`funcionario`/`agendamento`):
`demo@teste.com`, `demo.final@teste.com`, `teste.pro@teste.com`,
`teste.prob@teste.com`, `qa.cliente.*`, `qa.ui.*`, agendamentos `UT-BSG2C`,
`YX-82HJ8`, `KE-4CEFA`, `AJ-YDSK2`, e o "Teste Pro".

**Estado atual da planilha (produção):**
- `usuario`: 8 (rafael, marcos, juliana, admin, carlos, ana, super@barbearia, super@maraca);
- `cliente`: 2 (Carlos, Ana);
- `funcionario`: 6 (Rafael, Marcos, Juliana, Admin, Super Usuário, Super Maraca);
- `agendamento`: 4 (`PN-XZ5A2`, `MS-6RSRP`, `AD-2EXV9`, `DA-2FVDR`) — todos de Ana/Carlos.

### 2.9 Deploys e correção do bug do 405 (HOJE)
**Bug reportado pelo usuário**: login ```super@maraca.com / maraca123``` na produção
falhava com "Erro na requisição (405)".

- Causa raiz: na Vercel, a env **`VITE_API_BASE_URL` estava com o valor
  `VITE_API_BASE_URL=/api`** (o NOME da variável colado no valor). O bundle
  mostrava `apiBaseUrl:"VITE_API_BASE_URL=/api"`, o que fazia o frontend montar
  o fetch como caminho estático do site → Vercel responde 405 para POST.
- Correção: `vercel env remove VITE_API_BASE_URL production` → recadastrar com
  valor **puro `/api`**; também removido `VITE_USE_MOCK_API` (valor sujo; com o
  código o mock ficava off por acaso).
- Redeploy do frontend (`vercel --prod`) → bundle novo `index-_BV2bL_p.js` com
  `apiBaseUrl:"/api"`.

**Validações feitas APÓS o redeploy:**
- `POST /api/auth/login` via proxy do frontend → **200**, role `superusuario`,
  nome "Super Maraca";
- `GET /api/agendamentos` sem token → **401**; com token → **200**;
- `POST /api/agendamentos` público com payload inválido → **400** (não 401);
- `PATCH`, status/cancelar/reagendar sem token → **401**;
- `GET /api/usuarios` com token do super → **200**;
- preflight OPTIONS (Origin produção) → **204** com allow-origin correto;
- bundle produção: `useMockApi:!1` (mock OFF), `googleClientId` correto.

### 2.10 Docs e git
- `docs/SETUP_GOOGLE_SHEETS.md` atualizado: schema das 7 abas, credenciais demo
  (incluindo super@maraca.com), seção de login Google/OAuth.
- Commits (push direto no `main`):
  - `1326df3` feat(backend): protege rotas de agendamento por papel e cria funcionario ao cadastrar admin
  - `1c4344d` feat(frontend): alinha modal de serviço com o design local e envia senha real ao criar admin
  - `4be697b` docs: atualiza setup do Google Sheets (schema, superusuário e OAuth)

---

## 3. Credenciais demo (planilha de produção)

| Papel | Email | Senha |
|---|---|---|
| Superusuário | `super@maraca.com` | `maraca123` |
| Superusuário (antigo) | `super@barbearia.com` | `senha123` |
| Administrador | `admin@barbearia.com` | `senha123` |
| Barbeiro | `rafael@barbearia.com` | `senha123` |
| Recepcionista | `juliana@barbearia.com` | `senha123` |
| Cliente | `carlos@email.com` | `senha123` |
| Cliente | `ana@email.com` | `senha123` |

---

## 4. Pendências / próximo responsável (amanhã)

1. **Google OAuth consent screen (BLOQUEADA POR AÇÃO HUMANA do usuário)**:
   - adicionar origens JS autorizadas:
     - `https://barbearia-frontend-ten.vercel.app`
     - `http://localhost:5173`
   - adicionar a conta Google da demo aos **test users**.
   Depois disso: testar o popup de login Google no frontend de produção.
2. **Revalidar login na produção** após correção do 405 (usuário testa com
   recarga forçada/janela anônima): `https://barbearia-frontend-ten.vercel.app/#/login`.
3. **QA fim-a-fim no browser** (produção):
   - login senha (super/admin/profissional/recepcionista/cliente);
   - login Google (cliente) — depende da pendência 1;
   - super cria novo admin → login do admin (role `admin`);
   - modal serviços: novo/editar na sua tela (`#/admin/servicos`);
   - agendamento: criar público, cancelar/reagendar autenticado, 401 sem token.
4. **Limpeza cosmética (opcional)**: linhas `usuario` antigas com timestamps nas
   colunas G/H (caveat 2.2) — reescrever se quiserem normalizar.
5. **Servidor antigo na porta 3000**: sessão tmux rodando código antigo
   (`src/index.ts`, GET / → 404). Para testar código novo localmente, usar outra
   porta, ex.: `PORT=3002 npx tsx src/index.ts`.
6. Se a demo incluir envio de PR via GitHub: fluxo deste repo é **push direto no
   `main`** (sem PR) — manter consistência ou combinar mudança.

---

## 5. Comandos úteis

```sh
# Deploy produção
cd backend && npx --no-install vercel --prod --yes
cd frontend && npx --no-install vercel --prod --yes

# Envs (sempre a partir de backend/ ou frontend/)
npx --no-install vercel env ls production
npx --no-install vercel env add VITE_X production   # valor via stdin
npx --no-install vercel env remove VITE_X production --yes

# Backend local
cd backend && npm run dev                # npx tsx src/index.ts (PORT default 3000)
PORT=3002 npm run dev                    # evitar conflito com server antigo

# Schema da planilha (já rodado; rerodar é idempotente para cabeçalhos)
cd backend && npm run sheets:init

# Superusuário (idempotente)
cd backend && SUPER_EMAIL=super@maraca.com SUPER_SENHA=maraca123 SUPER_NOME="Super Maraca" npx tsx src/criar-superusuario.ts

# Typecheck/build
cd backend && npm run build
cd frontend && npm run typecheck && npm run build
```

---

## 6. Arquivos afetados nesta fase (código)

- `backend/src/controllers/agendamento-controller.ts` — escopo por papel + autorizar antes de mutar
- `backend/src/rotas/agendamento-routes.ts` — requireAuth nas rotas protegidas
- `backend/src/repositories/profissional-repository.ts` — `buscarPorUsuarioId`
- `backend/src/services/usuario-service.ts` — cria funcionario + nome/telefone
- `frontend/src/services/admins.ts` — envia `password` real no createAdmin
- `frontend/src/views/manage.ts` — modal de serviço alinhado com o `-local`
- `docs/SETUP_GOOGLE_SHEETS.md` — schema/credenciais/OAuth
- Envs Vercel (fora do repo): `VITE_API_BASE_URL=/api` (corrigida), `VITE_GOOGLE_CLIENT_ID` (ok)