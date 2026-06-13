# CLAUDE.md — AI Workforce Operating System (AWOS)

> ⚠️ WAJIB DIBACA PENUH SEBELUM MENGERJAKAN APAPUN.
> Dokumen ini adalah **Source of Truth** utama. Jika ada konflik antara dokumen ini
> dengan dokumen lain, dokumen ini yang berlaku KECUALI docs/AGENT_RULES.md
> yang bersifat lebih spesifik dan selalu override dokumen ini.

---

## 0. LANGKAH PERTAMA — WAJIB SEBELUM MENULIS SATU BARIS KODE

```bash
# Step 1 — Baca semua dokumentasi Source of Truth secara berurutan
cat docs/PRODUCT_VISION.md
cat docs/AI_ARCHITECTURE.md
cat docs/ROADMAP.md
cat docs/AGENT_RULES.md

# Step 2 — Audit kondisi aktual codebase
find apps/api/src -type f -name "*.ts" | sort
find apps/web/app -type f | sort
find apps/web/components -type f | sort
cat apps/api/prisma/schema.prisma

# Step 3 — Cek package yang terinstall (jangan asumsi versi)
cat apps/api/package.json
cat apps/web/package.json

# Step 4 — Baru kerjakan task
```

> ❌ DILARANG membuat, mengedit, atau menghapus file apapun sebelum Step 1–3 selesai.
> ❌ DILARANG mengasumsikan isi file yang belum dibaca.
> ❌ DILARANG mengasumsikan versi library dari memori training.

---

## 1. DOCUMENTATION HIERARCHY

Baca dokumen berikut secara berurutan. Semua bersifat **mandatory**:

| Urutan | File | Isi |
|--------|------|-----|
| 1 | `docs/PRODUCT_VISION.md` | Visi produk, target user, business value |
| 2 | `docs/AI_ARCHITECTURE.md` | Arsitektur AI, data dependency, AI roadmap |
| 3 | `docs/ROADMAP.md` | Phase-by-phase roadmap, scope tiap phase |
| 4 | `docs/AGENT_RULES.md` | Aturan operasional agent, anti-pattern |
| 5 | `CLAUDE.md` (ini) | Technical reference, konvensi, state codebase |

**Jika ada konflik antar dokumen:**
- `docs/AGENT_RULES.md` → priority tertinggi
- `docs/ROADMAP.md` → tentukan KAPAN sesuatu dibangun
- `docs/PRODUCT_VISION.md` → tentukan MENGAPA sesuatu dibangun
- `CLAUDE.md` → tentukan BAGAIMANA sesuatu dibangun

---

# CURRENT IMPLEMENTATION STATUS

Dokumen ini HARUS mencerminkan kondisi codebase aktual.

Jika dokumentasi tidak sesuai dengan codebase:

CODEBASE adalah sumber kebenaran utama.

Agent WAJIB memverifikasi implementasi aktual sebelum mengubah modul.

---

## Backend Completed

✅ Authentication Foundation

- Register
- Login
- Me
- JWT Access Token

✅ User Management

- User CRUD
- Role Assignment
- User Activation / Deactivation

✅ Department Management

- Department CRUD

✅ Role Foundation

- SUPER_ADMIN
- ADMIN
- MANAGER
- EMPLOYEE

✅ Task Management

- Task CRUD
- Assignment
- Ownership
- Search
- Filter
- Pagination

✅ Task Comments

- Task Comment CRUD

✅ Notification Foundation

- Notification CRUD
- Unread Counter
- Mark As Read
- Mark All As Read

✅ Realtime Foundation

- Socket.IO
- notification:new
- task:assigned
- task:updated
- task:comment

---

## Frontend Completed

✅ Login Page

✅ Dashboard

✅ Task Management UI

✅ Notification Center UI

✅ User Management UI

✅ Department Management UI

✅ Operational Dashboard UI

---

## Work Evidence System ✅ COMPLETED (Modul 5.0)

- Prisma: model `TaskEvidence` (taskId, uploadedById, fileName, fileUrl, fileType, fileSize, description, createdAt) + index `taskId`/`uploadedById`
- Task: `completionNote`, `completedAt`, relasi `evidences[]`
- Backend module `task-evidence/`: upload, list, delete evidence + update completion note
- Endpoints: `POST/GET/DELETE /api/tasks/:taskId/evidence`, `PATCH /api/tasks/:taskId/completion-note`
- Local storage `uploads/task-evidence/` (disajikan statis di `/uploads`)
- Authorization: EMPLOYEE (task miliknya), MANAGER (view), ADMIN/SUPER_ADMIN (full); delete = uploader/admin
- Frontend: section Work Evidence di Task Detail (upload, completion note, evidence list)
- Menjadi fondasi data untuk: Daily Work Log → Manager Review → KPI Engine → AI Evaluation

---

## Daily Work Log System ✅ COMPLETED (Modul 5.1)

