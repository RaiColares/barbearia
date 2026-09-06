# GUIA DE ESTUDO — Frontend Barbearia Maracá

Guia pessoal de estudo do frontend da SPA. Documenta **o que existe**, **como funciona** e **por que foi
feito assim**, com trechos de código e referências `arquivo:linha` para navegar no código.

> **Arquivo local de estudo** — não deve ser commitado (assim como `HISTORICO-FRONT-END.md`).
> Atualizado em: 05/09/2026 · Sessão 16: superusuário + dashboard admin + guia de estudo.

---

## 1. Visão geral

Frontend da Barbearia Maracá como **SPA (Single Page Application)** em **Vanilla TypeScript + HTML5 +
CSS3 nativo**, sem frameworks (sem React/Vue/Angular). Essa é uma exigência do PRD/AGENTS.md, não uma
escolha de gosto:

> "Vanilla TypeScript; HTML5; CSS3 nativo; SPA sem framework." — Guia de Agentes

### 1.1 Por que SPA sem framework?

- **Requisito do projeto**: a especificação define Vanilla TS. React/Vue/Angular/Tailwind/Bootstrap
  precisariam de aprovação externa.
- **Benefício didático**: entendemos o DOM, o ciclo de vida e o roteamento de verdade, sem abstração.
- **Custo que assumimos**: mais código manual para renderizar, limpar listeners e gerenciar estado
  (fazemos com o padrão `render + cleanup`).

### 1.2 Fluxo de dados simplificado

```
HTML (index.html) ──> main.ts (bootstrap) ──> router (hash routing) ──> views (render) ──> services (dados)
        │  cuida do tema, navbar, modais                                                            │
        └──────────────────────────────────────── ← returns cleanup() ←────────────────────────────┘
```

- As **views** renderizam `innerHTML` e devolvem uma função de **cleanup** (remove listeners).
- Os **services** são a camada de dados: hoje **mock/localStorage**, mas com ramos de API prontos
  para quando o backend existir.

### 1.3 Árvore de pastas (o mapa do "tudo")

```
frontend/
├── index.html            # shell: header/nav, <main id="app">, footer, modais genericos
├── package.json          # scripts dev/build/preview/typecheck
├── tsconfig.json         # modo estrito
├── public/assets/        # imagens (logos por tema, hero desktop/mobile, sobre)
├── css/                  # 10 arquivos de estilo (ver seção 11)
└── src/
    ├── main.ts           # bootstrap da SPA
    ├── router.ts         # hash router + âncoras + navegação
    ├── theme.ts          # tema light/dark
    ├── types.ts          # tipos de domínio (contrato interno)
    ├── config.ts         # CONFIG central (chaves, limites, demos)
    ├── vite-env.d.ts
    ├── data/             # mock.ts (todayIso) + seed.ts (dados demo)
    ├── features/         # navbar.ts (menu mobile) + bookingWizard.ts (agendamento)
    ├── pages/            # dashboard/home/login/servicos.py — LEGADO, não usado
    ├── services/         # camada de dados (api, auth, admins, usuarios, clientes, catalog, booking, schedule, googleAuth)
    ├── styles/main.css   # LEGADO/órfão — não linkado (ver pendências)
    ├── ui/               # dom, format, icons, mask, modal, toast, layout (painel)
    └── views/            # landing, login, loginCliente, minhaConta, manage, profissional, superusuario, placeholderPanel, privacidade, termos
```

> **Pendência documentada**: `src/pages/` e `src/styles/main.css` são sobras de versões antigas;
> `src/styles/main.css` não está linkado no `index.html` (paleta própria marrom/sépia).
> `src/data/mock.ts` só tem `todayIso()` — o "mock de API" de verdade vive nos `services/` via
> `isMockMode()`.

---

## 2. Inicialização — `src/main.ts`

`init()` roda nesta ordem (`main.ts:16-54`):

1. `ensureSeed()` — popula localStorage com dados demo, **somente se ausentes** (não sobrescreve).
2. `initTheme()` — aplica tema salvo (default escuro) e liga o toggle do header.
3. `initNavbar()` — configura o hamburger mobile do header público.
4. `initModals()` — conecta os modais estáticos do `index.html` (`[data-open-modal]`).
5. `registerRoute(...)` — registra as ~22 rotas.
6. `registerAnchor("inicio"|"servicos"|"sobre"|"contato")` — seções da landing para scroll.
7. `initRouter(appContainer)` — inicia o roteador sobre `<main id="app">`.

```ts
// main.ts:16-27 (simplificado)
function init(): void {
  ensureSeed();
  initTheme();
  initNavbar();
  initModals();
  registerRoute("/", renderLanding);
  registerRoute("/login", renderLogin);
  registerRoute("/admin", renderManage);          // várias rotas compartilham o mesmo render
  registerRoute("/superusuario", renderSuperusuario);
  ...
}
```

**Observação importante**: várias rotas **compartilham o mesmo render**. Ex.:
- `/admin`, `/admin/agendamentos`, ... → `renderManage` (que decide a aba pelo hash, `manage.ts:1444-1454`)
- `/minha-conta`, `/minha-conta/configuracoes` → `renderMinhaConta`

Isso simplifica: um painel = um render + abas controladas por hash.

