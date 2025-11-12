# Documento de Arquitetura do Sistema de Networking

## 1. Visão Geral
A plataforma conecta membros de grupos de networking, permitindo gestão de participantes, comunicação, controle financeiro e acompanhamento de performance.  
**Stack principal:**
- Frontend: React + Next.js + Ant Design + Jest + Tailwind
- Backend: Node.js (Express, padrão MVC)  
- Banco: PostgreSQL

---

## 2. Diagrama da Arquitetura
```mermaid
graph TD

%% --- Usuário e Frontend ---
U[Usuário / Navegador] -->|HTTP/HTTPS| A[Frontend - Next.js e React]

%% --- Comunicação Front-Back ---
A -->|API REST / JSON| B[Backend - Node.js Express MVC]

%% --- Camadas Internas do Backend ---
subgraph B["Backend - Camadas"]
  B1[Controller Layer - Rotas e Validação]
  B2[Service Layer - Regras de Negócio]
  B3[Model Layer - ORM \(Prisma ou Sequelize\)]
  B1 --> B2 --> B3
end

%% --- Banco de Dados ---
B3 -->|SQL Queries| C[(PostgreSQL Database)]

%% --- Cache / Sessões (opcional futuro) ---
B2 --> R[(Redis - Cache e Sessões)]

%% --- Autenticação e Segurança ---
B1 --> T[JWT Auth e Middleware de Segurança]

%% --- Integrações externas ---
B2 --> D[Serviços Externos - Email e Pagamentos]
B2 --> L[Logger e Monitoramento - Winston e Grafana]

%% --- Painel Administrativo ---
A -->|Rotas protegidas| ADM[Área Administrativa / Dashboard]

%% --- Conexões e Fluxo ---
U -->|Acessa via browser| A
ADM -->|Gerencia membros, finanças e relatórios| B


```

---

## 3. Modelo de Dados
**Usuários**
- id (PK, UUID)  
- nome  
- email (UNIQUE)  
- senha_hash  
- tipo (admin, membro)  
- status (pendente, aprovado, ativo)

**Intenções**
- id (PK)
- nome  
- email  
- mensagem  
- status (pendente, aprovado, reprovado)

**Indicações**
- id (PK)  
- sender_id (FK → users.id)
- receiver_id (FK → users.id)  
- descrição  
- status (nova, em_andamento, fechada)

**Mensalidades / Pagamentos**
- id (PK)  
- member_id (FK → users.id)  
- valor  
- status (pendente, pago, atrasado)  
- vencimento

---

## 4. Estrutura de Componentes (Frontend)
```text
  src/
  ├─ app/
  │  ├─ admin/
  │  │  └─ page.tsx
  │  ├─ form/
  │  │  └─ page.tsx
  │  ├─ invitation/
  │  ├─ invitations/
  │  ├─ login/
  │  ├─ register/
  │  └─ stats/
  ├─ components/
  │  ├─ button/
  │  │  ├─ button.tsx
  │  │  └─ button.test.tsx
  │  ├─ input/
  │  ├─ navbar/
  │  ├─ paragraph/
  │  ├─ table/
  │  └─ title/
  ├─ hooks/
  │  ├─ withAuth.tsx
  │  └─ withAuth.test.tsx
  ├─ store/
  │  ├─ userStore.ts
  │  └─ userStore.test.tsx
  ├─ globals.css
  ├─ layout.tsx
  └─ page.tsx
```
- UI: Ant Design (Forms, Tables, Modals, Buttons, Inputs).  
- Estado: Context API (Auth) + Zustand para dashboards complexos.  
- Testes: Jest.

---

## 5. Definição da API (base /api/v1)
### POST /auth/login
**Request:** `{ "email", "senha" }`  
**Response:** `{ "token", "user": { id, nome, tipo } }`

### POST /intentions
**Request:** `{ "nome", "email", "mensagem" }`  
**Response:** `{ "id", "status": "pendente" }`

### GET /members
**Response:** `[ { id, nome, email, status } ]`

### PATCH /members/:id/approve
**Response:** `{ "message": "Membro aprovado" }`

### POST /indications
**Request:** `{ "sender_id", "receiver_id", "descricao" }`  
**Response:** `{ "id", "status": "nova" }`

### POST /meetings/:id/attendance
**Request:** `{ "member_id", "present": true }`  
**Response:** `{ "message": "Presença registrada" }`

### POST /indications/:id/thanks
**Request:** `{ "created_by", "public_message" }`  
**Response:** `{ "message": "Obrigado registrado" }`

### Payments
- POST /payments (gerar fatura)  
- PATCH /payments/:id (atualizar status)

---

## 6. Justificativas Técnicas
- **PostgreSQL:** integridade referencial, transações ACID, suporta JSONB para flexibilidade.  
- **Next.js:** SSR + SPA, rotas fáceis e bom SEO para landing pages públicas.  
- **Express + Node.js:** leve, altamente suportado; padrão MVC para separação de responsabilidades.  
- **Prisma (recomendado):** ORM tipado para produtividade; alternativa: Sequelize.  
- **Ant Design:** acelera desenvolvimento de UI consistente.

---

## 7. Segurança e Boas Práticas
- Autenticação: JWT (access + refresh), armazenar refresh em HttpOnly cookie.  
- Senhas: bcryptjs.  
- Validação: Zod para request bodies.  
- Proteções: Helmet, CORS whitelist, rate-limit.  
- Logs: Winston/Pino; métricas: Prometheus/Grafana.

---

## 8. Testes e CI
- Unitários: Jest (services, utils).  
- Frontend: Jest + React Testing Library.  
- Integração: Supertest para endpoints.  
- CI: rodar testes e lint antes de merge (GitHub Actions).

  > Observação: Os testes das páginas principais do frontend serão realizados futuramente utilizando testes end-to-end (E2E) cypress

---

