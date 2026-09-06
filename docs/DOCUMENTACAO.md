# Documentação do Protótipo & Sistema de UI/UX — Barbearia Maracá

Este documento unifica e consolida todas as especificações técnicas, visão geral, paleta de cores, tipografia, componentes de UI, inventário completo de telas, modais e arquitetura do sistema da **Barbearia Maracá**.

---

## 1. Visão Geral do Projeto

* **Projeto:** Sistema Web para a Barbearia Maracá[cite: 5]
* **Tipo:** Aplicação web responsiva (Desktop / Mobile)[cite: 5, 6]
* **Tema Visual:** Dark mode — interface escura com acentos dourados[cite: 5, 6]
* **Famílias Tipográficas:** Inter, Montserrat[cite: 4, 5]
* **Total de Telas:** 30 frames[cite: 5]
* **Resolução Principal:** 1520×980px (painel Admin / Recepção / Profissional)[cite: 5]
* **Modais:** 600×840px / 662×740px / 800×749px[cite: 2, 3, 5]
* **Perfis de Usuário:**
  * **Administrador:** Acesso total (Dashboard, Serviços, Profissionais, Agendamentos, Configurações)[cite: 5].
  * **Recepcionista:** Gestão operacional (Serviços, Profissionais, Agendamentos, Configurações)[cite: 5].
  * **Profissional:** Visão própria (Dashboard, Agendamentos, Configurações)[cite: 5].
  * **Cliente:** Agendamento e perfil (Landing page, Login, Cadastro, Agendamentos, Configurações)[cite: 5].

---

## 2. Paleta de Cores

O protótipo utiliza uma paleta escura (dark mode) com acentos em dourado[cite: 5, 6].

### Cores Primárias & Fundo
* `#D4AF37` — Dourado (Accent / Brand)[cite: 1, 5]
* `#D4AF37` (10%) — Dourado 10%[cite: 5]
* `#090908` — Preto Profundo (Background Principal / Modais)[cite: 1, 2, 3, 5]
* `#121214` — Cinza Escuro 1 (Fundo do Card / Elementos em destaque)[cite: 1, 3, 5]
* `#1E1E22` — Cinza Escuro 2 (Containers / Sidebar / Cards)[cite: 1, 3, 5]
* `#18181A` — Cinza Escuro 3[cite: 5]
* `#2D2D35` — Cinza Borda / Divisores[cite: 1, 3, 5]

### Cores de Texto
* `#FFFFFF` — Branco (Títulos / Textos Principais)[cite: 1, 5]
* `#A0A0B0` — Cinza Claro[cite: 5]
* `#A0A0B0` (50%) — Cinza Claro 50%[cite: 5]
* `#9A9A9F` — Cinza Neutro[cite: 5]
* `#626270` — Cinza Médio[cite: 5]
* `#4A4A52` — Cinza Escuro Texto[cite: 5]

### Cores de Status
* `#2E7D32` — Verde (Sucesso / Confirmado)[cite: 1, 5]
* `#2E7D32` (10%) — Verde 10% (Fundo de Status Confirmado)[cite: 1, 5]
* `#D32F2F` — Vermelho (Erro / Perigo / Cancelado)[cite: 1, 5]
* `#D32F2F` (10%) — Vermelho 10% (Fundo de Status Cancelado)[cite: 1, 5]
* `#FF383C` — Vermelho Claro[cite: 5]
* `#E54D4D` — Vermelho Coral (Avisos / Mensagens de atenção)[cite: 5]

---

## 3. Tipografia

O protótipo utiliza duas famílias tipográficas: **Inter** (textos de interface, dados, labels e formulários) e **Montserrat** (títulos, CTAs, marca e destaques numéricos)[cite: 4, 5].

### Inter — Tipografia de Interface

