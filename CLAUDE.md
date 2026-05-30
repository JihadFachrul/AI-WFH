# CLAUDE.md — AI Workforce Operating System (AWOS)

> **WAJIB DIBACA SEBELUM MENGERJAKAN APAPUN.**
> Dokumen ini adalah source-of-truth untuk seluruh pengembangan AWOS. Ikuti semua konvensi, arsitektur, dan keputusan desain yang tertulis di sini. Jangan berasumsi atau berimprovisasi tanpa referensi dari dokumen ini.

---

## 1. RINGKASAN PROYEK

**Nama Proyek:** AI Workforce Operating System (AWOS)
**Tipe:** Platform enterprise internal berbasis AI
**Tujuan:** Membantu perusahaan mengelola WFH, hybrid working, dan distributed team secara efektif, realtime, terukur, dan terotomatisasi.

### Yang AWOS BUKAN:
- ❌ Bukan employee surveillance system
- ❌ Bukan screenshot/mouse/webcam tracker
- ❌ Bukan spyware atau activity monitor invasif

### Yang AWOS ADALAH:
- ✅ Centralized operational workspace
- ✅ Task & KPI management platform
- ✅ AI-powered productivity augmentation
- ✅ Workflow automation engine
- ✅ Knowledge management system dengan RAG

---

## 2. ARSITEKTUR SISTEM

### Monorepo Structure
```
awos/
├── apps/
│   ├── api/          # NestJS Backend (Port 3001)
│   └── web/          # Next.js Frontend (Port 3000)
├── services/
│   └── ai/           # FastAPI AI Service (Port 8000)
├── packages/
│   ├── shared/       # Shared types, DTOs, constants
│   ├── ui/           # Shared UI components (jika multi-app)
│   └── config/       # Shared config (eslint, tsconfig base)
├── infrastructure/   # Docker, K8s, Terraform configs
├── docs/             # Dokumentasi teknis
├── scripts/          # Dev & deployment scripts
├── prisma.config.ts  # Root prisma config
└── docker-compose.yml
```

### Tech Stack

| Layer | Teknologi | Versi Target |
|-------|-----------|--------------|
| Frontend | Next.js (App Router) | 15.x |
| UI Components | shadcn/ui + Tailwind CSS | Latest |
| State Management | Zustand | 5.x |
| Backend | NestJS | 10.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 16.x |
| Cache | Redis | 7.x |
| AI Service | FastAPI + LangChain | Python 3.11+ |
| AI Model | Claude API (Anthropic) | claude-sonnet |
| Vector DB | pgvector (dalam PostgreSQL) | Latest |
| Realtime | Socket.io (WebSocket) | Latest |
| Queue | BullMQ (Redis-backed) | Latest |
| Auth | JWT + Refresh Token | - |
| Package Manager | pnpm (workspace) | 9.x |
| Container | Docker + Docker Compose | - |

---

## 3. MODUL APLIKASI

### 3.1 Authentication & RBAC
**Path:** `apps/api/src/modules/auth/`

**Fitur:**
- Register, Login, Logout
- JWT Access Token (15 menit) + Refresh Token (7 hari)
- Role-Based Access Control dengan roles: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EMPLOYEE`
- Permission guard per endpoint
- Password hashing dengan bcrypt

**Prisma Models:** `User`, `Role`, `Permission`, `RefreshToken`

**Endpoints:**
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

---

### 3.2 Task Management
**Path:** `apps/api/src/modules/tasks/`

**Fitur:**
- CRUD task dengan status: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`, `CANCELLED`
- Priority: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Assign task ke user/team
- Task dependencies (blocking/blocked-by)
- Sub-task (parent-child)
- Due date + reminder
- Task comment & activity log
- Tag/label system
- File attachment reference

**Prisma Models:** `Task`, `TaskComment`, `TaskActivity`, `TaskTag`, `TaskAttachment`

**Endpoints:**
```
GET    /tasks
POST   /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
POST   /tasks/:id/comments
GET    /tasks/:id/activity
PATCH  /tasks/:id/status
POST   /tasks/:id/assign
```

---

### 3.3 KPI Dashboard
**Path:** `apps/api/src/modules/kpi/`