**Bootstrap** (`main.ts:56-60`): se o documento ainda está carregando (`document.readyState ===
"loading"`) aguarda `DOMContentLoaded`; senão executa `init()` imediatamente.

---

## 3. Roteamento hash — `src/router.ts`

### 3.1 Por que hash router (`#/...`)?

- O app é servido como arquivos estáticos; **hash não exige configuração de servidor** (ou reescrita de
  URL) — ao contrário do History API (`pushState`), que precisaria de fallback em todo caminho.
- O hash **não recarrega a página**: a mudança dispara `hashchange` e o router troca o conteúdo.
- Vantagem extra: links de âncora (`#servicos`) e rotas convivem no mesmo mecanismo.

### 3.2 Como funciona

```ts
// router.ts:1-8
type RouteRender = (container: HTMLElement) => () => void;   // cada rota devolve cleanup
interface Route { path: string; render: RouteRender; }
```

Prioridade de matching em `handleRoute()` (`router.ts:50-85`):
1. **Rota exata** — se `window.location.hash.slice(1)` casa um `route.path` → chama `render`.
2. **Âncora** — se o hash é `inicio|servicos|sobre|contato` → `scrollToAnchor` (se não estiver na home,
   primeiro renderiza a home).
3. **Fallback** — qualquer hash desconhecido → renderiza a rota `/` (landing).

A cada troca de rota:
- executa o **cleanup da rota anterior** (`currentCleanup?.()`, `router.ts:58`);
- aplica a classe `view-enter` com **reflow forçado** para retriggar a animação de entrada
  (`void appContainer.offsetWidth`, `router.ts:61-62`);
- se era âncora, rola até a seção (compensando o header fixo, `scrollToAnchor` em `router.ts:28-34`);
- senão, vai para o topo (`scrollTo({top: 0, behavior: "smooth"})`).

### 3.3 Por que toda view devolve uma função de cleanup?

```ts
const cleanup = (): void => {
  form.removeEventListener("submit", handleLoginSubmit);   // ex.: login.ts:350-358
  ...
};
return cleanup;
```

Porque a SPA **não recarrega a página** entre rotas — se os listeners não fossem removidos, eles
acumulariam e causariam comportamento duplicado (duplo submit, toasts repetidos etc.). Esse é o padrão
central do app: **render → registro de listeners → retorna cleanup**.

---

## 4. Tema light/dark — `src/theme.ts`

- **Chave**: `localStorage["maraca.theme"]` = `"light" | "dark"` (`theme.ts:1`).
- **Aplicação**: alterna a classe **`body.light-theme`** (`theme.ts:33-37`); o `variables.css:57-71`
  define os overrides claro (bg/surface/border/text), mantendo o dourado e os vermelhos/verdes.
- **Default**: sem preferência salva → **escuro** (não segue `prefers-color-scheme`).
- **Logos por tema**: `logo-maraca.png` (escuro) e `logo-maraca-green.png` (claro), trocados em
  `syncLogoImages` via atributo `data-logo` (`theme.ts:23-31`). Usado tanto no header público quanto nos
  painéis dinâmicos (`layout.ts:101-102`, `bindThemeToggles`).
- **Toggles dinâmicos**: `bindThemeToggles(root)` liga os toggles que nascem depois (painéis).

```ts
// theme.ts:33-41
function applyTheme(light: boolean): void {
  document.body.classList.toggle("light-theme", light);
  syncToggleStates(light);
  syncLogoImages(document);
}
function saveTheme(light: boolean): void { localStorage.setItem(STORAGE_KEY, light ? "light" : "dark"); }
```

Por que na `<body>` e não em `<html>`? Porque vários arquivos CSS usam `body.light-theme` como
seletor-pai; isso também permite q o JS apenas toggle uma classe, sem re-escrever estilos inline.

---

## 5. Camada de dados mock — a estratégia

### 5.1 `config.ts` — a fonte de verdade das chaves

Todas as constantes de chaves/limites ficam centralizadas em `CONFIG` (`config.ts:1-29`):

```ts
useMockApi: true,                 // HOJE todo fluxo roda em mock
apiBaseUrl: "http://localhost:3000/api",   // base p/ quando virar API
sessionKey: "maraca.session",                // sessão (sessionStorage)
appointmentsKey: "maraca.v2.appointments",
servicesKey:  "maraca.v2.services",
professionalsKey: "maraca.v2.professionals",
adminsKey:    "maraca.v2.admins",
sessionTtlMs: 30 * 60 * 1000,     // sessão expira em 30 min
maxLoginAttempts: 5, lockoutMs: 30 * 1000,  // lockout após 5 tentativas por 30s
bookingHorizonDays: 45,           // só agenda até 45 dias à frente
defaultPassword: "123456",        // senha padrão ao criar profissionais
```

### 5.2 Por que mock de localStorage?

- O backend ainda não tem todos os endpoints (hoje só `health`, `servicos`, `auth/login` e fallback —
  `backend/src/server.ts`). Para a SPA funcionar completa, os `services/` gravam/leem **localStorage**.
- **Vantagem para demonstração**: fica tudo local, sem servidor, e os dados persistem no navegador.
- **Limite assumido**: é dado de demonstração (ex.: credenciais `maraca123`), **nunca** dado real.