- Prisma: model `WorkLog` (taskId, userId, activity, progress, blocker, createdAt) + index `taskId`/`userId`; Task relasi `workLogs[]`
- Backend module `work-logs/`: create, list, delete work log
- Endpoints: `POST/GET /api/tasks/:taskId/work-logs`, `DELETE /api/tasks/:taskId/work-logs/:id`
- Validasi: activity min 10 char, progress 0–100, blocker opsional
- Aturan tambahan: jika progress terakhir 100% → tidak bisa menambah log (backend 409 + form terkunci di UI)
- Authorization: catat/hapus = assignee/admin (manager view); list = akses task
- Realtime: event `worklog:new`
- Frontend: section Work Progress Timeline (activity feed, jam menonjol) di atas Evidence

---

## Manager Review System ✅ COMPLETED (Modul 5.2)

- Prisma: enum `ReviewDecision` (APPROVED/REVISION), model `TaskReview` (taskId, reviewerId, decision, note, createdAt) + index; Task `reviews[]`, `submittedForReviewAt`
- Backend module `task-reviews/`: submit-review, create review, review history
- Endpoints: `POST /api/tasks/:taskId/submit-review`, `POST/GET /api/tasks/:taskId/reviews`
- Logika status: submit → REVIEW; APPROVED → DONE; REVISION → IN_PROGRESS (review selalu insert, history tak ditimpa)
- Authorization: submit = assignee/admin; create review = MANAGER/ADMIN/SUPER_ADMIN
- Realtime: event `review:created`; Notification: "Task Review" (approved/revision)
- Frontend: section Manager Review (form keputusan, status badge, review history)

---

## Workforce Session Tracking ✅ COMPLETED (Modul 5.3)

- Prisma: model `WorkSession` (userId, startedAt, endedAt, durationMinutes, createdAt) + index `userId`; User `workSessions[]`
- Backend module `work-sessions/`: start, end, me, team (tanpa DTO — start/end tanpa body)
- Endpoints: `POST /api/work-sessions/start|end`, `GET /api/work-sessions/me|team`
- Aturan: 1 sesi aktif per user (start ditolak 409 bila aktif); durationMinutes dihitung otomatis saat end
- Authorization: start/end/me = user sendiri; team = MANAGER/ADMIN/SUPER_ADMIN
- Realtime: broadcast `session:started` / `session:ended` (presence)
- Frontend: Session Status Card (Start/End Working + durasi hidup) & Team Activity Widget (presence realtime) di dashboard
- BUKAN attendance/GPS/screenshot/keystroke — murni accountability presence

---

## KPI Foundation ✅ COMPLETED (Modul 5.4)

- KPI dihitung DINAMIS dari data operasional (Task, Work Log, Evidence, Review, Session) — tanpa tabel/score tersimpan
- Backend module `kpi/`: `kpi.service.ts` (computeKpiMap, 3 query + agregasi in-memory, no N+1), controller, module
- Endpoints: `GET /api/kpi/me`, `GET /api/kpi/users/:id` (MANAGER+), `GET /api/kpi/team` (MANAGER+)
- 6 metrik: completionRate, approvalRate, revisionRate, evidenceCompliance, workLogConsistency, sessionConsistency
- Status: EXCELLENT (≥85) / GOOD (≥70) / NEEDS_ATTENTION (<70) — angka overall internal, tidak ditampilkan
- Frontend: My Performance card (dashboard employee), Team Performance table (dashboard manager/admin)
- **Phase 5 (Workforce Accountability) SELESAI** → membuka Phase 6 (Collaboration)

---

## Kanban Workspace ✅ COMPLETED (Modul 6.0)

- Frontend-only (TANPA model/endpoint baru) — reuse Task PATCH status + realtime `task:updated`
- Route `/kanban`: 4 kolom (TODO, IN_PROGRESS, REVIEW, DONE) drag-and-drop via `@dnd-kit/core`
- Pindah kartu → `PATCH /api/tasks/:id` (status); optimistic update + invalidate
- Sidebar: menu Kanban
- BUKAN board kompleks (tanpa swimlane/WIP-limit/kustomisasi kolom) — fondasi data status task untuk AI

---

## Meeting Scheduler ✅ COMPLETED (Modul 6.1)

- Prisma: model `Meeting` (title, description?, startAt, endAt, meetingUrl?, createdById) + `MeetingParticipant` (unique [meetingId,userId]); User `createdMeetings[]`/`meetingParticipations[]`
- Backend module `meetings/`: CRUD + `today`, pagination, search, filter date
- Endpoints: `POST/GET /api/meetings`, `GET /api/meetings/today`, `GET/PATCH/DELETE /api/meetings/:id`
- Authorization: CREATE/UPDATE = MANAGER(pembuat)/ADMIN/SUPER_ADMIN; DELETE = ADMIN/SUPER_ADMIN; VIEW = peserta/pembuat/privileged
- Realtime: `meeting:created/updated/deleted` (room peserta+pembuat); Notification: "Meeting Scheduled"/"Meeting Updated"
- Frontend: list `/meetings` + `/meetings/new` + `/meetings/[id]` (Join Meeting eksternal), Today's Meetings widget di dashboard, sidebar Meetings
- BUKAN video conference / reminder terjadwal (video tetap di platform eksternal via meetingUrl)

---

## Corporate Calendar ✅ COMPLETED (Modul 6.2)