| Peso | Tamanho | Aplicação / Uso |
| :--- | :--- | :--- |
| **Extra Bold** | 24px | Saudações, títulos de destaque cliente[cite: 4] |
| **Semi Bold** | 14px | Itens de menu, labels e navegação[cite: 4] |
| **Semi Bold** | 13px | Horários, dados em destaque na agenda[cite: 4] |
| **Semi Bold** | 12px | Títulos de seções na sidebar, cards[cite: 4] |
| **Semi Bold** | 11px | Labels em botões secundários, uploads[cite: 4] |
| **Bold** | 14px | Nomes de serviços e dados em destaque[cite: 4] |
| **Bold** | 13px | Números de calendário, ações inline[cite: 4] |
| **Bold** | 12px | Botão CANCELAR, labels em tags, ações de destaque[cite: 4] |
| **Bold** | 11px | Botões primários e secundários[cite: 4] |
| **Medium** | 14px | Links de navegação header landing page[cite: 4] |
| **Medium** | 13px | Dias do calendário[cite: 4] |
| **Regular** | 14px | Corpo de texto, descrições de serviço (line-height: 150%)[cite: 4] |
| **Regular** | 13px | Texto de formulários, dados em tabela[cite: 4] |
| **Regular** | 12px | Metadados, duração, subtítulos[cite: 4] |
| **Regular** | 10px | Labels de colunas de tabela (letter-spacing: 0.5)[cite: 4] |
| **Light** | 14px | Ação de recolher sidebar[cite: 4] |

### Montserrat — Títulos & Identidade Visual

| Peso | Tamanho | Aplicação / Uso |
| :--- | :--- | :--- |
| **Black** | 28px | Números grandes de KPI (Dashboard)[cite: 1, 4] |
| **Black** | 15px | Logo / Nome da barbearia (letter-spacing: 1.0)[cite: 4] |
| **ExtraBold** | 28px | Valores monetários / Métricas grandes[cite: 4] |
| **ExtraBold** | 20px | Títulos de modais (letter-spacing: 0.5)[cite: 4] |
| **ExtraBold** | 18px | Totais e valores de resumo[cite: 4] |
| **ExtraBold** | 16px | Subtítulos de seção em caixa alta (letter-spacing: 0.5)[cite: 4] |
| **Bold** | 20px | Preços de destaque[cite: 4] |
| **Bold** | 18px | Nomes de serviço em cards grandes[cite: 4] |
| **Bold** | 15px | CTAs, preços em cards[cite: 4] |
| **Bold** | 14px | Botões de CTA primários (letter-spacing: 1.0)[cite: 4] |
| **Bold** | 13px | Kickers de seção (letter-spacing: 1.5)[cite: 4] |
| **Bold** | 12px | Subtítulos, taglines (letter-spacing: 2.0)[cite: 4] |
| **Bold** | 11px | Labels de formatação em modais (letter-spacing: 1.5)[cite: 1, 4] |
| **Bold** | 8px | Texto legal / disclaimer (letter-spacing: 1.5)[cite: 4] |

---

## 4. Componentes & Padrões de UI

### Componentes Reutilizáveis

* **Sidebar (Navegação Lateral):**
  * Dimensões: `240×900px` (expandida) / `174×980px` (retraída)[cite: 1]
  * Fundo: `#1E1E22` com overlay `#000000` a 20%[cite: 1]
  * Borda direita: `#2D2D35`[cite: 3]
* **Botão Primário (CTA):**
  * Fundo: `#D4AF37` (dourado)[cite: 1]
  * Texto: `#121214` (escuro sobre dourado)[cite: 1]
  * Typography: Montserrat Bold 14px (letter-spacing: 1.0)[cite: 4]
* **Botão Secundário (Outline/Ghost):**
  * Fundo: Transparente[cite: 1]
  * Texto: `#D4AF37` (dourado)[cite: 1]
* **Botão Destrutivo:**
  * Fundo: `#D32F2F` (vermelho) ou transparente com borda vermelha[cite: 1]
  * Texto: `#FFFFFF` ou `#D32F2F`[cite: 1]
* **Service Card (Card de Serviço):**
  * Dimensões: `282×267px`[cite: 1]
  * Fundo: `#1E1E22`[cite: 1]
* **Staff Card (Card de Profissional):**
  * Dimensões: `360×253px`[cite: 1]
  * Fundo: `#1E1E22`[cite: 1]