### 5.3 O contrato de futuro: `api.ts`

`api.ts` é o núcleo HTTP que permite trocar mock por API **sem reescrever as views**:

```ts
// api.ts:3-36
export class ApiError extends Error { constructor(message: string, public readonly status = 0) {...} }
export const isMockMode = (): boolean => CONFIG.useMockApi;   // +true hoje = mock
export async function httpJson<T>(path, init = {}) {
  const response = await fetch(`${CONFIG.apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" }, ...init });
  if (!response.ok) throw new ApiError(..., response.status);
  return (await response.json()) as T;
}
```

Os services fazem:
```ts
if (isMockMode()) { await delay(700); ...localStorage... }   // ramo mock
else { return await httpJson<T>("/auth/login", { method: "POST", body: JSON.stringify(...) }); }  // ramo API
```

Ou seja: **a interface das views não muda**; basta alternar `useMockApi`. Isso é uma das decisões mais
importantes para explicar em apresentação (desacoplamento + preparação para integração).

### 5.4 `seed.ts` — dados de demonstração

`ensureSeed()` (`seed.ts:157-216`) cria, apenas se ausentes/vazios:
- 4 serviços (Corte 35/30min, Barba 25/30min, Corte+Barba 55/60min, Nail Designer 40/60min);
- 3 profissionais; 5 agendamentos; 1 cliente; 2 usuários internos (recepcionista + profissional);
- a lista de admins (via `listAdmins()`, que migra o admin legado).

> Não sobrescreve dados já existentes — comportamento idempotente e seguro para dev.

---

## 6. Serviços — `services/`

### 6.1 `api.ts`

Já coberto na 5.3. Exporta: `ApiError`, `delay`, `isMockMode`, `httpJson`.

### 6.2 `auth.ts` — sessão, papéis e login

**Papéis (`types.ts:3`)**: `"superusuario" | "admin" | "recepcionista" | "profissional" | "cliente"`.

**Redirect por papel** (`auth.ts:19-30`):
```ts
export const ROLE_REDIRECTS: Record<UserRole, string> = {
  superusuario: "/superusuario",
  admin: "/admin",
  recepcionista: "/recepcionista",
  profissional: "/profissional",
  cliente: "/minha-conta",
};
export function redirectForRole(role) { navigateTo(ROLE_REDIRECTS[role] ?? "/"); }
```

**Sessão** (`auth.ts:32-49`):
- `createToken()` — 32 bytes aleatórios via `crypto.getRandomValues` → hex 64 chars (mock).
- `persistSession()` — grava em **`sessionStorage`** (não sobrevive ao fechar a aba — intencional em
  ambiente mock; ver pendência 13.2).
- `getSession()` — valida `token` presente e `expiresAt > Date.now()`; expirada = remove e `null`.

**Guardas** (`auth.ts:262-283`): `requireSession()` e `requireRole(allowed)`.
```ts
export function requireRole(allowed: UserRole[]): Session {
  const session = getSession();
  if (!session) { navigateTo("/login"); throw new Error("Sessão expirada"); }
  if (!allowed.includes(session.role)) { redirectForRole(session.role); throw new Error("Acesso não autorizado"); }
  return session;
}
```
Cada painel chama `requireRole([...])` no início (ex.: `manage.ts:102`, `superusuario.ts:21`).

**Login interno — ordem de validação** (`auth.ts:140-181`): superusuário → admin → usuário interno.
```ts
const superAdmin = CONFIG.demoSuperAdmin;              // super@maraca.com / maraca123
if (norm === superAdmin.email && password === superAdmin.password) → role "superusuario"
const admin = validateAdminLogin(email, password);     // lista maraca.v2.admins → role "admin"
const usuario = validateUsuarioInterno(email, password); // profissionais/recepcionistas → role usuario.role
```

**Atualizar perfil** (`updateSessionUser`, `auth.ts:52-134`):
- admin → via `findAdminByEmail`/`updateAdmin` (lista de admins), com checagem de e-mail duplicado
  entre admins e usuários internos;
- demais internos → `updateUsuarioInterno`;
- API (ramo real) → `PATCH /auth/me`.

### 6.3 `admins.ts` — administradores (novo, superusuário)

**Interface** (`admins.ts:3-9`): `AdminProfile { id, nome, email, senha, createdAt }`.

**Migração automática** (`listAdmins`, `admins.ts:32-67`): antes o admin era **um único perfil demo**
em `maraca.v2.demoAdmin`. Agora é uma **lista** `maraca.v2.admins`. Ao primeiro acesso:
- se a lista existe → devolve;
- se não → migra o legado `maraca.v2.demoAdmin` (se válido) OU usa o seed `CONFIG.demoAdmin`
  (`admin@maraca.com` / `maraca123` / "Rai Colares");
- grava a lista e **remove** a chave legada.

```ts
export function validateAdminLogin(email, senha): AdminProfile | null { ... }   // admins.ts:74
export function createAdmin({nome,email,senha}): AdminProfile { ... }           // admins.ts:80
export function deleteAdmin(id): void { ... }                                   // admins.ts:108
export function isLastAdmin(): boolean { return listAdmins().length <= 1; }     // admins.ts:112
```

**Por que a proteção `isLastAdmin`?** Para impedir lockout: se o superusuário excluísse o último admin,
ninguém mais conseguiria entrar como administrador. A exclusão do último é bloqueada na view
(`superusuario.ts:98-101`).

### 6.4 `usuarios.ts` — usuários internos (profissional/recepcionista)

`UsuarioInterno { id, nome, email, senha, role: "profissional"|"recepcionista", professionalId?, createdAt }`
(`usuarios.ts:4-12`). CRUD em `maraca.v2.usuarios` + `roleLabel()` (`usuarios.ts:95-104`).

**Relação profissional ↔ usuário**: `professionalId` liga o perfil a um usuário de login; ao excluir um
profissional, o usuário vinculado também é removido (`manage.ts:1133-1148`, via `findByProfessionalId`).

### 6.5 `clientes.ts` — clientes

`Cliente { id, nome, email, telefone, senha, createdAt, googleId?, avatarUrl? }` (`types.ts:65-74`).
CRUD em `maraca.v2.clientes`. A checagem de duplicidade de e-mail no cadastro fica na view
(`loginCliente.ts:301-326`). Login Google usa `googleAuth.ts`, que chama `findClienteByEmail` e
`registerCliente`.

### 6.6 `catalog.ts` — serviços, profissionais e categorias

`loadServices`, `saveServices`, `loadProfessionals`, `saveProfessionals`, `loadCategories`,
`saveCategories` — leitura/escrita em `maraca.v2.*` via helpers genéricos `readList<T>(key)` /
`writeList<T>(key, list)` (`catalog.ts:6-19`). **Sem ramo de API** (ver tabela 6.10).

### 6.7 `booking.ts` — agendamentos

- **Código** (`booking.ts:50-63`): formato `LL-XXXXX` (2 letras + `-` + 5 alfanuméricos), letras sem
  I/L/O e números sem 0/1 **para evitar ambiguidade visual**; até 50 tentativas contra colisões,
  fallback `XX-<base36 do timestamp>`.
- **Conflito de horário** (`occupiedTimes`, `booking.ts:35-43`): retorna `Set<string>` de horários
  ocupados para a mesma data+profissional, ignorando os **cancelados**. A validação real ocorre na UI
  (wizard desabilita o slot, `bookingWizard.ts:233-256`) — em mock o `createAppointment` apenas
  persiste.
- **Status**: `confirmado | pendente | concluido | cancelado`. `setAppointmentStatus` grava direto.

### 6.8 `schedule.ts` — configuração da agenda

- `DaySchedule { open, start, end }`, `ScheduleConfig { weekly, blockedDates, exceptions }`
  (`schedule.ts:3-19`).
- **Slot de 30 minutos** (`SLOT_STEP_MIN = 30`); `slotsForDate` gera de `start` até `end` **inclusive**
  (`schedule.ts:132-153`).
- `isDateOpen` / `isDateBlocked` / `exceptionFor` — regras de dia aberto; exceções **sobrepõem** o
  semanal; datas bloqueadas negam tudo (`schedule.ts:112-129`).

### 6.9 `googleAuth.ts` — login com Google

- Carrega o script GIS dinamicamente (`loadGisScript`, `googleAuth.ts:37-55`).
- `promptGoogleIdToken` exige `VITE_GOOGLE_CLIENT_ID` no `config.googleClientId`.
- `decodeGoogleProfile` decodifica o JWT **sem validar assinatura** — a validação é responsabilidade do
  backend (`/auth/google`). (Decisão de segurança: o frontend não confia no token.)
- Mock: `mockGoogleLogin` cria/sessão cliente `cliente.google@maraca.com` sem servidor.

### 6.10 Tabela mock vs API por arquivo

| Arquivo | localStorage (mock) | Ramo `httpJson` (API) |
|---|---|---|
| `api.ts` | — | núcleo |
| `auth.ts` | `maraca.session`, listas | `POST /auth/login`, `PATCH /auth/me` |
| `admins.ts` | `maraca.v2.admins` | — (CRUD superuser 100% mock) |
| `usuarios.ts` | `maraca.v2.usuarios` | — |
| `clientes.ts` | `maraca.v2.clientes` | — |
| `catalog.ts` | services/professionals/categories | — |
| `booking.ts` | `maraca.v2.appointments` (leitura sempre local) | `POST /agendamentos`, `GET/PATCH /agendamentos/{code}`, `PATCH .../cancelar`, `PATCH .../reagendar` |
| `schedule.ts` | `maraca.v2.schedule` | — |
| `googleAuth.ts` | clientes + sessão | `POST /auth/google` |

> **Conclusão de estudo**: hoje `useMockApi = true` → **tudo rodando em mock**. Os ramos `httpJson`
> existem em auth/booking/googleAuth; admins/usuarios/clientes/catalog/schedule são 100% localStorage.
> Para integrar com backend real (fase futura), seria preciso adicionar ramos de API em catalog,
> usuarios, clientes, admins e schedule + rotas no backend + contratos em `shared/types`.

---

## 7. Tipos e Config

### 7.1 `types.ts` — o contrato interno do domínio

| Tipo | Campos (resumo) |
|---|---|
| `ServiceIcon` | `"scissors" \| "beard" \| "layers" \| "sparkle"` |
| `UserRole` | `"superusuario" \| "admin" \| "recepcionista" \| "profissional" \| "cliente"` |
| `Service` | `id, name, description, category, durationMin, price, icon, active` |
| `Professional` | `id, name, role, category, active, email?, userRole?, photoUrl?` |
| `AppointmentStatus` | `"confirmado" \| "pendente" \| "concluido" \| "cancelado"` |
| `Appointment` | `code, clientName, phone, email, serviceIds[], professionalId, dateIso, time, status, createdAt` |
| `AdminAppointment` | estende `Appointment` + `id`, `serviceName?` |
| `Session` | `token, userName, userEmail, expiresAt, role` |
| `Cliente` | `id, nome, email, telefone, senha, createdAt, googleId?, avatarUrl?` |

**Por que `serviceIds` (array)?** Uma das regras do agendamento é **múltiplos serviços** no mesmo
agendamento (ex.: Corte + Barba); o wizard implementa multi-seleção (`bookingWizard.ts:133-167`).

**TypeScript estrito**: `tsconfig.json` sem `strict=false`; o projeto evita `any` e casts inseguros.
Ex.: `$<HTMLButtonElement>("...")` é tipado.

### 7.2 `config.ts` — limites e demos (já detalhado na seção 5.1)

Valores-chave para defender na apresentação:
- `sessionTtlMs = 30 min` — expiração de sessão mock;
- `maxLoginAttempts = 5` e `lockoutMs = 30s` — trava 5 tentativas erradas por 30s;
- `bookingHorizonDays = 45` — horizonte máximo de agendamento;
- `defaultPassword = "123456"` — senha padrão dos profissionais criados no painel.

---

## 8. Biblioteca UI — `src/ui/`

### 8.1 `dom.ts`
`$`/`$$` (selectors tipados), `clearElement`, `escapeHtml` (**XSS — ver seção 12**), `initials` (avatar),
`setFieldError`/`clearFormErrors` (validação de formulário com `.field.has-error` + `aria-invalid`).

### 8.2 `icons.ts`
Mapa `BOXICON_MAP` liga nomes semânticos (`"edit"`, `"trash"`, `"users"`...) a ícones **Boxicons**
(`bx-*`). `icon(name, size)` devolve `<i class="bx ...">`, fallback `bx-error-circle`. **Por que
Boxicons?** CDN de ícones sem cuspir SVGs no código, casando com o "sem framework" do projeto.

### 8.3 `format.ts`
`formatCurrency` (pt-BR BRL via `Intl`), `parseIsoDate`/`toIsoDate` (local, **não UTC** — decisão de
timezone: o sistema usa a data local do navegador), formatos de data (`Long|Short|Medium|Relative` com
"Hoje/Ontem/Amanhã"), `isSameIsoDate`.

### 8.4 `mask.ts`
`maskPhone` → `(XX) XXXXX-XXXX` (11 dígitos com DDD), `maskBookingCode` (uppercase `A-Z0-9-`, max 8),
`attachUppercaseMask`. Útil: máscaras aplicadas no `input`, sem libs (decisão "CSS3/JS nativo").

### 8.5 `modal.ts` — sistema de overlays
- **Stack de overlays** `openOverlays[]` — suporta modal sobre modal.
- `openModal`/`closeModal`: adicionam `is-open`, **travam o scroll** do body (`has-open-modal`),
  guardam `lastFocused`, focam o primeiro elemento e **restauram o foco** ao fechar (acessibilidade).
- **ESC fecha** o topo (`modal.ts:69-79`) e dispara `modal:close`.
- **Trap de Tab** (`trapTab`) — o foco não escapa do modal (acessibilidade).
- `confirmDialog({title, message, confirmLabel?, danger?})` → `Promise<boolean>`; se `danger`, usa
  `btn--danger` no botão de confirmar. Usado nas exclusões (ex.: `superusuario.ts:86-101`).

### 8.6 `toast.ts`
`showToast(message, "success"|"error"|"info")` — usa `#toast-container` com `aria-live="polite"`,
some após 3200ms.