- Prisma: enum `CalendarEventType` (MEETING, COMPANY_EVENT, TRAINING, HOLIDAY, DIRECTOR_SCHEDULE, ANNOUNCEMENT), model `CalendarEvent` (title, description?, type, startAt, endAt, createdById); User `createdCalendarEvents[]`
- Backend module `calendar/`: CRUD event + timeline gabungan
- Endpoints: `POST/GET /api/calendar/events`, `GET/PATCH/DELETE /api/calendar/events/:id`, `GET /api/calendar/month`, `GET /api/calendar/upcoming`
- **Meeting integration:** Meeting (6.1) TIDAK disalin — `/month` & `/upcoming` MENGGABUNGKAN Meeting (read-only, source-of-truth) + CalendarEvent jadi satu timeline (`CalendarItem` dengan `source: MEETING|EVENT`)
- Authorization: CREATE/UPDATE = MANAGER(pembuat)/ADMIN/SUPER_ADMIN; DELETE = ADMIN/SUPER_ADMIN; VIEW = semua user login. Meeting dalam merge tetap mengikuti scope visibilitas 6.1 (employee hanya meeting yang melibatkannya); CalendarEvent perusahaan-wide
- Realtime: broadcast `calendar:event-created/updated/deleted`; Notification: "New Calendar Event"/"Calendar Event Updated" ke seluruh user aktif
- Frontend: `/calendar` Month View (grid 6×7, navigasi bulan, chip berwarna per tipe, detail dialog), Create Event dialog (privileged), Upcoming Events widget (maks 5) di dashboard, sidebar Calendar
- BUKAN sync Google/Outlook, ICS, recurring engine, reminder scheduler, atau calendar AI

---

## Current Active Development

🚧 Office Feed (Modul 6.3) — Phase 6: Workforce Collaboration (modul terakhir Phase 6)

---

## Locked Modules

### Phase 6 — Workforce Collaboration
🔒 Office Feed (6.3) — berikutnya

### Phase 7 — Workforce Intelligence (AI — LOCKED KERAS)
🔒 AI Report Evaluation (7.0)
🔒 Manager Copilot (7.1)
🔒 Workforce Intelligence (7.2)
🔒 AI KPI Recommendation (7.3)

> AI (Phase 7) DILARANG dibangun sebelum SELURUH dependency tersedia:
> ✅ Task, Work Log, Evidence, Review, Session, KPI, Kanban, Meeting, Calendar · ⏳ Office Feed.
> Status dependency: 9/10. Selesaikan Office Feed (6.3) dulu.

## 2. PRODUCT IDENTITY

### AWOS bukan:
- ❌ Task management app biasa
- ❌ Jira / Trello / Asana clone
- ❌ Employee surveillance system
- ❌ Screenshot / mouse / webcam tracker
- ❌ ChatGPT wrapper / general-purpose chatbot

### AWOS adalah:
> **AI Workforce Operating System** — platform yang membantu organisasi bertransisi dari Work From Office ke Work From Anywhere tanpa kehilangan productivity, accountability, transparency, dan performance measurement.

### Core Value Chain AWOS:
```
Task → Evidence → Work Log → Manager Review → KPI Engine → AI Workforce Intelligence
```

> Setiap fitur yang diusulkan harus berkontribusi pada rantai di atas.
> Jika tidak, fitur tersebut harus dievaluasi ulang sebelum diprioritaskan.

### Fokus Utama (bukan surveillance):
- ✅ Task Completion & Output
- ✅ Work Evidence
- ✅ Progress Visibility
- ✅ Manager Review
- ✅ KPI Automation
- ✅ Workforce Intelligence

---

## 3. ANTI-HALLUCINATION RULES

### Sebelum mengusulkan fitur baru, jawab semua pertanyaan ini:
1. Apakah fitur ini ada di `docs/ROADMAP.md` pada phase yang sedang aktif?
2. Apakah data dependency fitur ini sudah tersedia?
3. Apakah fitur ini berkontribusi pada Core Value Chain AWOS?

Jika **lebih dari satu jawaban NO** → jangan implementasi, laporkan ke user terlebih dahulu.

### STOP dan tanya user jika:
- File yang akan diedit tidak ada di hasil `find` sebelumnya
- Instruksi dari user bertentangan dengan `docs/ROADMAP.md` atau `docs/AGENT_RULES.md`
- Diminta membangun modul yang statusnya `🔒 LOCKED`
- Diminta menginstall library baru yang tidak ada di tech stack
- Ada ambiguitas antara dua pendekatan yang sama-sama valid

### Jangan pernah:
- Mengarang nama field Prisma — selalu baca `schema.prisma` terlebih dahulu
- Mengarang endpoint — selalu verifikasi dari dokumen ini atau kode yang ada
- Mengarang versi library — selalu baca dari `package.json`
- Mengasumsikan sebuah file ada tanpa verifikasi via `find` atau `cat`
- Melanjutkan implementasi jika ada konflik yang belum terselesaikan

---

## 4. CURRENT PHASE & ACTIVE SCOPE