* **Tabela de Agendamentos:**
  * Container: Fundo `#1E1E22`, borda `#2D2D35`[cite: 1]
  * Header: Borda inferior `#2D2D35`[cite: 1]
* **Campos de Formulário (Inputs):**
  * Layout: Vertical (Label + Input)[cite: 1]
  * Label: Montserrat Bold 11px (letter-spacing: 1.5)[cite: 1]
  * Padding: 12px[cite: 3]
* **Status Badges:**
  * **Confirmado:** Texto `#2E7D32`, fundo `#2E7D32` a 10%, borda `#2E7D32`[cite: 1]
  * **Cancelado:** Texto `#D32F2F`, fundo `#D32F2F` a 10%, borda `#D32F2F`[cite: 1]
* **KPI / Métricas (Dashboard):**
  * Fundo: `#1E1E22`, borda `#2D2D35`[cite: 1]
  * Número grande: Montserrat Black 28px ou ExtraBold 28px `#FFFFFF`[cite: 1, 4]
* **Modal Base:**
  * Dimensões: `600×840px` (padrão) ou `662×749px` / `662×740px` (cadastro de serviço)[cite: 1, 3]
  * Fundo: `#090908`[cite: 1, 3]

---

## 5. Inventário Completo de Telas

### Fluxo de Autenticação (Admin / Recepcionista / Profissional)
1. `tela-login` — Dimensões: `600×840px` | Fundo: `#1E1E1E` / `#090908`[cite: 2]
2. `tela-login/error` — Dimensões: `800×749px` | Fundo: `#090908`[cite: 2]
3. `tela-recuperar-login (1)` — Dimensões: `600×749px` | Fundo: `#090908`[cite: 2]
4. `link-recuperacao-senha` — Dimensões: `600×749px` | Fundo: `#090908`[cite: 2]
5. `tela-recuperar-login (2)` — Dimensões: `800×749px` | Fundo: `#090908`[cite: 2]

### Fluxo de Autenticação (Cliente)
1. `tela-login-cliente` — Dimensões: `600×912px` | Fundo: `#1E1E1E`[cite: 2]
2. `cadastro-login-cliente` — Dimensões: `800×900px` | Fundo: `#1E1E1E`[cite: 2]

### Painel do Administrador
1. `Administrador/dashboard` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
2. `Administrador/serviços` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
3. `Administrador/profissionais` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
4. `Administrador/agendamento` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
5. `Administrador/configurações` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
6. `Configurações de agendamento` — Dimensões: `1520×1557px` | Fundo: `#090908`[cite: 2]

### Painel da Recepcionista
1. `Recepcionista/serviços` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
2. `Recepcionista/profissionais` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
3. `Recepcionista/agendamento` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
4. `Recepcionista/configurações` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
5. `Recepcionista/configurações de agendamento` — Dimensões: `1520×1862px` | Fundo: `#090908`[cite: 2]

### Painel do Profissional
1. `Profissional/dashboard` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
2. `Profissional/agendamento` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
3. `Profissional/configurações` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]

### Área do Cliente
1. `05-Cliente Desktop` — Dimensões: `1440×1056px` | Fundo: `#0C0C0E`[cite: 2]
2. `Cliente/configurações` — Dimensões: `1520×980px` | Fundo: `#090908`[cite: 2]
3. `Single Page-desktop` — Dimensões: `1520×2717px` | Fundo: `#000000` / `#090908`[cite: 2]

---

## 6. Modais & Especificações de Layout

### Fluxo de Agendamento (4 passos + confirmação)
* `modal - agendamento - passo 1` — `600×840px` | Fundo: `#090908`[cite: 3]
  * *Seleção de Serviços:* Checkboxes/cards interativos para seleção de um ou múltiplos serviços (ex: Corte + Barba) com atualização em tempo real do valor total[cite: 6].
* `modal - agendamento - passo 2` — `600×840px` | Fundo: `#090908`[cite: 3]
  * *Data e Horário:* Componente de calendário. Datas sem disponibilidade usam estado de UI Disabled (cinza e inativo)[cite: 6].