### 8.7 `layout.ts` — painel (sidebar)
- `renderPanel(container, { title, roleLabel, links })` constrói sidebar + topbar + `[data-panel-content]`
  (`layout.ts:34-171`).
- Liga **colapso**, **drawer mobile** (hamburger + backdrop), **link ativo por hash**, **theme toggle**
  dinâmico, **logos por tema** e **logout**.
- `body.panel-mode` esconde o header/footer público (`panel.css:1-3`).
- Key do colapso: `localStorage["maraca.panel.collapsed"]`.
- Cleanup remove `panel-mode` e todos os listeners.

---

## 9. Views por papel — `src/views/`

Cada view segue o padrão: `render(container)` → `requireRole(...)` (quando restrito) →
`container.innerHTML = \`...\`` → liga listeners (acumulando `cleanups`) → `return cleanup`.

### 9.1 Landing — `landing.ts` (público, sem login)
- Seções: hero (`#inicio`) com `<picture>` responsiva (desktop/mobile); **Serviços** (`#servicos`) —
  grid renderizado de `loadServices()` filtrando `active`; Sobre (`#sobre`); Contato (`#contato`) com
  Instagram/WhatsApp reais.
- Botão "Agendar": se `getSession()` existe → abre o wizard (`openNew(service.id)`); senão →
  `#/login-cliente` (`landing.ts:35-43`).