**Fitur:**
- Definisi KPI per role/departemen
- Input KPI progress oleh employee
- Auto-calculate KPI dari task completion
- Historical KPI tracking (weekly, monthly, quarterly)
- KPI alert ketika di bawah threshold
- Team & individual KPI comparison

**Prisma Models:** `KPIDefinition`, `KPIRecord`, `KPIAlert`

**Endpoints:**
```
GET    /kpi/definitions
POST   /kpi/definitions
GET    /kpi/records
POST   /kpi/records
GET    /kpi/dashboard/:userId
GET    /kpi/team/:teamId
```

---

### 3.4 Realtime Notification
**Path:** `apps/api/src/modules/notifications/`

**Fitur:**
- Push notification via WebSocket (Socket.io)
- Notification types: `TASK_ASSIGNED`, `TASK_UPDATED`, `KPI_ALERT`, `MENTION`, `WORKFLOW_TRIGGER`, `SYSTEM`
- Notification read/unread state
- Notification preferences per user
- In-app notification center

**Prisma Models:** `Notification`, `NotificationPreference`

**WebSocket Events:**
```
notification:new
notification:read
notification:readAll
```

---

### 3.5 AI Workspace
**Path:** `apps/api/src/modules/ai-workspace/` + `services/ai/`

**Fitur:**
- Chat interface dengan AI assistant internal
- Context-aware: AI tahu data task, KPI, dan workflow user
- Conversation history per user
- AI bisa create/update task langsung dari chat
- AI bisa generate report summary
- AI bisa detect bottleneck dari data KPI

**AI Capabilities:**
- Summarization (laporan, task list, KPI)
- Recommendation (prioritas task, workflow improvement)
- Natural language task creation
- Bottleneck detection dari data historis
- Productivity insights

**Endpoints (via API yang proxy ke FastAPI):**
```
POST /ai/chat
GET  /ai/conversations
GET  /ai/conversations/:id
DELETE /ai/conversations/:id
POST /ai/summarize
POST /ai/analyze-kpi
```

---

### 3.6 Knowledge Base AI (RAG System)
**Path:** `apps/api/src/modules/knowledge/` + `services/ai/`

**Fitur:**
- Upload dokumen (PDF, DOCX, TXT, MD)
- Automatic chunking & embedding ke pgvector
- Semantic search atas knowledge base
- AI menjawab pertanyaan berdasarkan dokumen internal
- Knowledge categorization (SOP, Policy, Technical Docs)
- Access control per dokumen

**Prisma Models:** `KnowledgeDocument`, `KnowledgeChunk`, `KnowledgeCategory`

**Endpoints:**
```
POST   /knowledge/documents      # Upload dokumen
GET    /knowledge/documents
GET    /knowledge/documents/:id
DELETE /knowledge/documents/:id
POST   /knowledge/search         # Semantic search
POST   /knowledge/ask            # RAG Q&A
```

---

### 3.7 Workflow Automation
**Path:** `apps/api/src/modules/workflow/`

**Fitur:**
- Visual workflow builder (trigger → condition → action)
- Trigger types: `TASK_STATUS_CHANGE`, `KPI_THRESHOLD`, `SCHEDULE`, `MANUAL`, `WEBHOOK`
- Action types: `CREATE_TASK`, `SEND_NOTIFICATION`, `UPDATE_KPI`, `CALL_WEBHOOK`, `ASSIGN_USER`, `SEND_EMAIL`
- Condition logic (AND/OR)
- Workflow execution log
- Template workflow yang bisa di-clone

**Prisma Models:** `Workflow`, `WorkflowTrigger`, `WorkflowCondition`, `WorkflowAction`, `WorkflowExecution`

**Endpoints:**
```
GET    /workflows
POST   /workflows
GET    /workflows/:id
PATCH  /workflows/:id
DELETE /workflows/:id
POST   /workflows/:id/execute
GET    /workflows/:id/executions
POST   /workflows/templates
```

---

### 3.8 Async Reporting
**Path:** `apps/api/src/modules/reports/`

**Fitur:**
- Generate report secara async (via BullMQ queue)
- Report types: `TASK_SUMMARY`, `KPI_REPORT`, `TEAM_PRODUCTIVITY`, `WORKFLOW_AUDIT`
- Format output: PDF, Excel, JSON
- Scheduled report (cron)
- Report sharing via link

