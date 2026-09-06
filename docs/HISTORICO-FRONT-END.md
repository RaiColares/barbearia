# 📜 HISTÓRICO DO TRABALHO DE FRONT-END — Barbearia Maracá

> ⚠️ **ARQUIVO PESSOAL — NÃO COMMITAR**
> Documento interno do Rai Colares para situar sessões futuras de trabalho.
> Adicionado ao `.git/info/exclude` (ignore local, sem tocar no .gitignore do time).
> Criado em: 22/08/2026 · Sessão de referência: entrega do formulário de login
> Atualizado em: 22/08/2026 (noite) · Sessão 2: entrega da página inicial estática
> Atualizado em: 25/08/2026 · Sessão 4: migração frontend SPA + prompts IA + push novo repo + doc explicativo
> Atualizado em: 27/08/2026 · Sessão 5: correção de escopo — exclui 3 branches e publica só `.opencode/` (card S1-02) numa branch única
> Atualizado em: 27/08/2026 · Sessão 5 (complemento): adiciona guia de workflow para os próximos commits
> Atualizado em: 30/08/2026 · Sessão 6: SPA frontend no `tahlly` (branch `feat/router-spa`) + fixes visuais/âncoras + README reescrito + PR
> Atualizado em: 01/09/2026 · Sessão 7: Área do Cliente + Dashboard Admin + autenticação por papel (mock/localStorage) + skeletons Profissional/Recepcionista
> Atualizado em: 02/09/2026 · Sessão 8: painel compartilhado Admin+Recepcionista (`manage.ts`) + fix navegação por abas + sidebar recolhível + logo verde no modo claro + servidor dev persistente (`setsid`)
> Atualizado em: 03/09/2026 · Sessão 10: painel do Profissional + sidebar fixa (desktop) + hamburger/drawer (mobile) + "Voltar ao site"
> Atualizado em: 05/09/2026 · Sessão 18: ajustes no menu mobile — CTA de agendamento (legibilidade/quebra) + toggle de tema claro/escuro no drawer + commit/push na branch da PR #41

---

## 1. Snapshot do ambiente

| Item | Valor |
|---|---|
| Repositório do time | `github.com/pollyanasousa/barbearia-maraca` (**público**) |
| Dona do repo | `pollyanasousa` (Pollyana) |
| Colaboradores ativos | `AngeloSouza1` (back-end), `r90ur7` (tooling/husky), `RaiColares` (front — eu) |
| Minha conta Git | `Rai Colares <jrcolares2012@gmail.com>` · SSH key `~/.ssh/id_ed25519` |
| Branch padrão | `main` (só setup/docs) |
| Branch de integração | `develop` ← **onde o trabalho acontece** |
| Minhas branches | `feat/tela-login` (2 commits, inclui fix do X) · `feat/tela-inicial` (1 commit) — PRs prontas p/ abrir, nenhuma mergeada |
| Clone local do time | `~/barbearia-maraca` (após sessão 2: na `feat/tela-inicial`) |
| Projeto completo meu | `~/barbearia-maraca-local` (intacto + `barbearia-maraca.rar` backup) |
| E-book de estudo | `~/barbearia-maraca-local/EBOOK-FRONT-END.md` (não está no repo do time) |

---

## 2. Linha do tempo da sessão (21–22/08/2026)

1. **Pedido da equipe:** subir *apenas a tela/formulário de login* no repo do time — versão **estática** (HTML+CSS, sem JavaScript), abrindo PR com base na `develop`.
2. **Tentativa de clone errada:** clonamos `RaiColares/barbearia-maraca` → *"Repository not found"*. Para liberar o nome, o projeto local foi renomeado para `~/barbearia-maraca-local` (`mv` — nada foi perdido).
3. **Diagnóstico:** consulta à API pública do GitHub revelou que o repo real é `pollyanasousa/barbearia-maraca` (público, criado 16/08, push diário). Mistério resolvido: caminho errado, não falta de acesso.
4. **Auditoria remota:** `main` tem tooling (Husky/Prettier/Commitlint); `develop` tem o back-end integrado (Node/TS/Postgres por AngeloSouza1) e a pasta `frontend/` contendo **apenas `.gitkeep`** — placeholder esperando exatamente esta entrega.
5. **Execução da entrega** (detalhes na seção 3).
6. **Link da PR gerado** com título/descrição pré-preenchidos (`quick_pull=1`). ⚠️ Status da PR **não confirmado**: cabe verificar amanhã se foi aberta/revisada/mesclada.
7. **Paralelo (fora do repo do time):** geração do e-book `EBOOK-FRONT-END.md` + 2 correções **somente no projeto local** (ver seção 5).

---

## 3. A entrega: primeiro commit de front no repositório do time

| Campo | Valor exato |
|---|---|
| **Branch** | `feat/tela-login` (criada de `origin/develop`: `git switch -c feat/tela-login origin/develop`) |
| **Commit** | `e23de2e` |
| **Mensagem** | `feat(front): adiciona formulário de login estático da área administrativa` |
| **Corpo do commit** | Descreve versão estática preenchendo o placeholder `frontend/`; lista os arquivos; avisa que validação/bloqueio/integração HTTP ficam para próximas PRs |
| **Estatística** | 6 arquivos · 977 inserções |
| **Push** | `git push -u origin feat/tela-login` ✅ (branch visível no remoto, confirmado via API) |
| **PR** | Link pronto: `github.com/pollyanasousa/barbearia-maraca/compare/develop...feat/tela-login?quick_pull=1` — **abertura manual pendente/confirmação pendente** |

### Arquivos enviados (todos sob `frontend/`)

| Arquivo | Origem | O que é |
|---|---|---|
| `login.html` | adaptado de `~/barbearia-maraca-local/frontend/login.html` | Cartão do formulário: escudo + "Acesso Restrito", campos Email/Senha, olho decorativo, botão ENTRAR, div `.alert` oculta |
| `css/variables.css` | cópia fiel | Tokens do design system (`:root`) |
| `css/base.css` | cópia fiel | Reset global + utilitários + keyframes |
| `css/components.css` | cópia fiel | btn/field/badge/alert/input-wrap |
| `css/auth.css` | cópia fiel | Estilos específicos da tela de login |
| `README.md` | novo | Escopo estático, como visualizar, contrato `POST /login-barbeiro` |

### Adaptações feitas no `login.html` (importante lembrar)

- ❌ Removidas as 4 telas de recuperar/enviado/redefinir/concluído
- ❌ Removido `<script type="module" src="js/features/login.js">`
- ❌ Removidos botão X (→ index.html) e link "Esqueceu a senha?" (destinos inexistentes no repo) — *o botão X foi REINTEGRADO na sessão 3, ver seção 8*
- ✅ **Removido o atributo `hidden` do cartão** — sem JS para exibi-lo, a página ficaria em branco
- ✅ Mantida a div `.alert` oculta (documenta onde erros aparecerão na integração)
- Dependências externas mantidas via CDN: Boxicons 2.1.4 + Google Fonts Inter

### Tecnologia usada na entrega

- HTML5 semântico + CSS3 puro (design system próprio) — **sem JavaScript por decisão da equipe**
- Git via SSH (`git@github.com:pollyanasousa/barbearia-maraca.git`)
- Verificação local: `python3 -m http.server` + `curl` (HTTP 200 nos 6 arquivos)

---

## 4. Padrões do time descobertos (respeitar nas próximas contribuições)

- **Conventional Commits pt-BR**, estilo visto no histórico: `feat(back): …`, `fix(db): …`, `docs: …`, `chore: …`
- **Husky + Commitlint + Prettier + lint-staged** configurados na branch `main` (por `r90ur7`) — a `develop` **não tem package.json/hooks na raiz**, então nesta entrega não houve validação client-side; a mensagem seguiu o padrão mesmo assim
- Back-end já expõe: `POST /login-barbeiro` `{email, senha}` → `200 {token}` / `401 CREDENCIAIS_INVALIDAS` (JWT, bcrypt, Postgres — US01-US03 + US12)
- Issue #1 aberta rastreia o épico do back-end
- **Quem abre PRs e faz merge é o Angelo (back-end)** (esclarecido em 23/08/2026): o front apenas sobe a branch `feat/*` no remoto e avisa. O Angelo integra primeiro **na branch DELE** (front+back juntas) e só depois vai para a `develop`. Materiais de PR (link compare, título, descrição) continuam sendo preparados pelo front para facilitar o trabalho dele

---

## 5. Correções paralelas (SOMENTE no projeto local `~/barbearia-maraca-local`)

Estas mudanças **não foram enviadas ao repo do time** — virarão futura(s) PR(s) se/quando decidirmos:

1. **`index.html` restaurado na raiz do `frontend/`** — existia só em `src/index.html` e o site dava 404; corrigido copiando a cópia de volta para a raiz
2. **`landing.css` regras órfãs consolidadas** — propriedades da pílula `.service-card__duration` (linhas ~398-408) estavam fora de qualquer seletor; fundidas no bloco correto (balanceamento de chaves verificado)
3. **E-book gerado:** `EBOOK-FRONT-END.md` na raiz do projeto local (guia de defesa p/ banca Alpha EdTech, 6 capítulos, âncoras validadas)

---

## 6. Pendências / próximos passos (checklist atualizado na sessão 2)

- [ ] **Avisar o Angelo para integrar as duas branches** — *correção da sessão 4 (23/08/2026): quem abre as PRs é o Angelo (back-end)*; ele mescla primeiro **na branch DELE** (front+back) e depois vai pra develop. Repassar a ele os materiais prontos (links/títulos/descrições: login em **8.2**, landing em **7.5**)
- [ ] Avisar o time que o **merge do login não aconteceu** (colega do back achou que tinha sido mergeada; ver seção 7.2 — o próprio Rai confirmou no git)
- [ ] Acompanhar a integração **pelo Angelo** (branch dele → develop) — ordem de integração das duas branches **tanto faz** (CSS compartilhados idênticos mesclam sem conflito); os links cruzados X↔rodapé só funcionam quando AMBAS chegarem na develop
- [ ] **Enviar o documento das 2 telas ao Trello** (Polly) — pronto em `~/barbearia-maraca-local/TRELLO-FRONT-END.md` (3 blocos: contexto, login, index)
- [ ] **Kit de agentes genéricos criado** em `~/barbearia-maraca-local/opencode-agentes-kit/` (templates arquiteto/desenvolvedor/uiux/code-reviewer + README com guia de uso/aprimoramento/criação — para projetos futuros; preencher os `[PLACEHOLDERS]` ao instalar num projeto novo)
- **Ferramenta permanente**: conversor Markdown→PDF em `~/barbearia-maraca-local/ferramentas/md2pdf.sh` (venv próprio auto-instalado na 1ª execução; WeasyPrint sem sudo/Chromium; **remove emojis por padrão** — `--manter-emojis` desativa; uso: `./md2pdf.sh arquivo.md [saida.pdf]`; estilo editável em `pdf-style.css`). Origem: sistema sem pandoc/wkhtmltopdf/sudo — PEP 668 contornado com venv `--without-pip` + get-pip.py
- [ ] Futuro: PR com lógica completa do login (validação, bloqueio, `auth.ts` → `/login-barbeiro`)
- [ ] Futuro: PR com wizard de agendamento em JS (aí remover o comentário do grid estático e restaurar o `#services-grid` dinâmico) + menu mobile funcional
- [ ] Futuro: levar as correções locais (seção 5) para o repo do time
- [ ] Integrar demais telas conforme cronograma do curso