> **Baca `docs/ROADMAP.md` untuk detail lengkap setiap phase.**
> Bagian ini hanya ringkasan cepat untuk referensi agent.

### Phase yang sedang aktif:
**Phase 6 — Workforce Collaboration**

### Status phase:
- ✅ **Phase 5 — Workforce Accountability** SELESAI (5.0 Work Evidence, 5.1 Daily Work Log, 5.2 Manager Review, 5.3 Workforce Session Tracking, 5.4 KPI Foundation)
- 🚧 **Phase 6 — Workforce Collaboration** (AKTIF): 6.0 Kanban ✅, 6.1 Meeting Scheduler ✅, 6.2 Corporate Calendar ✅, 6.3 Office Feed (current)
- ⏳ **Phase 7 — Workforce Intelligence** (AI, LOCKED): 7.0 AI Report Evaluation, 7.1 Manager Copilot, 7.2 Workforce Intelligence, 7.3 AI KPI Recommendation

### Modul aktif di Phase 6:
1. Kanban Workspace (6.0) — ✅ selesai
2. Meeting Scheduler (6.1) — ✅ selesai
3. Corporate Calendar (6.2) — ✅ selesai
4. Office Feed (6.3) — 🚧 current

### Aturan phase:
- ❌ DILARANG mengerjakan modul di luar scope phase aktif
- ❌ DILARANG memulai Phase 7 (AI) sebelum semua item Phase 6 selesai
- ❌ AI Evaluation DILARANG dibangun sebelum SELURUH dependency tersedia (lihat seksi 7)
- ✅ Boleh memperbaiki bug atau refactor modul dari phase sebelumnya
- ✅ Boleh menambah test coverage modul yang sudah selesai

---

## 5. COMPLETED MODULES — STATUS LOCKED 🔒

> Modul berikut sudah selesai diimplementasi. **JANGAN diubah tanpa instruksi eksplisit.**
> Sebelum menyentuh modul ini, baca seluruh file yang ada terlebih dahulu.

### ✅ Database Foundation — LOCKED
- Prisma schema telah didefinisikan
- Migration telah dijalankan
- **Wajib baca:** `apps/api/prisma/schema.prisma` sebelum membuat model baru
- Untuk menambah model baru: tambah ke schema → jalankan migration → generate client

### ✅ Authentication Foundation — LOCKED
- **Files:**
  - `apps/api/src/modules/auth/auth.module.ts`
  - `apps/api/src/modules/auth/auth.controller.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/api/src/modules/auth/strategies/jwt.strategy.ts`
  - `apps/api/src/modules/auth/strategies/jwt-refresh.strategy.ts`
  - `apps/api/src/modules/auth/guards/jwt-auth.guard.ts`
- **Endpoints live:** `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `POST /auth/refresh`, `GET /auth/me`
- **Token:** JWT Access (15m) + Refresh Token (7d, httpOnly cookie)
- **Hashing:** bcrypt
- ❌ JANGAN buat auth logic baru di luar module ini

### ✅ User Management — LOCKED
- **Files:**
  - `apps/api/src/modules/users/users.module.ts`
  - `apps/api/src/modules/users/users.controller.ts`
  - `apps/api/src/modules/users/users.service.ts`
- **Capabilities:** CRUD user, profile update, user listing dengan filter
- ❌ JANGAN duplikasi user query di module lain — import `UsersService`

### ✅ Role Foundation — LOCKED
- Roles yang tersedia: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EMPLOYEE`
- RBAC via `RolesGuard` + `@Roles()` decorator
- **Wajib baca:** `apps/api/src/common/guards/` sebelum menambah guard baru

### ✅ Department Management — LOCKED
- Department CRUD selesai
- Relasi Department → User sudah ada di schema
- ❌ JANGAN buat department logic di luar module yang sudah ada

### ✅ Task Management — LOCKED
- **Files:**
  - `apps/api/src/modules/tasks/tasks.module.ts`
  - `apps/api/src/modules/tasks/tasks.controller.ts`
  - `apps/api/src/modules/tasks/tasks.service.ts`
- **Status enum:** `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`, `CANCELLED`
- **Priority enum:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **Endpoints live:** GET/POST/PATCH/DELETE `/tasks`, status update, assign
- ❌ JANGAN buat task query di service lain — gunakan `TasksService`

### ✅ Task Comments — LOCKED
- Comments terintegrasi dalam `TasksModule`
- Endpoint: `POST /tasks/:id/comments`, `GET /tasks/:id/comments`
- Activity log otomatis saat comment dibuat

### ✅ Ownership Authorization — LOCKED
- Guard untuk verifikasi ownership resource sudah tersedia
- **Wajib gunakan** ownership guard untuk semua endpoint yang mengakses data spesifik user

---

## 6. MODUL IN PROGRESS / BELUM DIBANGUN

> Urutkan pengerjaan sesuai `docs/ROADMAP.md`. Jangan loncat urutan.

### ✅ Phase 5 — Workforce Accountability (SELESAI):