**Prisma Models:** `Report`, `ReportSchedule`

**Queue:** `report-generation` (BullMQ)

**Endpoints:**
```
POST   /reports/generate
GET    /reports
GET    /reports/:id
GET    /reports/:id/download
POST   /reports/schedules
GET    /reports/schedules
PATCH  /reports/schedules/:id
DELETE /reports/schedules/:id
```

---

### 3.9 Productivity Analytics
**Path:** `apps/api/src/modules/analytics/`

**Fitur:**
- Task completion rate per user/team
- Average task resolution time
- Overdue task trends
- KPI trend visualization
- Team workload distribution
- Peak productivity hours (dari task activity timestamps)
- Department comparison dashboard

**Endpoints:**
```
GET /analytics/overview
GET /analytics/tasks
GET /analytics/kpi
GET /analytics/team/:teamId
GET /analytics/user/:userId
GET /analytics/workload
```

---

### 3.10 AI Agents
**Path:** `services/ai/agents/`

**Agent Types:**
- **Task Agent**: Bisa buat, update, assign task via natural language
- **KPI Agent**: Analisis KPI, beri rekomendasi improvement
- **Report Agent**: Generate laporan otomatis dari data
- **Workflow Agent**: Saran optimasi workflow berdasarkan data historis

**Implementasi:** LangChain Agents dengan tool calling ke API internal AWOS

---

## 4. DATABASE SCHEMA (PRISMA)

**Path:** `apps/api/prisma/schema.prisma`

### Konvensi Prisma:
- Semua model menggunakan `id` sebagai UUID (`@default(uuid())`)
- Selalu ada `createdAt DateTime @default(now())` dan `updatedAt DateTime @updatedAt`
- Soft delete menggunakan `deletedAt DateTime?`
- Enum didefinisikan di level Prisma
- Relasi menggunakan nama yang deskriptif

### Core Models Overview:
```prisma
// User & Auth
model User         { ... }
model Role         { ... }
model Permission   { ... }
model RefreshToken { ... }

// Organization
model Organization { ... }
model Department   { ... }
model Team         { ... }
model TeamMember   { ... }

// Task
model Task           { ... }
model TaskComment    { ... }
model TaskActivity   { ... }
model TaskTag        { ... }
model TaskAttachment { ... }

// KPI
model KPIDefinition { ... }
model KPIRecord     { ... }
model KPIAlert      { ... }

// Notification
model Notification           { ... }
model NotificationPreference { ... }

// Knowledge
model KnowledgeDocument  { ... }
model KnowledgeChunk     { ... }
model KnowledgeCategory  { ... }

// Workflow
model Workflow          { ... }
model WorkflowTrigger   { ... }
model WorkflowCondition { ... }
model WorkflowAction    { ... }
model WorkflowExecution { ... }

// Report
model Report         { ... }
model ReportSchedule { ... }

// AI
model AIConversation { ... }
model AIMessage      { ... }
```

---

## 5. STRUKTUR FOLDER DETAIL