## 7. Sessão 2 (22/08/2026, noite): segunda entrega — página inicial estática

### 7.1 Contexto e decisão

O time pediu a `index.html` (landing pública) também como PR. Decisões tomadas nesta sessão:

1. **Serviços:** hardcodar 4 cards no HTML (grid é populado por JS/localStorage no projeto completo — ficaria vazio). Corte Masculino usa dado real do `povoamento.sql` (30min R$35); os outros 3 são ilustrativos.
2. **Modais:** manter os 3 modais ocultos no HTML + `modals.css` (sem JS eles ficam invisíveis por padrão — `.modal-overlay { opacity:0; pointer-events:none }`, seguro). Mesmo espírito do `.alert` oculto do login.
3. **Estratégia:** subir só a landing agora, baseada na `origin/develop` de hoje.

### 7.2 ⚠️ Desmentido importante: o "merge" do login NÃO aconteceu

O colega do back avisou que a tela de login já tinha sido mergeada. **Verifiquei e é falso**:

- API do GitHub: única PR existente é a **#1 do back-end** (`feat/implementacao-login` → `main`), aberta e **não mesclada**
- `git ls-tree origin/develop frontend/` → só `.gitkeep`; `login.html` não existe na develop
- O que houve: o back só fez push novo na branch dele (`6d5edcb..5bc9709`)
- **Lição:** merge por squash muda o SHA — o teste definitivo nunca é o SHA do commit, é verificar se os ARQUIVOS existem na branch (`git ls-tree` / `git show branch:caminho`)

### 7.3 A entrega

| Campo | Valor exato |
|---|---|
| **Branch** | `feat/tela-inicial` (criada de `origin/develop`: `git switch -c feat/tela-inicial origin/develop`) |
| **Commit** | `f7eb808` |
| **Mensagem** | `feat(front): adiciona página inicial estática (landing)` |
| **Estatística** | 11 arquivos · 2.534 inserções |
| **Push** | `git push -u origin feat/tela-inicial` ✅ confirmado |
| **PR** | **Não aberta ainda** — link pronto com título/descrição (ver 7.5) |

### 7.4 Arquivos enviados (todos sob `frontend/`) e adaptações

| Arquivo | Origem |
|---|---|
| `index.html` | adaptado do local (ver adaptações abaixo) |
| `css/landing.css` | cópia fiel (745 linhas, já contém fix das regras órfãs do `.service-card__duration`) |
| `css/modals.css` | cópia fiel (698 linhas) |
| `css/variables.css` `base.css` `components.css` | cópias **byte-idênticas** às já existentes na `feat/tela-login` (verificado com `diff -q`) |
| `assets/*.jpg/png` (5) | cópias fiéis — logo + hero desktop/mobile + sobre desktop/mobile (~1,3 MB total) |

Adaptações no `index.html`:

- ❌ Removido `<script type="module" src="js/features/main.js">`
- ✅ `<div id="services-grid">` vazio → **4 cards hardcoded** seguindo o markup exato gerado pelo `main.js` (`service-card__head/desc/footer`): Corte Masculino 30min R$35 · Barba Completa 30min R$25 · Corte+Barba 60min R$55 · Nail Designer 60min R$40
- ✅ Comentário HTML no grid marcando que na integração JS ele volta a ser dinâmico
- ✅ Modais mantidos ocultos + atributos `data-open-modal` decorativos; footer year fixo (`2026`)
- ✅ Rodapé mantém link → `login.html` (dará 404 até a PR do login mergear — avisado na descrição)

### 7.4.1 Truque técnico: CSS compartilhado nas duas branches

Os 3 CSS base foram incluídos **idênticos** nesta branch para a landing ser autossuficiente (na develop eles não existem — só entram pela PR do login). Git mescla adições de conteúdo idêntico **sem conflito**: quem mergear primeiro absorve os arquivos e a outra PR para de exibi-los no diff. Por isso a ordem de merge das duas PRs é irrelevante. Por causa disso, **não mexi no `frontend/README.md` nesta PR** (ele só existe na `feat/tela-login`; mexer geraria conflito de duas adições diferentes).

### 7.5 PR pronta para abrir (copiar/colar)

Link: `https://github.com/pollyanasousa/barbearia-maraca/compare/develop...feat/tela-inicial?quick_pull=1`

Título:
```
feat(front): adiciona página inicial estática (landing)
```

Descrição:
```markdown
## O que esta PR entrega

Versão **estática** (HTML+CSS, sem JavaScript) da página inicial do site público,
dando sequência ao padrão da PR do login.

### Inclui
- `index.html` — hero responsivo (picture desktop/mobile), seções Serviços, Sobre e
  Contato, footer com link para o acesso administrativo
- Cards de serviço fixos no HTML — dados ilustrativos (Corte Masculino 30min R$35
  conforme `database/povoamento.sql`; demais valores demonstrativos)
- Modais de agendamento/acompanhamento mantidos ocultos (invisíveis por CSS sem JS),
  documentando onde entrará a lógica nas próximas PRs
- `css/landing.css` e `css/modals.css` novos + `assets/` (logo e fotos, ~1,3 MB)

### Nota técnica
`variables/base/components.css` estão incluídas **idênticas** às da branch
`feat/tela-login` para tornar esta página autossuficiente. Adições idênticas
mesclam sem conflito — a PR que mergear primeiro "absorve" os arquivos e a outra
para de exibi-los no diff.

### Fora do escopo (próximas PRs)
Menu mobile funcional, wizard de agendamento via JS, integração com a API.
```

### 7.6 Verificação executada

`python3 -m http.server 8099 --directory frontend` + `curl` → **11/11 arquivos com HTTP 200**; `grep "<script"` → 0 ocorrências.

## 8. Sessão 3 (22/08/2026, noite): fix do botão fechar + preparo final das PRs

### 8.1 O que aconteceu

1. Rai checou o git e **confirmou por conta própria** que o merge do login não ocorreu (ver 7.2)
2. Decisão: abrir as **duas** PRs por precaução
3. Rai notou que o login entregue está **sem o botão de fechar**; comportamento esperado: fechar → voltar para a home

### 8.2 Diagnóstico e fix

- O X havia sido removido na adaptação da sessão 1 porque `index.html` não existia no repo
- No protótipo local ele é um **link puro, sem JS**: `<a href="index.html" class="auth__close" aria-label="Fechar e voltar ao site"><i class='bx bx-x'></i></a>`
- Bônus: o CSS `.auth__close` **já estava no repo** (em `auth.css` linhas 34–52, subiu junto na entrega de ontem) — o fix foi só HTML
- **Commit:** `bb41f98` · `feat(front): adiciona botão de fechar com retorno à página inicial` (+3 linhas em `frontend/login.html`) — inserido como primeiro filho de `.auth__box`, antes do escudo
- **Push ✅** em `origin/feat/tela-login`; verificação local HTTP 200
- Dependência cruzada temporária: X → `index.html` dá 404 até a PR da landing mergear (nota incluída na descrição)

### 8.3 Estado das duas PRs (abrir manualmente — `gh` não instalado)

> ⚠️ **Correção (23/08/2026, sessão 4)**: o entendimento da época era que o Rai abriria as PRs manualmente. Fluxo real acordado com o time: **o Angelo (back-end) abre as PRs e faz os merges** — primeiro integrando na branch DELE (front+back juntas), depois para a `develop`. Os materiais abaixo continuam úteis para repassar a ele.

| PR | Link (`https://github.com/pollyanasousa/barbearia-maraca/compare/...`) | Título |
|---|---|---|
| Login | `develop...feat/tela-login?quick_pull=1` | `feat(front): adiciona formulário de login estático da área administrativa` |
| Landing | `develop...feat/tela-inicial?quick_pull=1` | `feat(front): adiciona página inicial estática (landing)` |

Descrição da PR do login **ATUALIZADA** (substitui a referência antiga da seção 3):

```markdown
## O que esta PR entrega

Formulário de acesso da área administrativa em versão estática (HTML+CSS,
sem JavaScript), preenchendo o placeholder frontend/.

### Inclui
- `login.html` — cartão com escudo + "Acesso Restrito", campos Email/Senha,
  botão ENTRAR, div .alert oculta (pronta p/ mensagens de erro) e botão X
  que retorna à página inicial (`index.html`, em aberto na feat/tela-inicial)
- Design system completo: css/variables.css, base.css, components.css e auth.css
- README do frontend descrevendo escopo e contrato esperado

### Nota de dependência
Enquanto a PR da página inicial (feat/tela-inicial) não for mesclada, o botão X
aponta temporariamente para um arquivo inexistente (404 esperado).

### Contrato esperado do back-end (US02/US03)

POST /login-barbeiro {email, senha} → 200 {token} | 401 CREDENCIAIS_INVALIDAS

### Fora do escopo (próximas PRs)
Validação client-side, bloqueio por tentativas, fluxos de senha, integração HTTP.
```

A descrição da PR da landing segue pronta na **seção 7.5**. Ordens de merge tanto faz.

## 9. Workflow permanente: conferir o visual ANTES de subir (decisão da sessão 3)

A partir de agora, **toda entrega** segue esta ordem:

> branch → arquivos → validação `curl` → **preview via `git worktree` para aprovação visual do Rai** → commit/push/PR → **documento explicativo para o Trello (Polly)**

### 📌 Regra do documento Trello (decisão da sessão 3)

**Sempre que subirmos arquivo(s) novo(s) pro GitHub, é obrigatório gerar um documento
explicando a funcionalidade do que foi feito**, pra Polly gerenciar no Trello.

- Modelo/localização: `~/barbearia-maraca-local/TRELLO-FRONT-END.md` (primeiro exemplar:
  blocos Contexto&Entregas / Login / Index)
- Formato combinado: **blocos independentes por tema/tela**, prontos pra colar em cards separados
- O documento é entregue como texto no chat (copiar/colar no Trello) + cópia salva no projeto local

