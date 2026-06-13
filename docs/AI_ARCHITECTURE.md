# AWOS AI ARCHITECTURE

## Prinsip Dasar

AI dalam AWOS bukan chatbot umum.

AI dalam AWOS adalah Workforce Intelligence Engine.

Tujuan AI adalah membantu perusahaan memahami produktivitas dan performa kerja berdasarkan data operasional.

---

# Evolusi AI

AI dibangun bertahap di atas tiga pilar AWOS:

**Phase 5 — Workforce Accountability** (✅ selesai)
- Task, Work Evidence, Work Log, Manager Review, Work Session, KPI Foundation

**Phase 6 — Workforce Collaboration** (🚧 berjalan)
- Kanban Workspace, Meeting Scheduler, Corporate Calendar, Office Feed

**Phase 7 — Workforce Intelligence** (⏳ AI, locked)
- 7.0 AI Report Evaluation
- 7.1 Manager Copilot
- 7.2 Workforce Intelligence
- 7.3 AI KPI Recommendation

AI hanya boleh dibangun setelah Phase 5 DAN Phase 6 selesai.

---

# Data Yang Digunakan AI

AI hanya boleh melakukan evaluasi jika data berikut tersedia:

* Tasks ✅ tersedia
* Task Comments ✅ tersedia
* Work Logs ✅ tersedia (5.1)
* Work Evidence ✅ tersedia (5.0)
* Manager Reviews ✅ tersedia (5.2)
* Work Sessions ✅ tersedia (5.3)
* KPI ✅ tersedia (5.4)
* Department Context ✅ tersedia
* Kanban ⏳ belum (6.0)
* Meeting ⏳ belum (6.1)
* Calendar ⏳ belum (6.2)
* Office Feed ⏳ belum (6.3)

Jika data belum lengkap maka confidence AI harus diturunkan.

Status saat ini: seluruh data Phase 5 (accountability) sudah terkumpul. AI
menunggu data kolaborasi Phase 6 (Kanban, Meeting, Calendar, Office Feed)
sebelum boleh dibangun.

---

# Alur Evaluasi AI (Dependency Graph)

Task                    ✅ tersedia
↓
Work Log                ✅ tersedia (5.1)
↓
Evidence                ✅ tersedia (5.0)
↓
Manager Review          ✅ tersedia (5.2)
↓
Work Session            ✅ tersedia (5.3)
↓
KPI                     ✅ tersedia (5.4)
↓
Kanban                  ⏳ Phase 6 (6.0)
↓
Meeting                 ⏳ Phase 6 (6.1)
↓
Calendar                ⏳ Phase 6 (6.2)
↓
Office Feed             ⏳ Phase 6 (6.3)
↓
AI Evaluation           ⏳ Phase 7 (7.0)
↓
Manager Copilot         ⏳ Phase 7 (7.1)
↓
Workforce Intelligence  ⏳ Phase 7 (7.2)

Setiap lapisan menjadi fondasi lapisan di atasnya. Data accountability Phase 5
(Task → Work Log → Evidence → Review → Session → KPI) sudah tersedia. AI (Phase 7)
baru boleh dibangun setelah data kolaborasi Phase 6 (Kanban, Meeting, Calendar,
Office Feed) lengkap.

Status: 6/10 dependency terpenuhi.

AI tidak boleh melakukan evaluasi hanya berdasarkan status task.

---

# Output AI

AI dapat menghasilkan:

* Performance Summary
* KPI Recommendation
* Risk Detection
* Productivity Insight
* Workload Analysis
* Team Bottleneck Detection

---

# Larangan

AI tidak boleh:

* Menentukan KPI final tanpa review manusia
* Menggantikan keputusan manager
* Menilai kinerja hanya dari waktu online
* Menilai kinerja hanya dari jumlah task

---

# Tujuan Akhir

AI harus menjadi copilot bagi manager.

Bukan pengganti manager.