### Backend (NestJS) — `apps/api/src/`
```
src/
├── main.ts                    # Bootstrap NestJS app
├── app.module.ts              # Root module
├── app.controller.ts
├── app.service.ts
│
├── common/
│   ├── decorators/            # Custom decorators (@CurrentUser, @Roles, dll)
│   ├── filters/               # Exception filters (global HTTP exception filter)
│   ├── guards/                # Guards (JwtAuthGuard, RolesGuard)
│   ├── interceptors/          # Interceptors (logging, transform response)
│   ├── pipes/                 # Validation pipes
│   └── middleware/            # HTTP middlewares
│
├── config/
│   ├── app.config.ts          # App config (port, env)
│   ├── database.config.ts     # PostgreSQL/Prisma config
│   ├── redis.config.ts        # Redis config
│   ├── jwt.config.ts          # JWT config
│   └── ai.config.ts           # AI service URL config
│
├── prisma/
│   ├── prisma.module.ts       # PrismaModule (global)
│   └── prisma.service.ts      # PrismaService extends PrismaClient
│
├── shared/
│   ├── dto/                   # Shared DTOs (PaginationDto, dll)
│   ├── types/                 # Shared TypeScript types
│   └── constants/             # App constants, enums
│
├── utils/
│   ├── pagination.util.ts     # Pagination helper
│   ├── hash.util.ts           # bcrypt helpers
│   └── date.util.ts           # Date helpers
│
└── modules/
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── strategies/
    │   │   ├── jwt.strategy.ts
    │   │   └── jwt-refresh.strategy.ts
    │   ├── guards/
    │   │   └── jwt-auth.guard.ts
    │   └── dto/
    │       ├── login.dto.ts
    │       └── register.dto.ts
    │
    ├── users/
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── dto/
    │
    ├── tasks/
    │   ├── tasks.module.ts
    │   ├── tasks.controller.ts
    │   ├── tasks.service.ts
    │   ├── tasks.gateway.ts   # WebSocket gateway untuk task updates
    │   └── dto/
    │
    ├── kpi/
    ├── notifications/
    │   ├── notifications.module.ts
    │   ├── notifications.service.ts
    │   └── notifications.gateway.ts  # Socket.io gateway
    ├── ai-workspace/
    ├── knowledge/
    ├── workflow/
    ├── reports/
    ├── analytics/
    └── health/                        # Health check endpoint
```

### Frontend (Next.js) — `apps/web/`
```
web/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing / redirect
│   ├── globals.css
│   │
│   ├── (auth)/                  # Auth route group (no sidebar)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   └── (dashboard)/             # Dashboard route group (with sidebar)
│       ├── layout.tsx           # Dashboard layout (sidebar + header)
│       ├── page.tsx             # Dashboard home
│       ├── tasks/
│       │   ├── page.tsx         # Task list
│       │   └── [id]/page.tsx    # Task detail
│       ├── kpi/
│       │   └── page.tsx
│       ├── ai/
│       │   └── page.tsx         # AI chat workspace
│       ├── knowledge/
│       │   └── page.tsx
│       ├── workflows/
│       │   └── page.tsx
│       ├── reports/
│       │   └── page.tsx
│       ├── analytics/
│       │   └── page.tsx
│       └── settings/
│           └── page.tsx
│
├── components/
│   ├── ui/                      # shadcn/ui components (jangan edit manual)
│   ├── layout/                  # Sidebar, Header, Breadcrumb
│   ├── tasks/                   # Task-specific components
│   ├── kpi/                     # KPI-specific components
│   ├── ai/                      # AI chat components
│   ├── knowledge/               # Knowledge base components
│   ├── workflow/                # Workflow builder components
│   ├── analytics/               # Chart & analytics components
│   └── shared/                  # Reusable shared components
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useSocket.ts             # WebSocket hook
│   └── useAI.ts
│
├── lib/
│   ├── utils.ts                 # cn() dan utilities
│   ├── api.ts                   # Axios instance + interceptors
│   └── socket.ts                # Socket.io client setup
│
├── store/                       # Zustand stores
│   ├── auth.store.ts
│   ├── tasks.store.ts
│   ├── notifications.store.ts
│   └── ui.store.ts
│
├── types/                       # Frontend TypeScript types
│   ├── api.types.ts
│   ├── task.types.ts
│   └── user.types.ts
│
└── constants/                   # Frontend constants
    └── routes.ts
```

### AI Service (FastAPI) — `services/ai/`
```
services/ai/
├── main.py
├── requirements.txt
├── .env
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── config.py          # Settings (Pydantic BaseSettings)
│   │   └── security.py        # API key validation
│   ├── api/
│   │   └── v1/
│   │       ├── chat.py
│   │       ├── knowledge.py
│   │       └── analytics.py
│   ├── services/
│   │   ├── chat_service.py     # LangChain chat
│   │   ├── rag_service.py      # RAG pipeline
│   │   └── embedding_service.py
│   ├── agents/
│   │   ├── task_agent.py
│   │   ├── kpi_agent.py
│   │   └── report_agent.py
│   └── models/
│       └── schemas.py          # Pydantic models
```

---

## 6. KONVENSI CODING

### TypeScript / NestJS