* `modal - agendamento - passo 3` — `600×840px` | Fundo: `#090908`[cite: 3]
  * *Cadastro do Cliente:* Formulário com validação (Nome Completo, Telefone WhatsApp, E-mail)[cite: 6].
* `modal - agendamento - passo 4` — `600×840px` | Fundo: `#090908`[cite: 3]
  * *Revisão e confirmação das informações do agendamento.*
* `modal - agendamento confirmado` — `600×840px` | Fundo: `#090908`[cite: 3]
  * *Confirmação:* Tela de sucesso com aviso de envio de notificação (E-mail/WhatsApp) e destaque visual para o Código Alfanumérico Gerado (ex: `BH-8F92K`)[cite: 6].

### Modais de Cancelamento e Detalhes
* `modal-cancelamento (Admin)` — `600×840px` | Fundo: `#090908`[cite: 3]
* `modal-cancelamento (Recepcionista)` — `600×840px` | Fundo: `#090908`[cite: 3]
* `modal-agendamento - hair (Cliente)` — `600×840px` | Fundo: `#090908`[cite: 3]
* `modal - Acompanhar Agendamento` / `Detalhes do Agendamento`[cite: 6]

### Modais de Cadastro
* `modal-cadastro de serviços/novo serviço` — `662×740px` | Fundo: `#090908`[cite: 3]
* `modal-cadastro de profissional` — `600×749px` | Fundo: `#090908`[cite: 3]
* `modal-cadastro de serviços/colaboradores (Recepcionista)` — `600×740px` | Fundo: `#090908`[cite: 3]

---

## 7. Arquitetura de Layout e Design System

### Estrutura do Painel (`1520×980px`)
* **Container Externo:** Padding 40px, Gap 80px, Fundo `#090908`[cite: 3]
* **Screen Interno:** `1440×900px`, Fundo `#121214`[cite: 3]
* **Sidebar:** 240px largura fixa, Fundo `#1E1E22`, Borda direita `#2D2D35`[cite: 1, 3]
* **Conteúdo Principal:** 1200px, Padding 40px, Gap vertical 24px[cite: 3]

### Sistema de Espaçamento
* **Gap entre Sidebar e Conteúdo:** 0px (embutido no layout)[cite: 3]
* **Padding de Cards:** 16–20px[cite: 3]
* **Gap entre Cards (Grid):** 20–24px[cite: 3]
* **Espaçamento de Itens de Menu:** 8px[cite: 3]
* **Espaçamento entre Seções:** 24–48px[cite: 3]
* **Padding de Botões:** 12px vertical, 16px horizontal[cite: 3]
* **Padding de Inputs:** 12px[cite: 3]

### Border Radius
* **Botões:** 4px[cite: 3]
* **Itens de Menu (Sidebar):** 6px[cite: 3]
* **Inputs / Selects:** 4–6px[cite: 3]
* **Cards (Serviço / Profissional):** 8px[cite: 3]
* **Tags / Badges:** 4px[cite: 3]
* **Avatar Circular:** 18px (metade de 36px)[cite: 3]
* **Componentes de Documentação:** 10–13px[cite: 3]

### Sombras e Efeitos
* O protótipo **não utiliza sombras (drop-shadow)** expressivas[cite: 3].
* A profundidade é criada por **camadas de cor** (escuro > mais escuro)[cite: 3].
* **Overlay de Modais:** `#090908` a 80%[cite: 3].
* **Bordas sutis (`#2D2D35`)** criam separação visual[cite: 3].
---

## 8. Painel (App Shell) — Comportamento & Navegação (registro de decisão de UI/UX)

> Nota de revisão: esta seção registra decisões de UI/UX do painel interno, tomadas em
> sessão de refinamento, para manter consistência entre os papéis (Admin / Recepção /
> Profissional / Cliente) e com o Figma.

### 8.1 Layout do painel (Desktop e Mobile)

* **Desktop:** a sidebar fica **fixa e sempre visível**, ocupando a altura da tela;
  não rola com o conteúdo. O **conteúdo à direita rola** dentro da própria área; o topo
  (`topbar` com título + tema) permanece fixo.