| Modul | Status | Dependency |
|-------|--------|------------|
| Work Evidence System | ✅ SELESAI (5.0) | Task Management ✅ |
| Daily Work Log System | ✅ SELESAI (5.1) | Task ✅, Work Evidence ✅ |
| Manager Review System | ✅ SELESAI (5.2) | Work Evidence ✅, Work Log ✅ |
| Workforce Session Tracking | ✅ SELESAI (5.3) | User Management ✅ |
| KPI Foundation | ✅ SELESAI (5.4) | Task ✅, Work Log ✅, Review ✅, Session ✅ |

### 🚧 Phase 6 — Workforce Collaboration (AKTIF):

| Modul | Status | Dependency |
|-------|--------|------------|
| Kanban Workspace | ✅ SELESAI (6.0) | Task ✅ |
| Meeting Scheduler | ✅ SELESAI (6.1) | User ✅ |
| Corporate Calendar | ✅ SELESAI (6.2) | User ✅, Meeting ✅ |
| Office Feed | 🚧 Sedang dikerjakan (6.3) | User ✅ |

### 🔒 Phase 7 — Workforce Intelligence (AI — LOCKED KERAS):

| Modul | Keterangan |
|-------|-----------|
| AI Report Evaluation (7.0) | Butuh SELURUH Phase 5 ✅ + Phase 6 ⏳ |
| Manager Copilot (7.1) | Butuh AI Report Evaluation |
| Workforce Intelligence (7.2) | Butuh seluruh data + AI Evaluation |
| AI KPI Recommendation (7.3) | Butuh KPI ✅ + AI Evaluation |

---

## 7. AI DEVELOPMENT — ATURAN KERAS

> Baca `docs/AI_ARCHITECTURE.md` untuk detail lengkap.

### AI bukan:
- ❌ Chatbot umum
- ❌ ChatGPT clone
- ❌ Fitur percakapan biasa
- ❌ Fitur dekoratif

### AI adalah:
> **Workforce Intelligence Engine** yang menganalisis data nyata dari sistem AWOS untuk menghasilkan insight yang actionable.

### AI TIDAK BOLEH dibangun sebelum data berikut tersedia:

```
REQUIRED DATA DEPENDENCY untuk AI Evaluation (Phase 7):

[1]  Task data          → Task Management    ✅ DONE
[2]  Work Log           → Work Log System     ✅ DONE (5.1)
[3]  Work Evidence      → Evidence System     ✅ DONE (5.0)
[4]  Manager Review     → Review System       ✅ DONE (5.2)
[5]  Work Session       → Session Tracking    ✅ DONE (5.3)
[6]  KPI Records        → KPI Foundation      ✅ DONE (5.4)
[7]  Kanban             → Kanban Workspace    ✅ DONE (6.0)
[8]  Meeting            → Meeting Scheduler   ✅ DONE (6.1)
[9]  Calendar          → Corporate Calendar  ✅ DONE (6.2)
[10] Office Feed        → Office Feed         ⏳ Phase 6 (6.3)

Status: 9/10 dependency terpenuhi
→ AI (Phase 7) DILARANG diimplementasi sampai SELURUH dependency Phase 6 tersedia
```

### Konsekuensi melanggar aturan ini:
AI yang dibangun tanpa data akan menghasilkan insight palsu dan merusak kepercayaan user terhadap platform.

---

## 8. ARSITEKTUR SISTEM

### Monorepo Structure
```
awos/
├── apps/
│   ├── api/              # NestJS Backend (Port 3001)
│   └── web/              # Next.js Frontend (Port 3000)
├── services/
│   └── ai/               # FastAPI AI Service (Port 8000) 🔒 LOCKED
├── packages/
│   ├── shared/           # Shared types, DTOs, constants
│   ├── ui/               # Shared UI components
│   └── config/           # Shared config (eslint, tsconfig base)
├── infrastructure/       # Docker, K8s, Terraform configs
├── docs/                 # Dokumentasi teknis (Source of Truth)
├── scripts/              # Dev & deployment scripts
├── prisma.config.ts
└── docker-compose.yml
```

### Tech Stack — Versi Aktual

> ⚠️ JANGAN asumsikan versi dari memori training.
> Selalu verifikasi dari `package.json` masing-masing app.

| Layer | Teknologi | Catatan |
|-------|-----------|---------|
| Frontend | Next.js App Router | Verifikasi dari `apps/web/package.json` |
| UI Components | shadcn/ui + Tailwind CSS | Jangan edit file di `components/ui/` manual |
| State Management | Zustand | Jangan pakai Redux/Context untuk global state |
| Backend | NestJS | Verifikasi versi dari `apps/api/package.json` |
| ORM | Prisma | Selalu generate client setelah schema berubah |
| Database | PostgreSQL | Port 5432 |
| Cache | Redis | Port 6379 |
| AI Service | FastAPI + LangChain | 🔒 LOCKED sampai Phase 6+ |
| AI Model | Claude API (Anthropic) | Model: claude-sonnet |
| Vector DB | pgvector (PostgreSQL) | 🔒 LOCKED sampai RAG dibangun |
| Realtime | Socket.io | 🔒 LOCKED sampai Notification module |
| Queue | BullMQ | 🔒 LOCKED sampai Reporting module |
| Auth | JWT + Refresh Token | ✅ Sudah implemented |
| Package Manager | pnpm workspace | Jangan pakai npm/yarn |
| Container | Docker + Docker Compose | Untuk semua service |