```typescript
// ✅ BENAR - Gunakan class-validator di semua DTO
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;
}

// ✅ BENAR - Response selalu dibungkus ResponseDto
// Gunakan interceptor TransformResponseInterceptor
{
  "success": true,
  "data": { ... },
  "message": "Task created successfully",
  "meta": { "page": 1, "total": 100 }  // jika pagination
}

// ✅ BENAR - Error response via global exception filter
{
  "success": false,
  "error": "TASK_NOT_FOUND",
  "message": "Task dengan ID tersebut tidak ditemukan",
  "statusCode": 404
}
```

### Naming Conventions

| Context | Convention | Contoh |
|---------|-----------|--------|
| File NestJS | kebab-case | `task-management.service.ts` |
| Class | PascalCase | `TaskManagementService` |
| Method/Var | camelCase | `createTask()`, `taskId` |
| Prisma Model | PascalCase | `TaskComment` |
| DB Column | snake_case (Prisma handle) | `created_at` |
| ENV Variable | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| React Component | PascalCase | `TaskCard.tsx` |
| React Hook | camelCase + use prefix | `useTaskList.ts` |
| Zustand Store | camelCase + Store suffix | `taskStore.ts` |
| API Route | kebab-case plural | `/api/v1/task-comments` |

### Frontend Conventions

```tsx
// ✅ BENAR - Semua API call via hooks, bukan langsung di component
// hooks/useTasks.ts
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then(r => r.data)
  })
}

// ✅ BENAR - Server components untuk data fetching (Next.js App Router)
// Client components hanya untuk interaktivitas

// ✅ BENAR - Gunakan 'use client' hanya jika butuh hooks/event handlers
'use client'

// ✅ BENAR - Loading state menggunakan Suspense + skeleton
<Suspense fallback={<TaskListSkeleton />}>
  <TaskList />
</Suspense>
```

---

## 7. ENVIRONMENT VARIABLES

### Backend (`apps/api/.env`)
```env
# App
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://awos:awos_password@localhost:5432/awos_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# AI Service
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=internal-api-key

# CORS
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=AWOS
```

### AI Service (`services/ai/.env`)
```env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://awos:awos_password@localhost:5432/awos_db
API_SECRET_KEY=internal-api-key
ENVIRONMENT=development
```

---

## 8. DOCKER & INFRASTRUKTUR

### Services di Docker Compose:
```yaml
services:
  postgres:    # Port 5432
  redis:       # Port 6379
  api:         # Port 3001 (NestJS)
  web:         # Port 3000 (Next.js)
  ai-service:  # Port 8000 (FastAPI)
  pgadmin:     # Port 5050 (dev only)
```

---

## 9. API VERSIONING & GLOBAL PREFIX

- Semua API endpoint menggunakan prefix: `/api/v1/`
- Contoh: `http://localhost:3001/api/v1/tasks`
- Health check: `GET /health` (tanpa prefix)
- WebSocket namespace: `/socket.io`

---

## 10. AUTHENTICATION FLOW

```
1. POST /api/v1/auth/login
   → Returns: { accessToken, refreshToken, user }

2. Frontend simpan accessToken di memory (Zustand)
   Frontend simpan refreshToken di httpOnly cookie

3. Setiap request: Authorization: Bearer <accessToken>

4. Jika 401, frontend auto-call POST /api/v1/auth/refresh
   → Returns: { accessToken }

5. POST /api/v1/auth/logout
   → Invalidate refreshToken di DB
```

---

## 11. WEBSOCKET EVENTS

### Client → Server
```
task:subscribe    { taskId }
task:unsubscribe  { taskId }
room:join         { roomId }
```

### Server → Client
```
notification:new     { notification }
task:updated         { task }
task:comment:new     { comment, taskId }
kpi:alert            { alert }
workflow:executed    { execution }
```

---

## 12. ATURAN PENTING UNTUK AGENT