- **ScrollSpy** com `IntersectionObserver` destaca o link ativo da nav (`landing.ts:185-229`).

### 9.2 Login interno — `login.ts`
5 sub-views (`login | recover | recover-sent | reset | reset-done`) alternadas por `data-goto`
(`login.ts:8-23`). Validações: e-mail regex + senha ≥ 6. **Lockout**: 5 tentativas → 30s, com contagem
regressiva (`login.ts:42-59`, `209-226`). Esse é o login que direciona **por papel** (via
`redirectForRole`).

### 9.3 Login do Cliente — `loginCliente.ts`
4 sub-views. Cadastro valida: nome com espaço, e-mail regex + **sem duplicata**, telefone com DDD (11
dígitos), senha ≥ 8 com maiúscula e caractere especial, confirmação igual (`loginCliente.ts:296-326`).
Google: mock direto; real = `promptGoogleIdToken` → `decodeGoogleProfile` → `loginWithGoogle`
(`loginCliente.ts:241-285`).

### 9.4 Painel do Cliente — `minhaConta.ts` (`requireRole(["cliente"])`)
2 abas via hash:
- **Agendamentos**: dados filtrados por email da sessão (`listByEmail`), filtros por status/busca/
  período, ações **Reagendar** (abre wizard) e **Cancelar** (confirmDialog + `cancelAppointment`),
  botão "Novo agendamento".