---

## 9. STRUKTUR FOLDER BACKEND — `apps/api/src/`

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
│
├── common/
│   ├── decorators/          # @CurrentUser(), @Roles(), @Public()
│   ├── filters/             # GlobalHttpExceptionFilter
│   ├── guards/              # JwtAuthGuard, RolesGuard, OwnershipGuard
│   ├── interceptors/        # TransformResponseInterceptor, LoggingInterceptor
│   ├── pipes/               # ValidationPipe config
│   └── middleware/
│
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   └── ai.config.ts         # 🔒 Belum aktif
│
├── prisma/
│   ├── prisma.module.ts     # Global module
│   └── prisma.service.ts    # Extends PrismaClient
│
├── shared/
│   ├── dto/                 # PaginationDto, ResponseDto
│   ├── types/               # AppRequest, JwtPayload
│   └── constants/           # Enums, magic strings
│
├── utils/
│   ├── pagination.util.ts
│   ├── hash.util.ts
│   └── date.util.ts
│
└── modules/
    ├── auth/                # ✅ LOCKED
    ├── users/               # ✅ LOCKED
    ├── departments/         # ✅ LOCKED
    ├── tasks/               # ✅ LOCKED
    ├── health/              # ✅ LOCKED
    │
    ├── evidence/            # 🚧 Phase 5 — belum ada
    ├── work-log/            # 🚧 Phase 5 — belum ada
    ├── reviews/             # 🚧 Phase 5 — belum ada
    ├── sessions/            # 🚧 Phase 5 — belum ada
    ├── kpi/                 # 🚧 Phase 5 — belum ada
    │
    ├── notifications/       # 🔒 Phase 6
    ├── analytics/           # 🔒 Phase 6
    ├── workflow/            # 🔒 Phase 7
    ├── reports/             # 🔒 Phase 7
    ├── knowledge/           # 🔒 Phase 8
    └── ai-workspace/        # 🔒 Phase 9 — LOCKED KERAS
```

---

## 10. STRUKTUR FOLDER FRONTEND — `apps/web/`

```
web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   └── (dashboard)/
│       ├── layout.tsx           # Sidebar + Header wrapper
│       ├── page.tsx             # Dashboard home
│       ├── tasks/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── evidence/            # 🚧 Phase 5
│       ├── work-log/            # 🚧 Phase 5
│       ├── reviews/             # 🚧 Phase 5
│       ├── kpi/                 # 🚧 Phase 5
│       ├── analytics/           # 🔒 Phase 6
│       ├── ai/                  # 🔒 Phase 9
│       ├── knowledge/           # 🔒 Phase 8
│       ├── workflows/           # 🔒 Phase 7
│       ├── reports/             # 🔒 Phase 7
│       └── settings/
│
├── components/
│   ├── ui/                      # ❌ JANGAN edit manual (shadcn/ui)
│   ├── layout/                  # Sidebar, Header, Breadcrumb
│   ├── tasks/                   # ✅ Task components
│   ├── evidence/                # 🚧 Phase 5
│   ├── work-log/                # 🚧 Phase 5
│   ├── reviews/                 # 🚧 Phase 5
│   ├── kpi/                     # 🚧 Phase 5
│   ├── analytics/               # 🔒 Phase 6
│   ├── ai/                      # 🔒 Phase 9
│   └── shared/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useEvidence.ts           # 🚧 Phase 5
│   ├── useWorkLog.ts            # 🚧 Phase 5
│   └── useSocket.ts             # 🔒 Phase 6
│
├── lib/
│   ├── utils.ts                 # cn() utilities
│   ├── api.ts                   # Axios instance + interceptors
│   └── socket.ts                # 🔒 Phase 6
│
├── store/
│   ├── auth.store.ts
│   ├── tasks.store.ts
│   ├── notifications.store.ts   # 🔒 Phase 6
│   └── ui.store.ts
│
├── types/
│   ├── api.types.ts
│   ├── task.types.ts
│   ├── user.types.ts
│   └── evidence.types.ts        # 🚧 Phase 5
│
└── constants/
    └── routes.ts
```

---

## 11. KONVENSI CODING

### Naming Conventions

| Context | Convention | Contoh |
|---------|-----------|--------|
| File NestJS | kebab-case | `work-evidence.service.ts` |
| Class | PascalCase | `WorkEvidenceService` |
| Method / Variable | camelCase | `createEvidence()`, `evidenceId` |
| Prisma Model | PascalCase | `WorkEvidence` |
| DB Column | snake_case (auto Prisma) | `created_at` |
| ENV Variable | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| React Component | PascalCase | `EvidenceCard.tsx` |
| React Hook | camelCase + `use` prefix | `useEvidenceList.ts` |
| Zustand Store | camelCase + `Store` suffix | `evidenceStore.ts` |
| API Route | kebab-case plural | `/api/v1/work-evidences` |

### Standard Response Format

```typescript
// ✅ Success response (via TransformResponseInterceptor)
{
  "success": true,
  "data": { ... },
  "message": "Evidence created successfully"
}