### ✅ SELALU lakukan:
1. Baca file yang ada sebelum membuat file baru
2. Ikuti struktur folder yang sudah didefinisikan di dokumen ini
3. Gunakan Prisma untuk semua database operation (jangan raw SQL kecuali ada kebutuhan khusus)
4. Validasi semua input menggunakan class-validator
5. Tambahkan JSDoc/comment untuk fungsi yang kompleks
6. Gunakan TypeScript strict mode
7. Semua secret/credential dari environment variable
8. Tambahkan error handling di semua service method
9. Gunakan `PrismaService` yang sudah ada, jangan buat Prisma instance baru
10. Import dari `@nestjs/common` untuk decorator NestJS standar

### ❌ JANGAN pernah:
1. Hard-code credential, API key, atau URL
2. Buat file di luar struktur yang sudah ditentukan tanpa alasan jelas
3. Menggunakan `any` di TypeScript tanpa alasan yang sangat kuat
4. Skip validasi DTO
5. Langsung akses database dari controller (selalu via service)
6. Membuat state management baru selain Zustand
7. Menginstall library baru tanpa menyebutkan alasannya
8. Mengubah shadcn/ui components di `components/ui/` secara manual
9. Membuat API endpoint tanpa autentikasi (kecuali auth endpoints)
10. Lupa menambahkan guard `@UseGuards(JwtAuthGuard)` di protected routes

### 🔄 Urutan development yang benar:
```
1. Prisma schema → 2. Migration → 3. DTO → 4. Service → 5. Controller → 6. Module → 7. Frontend types → 8. API hook → 9. UI Component
```

---

## 13. TESTING

### Backend
- Unit test: `*.spec.ts` di samping file yang ditest
- E2E test: `apps/api/test/`
- Framework: Jest
- Mock Prisma: gunakan `jest-mock-extended`

### Frontend
- Unit test: `*.test.tsx`
- Framework: Vitest + Testing Library

---

## 14. DEVELOPMENT COMMANDS

```bash
# Install semua dependencies (dari root)
pnpm install

# Jalankan semua service (development)
docker-compose up -d postgres redis  # Start DB dulu
pnpm --filter api run start:dev       # NestJS dev server
pnpm --filter web run dev             # Next.js dev server

# Database
pnpm --filter api run prisma:migrate  # Run migrations
pnpm --filter api run prisma:studio   # Prisma Studio GUI
pnpm --filter api run prisma:generate # Generate Prisma Client

# Build
pnpm --filter api run build
pnpm --filter web run build

# Testing
pnpm --filter api run test
pnpm --filter api run test:e2e
```

---

## 15. CURRENT STATUS & PROGRESS

### ✅ Sudah Ada (Foundation):
- [x] Monorepo structure (pnpm workspace)
- [x] NestJS app bootstrap (`apps/api`)
- [x] Next.js app bootstrap (`apps/web`)
- [x] shadcn/ui setup di web (`button`, `card`, `dialog`, `dropdown-menu`, `input`, `table`)
- [x] Prisma schema file (perlu diisi)
- [x] Docker Compose (perlu dilengkapi)
- [x] Auth module structure (`apps/api/src/modules/auth/`)
- [x] Users module structure (`apps/api/src/modules/users/`)
- [x] Health module (`apps/api/src/modules/health/`)
- [x] Common, config, shared, utils folders

### 🚧 Perlu Dibangun (Prioritas):
1. **Prisma Schema** — definisikan semua models
2. **Auth Module** — implement JWT auth lengkap
3. **Users Module** — CRUD user + profile
4. **Task Module** — core task management
5. **Notification Module** — WebSocket + in-app notif
6. **KPI Module** — definisi & tracking
7. **Frontend Auth** — login/register pages + auth flow
8. **Frontend Dashboard** — layout + task views
9. **AI Service** — FastAPI setup + LangChain
10. **Workflow Module** — automation engine

---

## 16. GLOSSARY

| Term | Definisi |
|------|----------|
| AWOS | AI Workforce Operating System |
| WFH | Work From Home |
| RBAC | Role-Based Access Control |
| RAG | Retrieval-Augmented Generation |
| KPI | Key Performance Indicator |
| BullMQ | Redis-based job queue library |
| pgvector | PostgreSQL extension untuk vector similarity search |
| DTO | Data Transfer Object (NestJS input validation class) |
| Guard | NestJS middleware untuk authorization |
| Gateway | NestJS WebSocket handler |
| Agent | AI agent yang bisa mengeksekusi tools/actions |

---