Comandos de preview (não alteram a branch atual, o VSCode nem o GitHub — nada é enviado):

```bash
# criar pasta de consulta apontando para a branch
git worktree add /tmp/opencode/preview-NOME feat/NOME-DA-BRANCH

# servir e visualizar em http://localhost:8080
python3 -m http.server 8080 --directory /tmp/opencode/preview-NOME/frontend

# ao terminar, limpar tudo:
kill %1
git worktree remove /tmp/opencode/preview-NOME
```

Garantias: zero efeito no repositório do GitHub (nem commit nem push); a pasta é apenas uma "cópia de consulta" da branch; remoção não deixa rastro.

### Decisão registrada na mesma conversa — menu hamburger da landing

- **Mantido decorativo** nesta entrega estática; comportamento completo entra na futura PR de integração JS (`initNavbar`: fechar ao clicar em link, `aria-expanded` dinâmico)
- Opção **CSS puro** foi avaliada e descartada por ora (fica documentada pra não re-pesquisar): checkbox invisível dentro de um `<label>` no lugar do botão, reaproveitando a classe `.visually-hidden` (já existe no `base.css`) + seletores `:has()` replicando as regras `.is-open` existentes no `landing.css`
  - ✅ Visual 100% idêntico · teclado funciona (Tab/Enter) · sem JS
  - ❌ Menu não fecha ao clicar num link âncora (única limitação relevante) · `aria-expanded` estático
- Nesta conversa **nada foi commitado ou enviado ao GitHub**

## 10. Referência rápida de comandos

```bash
cd ~/barbearia-maraca                     # clone do time
git status && git log --oneline -5        # estado atual (branch feat/tela-inicial)
git switch develop && git pull            # sincronizar integração
git ls-tree origin/develop frontend/      # checar o que REALMENTE existe na develop
python3 -m http.server 8080 --directory frontend   # servir e conferir as entregas
cd ~/barbearia-maraca-local               # meu projeto completo (intocado)
```

## 11. Sessão 4 (25/08/2026): Migração completa frontend SPA + Prompts de Agentes IA

### 11.1 Contexto

Migração do código completo do projeto local (`~/barbearia-maraca-local`) para o novo repo (`tahlly/barbearia-maraca`) como SPA Vanilla TypeScript com hash routing, light/dark mode e menu hamburger melhorado. Também criação dos prompts de agentes IA.

### 11.2 O que foi feito