// ✅ Success dengan pagination
{
  "success": true,
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}

// ✅ Error response (via GlobalHttpExceptionFilter)
{
  "success": false,
  "error": "EVIDENCE_NOT_FOUND",
  "message": "Work evidence tidak ditemukan",
  "statusCode": 404
}
```

### DTO Pattern (wajib)

```typescript
// ✅ BENAR
import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class CreateWorkEvidenceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsEnum(EvidenceType)
  type: EvidenceType;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
```

### Service Pattern (wajib)

```typescript
// ✅ BENAR — error handling di setiap method
async findById(id: string, userId: string): Promise<WorkEvidence> {
  const evidence = await this.prisma.workEvidence.findFirst({
    where: { id, userId, deletedAt: null },
  });

  if (!evidence) {
    throw new NotFoundException(`Work evidence dengan ID ${id} tidak ditemukan`);
  }

  return evidence;
}
```

### Controller Pattern (wajib)

```typescript
// ✅ BENAR
@Controller('work-evidences')
@UseGuards(JwtAuthGuard)           // ← WAJIB di setiap protected controller
@ApiBearerAuth()
export class WorkEvidenceController {
  constructor(private readonly evidenceService: WorkEvidenceService) {}

  @Post()
  @Roles(Role.EMPLOYEE, Role.MANAGER)
  @UseGuards(RolesGuard)
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateWorkEvidenceDto,
  ) {
    return this.evidenceService.create(user.sub, dto);
  }
}
```

### Frontend Patterns (wajib)

```tsx
// ✅ BENAR — data fetching via custom hook
// hooks/useEvidence.ts
export function useEvidence(taskId: string) {
  return useQuery({
    queryKey: ['evidence', taskId],
    queryFn: () => api.get(`/work-evidences?taskId=${taskId}`).then(r => r.data),
  });
}

// ✅ BENAR — loading via Suspense
<Suspense fallback={<EvidenceListSkeleton />}>
  <EvidenceList taskId={taskId} />
</Suspense>

// ✅ BENAR — 'use client' hanya jika perlu interaktivitas
'use client';

// ❌ SALAH — fetch langsung di component
const res = await fetch('/api/v1/evidence'); // jangan
```

---

## 12. ENVIRONMENT VARIABLES

### Backend — `apps/api/.env`
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

# AI Service (belum aktif - Phase 9)
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=internal-api-key

# CORS
CORS_ORIGINS=http://localhost:3000
```

### Frontend — `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=AWOS
```

### AI Service — `services/ai/.env` (🔒 belum aktif)
```env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://awos:awos_password@localhost:5432/awos_db
API_SECRET_KEY=internal-api-key
ENVIRONMENT=development
```

---

## 13. DATABASE — PRISMA CONVENTIONS

**Path schema:** `apps/api/prisma/schema.prisma`

> ⚠️ Selalu baca schema aktual sebelum menambah model atau field.
> Jangan asumsikan field yang ada berdasarkan dokumen ini.

### Konvensi wajib:

```prisma
model ContohModel {
  id        String    @id @default(uuid())      // Selalu UUID
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?                            // Soft delete

  // ... fields lain
}
```

### Workflow perubahan schema:

```bash
# 1. Edit schema
nano apps/api/prisma/schema.prisma

# 2. Buat migration
pnpm --filter api run prisma migrate dev --name nama_migration

# 3. Generate client
pnpm --filter api run prisma generate

# 4. Verifikasi
pnpm --filter api run prisma studio
```

### Aturan relasi:
- Nama relasi harus deskriptif: `assignedTasks` bukan `tasks`
- Foreign key eksplisit di kedua sisi relasi
- Cascade delete harus eksplisit dan dipikirkan matang

---

## 14. API CONVENTIONS

- Prefix semua endpoint: `/api/v1/`
- Health check: `GET /health` (tanpa prefix, tanpa auth)
- WebSocket namespace: `/` dengan room-based subscription (🔒 Phase 6)

### Auth Flow:
```
POST /api/v1/auth/login
  → { accessToken, refreshToken (httpOnly cookie), user }

Setiap request:
  Authorization: Bearer <accessToken>

Jika 401:
  POST /api/v1/auth/refresh → { accessToken baru }

POST /api/v1/auth/logout
  → Invalidate refreshToken di DB
```

---

## 15. PRISMA SERVICE — CARA PENGGUNAAN YANG BENAR

```typescript
// ✅ BENAR — inject PrismaService, jangan buat instance baru
@Injectable()
export class WorkEvidenceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkEvidenceDto) {
    return this.prisma.workEvidence.create({
      data: { ...dto, userId },
    });
  }
}

// ❌ SALAH — jangan buat PrismaClient baru
const prisma = new PrismaClient(); // DILARANG
```

---

## 16. MODULE REGISTRATION — PATTERN WAJIB

```typescript
// ✅ BENAR — setiap module baru harus terdaftar di app.module.ts
@Module({
  imports: [
    PrismaModule,       // sudah global, tapi pastikan tersedia
    WorkEvidenceModule, // ← daftarkan di sini
  ],
})
export class AppModule {}