- **Configurações**: avatar (foto em sessionStorage), nome, senha (atual+nova+confirmação), e-mail
  (exige senha atual).

### 9.5 Painel Admin/Recepcionista — `manage.ts` (1467 linhas)
`requireRole(["admin", "recepcionista"])`. **O mesmo painel, diferenças pelo papel**:

| Aspecto | Admin | Recepcionista |
|---|---|---|
| Base URL | `/admin` | `/recepcionista` |
| Abas | Dashboard, Agendamentos, Serviços, Profissionais, Config | (sem Dashboard) Agendamentos, Serviços, Profissionais, Config |
| Financeiro | dashboard com **faturamento** | **não acessa** |

**Dashboard (só admin)** (`manage.ts:150-420`):
- Filtros: **período** (`todos|ano|mes|periodo` com dates) + **profissional**;
- **KPIs** (`kpi-grid`, `manage.ts:347-357`): Total, Confirmados, Pendentes, Cancelados, **Faturamento**
  (soma dos não-cancelados) e **Profissional destaque do mês** (maior nº de concluídos; desempate pelo
  atendimento mais recente, `topProResult` `manage.ts:384-395`);
- Layout recente: **4 cards em cima; Faturamento + Destaque abaixo**, cada um em `span 2` ocupando a
  largura total (CSS `panel.css:334-343`);
- **Serviços mais vendidos** — top 3 por contagem.

**Agendamentos**: busca, filtro por status e período, **CONFIRMAR/Cancelar** com `confirmDialog`
(`manage.ts:571-592`), modal de detalhes ao clicar na linha, configuração global da **agenda**
(semanal por dia + bloqueadas + exceções).

**Serviços**: tabela + modal CRUD (valida nome ≥ 3, duração ≥ 10min, preço ≥ 0; nova categoria é
salva automaticamente).

**Profissionais**: cards com avatar (foto/iniciais), métricas do mês; ao criar, cria também o
`UsuarioInterno` com senha padrão ("123456"); ao excluir, remove o usuário vinculado.

**Configurações**: igual ao cliente (avatar/nome/senha/e-mail).

### 9.6 Painel do Profissional — `profissional.ts` (`requireRole(["profissional"])`)
- Vincula a sessão ao `professionalId` via lookup em `listUsuariosInternos` (`profissional.ts:45-48`).
- **Agendamentos SOMENTE LEITURA** filtrados pelo `professionalId` (sem coluna de Ações).
- Configurações idêntica, mas o **upload de foto também grava `Professional.photoUrl`** no catálogo
  (`profissional.ts:324-329`) — motivo: a foto do profissional aparece no dashboard "destaque do mês".

### 9.7 Painel do Superusuário — `superusuario.ts` (`requireRole(["superusuario"])`)
- **Menu único** "Lista de usuários" (mais "Voltar ao site").
- Lista os **administradores** (`maraca.v2.admins`) com avatar em iniciais, nome e e-mail.
- **Adicionar / Editar / Excluir**:
  - valida nome ≥ 3, e-mail regex, senha ≥ 6 (obrigatória ao criar, opcional ao editar = mantém);
  - impede e-mail **duplicado** entre admins e usuários internos
    (`superusuario.ts:190-199` via `findAdminByEmail` + `findUsuarioByEmail`);
  - impede excluir o **último admin** (`superusuario.ts:98-101`).

### 9.8 Institucionais — `privacidade.ts` / `termos.ts`
Texto estático, sem listeners; destroy/cleanup trivial.

---

## 10. Wizard de Agendamento — `src/features/bookingWizard.ts`