* **Mobile (< 768px):** a sidebar é **oculta por padrão** e vira um **drawer lateral**
  (mesmo layout vertical do desktop). Para abrir, usa-se o **botão hamburger** no topo;
  um **backdrop** escuro cobre o conteúdo e fecha o menu ao tocar fora. O menu também
  fecha automaticamente ao navegar por um link.
* A estrutura do painel é **compartilhada** entre todos os papéis (mesmo componente de
  sidebar/topbar/rodapé — avatar, nome, função, Sair).

### 8.2 Sidebar — itens padronizados

* Cada papel exibe apenas os itens que lhe cabem (RBAC).
* Item padrão de retorno ao site público: **"Voltar ao site"** (ícone seta à esquerda),
  que navega para a landing **sem deslogar** — assim o usuário pode voltar e reentrar no
  painel pelo acesso administrativo sem refazer login.

### 8.3 Profissional (Barbeiro) — permissões de visualização

* O **Profissional apenas visualiza** seus agendamentos e os **status**
  (Pendente / Confirmado / Concluído / Cancelado). **Não há ações** de confirmar ou
  cancelar no seu painel (não possui essa permissão).
* Tabela de agendamentos do profissional é **somente leitura**, com filtros por status,
  busca por cliente e consulta por intervalo de datas.

### 8.4 Roteamento de retorno (sessão preservada)

* "Voltar ao site" → landing (`#/`) sem `logout`. Ao clicar em "Acesso Administrativo"
  (`#/login`), se há sessão, o login redireciona **direto ao painel do papel** (sem pedir
  credenciais novamente).

### 8.5 Administrador e Recepcionista (`manage.ts`)

* Usam o mesmo painel compartilhado, diferenciados por papel (Admin ganha "Dashboard" e
  dados financeiros; Recepcionista não acessa financeiro).
* **Menu**: item de retorno é **"Voltar ao site"** (ícone seta à esquerda), igual ao
  profissional — substitui o antigo "Início".
* **Aba Agendamentos**: adicionado bloco **"CONSULTAR AGENDAMENTOS"** (`.adv-filter`) com
  filtro por intervalo de datas (início/fim), botões "Consultar" e "Limpar Filtro", além da
  busca por cliente e filtro por status. O intervalo padrão é o ano corrente.
* **Tabela encaixada**: usa `table--fit` (`table-layout: fixed`), distribuindo as 7 colunas
  na largura disponível, sem scroll horizontal; em mobile as células quebram linha.
* **Coluna Ações (Agendamentos)**: pendente → botão **"CONFIRMAR"**; confirmado → apenas
  "Cancelar". (A recepcionista pode confirmar e cancelar agendamentos.)
* **Aba Serviços**: coluna Ações tem **"Editar"** e **"Excluir"**; excluir usa
  `confirmDialog` (danger) e remove o serviço (Admin e Recepcionista podem excluir).

### 8.6 Cliente (`minhaConta.ts`)

* Menu com **apenas 3 itens**: **Agendamentos** (`#/minha-conta`), **Configurações**
  (`#/minha-conta/configuracoes`) e **Voltar ao site** (`#/`, sem deslogar).
* **Aba Agendamentos** (histórico completo do próprio cliente): fonte
  `listByEmail(usuarioLogado)` — o cliente só enxerga os **próprios** agendamentos;
  cabeçalho `MEUS AGENDAMENTOS` + filtro de status + busca por **serviço**; bloco
  **CONSULTAR AGENDAMENTOS** (datas início/fim + Consultar + Limpar Filtro);
  botão **Novo agendamento** (abre o wizard de agendamento).
* **Colunas da tabela**: Serviço · Profissional · Data/Hora · Status · Ações
  (cliente **não** vê colunas de cliente/telefone).
* **Ações** (agendamentos pendentes/confirmados): **REAGENDAR** (muda data/hora via wizard)
  e **Cancelar** (com confirmação). Concluído/cancelado: sem ação.
* **Aba Configurações**: mesmo padrão dos demais papéis (foto, nome, alterar senha,
  alterar email) via `updateSessionUser`/`updateUsuarioInterno`.