// ✅ BENAR — struktur module baru
@Module({
  controllers: [WorkEvidenceController],
  providers: [WorkEvidenceService],
  exports: [WorkEvidenceService],   // export jika dipakai modul lain
})
export class WorkEvidenceModule {}
```

---

## 17. DEFINITION OF DONE — Kapan Modul Dianggap Selesai

Modul dianggap **SELESAI** hanya jika semua checklist berikut terpenuhi:

```
Backend:
[ ] Prisma schema model selesai + migration berhasil dijalankan
[ ] DTO tersedia dengan validasi class-validator lengkap
[ ] Service implemented dengan error handling di setiap method
[ ] Controller implemented dengan JwtAuthGuard + RolesGuard
[ ] Module registered di app.module.ts
[ ] Unit test minimal untuk service (happy path + error case)
[ ] Endpoint dapat dipanggil dan return response yang benar

Frontend:
[ ] Types didefinisikan di folder types/
[ ] API hook dibuat di folder hooks/
[ ] UI Component dibuat di folder components/<module>/
[ ] Page route dibuat di app/(dashboard)/<module>/
[ ] Loading state dengan skeleton
[ ] Error state dengan pesan yang jelas

Dokumentasi:
[ ] Section "Completed Modules" di CLAUDE.md diupdate
[ ] File yang dibuat dicantumkan dengan path lengkap
[ ] Catatan khusus (jika ada) ditambahkan
```

---

## 18. MANDATORY POST-MODULE PROCESS

Setelah setiap modul selesai, agent **WAJIB** melakukan:

1. **Run tests** — `pnpm --filter api run test`
2. **Laporkan hasil** — file apa yang dibuat, endpoint apa yang tersedia
3. **Update CLAUDE.md** — pindahkan modul dari "In Progress" ke "Completed"
4. **Verifikasi roadmap** — konfirmasi posisi di `docs/ROADMAP.md`
5. **Dampak AI** — jelaskan apakah modul ini membuka data dependency untuk AI

---

## 19. DEVELOPMENT COMMANDS

```bash
# Setup awal
pnpm install                                        # Install semua dependencies

# Development
docker-compose up -d postgres redis                  # Start infrastructure
pnpm --filter api run start:dev                      # NestJS (port 3001)
pnpm --filter web run dev                            # Next.js (port 3000)

# Database
pnpm --filter api run prisma:migrate                 # Jalankan pending migrations
pnpm --filter api run prisma:generate                # Generate Prisma Client
pnpm --filter api run prisma:studio                  # Buka Prisma Studio (port 5555)

# Testing
pnpm --filter api run test                           # Unit tests
pnpm --filter api run test:cov                       # Test + coverage
pnpm --filter api run test:e2e                       # E2E tests

# Build
pnpm --filter api run build
pnpm --filter web run build

# Linting
pnpm --filter api run lint
pnpm --filter web run lint
```

---

## 20. ATURAN INSTALASI LIBRARY BARU

Sebelum menginstall library baru:

1. Verifikasi apakah sudah ada library yang bisa melakukan hal yang sama
2. Cek apakah library tersebut sesuai dengan tech stack (baca Section 8)
3. **Laporkan ke user terlebih dahulu** dengan penjelasan:
   - Nama library
   - Tujuan penggunaan
   - Alternatif yang sudah ada (jika ada)
   - Apakah ini blocking progress
4. Tunggu konfirmasi sebelum menjalankan `pnpm add`

---

## 21. GLOSSARY

| Term | Definisi |
|------|----------|
| AWOS | AI Workforce Operating System |
| WFH / WFA | Work From Home / Work From Anywhere |
| RBAC | Role-Based Access Control |
| RAG | Retrieval-Augmented Generation (🔒 Phase 8) |
| KPI | Key Performance Indicator |
| BullMQ | Redis-based job queue (🔒 Phase 7) |
| pgvector | PostgreSQL vector extension untuk RAG (🔒 Phase 8) |
| DTO | Data Transfer Object — class validasi input NestJS |
| Guard | NestJS middleware untuk authorization |
| Gateway | NestJS WebSocket handler (🔒 Phase 6) |
| Agent | AI agent yang bisa eksekusi tools (🔒 Phase 9) |
| Evidence | Work Evidence — bukti output pekerjaan (🚧 Phase 5) |
| Work Log | Catatan harian aktivitas kerja (🚧 Phase 5) |

---

# DOCUMENTATION UPDATE RULE

Setelah modul selesai:

Agent WAJIB:

1. Update ROADMAP.md
2. Update CLAUDE.md
3. Menambahkan modul ke Completed Modules
4. Menjelaskan dependency berikutnya

Modul belum dianggap selesai
sampai dokumentasi diperbarui

*Update terakhir wajib mencantumkan tanggal dan modul yang berubah.*

**Update terakhir: 2026-06-11 — Modul 6.2 Corporate Calendar SELESAI** (juga menandai 6.0 Kanban & 6.1 Meeting sebagai SELESAI yang sebelumnya belum tercatat). Dependency AI kini 9/10 — tersisa Office Feed (6.3).