Modal de 3 passos, usado pela Landing ("Agendar"), Cliente ("Novo agendamento" / "Reagendar") e possui
callback `onBookingCreated` para refrescar listas.

> **Mudança da sessão 17**: o antigo passo 3 ("Seus dados") foi **removido** — quem agenda já está
> logado, então o nome/e-mail/telefone vêm do perfil (`getSession()` + `findClienteByEmail`). O passo de
> confirmação passou a ser o passo 3. Também foi corrigido o **scroll do modal**: o `.modal__body` é o
> único elemento rolável (`min-height: 0` no do `form` e no body), então listas grandes (serviços,
> profissionais, horários) rolam dentro do modal sem estourar a tela (`modals.css:22-26`,
> `90-109`).

### Estado (`bookingWizard.ts:16-23`)
```ts
interface WizardState {
  step: number;
  serviceIds: Set<string>;      // multi-serviço
  professionalId: string | null;
  dateIso: string | null;
  time: string | null;
  rescheduleCode: string | null; // null = novo; presente = reagendar
}
```

### Passo 1 — Serviços (`bookingWizard.ts:133-167`)
Multi-seleção com checkbox; recalcula total e re-renderiza o passo 2. Filtra `loadServices() → active`.

### Passo 2 — Profissional + Data + Hora (`bookingWizard.ts:178-271`)
- **Profissionais** filtrados por: ativos **e** categoria compatível com os serviços escolhidos
  (`bookingWizard.ts:181-183`).
- **Data**: min hoje, max hoje + `bookingHorizonDays` (45); `isDateOpen(value)` bloqueia datas
  fechadas; default primeira data aberta nos próximos 7 dias.
- **Horários**: `slotsForDate` (30 em 30 min) + `occupiedTimes` desabilita ocupados; se for hoje,
  horários passados também são desabilitados.
- Este é o passo de **submissão**: o botão "Confirmar agendamento" (validado no `validateStep(2)`).

### Passo 3 — Confirmação/resumo (`bookingWizard.ts:352-420`)
- **Dados do cliente vêm da sessão/perfil** (`getSession()` + `findClienteByEmail`): nome, e-mail e
  telefone; telefone ausente aparece como "—".
- Monta `BookingDraft` e: se `rescheduleCode` → `rescheduleAppointment` (só envia
  profissional/data/hora); senão `createAppointment`.
- Em mock, `booking.ts` gera o código e persiste com status `"pendente"`.

### Regras de negócio que vivem no cliente (atenção para defender)
1. **Conflito de horário**: mesmo profissional + data, status ≠ cancelado → slot desabilitado.
2. **Horizonte**: não agenda além de 45 dias.
3. **Profissional-categoria**: o profissional só aparece se a categoria dele casa com o serviço.
4. **Cancelados são "liberados"** no horário (não geram conflito).
5. **Dados do agendamento** nunca são pedidos no fluxo: o cliente está logado e o wizard usa o perfil.

> Lembrete de segurança (seção 12): em backend real, essas regras **devem ser revalidadas no servidor**;
> o front só as aplica para UX. O mock não impõe no `createAppointment`.

---

## 11. CSS — arquitetura e tokens

### 11.1 Arquivos e responsabilidades

| Arquivo | Linhas | Cobre |
|---|---|---|
| `variables.css` | 71 | tokens de design + tema claro |
| `base.css` | 206 | reset + base |
| `components.css` | 531 | botões, fields, avatares, componentes reuso |
| `landing.css` | 835 | header público + landing |
| `modals.css` | 724 | overlay/modal + wizard |
| `auth.css` | 345 | telas de login |
| `panel.css` | 465 | painel (sidebar, topbar, drawer, KPIs) |
| `account.css` | 75 | área do cliente |
| `admin.css` | 142 | cards administrativos (legado/pouco usado) |
| `manage.css` | 606 | painel compartilhado + superuser |

### 11.2 Design tokens (`variables.css:1-55`)
- **Espaço**: `--space-1..9` = 4,8,12,16,24,32,48,64,96px.
- **Cores (dark default)**: bg `#121214`, surface `#1e1e22`, borda `#2d2d35`, **dourado** `#d4af37`
  (marca), success `#2e7d32`, danger `#d32f2f`, texto `#f4f4f5`.
- **Tema claro** (`body.light-theme`, `variables.css:57-71`): refaz bg/surface/borda/texto; dourado e
  semânticos permanecem.

### 11.3 BEM e "sem framework"
Classes seguem **BEM** (`.btn--primary`, `.panel__sidebar`, `.kpi-card__value`). Daí o motivo de olhar
CSS e TS separadamente: o CSS é 100% nativo, agrupado por camada, e o TS nunca injeta estilos inline
(exceto ícones `font-size` de `icon()`).

### 11.4 Responsivo e layouts que mudaram
- `panel.css` media queries: `≤768px` — sidebar vira **drawer** com backdrop; `≤480px` — grid de KPIs
  vira 1 coluna.
- `kpi-grid` (dashboard): desktop 4 colunas + cards 5/6 em `span 2` (Faturamento e Destaque) — a
  mudança da sessão 16.

---

## 12. Segurança — o que defendemos e o que delegamos

