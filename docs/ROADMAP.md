# AWOS ROADMAP

## PHASE 1

Foundation Backend

[COMPLETED]

* Authentication
* Authorization
* User Management
* Department Management

---

## PHASE 2

Work Management

[COMPLETED]

* Task Management
* Task Comments
* Notifications
* Realtime

---

## PHASE 3

Frontend Platform

[COMPLETED]

* Frontend Foundation
* Task UI
* Notification UI
* User Management UI
* Department UI
* Operational Dashboard
* Auth Hardening

---

## PHASE 5 — WORKFORCE ACCOUNTABILITY

[COMPLETED]

✅ 5.0 Work Evidence
✅ 5.1 Daily Work Log
✅ 5.2 Manager Review
✅ 5.3 Workforce Session Tracking
✅ 5.4 KPI Foundation

Seluruh data operasional dasar (output, progres, bukti, validasi manager,
presence, dan KPI) telah tersedia sebagai fondasi fase berikutnya.

---

## PHASE 6 — WORKFORCE COLLABORATION

[IN PROGRESS]

✅ 6.0 Kanban Workspace
✅ 6.1 Meeting Scheduler
✅ 6.2 Corporate Calendar
🚧 6.3 Office Feed

Fase ini menambah lapisan kolaborasi tim (visual workflow, koordinasi waktu,
dan komunikasi internal) di atas data accountability Phase 5.

---

## PHASE 7 — WORKFORCE INTELLIGENCE

[FUTURE / LOCKED]

⏳ 7.0 AI Report Evaluation
⏳ 7.1 Manager Copilot
⏳ 7.2 Workforce Intelligence
⏳ 7.3 AI KPI Recommendation

Fase AI. TIDAK boleh dibangun sebelum seluruh dependency Phase 5 & 6 tersedia
(lihat Dependency Chain di bawah).

---

# DEPENDENCY CHAIN

Urutan ketergantungan data AWOS — setiap lapisan menjadi fondasi lapisan di atasnya:

```
Task
↓
Work Log
↓
Evidence
↓
Manager Review
↓
Work Session
↓
KPI
↓
Kanban
↓
Meeting
↓
Calendar
↓
Office Feed
↓
AI Evaluation
↓
Manager Copilot
↓
Workforce Intelligence
```

---

# AI EVALUATION — DEPENDENCIES

AI (Phase 7) TIDAK boleh dibangun sebelum SELURUH dependency berikut tersedia:

```
✅ Task
✅ Work Log
✅ Evidence
✅ Review
✅ Session
✅ KPI

✅ Kanban
✅ Meeting
✅ Calendar
⏳ Office Feed
```

Status: 9/10 dependency terpenuhi. AI menunggu modul terakhir Phase 6
(Office Feed) selesai lebih dulu.

---

# Development Rule

Agent dilarang melompati urutan roadmap.

Setiap phase harus selesai sebelum melanjutkan ke phase berikutnya.

AI Evaluation DILARANG dibangun sebelum seluruh dependency tersedia.