#### Frontend SPA (Vanilla TypeScript + CSS3 BEM)
- **`frontend/index.html`** — Shell SPA: header (nav + theme toggle), `<main id="app">`, footer, 3 modais (booking wizard 4-step, track, details)
- **`frontend/package.json`** — Vite + TypeScript devDeps
- **`frontend/tsconfig.json`** — strict mode, ES2020
- **`frontend/css/variables.css`** — CSS variables + `.light-theme` override
- **`frontend/css/landing.css`** — Header com `var(--color-bg)`, nav-backdrop, theme-toggle, light-theme overrides
- **`frontend/css/auth.css`** — Light-theme support para fundo/estilos
- **`frontend/css/modals.css`** — Light-theme support para overlay, date input, hover states
- **`frontend/src/router.ts`** — Hash router (`#/`, `#/login`) com cleanup pattern
- **`frontend/src/theme.ts`** — Toggle light/dark com localStorage persistence
- **`frontend/src/main.ts`** — Entry point: initTheme, initNavbar, initModals, initRouter
- **`frontend/src/views/landing.ts`** — Landing page adaptada do `features/main.ts` com SPA pattern
- **`frontend/src/views/login.ts`** — Login completo (5 telas) adaptado do `features/login.ts`
- **`frontend/src/features/navbar.ts`** — Menu hamburger melhorado: backdrop overlay + body scroll lock
- **Arquivos copiados como-is:** types.ts, config.ts, data/mock.ts, services/*.ts, ui/*.ts, features/bookingWizard.ts, features/tracking.ts
- **Assets:** 5 imagens movidas para `public/assets/images/`

#### Prompts de Agentes IA (`docs/prompts/`)
- `docs/prompts/README.md` — Índice com instruções de uso
- `docs/prompts/desenvolvedor-ts-spa.md` — Agente Desenvolvedor TS SPA (adaptado de `.opencode/agent/desenvolvedor.md`)
- `docs/prompts/uiux-css-animator.md` — Agente UI/UX CSS Animator (adaptado de `.opencode/agent/uiux.md`)
- `docs/prompts/code-reviewer.md` — Agente Code Reviewer (adaptado de `.opencode/agent/code-reviewer.md`)

### 11.3 Decisões técnicas

- **SPA com hash routing:** `/` → landing, `/login` → login
- **Views como funções** retornando `cleanup()` para evitar memory leaks
- **Theme toggle:** `.light-theme` class no `<body>`, persiste em `localStorage`
- **Hamburger menu:** backdrop overlay + `body.has-nav-open` scroll lock
- **CSS 100% variável:** nenhum cor hardcoded no dark/light (usa `var(--color-*)`)
- **Prompts adaptados** para uso em ChatGPT/Claude/Cursor (não dependem do opencode)

### 11.4 Arquivos criados/modificados (40+ arquivos)

**Novos:** index.html, package.json, tsconfig.json, router.ts, theme.ts, main.ts, views/landing.ts, views/login.ts, features/navbar.ts, docs/prompts/README.md, docs/prompts/desenvolvedor-ts-spa.md, docs/prompts/uiux-css-animator.md, docs/prompts/code-reviewer.md

**Copiados do local:** types.ts, config.ts, data/mock.ts, services/*.ts, ui/*.ts, features/bookingWizard.ts, features/tracking.ts, assets/*, css/*.css (com modificações em variables, landing, auth, modals)

### 11.5 Push para novo repo + correções

- **Push para novo repo:** `git push tahlly feat/frontend-spa-migration` (novo remote: `tahlly/barbearia-maraca`)
- **Branches copiadas:** `feat/tela-login`, `feat/tela-inicial`, `feat/frontend-spa-migration`
- **Remoção do `Guia-Onboarding.md`:** `git rm` + `commit --amend --no-edit` + `force push` (arquivo era guia interno, não deveria estar no repo)

### 11.6 Documento de explicação do código (local)

- **`~/barbearia-maraca-local/GUIA-DE-EXPLICACAO-DO-CODIGO.md`** — 888 linhas explicando cada arquivo, conceitos (SPA, hash router, cleanup pattern, BEM, dual mode, acessibilidade), diagrama de dependências e resumo para banca
- **`~/barbearia-maraca-local/GUIA-DE-EXPLICACAO-DO-CODIGO.pdf`** — versão PDF com syntax highlighting (Pygments, tema Monokai) gerado via script customizado

## 12. Sessão 5 (27/08/2026): Correção de escopo — publica só `.opencode/` (card S1-02)

### 12.1 Contexto

Na sessão 4 subimos o **frontend SPA inteiro + docs + demais pastas** nas 3 branches do
novo repo (`tahlly/barbearia-maraca`). A PO esclareceu que **não era pra subir agora**:
a única entrega vigente é o **card S1-02 — Configuração dos 3 Agentes Especialistas de IA
e System Prompts**, que pede apenas os prompts versionados em `.opencode/agent/`.

> ⚠️ **Documento pessoal — não commitar** (mantém o padrão deste arquivo, via `.git/info/exclude`).

### 12.2 Evolução e decisão final

O processo passou por um ajuste até a abordagem final:

1. **Primeira tentativa:** limpar as 3 branches (`feat/tela-login`, `feat/tela-inicial`,
   `feat/frontend-spa-migration`), deixando só `.opencode/` em cada uma. Feito — mas a PO
   preferiu não manter 3 branches para uma mesma entrega pequena.
2. **Decisão final (aprovada):** **excluir** as 3 branches no remoto e **criar UMA branch
   nova única** (`feat/agentes-ia`) com **apenas o `.opencode/`** como conteúdo novo, para
   a entrega do card S1-02.

Regras fixas:
- **Sobe agora: SOMENTE `.opencode/agent/*.md`** (arquiteto, desenvolvedor, uiux, code-reviewer)
  + `.opencode/.gitkeep`.
- **Fica na nossa máquina** (trabalho local) para uso futuro: o frontend SPA, as telas
  estáticas e o `docs/prompts/`.
- **`tahlly/main` fica intacta** — nunca sobe direto na main.
- **Toda subida é via Pull Request**, aprovada pela outra equipe. O nosso papel é apenas
  subir a branch limpa e preparar o material da PR; o merge é do time.

### 12.3 O que foi feito (execução)

1. `git push tahlly --delete feat/tela-login feat/tela-inicial feat/frontend-spa-migration`
   → **excluiu** as 3 branches no remoto.
2. `git worktree add -b feat/agentes-ia tahlly/main` → branch nova **a partir da `main`**
   (diff limpo contra a main — só adiciona o que for entregue).
3. Copiados para a branch nova: `.opencode/.gitkeep` + `agent/{arquiteto,code-reviewer,desenvolvedor,uiux}.md`
   (sem `node_modules`/`package.json` — só o que o card exige).
4. Commit: `feat(opencode): adiciona system prompts dos agentes de IA (S1-02)`.
5. `git push -u tahlly feat/agentes-ia` → branch criada no remoto (`72e5057`).

- **`tahlly/main`** → intacta (`f1b890a`).
- **`tahlly/feat/agentes-ia`** → `72e5057` (nova, única).
- Worktrees temporários e branches locais `*-limpo` removidos; locais originais
  (`feat/tela-*`, `feat/frontend-spa-migration`) preservadas com o frontend completo na máquina.
- Link do PR gerado pelo GitHub: `https://github.com/tahlly/barbearia-maraca/pull/new/feat/agentes-ia`

> Nota: o `.gitignore` interno de `.opencode/` (exclui `node_modules`/`package.json`) **não**
> foi publicado por decisão da PO — vai só o que o card exige (os `.md` dos prompts + `.gitkeep`).

### 12.4 Pendências / próximos passos

- [ ] **Abrir/registrar o PR** da branch `feat/agentes-ia` → `main` no `tahlly` para aprovação
      (material pronto — ver resumo da sessão; link de criação do PR já disponível).
- [ ] Registrar no Trello o card **S1-02** concluído (entregue: prompts em `.opencode/agent/`).
- [ ] Futuro: quando os outros cards entrarem, retomar frontend/docs/banco que ficaram
      guardados apenas na máquina local.
- **Regra registrada:** toda subida é via PR com aprovação do time; `main` sempre intacta;
  nada direto na main; sobe apenas o que o card vigente exige.

---

## 13. Guia de workflow — como subir commits daqui pra frente

> Este guia padroniza como **toda** entrega de front deve ser feita no novo repo
> (`tahlly/barbearia-maraca`), evitando os erros das sessões 4 e 5. Leia antes de
> qualquer commit/push.

### 13.1 Regras fixas (não negociáveis)

1. **Toda subida é via Pull Request (PR).** Nunca tocamos na `main` diretamente (sem push
   direto, sem merge nosso). A `main` fica **sempre intacta**.
2. **Sobe apenas o que o card vigente exige.** Não subimos "extras" (frontend completo,
   docs, banco, configs) sem um card pedindo. O que não for entrega atual fica só local.
3. **Quem aprova o merge é a outra equipe** (dona do repo). Nosso papel: criar a branch,
   subir limpa e preparar o material da PR. Não fazemos o merge.
4. **Conventional Commits pt-BR**: `feat(...)`, `fix(...)`, `chore(...)`, `docs(...)` com
   escopo. Ex.: `feat(opencode): adiciona system prompts dos agentes de IA (S1-02)`.
5. **No GitHub novo (`tahlly`) não existe Husky/commitlint** para validar no cliente — mas
   seguimos o padrão mesmo assim.

### 13.2 Processo passo a passo

1. **Identificar o card vigente** (ex.: `S1-02`) e listar exatamente os arquivos/pastas que
   serão entregues.
2. **Criar a branch a partir da `main`** (diff limpo):
   ```bash
   git fetch tahlly
   git worktree add -b feat/<nome-do-card> tahlly/main
   cd /tmp/opencode/<worktree>
   # (alternativa sem worktree: git switch -c feat/<nome> tahlly/main)
   ```
3. **Adicionar apenas a entrega do card** (copiar p/ o worktree só os arquivos da entrega,
   ex.: `.opencode/agent/*.md`). Evite `git rm` de arquivos já existentes na `main` dentro
   do PR — prefira diff só de adições.
4. **Commit convencional**:
   ```bash
   git add <arquivos-da-entrega>
   git commit -m "feat(<escopo>): <descrição> (<ID-do-card>)"
   ```
5. **Push da branch** (sem `--force` de rotina — só se precisar corrigir uma revisão):
   ```bash
   git push -u tahlly feat/<nome-do-card>
   ```
6. **Abrir o PR** contra `main` (o GitHub retorna o link `pull/new/<branch>`). Preparar
   título + descrição conforme o padrão das seções 7.5/8.3.
7. **Registrar no Trello** o card com o resumo da entrega (Polly).
8. **Atualizar este histórico** (nova seção na próxima sessão, ou um "deferido" aqui).
9. **Ao terminar**: remover o worktree temporário:
   ```bash
   git worktree remove <caminho-do-worktree> --force
   ```

### 13.3 Lembrete do estado do repo (`tahlly`)

- **`main`** — intacta; base de onde sempre criamos as branches de entrega.
- **`feat/agentes-ia`** — única branch nossa no remoto (card S1-02); aguardando PR/merge.
- **`dev`** — criada pelo time; não é nossa, não mexemos.

### 13.4 Fonte de verdade local

- O **trabalho completo** (frontend SPA, telas estáticas, docs/prompts, database) fica
  preservado nas branches locais `feat/tela-*` e `feat/frontend-spa-migration`, **apenas na
  máquina** — será usado quando os cards de front entrarem.
- **NÃO** enviar essas branches locais completas ao remoto por engano.

---

## REGRA: Sempre atualizar o histórico ao fechar uma sessão de trabalho

> **Ao final de cada sessão**, adicionar uma nova seção no `HISTORICO-FRONT-END.md`
> com: contexto, o que foi feito, decisões técnicas, arquivos criados/modificados,
> commits e branches. Isso garante rastreabilidade completa do projeto.

## 14. Sessão 6 (30/08/2026): SPA frontend no `tahlly` (branch `feat/router-spa`) + PR

### 14.1 Contexto

A professora pediu para a equipe **recomeçar do zero**; a entrega vigente passou a ser a
história do **router SPA** (navegação sem recarregar a página). O repo novo
(`tahlly/barbearia-maraca`) tem `main` intacta (só docs/arquitetura de agentes). Criei
a branch `feat/router-spa` a partir de `tahlly/main` e trouxe o frontend SPA completo da
branch antiga `feat/frontend-spa-migration` para o working tree.

### 14.2 O que foi feito

- **Frontend SPA no `tahlly`:** `npm install` (Vite + TypeScript), `typecheck` e `build`
  passando; `.gitignore` raiz criado; Especificação movida para `docs/`.
- **Fixes visuais/comportamento (pedido do usuário):**
  1. **Âncoras do menu** — links `#/servicos`, `#/sobre`, `#/contato` agora rolam suavemente
     até a seção da landing. Causa raiz: o router extraía `/servicos` (com barra) mas as
     âncoras eram registradas sem barra → caía no fallback e recarregava a home no topo.
     Corrigido normalizando o id da âncora no `frontend/src/router.ts`.
  2. **Light mode (hero)** — `frontend/css/landing.css`: overrides `body.light-theme` para
     `.hero__title` (escuro), `.hero__subtitle` (legível) e `.hero__btn--secondary`
     (texto/borda pretos) no botão "Acompanhar agendamento".
  3. **Login centralizado** — `frontend/css/auth.css`: `.auth` com
     `min-height: calc(100dvh - --header-h)` + `grid place-items: center` (centraliza a tela
     de login entre header e footer).
  4. **Login SPA correto** — removido `frontend/login.html` (estático obsoleto) e
     `auth.ts` passou de `window.location.replace("login.html")` para `navigateTo("/login")`
     (sem recarga de página). A tela de login continua sendo a rota `#/login`
     (`frontend/src/views/login.ts`).
- **`AGENTS.md` (raiz):** corrigida toda a acentuação/gramática (preservando estrutura).
- **`frontend/README.md`:** reescrito — como rodar, rotas, estrutura, funcionalidades,
  credencial demo e contrato backend.

### 14.3 Decisões técnicas

- Manter **Hash Router** (o HTML já usa `href="#/"`).
- Âncoras como scroll na landing (não rotas/views separadas).
- Login via rota SPA `#/login` (nada de página estática `login.html`).
- Navegação sem reload em `auth.ts` (`navigateTo`).

### 14.4 Arquivos alterados (resumo)

- `frontend/src/router.ts` · `frontend/src/main.ts` · `frontend/src/views/landing.ts`
- `frontend/src/services/auth.ts` (+nova importação de `navigateTo`)
- `frontend/css/landing.css` · `frontend/css/auth.css`
- `frontend/README.md` (reescrito)
- `AGENTS.md` (acentuação) · `docs/ESPECIFICACAO-PAPEIS-ACESSOS-ROTAS-CASOS-DE-USO.md`
- `REMOVIDO: frontend/login.html`
- Migração completa da SPA (arquivos novos de `frontend/`)

### 14.5 Commits e push

- **Branch:** `feat/router-spa` (base `tahlly/main`).
- **Commits (multi, convencional pt-BR):** feat(front) migração SPA → fix(front) âncoras/hero/login
  → fix(front) login SPA → docs AGENTS/Especificação → docs(front) README.
- **Push:** `git push tahlly feat/router-spa:feat/router-spa` (refspec explícito; **nunca na main**).
- **PR:** `https://github.com/tahlly/barbearia-maraca/pull/new/feat/router-spa` (abertura manual — `gh` não instalado; material pronto).

### 14.6 Validação

`npm run typecheck` + `npm run build` (exit 0) antes do push. Dev server `localhost:5173` OK (HTTP 200) durante a conferência visual.

### 14.7 Pendências / próximos passos

- [ ] **Abrir a PR** `feat/router-spa` → `main` no `tahlly` (link acima) para aprovação da equipe.
- [ ] Quando a histórica do router for aprovada: história de integração real com o back-end
      (tirar o modo mock), auth real, dashboard administrativo.
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 15. Sessão 7 (01/09/2026): Área do Cliente + Dashboard Admin + Auth por papel (mock)

### 15.1 Contexto

História de **telas internas** do frontend em **modo mock (localStorage)** — sem tocar em
`backend/`, `shared/`, `agents/` ou `docs/`. Entrega autorizada a evoluir o frontend
localmente (sem push). Objetivo: navegação por papel (Cliente/Barbeiro/Recepcionista/Admin)
com redirecionamento no login, layout de painel/sidebar conforme Figma e CRUDs no admin.

### 15.2 O que foi feito

#### Autenticação por papel + sessão (`src/services/auth.ts`)
- `loginInterno` (admin/profissional/recepcionista) e `loginCliente`.
- `getSession`/`requireSession`/`requireRole`/`logout`/`redirectForRole` + `ROLE_REDIRECTS`.
- Redirecionamento no login administrativo: admin → `#/admin`; profissional → `#/profissional`;
  recepcionista → `#/recepcionista`. Cliente → `#/minha-conta`.

#### Área do Cliente (`src/views/minhaConta.ts` + `css/account.css`)
- Painel com abas **Próximos / Histórico / Perfil** (a aba ativa reflete o hash).
- Cancelamento de agendamento (confirmDialog) + reagendar (reusa `initBookingWizard`).
- Edição de perfil (nome, telefone; e-mail fixo).
- Login/cadastro do cliente em `src/views/loginCliente.ts` (`#/login-cliente`).

#### Dashboard Administrador (`src/views/admin.ts` + `css/admin.css`)
- Abas: Dashboard, Serviços, Profissionais, Agendamentos (roteadas em `#/admin/...`).
- **Dashboard:** KPIs (total/confirmados/pendentes/cancelados/faturamento) + serviços mais vendidos.
- **Serviços:** CRUD em modal (nome, descrição, categoria/datalist, duração, preço, ícone, ativo).
- **Agendamentos:** tabela com filtro por status.
- **Profissionais:** CRUD em modal com checkbox **"É recepcionista"** — quando marcado,
  Cargo/Categoria são desabilitados/limpos e o usuário recebe role `recepcionista`; caso
  contrário role `profissional`. Toast informa a **senha padrão `123456`**
  (`CONFIG.defaultPassword`), a ser alterada em Configurações.

#### Skeletons de papel (`src/views/placeholderPanel.ts`)
- `#/profissional` e `#/recepcionista` com `requireRole` + sidebar/toggle + "em construção".

#### Infra/painel compartilhado
- `src/ui/layout.ts` — `renderPanel` (sidebar 240px, topbar, avatar, logout, tema, `markActive`).
- `css/panel.css` — layout do painel, KPI cards, badges, tabelas, empty-state, responsive.
- `src/theme.ts` refatorado para **múltiplos toggles** (`[data-theme-toggle]`); `body.panel-mode`
  oculta header/footer globais; `body.light-theme` aplicado globalmente.

#### Modelos/serviços/seed
- `src/types.ts`: `UserRole`, `Cliente`, `Professional.email?`, `Professional.userRole?`, `Session.role`.
- `src/config.ts`: `clientesKey`, `usuariosKey`, `defaultPassword`.
- `src/services/clientes.ts` (CRUD) e `src/services/usuarios.ts` (usuários internos).
- `src/services/booking.ts`: `loadAllAppointments()` e `listByEmail(email)`.
- `src/data/seed.ts` — `ensureSeed()`: serviços, profissionais, 5 agendamentos, 1 cliente demo,
  usuários internos (`recepcao@maraca.com`, `profissional@maraca.com`).

#### Roteamento e shell
- `src/main.ts`: chama `ensureSeed()` e registra `#/login-cliente`, `#/minha-conta(+ /proximos|/historico|/perfil)`,
  `#/admin(+ /servicos|/profissionais|/agendamentos)`, `#/profissional`, `#/recepcionista`.
- `frontend/index.html`: links `css/panel.css`, `css/account.css`, `css/admin.css` + link de
  rodapé "Área do Cliente".
- `frontend/README.md`: tabela de rotas atualizada + credenciais demo (senha padrão 123456).

### 15.3 Decisões técnicas

- **Modo mock total:** nada de API real/RBAC (backend vazio); guard no frontend via localStorage.
- **`panel-mode` no `<body>`** para isolar os painéis do layout público.
- **Aba da área do cliente refletida pelo hash** (profundidade de rota por subrota).
- **Admin consome `loadAllAppointments()`** (agregação) para KPIs/faturamento — financeiro
  restrito ao Admin.
- Ícone `user-plus` adicionado ao mapa em `src/ui/icons.ts` (estava caindo no fallback).

### 15.4 Credenciais demo (mock)

```
cliente@maraca.com    / cliente123      → Área do Cliente
admin@maraca.com      / maraca123       → Administrador
recepcao@maraca.com   / 123456          → Recepcionista
profissional@maraca.com / 123456        → Profissional
```

Novos cadastros de profissional/recepcionista usam senha padrão `123456`.

### 15.5 Arquivos criados/modificados (frontend apenas)

**Novos:** `src/ui/layout.ts`, `src/views/admin.ts`, `src/views/loginCliente.ts`,
`src/views/minhaConta.ts`, `src/views/placeholderPanel.ts`, `src/services/clientes.ts`,
`src/services/usuarios.ts`, `src/data/seed.ts`, `css/panel.css`, `css/account.css`, `css/admin.css`.

**Modificados:** `src/main.ts`, `src/config.ts`, `src/types.ts`, `src/services/auth.ts`,
`src/services/booking.ts`, `src/theme.ts`, `src/ui/icons.ts`, `src/views/login.ts`,
`index.html`, `frontend/README.md`.

### 15.6 Validação

- `npm run typecheck` ✅ (tsc --noEmit, strict, sem `any`).
- `npm run build` ✅ (tsc + vite build; 39 módulos).
- Dev server `localhost:5173` ✅ (HTTP 200; `main.ts` servido corretamente).
- Escopo conferido via `git status` — somente `frontend/*`; **nada em backend/shared/agents**.
- **Não commitado / não push** (instrução explícita); trabalho mantido local.

### 15.7 Pendências / próximos passos

- [ ] Conferência visual final nos 4 painéis (admin/cliente/profissional/recepcionista) + light/dark.
- [ ] Verificar o fluxo de "Novo profissional/recepcionista" completo (criação → login por papel).
- [ ] Retomar normalmente: histórias futuras de integração real com o back-end.
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 16. Sessão 8 (02/09/2026): Painel compartilhado Admin+Recepcionista + fixes

### 16.1 Contexto

Após a Sessão 7, o Admin tinha painel próprio (`admin.ts`) e Recepcionista/Profissional eram
skeletons. A história pediu um **painel de gestão compartilhado** para Admin e Recepcionista
(preservando as regras de acesso: recep não vê financeiro), mais a troca de logo no modo claro
e um botão para recolher a sidebar.

### 16.2 O que foi feito

#### Painel compartilhado (`src/views/manage.ts` — substitui `admin.ts`, que foi deletado)
- `renderManage(panel, inicialTab)` atendendo `/admin` e `/recepcionista`.
- Abas: dashboard, agendamentos, servicos, profissionais, configuracoes.
- **Dashboard** — somente Admin (recepcionista abre direto em Agendamentos).
- **Agendamentos** — tabela + busca + filtro por status + confirmar/cancelar
  (`setAppointmentStatus`) + modal Detalhes + modal Configurar Agenda (`DEFAULT_DAYS`).
- **Serviços** — tabela + modal Novo/Editar com categoria dinâmica.
- **Profissionais** — cards com métrica "Agendamentos este mês" (`findByProfessionalId`) +
  modais Novo/Editar/Excluir.
- **Configurações do perfil** — foto (upload base64), nome, senha, e-mail
  (`updateUsuarioInterno` + `updateSessionUser`; admin demo via patch `maraca.v2.demoAdmin`).

#### Fix de navegação por abas
- `linkHandler` comparava `window.location.hash` (com `#`) contra caminhos sem `#` → toda aba
  caía no dashboard. Corrigido normalizando com `hash.slice(1)`.

#### Sidebar recolhível (`ui/layout.ts` + `css/panel.css`)
- Botão `data-panel-collapse`; estado persistido em `localStorage maraca.panel.collapsed`.
- Classe `.is-collapsed` (72px, só ícones; textos ocultos p/ acessibilidade via `title` nos links).
- Mobile (<768px) sempre expandido e botão oculto.

#### Logo modo claro (`theme.ts` + `layout.ts`)
- Atributo `data-logo` + `syncLogoImages()`; modo claro usa o `logo-maraca-green.png`.

#### Serviços/armações
- `services/booking.ts`: `setAppointmentStatus(mock + PATCH)`.
- `services/usuarios.ts`: `updateUsuarioInterno`, `findByProfessionalId`.
- `services/auth.ts`: `updateSessionUser`; `loginInterno` aplica o patch do demo admin.
- `services/schedule.ts`: exporta `DEFAULT_DAYS`.
- `ui/icons.ts`: adicionados `upload`, `chevrons-left`, `chevrons-right`.
- `main.ts`: rotas `/admin*` e `/recepcionista*` → `renderManage`; placeholder de recepcionista
  removido de `placeholderPanel.ts`.

#### CSS
- `css/manage.css` novo (linkado no `index.html`); `css/panel.css` com estados recolhido/mobile.

### 16.3 Decisões técnicas

- Painel único `manage.ts` com guarda de papel: dashboard/receita **só Admin**; Recepcionista
  não acessa financeiro (regra de acesso respeitada, não só ocultação).
- Sidebar recolhida mantém acessibilidade (textos ocultos com `title`).
- Logo do modo claro via troca de atributo `src` em `syncLogoImages()`.
- **Servidor dev persistente:** o processo Vite morria quando o shell da ferramenta dava timeout
  (matava o grupo de processos). Solução: iniciar com
  `setsid npm run dev > /tmp/vite.log 2>&1 < /dev/null &` — o Vite roda em sessão própria e
  sobrevive ao timeout; confirmado com `curl` → HTTP 200 em `http://localhost:5173/`.

### 16.4 Credenciais demo (mock)

Continuam as mesmas da Sessão 7: `admin@maraca.com`/`maraca123`, `recepcao@maraca.com`/`123456`,
`profissional@maraca.com`/`123456`, `cliente@maraca.com`/`cliente123`.

### 16.5 Arquivos criados/modificados (frontend apenas)

**Novos:** `src/views/manage.ts`, `css/manage.css`.
**Deletado:** `src/views/admin.ts` (substituído por `manage.ts`).
**Modificados:** `src/main.ts`, `src/ui/layout.ts`, `src/theme.ts`, `src/services/auth.ts`,
`src/services/booking.ts`, `src/services/usuarios.ts`, `src/services/schedule.ts`,
`src/ui/icons.ts`, `src/views/placeholderPanel.ts`, `css/panel.css`, `index.html`.

### 16.6 Validação

- `npm run typecheck` ✅ (strict, sem `any`).
- `npm run build` ✅.
- Dev server HTTP 200 em `http://localhost:5173` (iniciado com `setsid`; sobrevive ao timeout
  do shell — conferido após o timeout).
- Escopo conferido via `git status` — somente `frontend/*`. **Não commitado / não push.**

### 16.7 Pendências / próximos passos

- [ ] Conferência visual final: abas Admin x Recepcionista (o que a recep vê vs admin),
  botão recolher/expandir (estado persiste ao recarregar) e tema claro com logo verde.
- [ ] Continuar com as histórias de integração real com o back-end quando entrarem.
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 17. Sessão 9 (03/09/2026): Backup do projeto + clone da `developer` (trabalho da Bruna)

### 17.1 Contexto

O time teve várias atualizações no repositório (incluindo trabalho da colega **Bruna** no
frontend — PR #12 "login com Google e ajustes de UX/painel"). Antes de trazer essas
atualizações, decidimos **manter um backup local do projeto atual** (branch `feat-telas-rai`)
como salvaguarda contra possíveis erros, e então fazer um **clone limpo da branch de integração
`developer`**.

### 17.2 O que foi feito

1. **Diagnóstico do remoto:** a branch de integração ativa no `tahlly` é a `developer`
   (`f8f2ec1`). A branch local `feat-telas-rai` tinha upstream remoto **já excluído**
   (mergida via PR #8) — workspace desatualizado e sem track.
2. **Backup (Opção A — completo, com `.git`):**
   - `tar` excluindo `node_modules`/`dist` (regeneráveis) para um arquivo enxuto e rápido;
   - resultado: `barbearia-maraca-backup-20260903-202926.tar.gz` (28M) em `/home/rai_colares/`;
   - verificado: `.git/` (histórico + branches locais), `HISTORICO-FRONT-END.md`,
     `DOCUMENTACAO.md` e `README.md` presentes; **sem** `node_modules`.
3. **Clone limpo da `developer`:**
   - `git clone --branch developer --single-branch git@github.com:tahlly/barbearia-maraca.git /home/rai_colares/barbearia-maraca-dev`;
   - HEAD `f8f2ec1` (PR #15), branch `developer`; workspace atual `barbearia-maraca` intacto.
4. **Validação do clone:**
   - `cp .env.example backend/.env` (só template, nada commitado);
   - backend: `npm install` + `npm run build` (tsc) ✅ exit 0;
   - frontend: `npm install` + `npm run typecheck` ✅ + `npm run build` (tsc + vite, 40 módulos) ✅;
   - dev server `http://localhost:5173` → HTTP 200 ✅ (parado após a conferência).

### 17.3 Estado da `developer` clonada (o que a Bruna/equipe já fizeram)

- **Backend:** Express 5 + zod + google-auth-library; API em camadas (`controllers/`,
  `services/`, `repositories/`, `dtos/`, `middlewares/`, `rotas/`, `server.ts`, `errors/`).
  `server.ts` expõe `/api/health`, `/api/servicos`, `/api/auth/login`, `/api/auth` e `/servicos`,
  com fallback SPA e error handler. **AVISO:** `/api/auth/login` ainda usa
  `token: 'token_placeholder'` e senha tratada em texto no fluxo — JWT/assinatura real pendente.
- **Frontend:** novo diretório `src/pages/` (dashboard, home, login, servicos) + `src/services/googleAuth.ts`
  (login com Google), `src/styles/main.css`, `src/views/` e `src/features/` mantidos.
- **Banco:** migrations corretivas de QA (PR #11) e restauração da **unicidade de agendamento**
  (PR #15); diagrama DER na seção 21 (PR #9).
- **AGENTS.md** do repo novo difere do manual antigo (novo ownership via `.opencode/agents/**`).

### 17.4 Decisões técnicas

- **Backup completo com `.git`** para preservar histórico e branches locais, excluindo módulos
  regeneráveis (tarball 28M em vez de 138M).
- **Clone em diretório novo** (`barbearia-maraca-dev`) mantendo o workspace atual intacto em
  paralelo, como forma de comparar/extrair com segurança.
- **Validação com build/typecheck** antes de considerar o clone pronto.

### 17.5 Arquivos/pastas relacionados

- Backup: `/home/rai_colares/barbearia-maraca-backup-20260903-202926.tar.gz`
- Clone: `/home/rai_colares/barbearia-maraca-dev` (branch `developer`)
- Original preservado: `/home/rai_colares/barbearia-maraca` (branch `feat-telas-rai`)

### 17.6 Pendências / próximos passos

- [ ] Revisar o `manage.ts`/páginas do frontend da `developer` para alinhar com o que a Bruna
      alterou (Google login, pages/*, styles).
- [ ] Conferir o backend em camadas e os novos endpoints antes de qualquer integração.
- [ ] Decidir sobre o `token_placeholder` do `/api/auth/login` (autenticação real pendente).
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 18. Sessão 10 (03/09/2026): Painel do Profissional + refinamentos de layout do painel (no clone `developer`)

### 18.1 Contexto

Trabalho feito **somente no frontend** do clone limpo da branch `developer`
(`/home/rai_colares/barbearia-maraca-dev`), preservando o workspace original
(`feat-telas-rai`) intacto. Objetivo: construir o painel real do **Profissional** na SPA
(substituindo o skeleton) e refinar o layout do painel para todos os papéis, conforme o
Figma/descrição textual. **Nada commitado / nada enviado.**

### 18.2 O que foi feito (por pedido do usuário)

#### a) Painel do Profissional (`src/views/profissional.ts`, novo)
- Sinha RBAC: só áreas permitidas ao barbeiro — **Agendamentos** e **Configurações**
  (sem Dashboard/Serviços/Profissionais, que são de Admin/Recepcionista).
- **Aba Agendamentos:** filtros por status + busca por cliente + bloco dourado
  **"CONSULTAR AGENDAMENTOS"** (data inicial/final, botão Consultar + Limpar Filtro) +
  tabela `Cliente | Telefone | Profissional | Serviço | Data/Hora | Status`.
  Lista filtrada **apenas para o profissional logado** (vincula sessão → `usuarios`;
  `professionalId`).
- **Aba Configurações:** foto (upload), nome, alterar senha e alterar e-mail
  (`updateSessionUser` + `updateUsuarioInterno`).
- **Menu "Voltar ao site" (arrow-left)** — navega para `#/` **sem deslogar** (sessão em
  `sessionStorage`), permitindo voltar à landing e, ao clicar em "Acesso Administrativo"
  (`#/login`), o `renderLogin` detecta a sessão e redireciona direto ao painel.

#### b) Remoção da coluna "Ações" da tabela do Profissional
- Barbeiro **só visualiza** agendamentos e seus status — **não** confirma nem cancela.
- Removidos botões "Confirmar Presença"/"Cancelar" e o código órfão
  (`bindRows`, `handleSetStatus`, `confirmDialog`, `setAppointmentStatus`, `$$`).

#### c) Sidebar fixa sem scroll + conteúdo com scroll (desktop)
- `css/panel.css`: `.panel` agora `height:100vh; overflow:hidden` (trava na viewport) e
  `.panel__content` com `overflow-y:auto; min-height:0`. Resultado: **sidebar sempre
  visível e fixa**; o **conteúdo à direita rola**; o topo (`.panel__topbar`) permanece fixo.
- Como todos os painéis usam o mesmo `renderPanel`, a melhoria vale para
  Admin/Recepcionista/Profissional/Minha-Conta.

#### d) Mobile: botão hamburger + drawer (substitui a barra horizontal)
- `css/panel.css` + `src/ui/layout.ts`:
  - Sidebar passa a ser um **drawer vertical** oculto (`translateX(-100%)`), aberto com
    `.is-mobile-open` — igual ao desktop visualmente.
  - Botão **hamburger** no topo (menu ↔ x) e **backdrop** escuro p/ fechar ao tocar fora.
  - Fecha automaticamente ao navegar por um link (`hashchange`).
  - Removidos os estilos da antiga barra horizontal no topo.

### 18.3 Arquivos alterados (todos frontend, no clone `developer`)

- `src/views/profissional.ts` (novo painel do profissional)
- `src/main.ts` (rota `#/profissional(+ /configuracoes)` → `renderProfissional`)
- `src/ui/layout.ts` (hamburger + backdrop + toggle `<--` `setMobileOpen`)
- `css/panel.css` (sidebar fixa 100vh + drawer/hamburger/backdrop mobile)
- `css/manage.css` (classes `.adv-filter*` — bloco CONSULTAR)

### 18.4 Decisões técnicas

- Estrutura do painel é **100% compartilhada** via `renderPanel` (todos os papéis herdam
  sidebar fixa, footer avatar/nome/Sair, hamburger mobile).
- RBAC no frontend apenas como fluxo/UX; segurança real fica no backend (segue o AGENTS.md).
- Sem mudança em `shared/`, `backend/`, `agents/` ou schema.

### 18.5 Validação

- `npm run typecheck` ✅ (strict, sem `any`).
- `npm run build` ✅ (tsc + vite, 42 módulos).
- Dev server `http://localhost:5173` → HTTP 200 (HMR reflete as mudanças).
- **Não commitado / não push** (instrução explícita).

### 18.6 Pendências / próximos passos

- [ ] **Padronizar demais painéis** (usuário confirmou em 4 frentes): Admin, Recepcionista
      e Minha Conta.
      - Menu: trocar "Início" por **"Voltar ao site"** (arrow-left) — `manage.ts` (admin e
        recepcionista) e `minhaConta.ts`.
      - Replicar bloco **"CONSULTAR AGENDAMENTOS"** (filtro por data) na aba Agendamentos de
        Admin/Recepcionista (`manage.ts` `renderAgendamentos`).
      - Padronizar **Configurações** → botão "Carregar foto" como `btn--gold-outline`
        (igual ao profissional).
      - Ajustar **usuário por usuário** conforme aprovação.
- [ ] Detalhe pendente no **perfil do profissional** (próximo ajuste a combinar com o usuário).
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 19. Sessão 11 (03/09/2026): Padronização da tela da Recepcionista/Admin (`manage.ts`)

### 19.1 Contexto

Pedido do usuário: deixar a tela da Recepcionista "exatamente igual" à do Profissional
(estrutura visual), mas mantendo as ações de Confirma/Cancela que são direito da recep,
com filtro por data, tabela encaixada (sem scroll horizontal) e ações de excluir serviço.
Usuário autorizou aplicar **a ambos admin e recepcionista** e confirmou que a recepcionista
pode excluir serviços, com `confirmDialog`.

### 19.2 O que foi feito (arquivo `src/views/manage.ts`)

- **Menu**: substituído "Início" (icon `grid`) por **"Voltar ao site"** (icon `arrow-left`)
  nos links de Admin e Recepcionista.
- **Aba Agendamentos (`renderAgendamentos`)**:
  - Adicionado bloco dourado **"CONSULTAR AGENDAMENTOS"** (`.adv-filter`) com data
    inicial/final, botões "Consultar" e "Limpar Filtro" (padrão anual = ano corrente).
  - Filtro integrado ao existente (busca + status), persistindo listeners/cleanups.
  - Tabela agora usa classe **`table--fit`** para caber na largura sem scroll horizontal.
- **Botão de presença**: texto "Confirmar Presença" → **"CONFIRMAR"**.
- **Aba Serviços (`renderServicos`)**: coluna Ações agora tem botão **"Excluir"**
  (`btn--danger-outline`) ao lado de "Editar", com listener → `handleDeleteService`
  (confirma via `confirmDialog` com `danger: true`, remove do cache e chama `saveServices`).

### 19.3 CSS (`css/components.css`)

- Novo seletor **`.table--fit`**: `table-layout: fixed; min-width: 0`, quebra de linha
  (`overflow-wrap: anywhere; word-break: break-word`), larguras relativas por coluna
  (Cliente 15%, Telefone 11%, Profissional 13%, Serviço 20%, Data/Hora 14%, Status 10%,
  Ações 17%) e ações com `flex-wrap: wrap` para mobile.

### 19.4 Validação

- `npm run typecheck` → ok (exit 0).
- `npm run build` → ok (42 módulos / ~126 kB JS).

### 19.5 Pendências / próximos passos

- [ ] Padronizar **Configurações** → botão "Carregar foto" como `btn--gold-outline`
      (igual ao profissional) — pendente.
- [ ] Detalhe pendente no **perfil do profissional** (a combinar com o usuário).
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 20. Sessão 12 (03/09/2026): Ajuste fino da tabela de Agendamentos (`table--fit`)

### 20.1 Contexto

Após a padronização da tela Admin/Recepcionista (Sessão 11), o usuário pediu ajuste fino na
tabela de Agendamentos: mais agendamentos visíveis em tela de 14" (menos espaço no
cabeçalho), status sem quebrar o texto, nome do cliente quebrando só após espaço vazio, e
botões CONFIRMAR/EXCLUIR com o mesmo tamanho.

### 20.2 O que foi feito (CSS)

- `css/components.css` (`.table--fit`):
  - Padding das células reduzido (`8px 10px`, antes `14px 18px`).
  - `overflow-wrap: anywhere` → `break-word` e `word-break: break-word` → `normal`
    (nome quebra apenas no limite de palavra/espaço).
  - `font-size` das células levemente reduzido (`0.85rem`).
  - Coluna Status (nth 6) com `white-space: nowrap` (sem quebra do texto do status).
  - Coluna Ações (nth 7) com `min-width: 92px` nos `btn--sm` de ação → CONFIRMAR e
    EXCLUIR ficam do mesmo tamanho.
- `css/panel.css`: `.panel__content` gap reduzido `--space-5` → `--space-4`
  (cabeçalho mais próximo da tabela em todas as telas).

### 20.3 Validação

- `npm run typecheck` → ok (exit 0).
- `npm run build` → ok (42 módulos).

### 20.4 Pendências / próximos passos

- [ ] Detalhe pendente no **perfil do profissional** (a combinar com o usuário).
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 21. Sessão 13 (03/09/2026): Reformulação do painel do Cliente (`minhaConta.ts`)

### 21.1 Contexto

Usuário pediu que o painel do Cliente tenha **apenas 3 opções de menu**: Agendamentos
(tabela + filtro, vendo todo o histórico do próprio cliente), Configurações (igual aos
demais papéis) e "← Voltar ao site". Decisões do usuário: manter botão "Novo agendamento";
ação REAGENDAR (abre wizard em mudar data/hora) no lugar de "confirmar"; busca por serviço;
colunas Serviço · Profissional · Data/Hora · Status · Ações; manter Reagendar + Cancelar.

### 21.2 O que foi feito

- `frontend/src/views/minhaConta.ts` (reescrito padronizando com `profissional.ts`):
  - Menu: Agendamentos (`#/minha-conta`), Configurações (`#/minha-conta/configuracoes`),
    **Voltar ao site** (`#/`, arrow-left).
  - **Aba Agendamentos**: fonte `listByEmail(session.userEmail)` (só do cliente, ordem desc);
    cabeçalho `MEUS AGENDAMENTOS` + filtro de status + **busca por serviço**;
    bloco **CONSULTAR AGENDAMENTOS** (datas início/fim, Consultar, Limpar Filtro, padrão ano);
    botão **Novo agendamento** (`wizard.openNew()`); tabela `table--fit table--conta`.
  - **Colunas**: Serviço · Profissional · Data/Hora · Status · Ações.
  - **Ações** (pendente/confirmado): **REAGENDAR** (`wizard.openForReschedule`) + **Cancelar**
    (`cancelAppointment` + `confirmDialog`).
  - **Aba Configurações**: idêntica ao padrão (foto, nome, alterar senha, alterar email) com
    `updateSessionUser`/`updateUsuarioInterno`.
  - Roteamento por hash (`handleTab` + `hashchange`).
- `frontend/src/main.ts`: removidas rotas `/minha-conta/proximos|historico|perfil`;
  adicionada `/minha-conta/configuracoes`.
- `frontend/css/components.css`: classe **`.table--conta`** com larguras para 5 colunas
  (Serviço 30%, Profissional 20%, Data/Hora 17%, Status 13%, Ações 20%) e botões de ação
  `min-width: 96px` (para não truncar "REAGENDAR").

### 21.3 Validação

- `npm run typecheck` → ok (exit 0).
- `npm run build` → ok (42 módulos / ~134 kB JS).
- Verificação: nenhuma referência restante às rotas antigas do cliente.

### 21.4 Pendências / próximos passos

- [ ] Revisão visual em `localhost:5173/#/minha-conta`.
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 22. Sessão 14 (03/09/2026): Ajustes nas telas de Login

### 22.1 Contexto

Usuário: (1) compactar a tela de Login do Acesso Administrativo (espaçamentos menores,
inputs menores para caber sem scroll) e corrigir o modo claro que mantinha a cor escura;
deixar o visual alinhado à tela de login do agendamento. (2) Trocar o texto do botão de
login com a conta Google, na tela de login de agendamento, para "LOGIN COM GOOGLE".
Decisão: manter a estrutura do login admin (com `auth__panel`), só corrigir cores do modo
claro (Opção A).

### 22.2 O que foi feito

- `frontend/src/views/loginCliente.ts`: texto do botão Google
  "Continuar com Google" → **"LOGIN COM GOOGLE"** (ícone SVG mantido).
- `frontend/css/auth.css` (`.auth--admin`):
  - **Correção do modo claro**: cores hardcoded escuras (`#0e0e10`, `#1e1e22`,
    `#121214`, `#2d2d35`, textos `#ffffff`/`#a0a0b0`) → **variáveis de tema**
    (`var(--color-bg)`, `var(--color-surface)`, `var(--color-text-muted)`,
    `var(--color-label)`, `var(--color-gold)`). Assim o modo claro passa a alternar
    corretamente (mesmo mecanismo da tela de agendamento `.auth--restricted`).
  - **Compactação**: inputs `padding: 12px` → `9px 12px`; `auth__panel` padding `24px` →
    `var(--space-4)`; `auth__box` padding reduzido; gap do form `16px` → `12px`; `field`
    gap reduzido; `auth__subtitle` margin-bottom `32px` → `space-4`.

### 22.3 Validação

- `npm run typecheck` → ok (exit 0).
- `npm run build` → ok (42 módulos).
- Verificação visual **aprovada pelo usuário**: modo claro do login admin e botão
  "LOGIN COM GOOGLE" corretos.

### 22.4 Pendências / próximos passos

- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 23. Sessão 15 (03/09/2026): Push do frontend via PR — branch `feat/paineis-frontend-rai-bruna`

### 23.1 Contexto

Usuário pediu para subir o trabalho de frontend (Rai + Bruna) para o GitHub via Pull Request,
com nome de branch terminando em `rai-bruna`, atualizando o `README.md` do frontend. Os arquivos
pessoais `HISTORICO-FRONT-END.md` e `DOCUMENTACAO.md` **não devem subir** (ficam no workspace
original `/home/rai_colares/barbearia-maraca`, que não é o repositório de produção).

### 23.2 O que foi feito

- **Branch criada** a partir de `developer`: `feat/paineis-frontend-rai-bruna`.
- **`frontend/README.md` atualizado**: tabela de rotas (agendamentos/configurações dos painéis,
  privacidade/termos, login-cliente com Google), estrutura de `views/` e seção "Funcionalidades
  atuais" (painéis do Profissional, Recepcionista/Admin e Cliente, páginas institucionais,
  sidebar fixa + drawer mobile, modo claro nas telas de login).
- **Commit único** (Conventional Commit, passou no commitlint/husky):
  `feat(frontend): painéis do profissional, recepcionista/admin e cliente + melhorias`
  — 15 arquivos (README, css/auth·components·manage·panel, index.html, main.ts, layout.ts,
  landing.ts, loginCliente.ts, manage.ts, minhaConta.ts, privacidade.ts, profissional.ts, termos.ts).
- **Push**: `git push -u origin feat/paineis-frontend-rai-bruna` (sucesso).

### 23.3 Garantia de que os pessoais não subiram

- `HISTORICO-FRONT-END.md` e `DOCUMENTACAO.md` existem **somente** no workspace original
  (`/home/rai_colares/barbearia-maraca`); no workspace dev (`barbearia-maraca-dev`) **não existem**.
- Verificado: `git diff --cached --name-only` não continha nenhum desses arquivos (apenas `frontend/`).

### 23.4 Pendências / próximos passos

- [ ] **Abrir o PR** no GitHub (apontar para a base `developer`):
      https://github.com/tahlly/barbearia-maraca/pull/new/feat/paineis-frontend-rai-bruna
- [ ] Validar/revisar o PR em conjunto (QA) antes do merge.
- [ ] `HISTORICO-FRONT-END.md` segue **pessoal** (`.git/info/exclude`) — nunca commitado.

## 24. Sessão 16 (05/09/2026): Superusuário + dashboard admin refinado + guia de estudo

### 24.1 Contexto

Usuário (atendendo pedido do dono do projeto) pediu um papel **Superusuário** para gerir os
administradores do sistema, além de ajustes no dashboard admin (cards de KPI e destaque do mês) e um
**guia de estudo do frontend** para a apresentação. Trabalho segue na branch
`feat/paineis-frontend-rai-bruna` (branches pessoais `docs/*` não sobem).

### 24.2 O que foi feito — Superusuário (frontend/mock)

- **`types.ts`**: `UserRole` ganhou `"superusuario"`.
- **`config.ts`**: nova chave `adminsKey: "maraca.v2.admins"` e o perfil demo `demoSuperAdmin`
  (`super@maraca.com` / `maraca123`).
- **`services/admins.ts`** (novo, 114 linhas): modelo `AdminProfile { id, nome, email, senha, createdAt }`,
  migração automática do legado `maraca.v2.demoAdmin` → lista `maraca.v2.admins`, `validateAdminLogin`,
  `createAdmin`, `updateAdmin`, `deleteAdmin` e `isLastAdmin`.
- **`services/auth.ts`**: `ROLE_REDIRECTS` ganhou `superusuario → /superusuario`; ordem de login:
  superusuário → admin → usuário interno; branch de admin em `updateSessionUser` passou a usar a lista
  de admins (com checagem de e-mail duplicado).
- **`views/superusuario.ts`** (novo, 245 linhas): `requireRole(["superusuario"])`, painel "Supervisão"
  com **Lista de usuários**; CRUD em modal com validação (nome ≥ 3, e-mail válido e sem duplicidade com
  usuários internos, senha ≥ 6) e **bloqueio de excluir o último admin** (anti-lockout).
- **`main.ts`**: registrou `/superusuario` e `/superusuario/usuarios`; **`usuarios.ts`**: `roleLabel`
  p/ superusuário; **`seed.ts`**: garante a lista de admins no seed; **`layout.ts`**: `roleLabel`.
- **CSS**: `.user-list*` em `manage.css` (108 linhas novas).

### 24.3 O que foi feito — Dashboard admin (manage.ts + panel.css)

- **KPIs reordenados**: 4 cards no topo (`kpi-grid` → `repeat(4, 1fr)`).
- **Faturamento e Profissional destaque do mês** passaram a ocupar a largura total abaixo
  (`grid-column: span 2` — cards 5 e 6), com espaçamento e media queries (≤768px 2 colunas, ≤480px 1
  coluna) em `panel.css`.
- **Espaço acima de "Serviços mais vendidos"** (`.kpi-grid + .panel__section { margin-top: var(--space-5); }`).
- **`profissional.ts`**: ajuste p/ o destaque do mês e upload de foto.

### 24.4 Validação

- `npm run typecheck` e `npm run build` sem erros.
- Testes em sandbox (`/tmp`, esbuild → bundles descartados): login superusuário, login admin demo,
  senha incorreta, migração legado, CRUD completo de admin, bloqueio do último admin.

### 24.5 README do frontend

- Tabela de rotas ganhou `#/superusuario`; "Funcionalidades atuais" ganhou o item do superusuário;
  credencial demo adicionada (`super@maraca.com` / `maraca123`).

### 24.6 Guia de estudo (NOVO, pessoal, não sobe)

- Criado **`frontend/GUIA-ESTUDO-FRONTEND.md`** — documento de 15 seções com explicação de toda a
  estrutura (bootstrap, hash router, tema, camada mock, services, tipos/config, UI, views por papel,
  wizard, CSS/tokens, segurança, pendências, perguntas prováveis de defesa e glossário), com trechos de
  código e referências `arquivo:linha`.

### 24.7 Commit e push

- Commit criado só com `frontend/**` (docs pessoais ficaram fora):
  `b48a7d6 feat(frontend): superusuário com gestão de administradores + melhorias no dashboard admin`
  (15 arquivos: 642 inserções, 51 remoções).
- **Push**: branch `feat/paineis-frontend-rai-bruna` confirmada no remoto (`git ls-remote`).
- Branch agora tem 2 commits à frente de `developer`: `26d761f` (sessão 15) e `b48a7d6` (sessão 16).
- **PR não aberto via CLI**: `gh` não instalado. Link pronto:
  https://github.com/tahlly/barbearia-maraca/pull/new/feat/paineis-frontend-rai-bruna

### 24.8 Registros de commits (sessões 15 e 16 da branch)

| Commit | Mensagem | O que entrega |
|---|---|---|
| `26d761f` | `feat(frontend): painéis do profissional, recepcionista/admin e cliente + melhorias` | Sessão 15 — painéis, CSS, README (PR pendente) |
| `b48a7d6` | `feat(frontend): superusuário com gestão de administradores + melhorias no dashboard admin` | Sessão 16 — superusuário, dashboard admin, README |

### 24.9 Pendências / próximos passos

- [ ] **Abrir o PR** apontando para a base `developer` (gh ausente → abrir pelo link manualmente).
- [ ] Registrar pendência formal: papel **superusuário não existe** na documentação/DER aprovada —
      decisão do dono; precisa de contrato em `shared/types` e rotas no backend quando integrar.
- [ ] Backend ainda não tem rotas p/ o frontend (sem `PATCH /auth/me`, CRUD admins etc.) —
      contrato a alinhar na integração (ver `frontend/GUIA-ESTUDO-FRONTEND.md`, seção 6.10/13).
- [ ] `HISTORICO-FRONT-END.md`, `DOCUMENTACAO.md` e `GUIA-ESTUDO-FRONTEND.md` seguem **pessoais** —
      nunca commitados.

## 25. Sessão 17 (05/09/2026): Wizard sem tela "Seus dados" + scroll no modal

### 25.1 Contexto

Usuário notou dois problemas no modal de agendamento: (1) o passo **"Seus dados"** era desnecessário,
já que quem agenda está logado — o passo 3 virou a Confirmação (agora passo 3 de 3); (2) com listas
grandes (ex.: serviços no passo 1) o conteúdo **vazava para fora do modal** — passou a rolar dentro dele.

### 25.2 O que foi feito

- **`frontend/index.html`**
  - Stepper passa a ter **3 passos**: Serviços → Profissional & Horário → Confirmação (removido item
    "Seus dados").
  - Removida a `<section data-step="3">` com os campos `#client-name`, `#client-phone`,
    `#client-email`; o painel de Confirmação (sucesso) renumera de `data-step="4"` para `data-step="3"`.
- **`frontend/src/features/bookingWizard.ts`**
  - `TOTAL_STEPS` de 4 → **3**.
  - `submit()` **não pede mais dados**: monta o `BookingDraft` a partir da sessão/perfil
    (`getSession()` + `findClienteByEmail` → nome, e-mail e telefone); sem sessão/e-mail → toast de
    erro. Telefone ausente vai como `""` e o resumo mostra "—".
  - Botão vira **"Confirmar agendamento" no passo 2** (antes passo 3); `validateStep` agora só valida
    passos 1 (serviços) e 2 (profissional/data/hora).
  - Removidos inputs/referências órfãos (`nameInput`, `phoneInput`, `emailInput`, `attachPhoneMask`,
    `setFieldError`) e o preenchimento no `openForReschedule`.
  - `goToStep` também reseta o scroll do `.wizard__body` ao trocar de passo.
- **`frontend/css/modals.css`**
  - Causa raiz do overflow: o `form#booking-form` (filho flex do `.modal`) tinha `min-height: auto` e
    crescia além do `max-height`, empurrando o `.modal__body` para fora (o `overflow-y: auto` do body
    não atuava porque o item não encolhia).
  - Fix: `.modal > form { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }` e
    `.modal__body { flex: 1 1 auto; min-height: 0; }` — o **corpo é o único elemento rolável** em
    todos os passos (cabeçalho, stepper e rodapé fixos).
  - `max-height` do `.modal` ajustado de `90dvh` para `calc(100dvh - var(--space-4) * 2)` (cabe no
    padding do overlay, evita estourar em telas menores).

### 25.3 Validação

- `npm run typecheck` e `npm run build` OK (44 módulos, sem erros).
- Revisão de contrato: mock `createAppointment` aceita `phone` vazio (grava `""`); fluxo de
  reagendamento continua enviando apenas profissional/data/hora.

### 25.4 Docs atualizados

- `frontend/GUIA-ESTUDO-FRONTEND.md` — seção 10 reescrita (wizard de 3 passos, dados da sessão,
  scroll do modal) e contagem de linhas do `modals.css` na tabela 11.1.
- `docs/HISTORICO-FRONT-END.md` — esta sessão (25).

### 25.5 Pendências / próximos passos

- [ ] Teste visual manual completo do fluxo (serviço → profissional → data/hora → confirmar) com
      lista longa de serviços (verificar scroll e botão no passo 2) — QA pendente (regra do AGENTS.md).
- [ ] Reabrir o item de **PR** da branch `feat/paineis-frontend-rai-bruna` (base `developer`,
      sync prévio com `origin/developer`) para incluir este ajuste junto.
- [ ] `HISTORICO-FRONT-END.md`, `DOCUMENTACAO.md` e `GUIA-ESTUDO-FRONTEND.md` seguem **pessoais** —
      nunca commitados.

## 26. Sessão 18 (05/09/2026): Ajustes no menu mobile — CTA de agendamento + toggle de tema no drawer

### 26.1 Contexto

Usuário pediu dois ajustes na landing no mobile: (1) o **botão de agendamento do menu** (drawer)
ficava com a letra quase branca/difícil de ler e com fonte grande sem espaçamento lateral — faltava
permitir a **quebra do texto**; (2) não havia opção de **modo claro/escuro** no mobile (o `#theme-toggle`
só existia no desktop).

### 26.2 Causas raiz

1. **Letra "branca" (dark):** `.nav a { color: #a0a0b0 }` (`landing.css`, especificidade (0,1,1))
   sobrepunha a cor escura do `.header__btn--solid` (0,1,0) → texto cinza-claro sobre botão dourado.
2. **Modo claro:** além disso, `body.light-theme .nav.is-open a { color: var(--color-gold) }` (0,3,2)
   deixava o texto **dourado sobre dourado** (parecia "lavado") quando o drawer estava aberto.
3. **Resto do visual:** o CTA usava `white-space: nowrap` e fonte 0.88rem herdada — sem quebra e sem
   respiro lateral no mobile.
4. **Sem tema no mobile:** `#theme-toggle` fica dentro de `.header__actions`, que tem `display: none`
   em telas ≤768px (`landing.css`).

### 26.3 O que foi feito

- **`frontend/index.html`** — adicionado ao drawer mobile (após o `.nav__cta`) o botão
  `<button class="theme-toggle theme-toggle--nav" data-theme-toggle>` com ícone `bx-moon`.
- **`frontend/src/theme.ts`** — `initTheme()` passou a retornar `bindThemeToggles(document)`
  (liga todos os `[data-theme-toggle]` + sincroniza ícones), em vez de ligar só o `#theme-toggle`.
- **`frontend/css/landing.css`**
  - `@media (max-width: 768px)`: CTA `.nav__cta .header__btn` com `width: 100%`, `min-height: 46px`,
    `padding: 12px 16px`, `font-size: 0.72rem`, `line-height: 1.4`, `white-space: normal`,
    `text-align: center`.
  - `color: #111111` forçado (dark) em `.nav__cta .header__btn--solid`.
  - `body.light-theme .nav.is-open .nav__cta .header__btn--solid { color: #111111 }` (especificidade
    (0,4,1), vence `.nav.is-open a` dourado).
  - `.theme-toggle--nav`: base `display: none`; no mobile `inline-flex`, `align-self: flex-end`,
    `margin-top: var(--space-3)`; hovers próprios para dark/light.

### 26.4 Commit e push

- **Commit:** `f3da441` — `fix(frontend): ajusta CTA de agendamento e adiciona toggle de tema no menu mobile`
  (3 arquivos: `frontend/index.html`, `frontend/src/theme.ts`, `frontend/css/landing.css`).
- **Push:** `git push origin feat/paineis-frontend-rai-bruna` → remoto `f6b4f0a → f3da441`; **PR #41**
  atualizada automaticamente (contém o commit).
- Observação de fluxo: o commit de hoje ficou local a princípio; a branch só apareceu no GitHub após o
  push 👉 **commit ≠ publicar** (quem "cria a branch" no remoto é o push).

### 26.5 Validação

- `npm run typecheck` + `npm run build` OK (44 módulos).
- `curl` no dev server (5174) confirmou as regras novas servidas (`theme-toggle--nav`,
  `body.light-theme .nav.is-open .nav__cta .header__btn--solid`).
- Teste visual manual pendente (menu aberto no mobile, alternar claro/escuro no drawer — item abaixo).

### 26.6 Pendências / próximos passos

- [ ] Conferência visual no navegador (Ctrl+Shift+R): menu mobile com CTA legível nos dois temas
      (texto escuro sobre dourado) + toggle de tema funcionando no drawer.
- [ ] Teste do **login Google** segue pendente de correção do Ângelo (erro
      "Não foi possível concluir a autenticação com o Google"); ambiente de teste montado apenas na
      cópia `full`/5173 e worktree `/tmp/opencode/bm-backend`.
- [ ] Decisão em aberto: base da PR #41 (`main` vs `developer`) e renovar a PR conforme fluxo da equipe.