| Princípio | Onde | Detalhe |
|---|---|---|
| **Escapar HTML** | `escapeHtml` em toda saída dinâmica | Previne **XSS** em nomes digitados pelo usuário (ex.: `manage.ts:894`) |
| **Entrada externa não confiável** | view → validação client-side | Validação existe para **UX**, não é segurança |
| **Autorização real no servidor** | backend (fase real) | "O frontend representa fluxo e navegação, não segurança real" (AGENTS.md) |
| **Não confiar no papel/ID/preço** | princípio | Quando a API vier, o backend valida de novo |
| **Senhas em texto no mock** | `maraca.v2.*` | São credenciais **demo** documentadas no README; em produção, só hash (backend) |
| **Token Google não validado no frontend** | `googleAuth.ts:95-117` | Decodifica para UX; validação é do backend (`/auth/google`) |
| **Lockout client-side** | `login.ts` | Mock; no real deve existir no servidor |

---

## 13. Pendências conhecidas (para citar com honestidade)

1. **`src/pages/` e `src/styles/main.css` são legado/órfãos** — não participam do build ativo
   (`styles/main.css` não linkado no `index.html`). Limpeza futura.
2. **`CONFIG.sessionKey = "maraca.session"` mas gravada em `sessionStorage`** (não localStorage):
   sessão não persiste entre abas/fechar navegador — comportamento intencional em mock, mas vale
   confirmar o contrato com backend.
3. **Backend não tem as rotas do frontend**: hoje só `health`, `servicos`, `auth/login`; não existem
   `PATCH /auth/me`, CRUD de administradores, profissionais etc. Contratos não alinhados em
   `shared/types` (arquivo vazio).
4. **Papel "superusuário" não existe na documentação aprovada** (DER prevê apenas barbeiro,
   recepcionista, administrador). Implementado a pedido do responsável humano, como **proposta/
   pendência** a validar com backend/banco em `shared/types`.
5. **Login Google depende de `VITE_GOOGLE_CLIENT_ID`** — sem isso, o botão só funciona em mock.
6. **`seed.ts` e `config.ts` contêm nomes pessoais demo** ("Rai Colares") — recomendação: anonimizar
   antes de handoff.

---

## 14. Roteiro de defesa — perguntas prováveis do professor

1. **"Por que vanilla e não React?"**
   → Requisito do PRD/AGENTS.md. E a escolha foi consciente: DOM manual + padrão `render + cleanup` +
   hash router. Mostra domínio de fundamentos.

2. **"Como funciona o roteamento sem framework?"**
   → Hash router (`router.ts`): `hashchange` → casa rota/âncora/fallback → chama `render`, executa
   cleanup da anterior e aplica `view-enter`. `navigateTo("#/...")` só seta `window.location.hash`.

3. **"Onde ficam os dados?"**
   → Mock em `localStorage` (`maraca.v2.*`), populados por `seed.ts`. Os `services/` têm ramos de API
   (`isMockMode()`/`httpJson`) que só ativam quando `useMockApi=false`. Tabela mock vs API na seção 6.10.

4. **"Como você controla acesso por papel?"**
   → Sessão em `sessionStorage` (`Session` com `role`), `ROLE_REDIRECTS` e `requireRole([...])` no topo
   de cada painel. **Ressalva**: é UX de navegação; autorização real será no backend.

5. **"Como evita conflito de agendamento?"**
   → No cliente: `occupiedTimes(dateIso, professionalId)` desabilita slots (exceto cancelados); slots de
   30min (schedule), aberto ≤ 45 dias. A regra definitiva deve ser revalidada no backend.

6. **"E o superusuário? Ele não está na documentação."**
   → Foi implementado a pedido do dono do projeto como proposta; lista de admins com migração do antigo
   perfil único; proteção "não excluir o último admin" evita lockout; pendência registrada para
   contrato/backend.

7. **"Por que senha em texto no localStorage?"**
   → Credenciais **demo/mock** para demonstração (README); em produção as senhas vivem como hash no
   backend. No mock não existe backend completo.

8. **"Como o tema/claro é persistido?"**
   → `maraca.theme` no localStorage; classe `body.light-theme` redefine as variáveis CSS; logos trocam
   por `data-logo`.

---

## 15. Glossário

| Termo | Significado |
|---|---|
| **SPA** | Single Page Application — uma página; a navegação troca conteúdo via JS. |
| **Hash router** | Roteador baseado em `#/caminho`; não precisa de config no servidor. |
| **RBAC** | Role-Based Access Control — acesso por papel (`requireRole`). |
| **BEM** | Metodologia de classe CSS (Bloco__Elemento--Modificador). |
| **Boxicons** | Biblioteca de ícones via CSS (`bx-*`). |
| **IntersectionObserver** | API do browser p/ detectar visibilidade (scrollspy da nav). |
| **XSS** | Cross-Site Scripting — mitigado com `escapeHtml`. |
| **Cleanup pattern** | Toda rota/componente devolve função que desfaz listeners. |
| **Mock** | Simulação de backend em localStorage com latência (`delay`). |
| **JWT** | JSON Web Token — no Google login, decodificado no front, validado no backend. |
| **CSP / tokens** | — (não aplicado ainda; citar backend). |

---

*Fim do guia. Revise com o código aberto: cada seção referencia `arquivo:linha` para localizar na hora
da apresentação.*