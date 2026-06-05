# AWOS Frontend Engineering Rules

## Source of Truth

Frontend WAJIB mengikuti:

1. Root CLAUDE.md
2. Dokumen ini (apps/web/CLAUDE.md)

Jika terjadi konflik:

Root CLAUDE.md > apps/web/CLAUDE.md

Jangan membuat architecture baru tanpa instruksi eksplisit.

---

# Project Context

Project:
AI Workforce Operating System (AWOS)

AWOS adalah internal enterprise platform untuk:

* WFH management
* Task management
* Team collaboration
* Notification system
* Productivity management
* Workflow execution
* AI-assisted operations

Frontend adalah operational interface untuk backend yang sudah tersedia.

Fokus utama frontend:

* usability
* maintainability
* scalability
* enterprise workflow

Bukan marketing website.

---

# Tech Stack

WAJIB gunakan:

* Next.js App Router
* TypeScript
* TailwindCSS
* shadcn/ui
* TanStack Query
* Zustand
* Axios
* Socket.IO Client

JANGAN gunakan:

* Redux
* MobX
* SWR
* Recoil
* Apollo
* Context API untuk global auth

---

# Architecture Principles

Prioritas:

1. Simplicity
2. Maintainability
3. Reusability
4. Scalability

JANGAN:

* overengineering
* abstraction berlebihan
* generic pattern yang tidak diperlukan

---

# Folder Structure

Gunakan struktur berikut:

app/
components/
features/
hooks/
lib/
services/
stores/
types/

JANGAN membuat folder random.

JANGAN membuat struktur baru tanpa alasan kuat.

---

# Feature Structure

Setiap feature besar:

features/
auth/
users/
tasks/
notifications/
departments/

Dalam feature:

components/
hooks/
services/
types/

WAJIB mengikuti pola ini.

---

# State Management

Gunakan:

Zustand

Untuk:

* auth state
* user session
* notification state ringan
* ui state ringan

JANGAN:

* menyimpan data API besar di Zustand

Gunakan TanStack Query untuk server state.

---

# Server State Rules

Semua data backend:

* users
* tasks
* notifications
* departments

WAJIB menggunakan:

TanStack Query

JANGAN:

* fetch manual berulang
* duplicate state

---

# API Rules

Semua API call HARUS melalui:

lib/api.ts

Gunakan Axios instance tunggal.

WAJIB:

* bearer token interceptor
* response interceptor
* centralized error handling

JANGAN:

* fetch langsung di component
* membuat axios instance baru

---

# Authentication Rules

Gunakan:

stores/auth.store.ts

Auth state minimal:

* user
* accessToken
* isAuthenticated

Actions:

* login
* logout
* setUser
* setToken

JANGAN:

* menyimpan password
* menyimpan credential sensitif

---

# Protected Route Rules

Protected routes WAJIB menggunakan:

* middleware
* auth guard layer

JANGAN:

* if token di setiap page

---

# Component Rules

Komponen harus:

* reusable
* small
* focused

JANGAN:

* component >300 lines jika bisa dipecah
* business logic berat di UI

---

# Page Rules

Page bertugas:

* layout
* composition

Business logic:

* hooks
* services

JANGAN:

* API call besar di page

---

# Form Rules

Gunakan:

* React Hook Form
* Zod

WAJIB:

* schema validation

JANGAN:

* manual validation

---

# UI Rules

Gunakan:

* shadcn/ui
* Tailwind

Design philosophy:

* enterprise software
* clean
* functional
* responsive

JANGAN:

* glassmorphism berlebihan
* neon cyberpunk
* startup landing aesthetic

AWOS adalah operational platform.

---

# Realtime Rules

Semua socket logic HARUS melalui:

lib/socket.ts

WAJIB:

* singleton socket
* reusable connection

JANGAN:

* membuat socket baru di banyak component

---

# Notification Rules

Notification UI:

* dropdown
* unread badge
* mark as read

JANGAN:

* polling

Gunakan websocket yang sudah tersedia.

---

# Error Handling Rules

WAJIB:

* user-friendly error
* fallback state
* loading state
* empty state

Setiap page harus punya:

* loading
* error
* empty

---

# Security Rules

JANGAN:

* menyimpan secret
* hardcode token
* expose sensitive data

Semua auth melalui backend.

---

# Performance Rules

WAJIB:

* lazy load jika diperlukan
* memoization jika masuk akal
* query caching

JANGAN:

* premature optimization

---

# Forbidden Features

JANGAN membuat:

* AI chat
* AI workspace
* RAG interface
* KPI analytics
* workflow builder
* kanban complex
* reporting engine

Sampai modul tersebut diminta secara eksplisit.

---

# Completed Backend Modules

Backend yang SUDAH tersedia:

* Authentication
* User Management
* Department Management
* Role Foundation
* Task Management
* Task Comments
* Notification System
* Realtime Foundation

Gunakan API yang sudah ada.

JANGAN membuat mock data jika endpoint tersedia.

---

# Coding Philosophy

Ketika ragu:

* pilih solusi lebih sederhana
* pilih maintainability
* pilih readability

Jangan membuat "future-proof abstraction".

Bangun apa yang dibutuhkan modul saat ini.


# UI / UX DESIGN SYSTEM

## Design Philosophy

AWOS adalah:

Enterprise Workforce Operating System

Bukan:

* marketing website
* startup landing page
* crypto dashboard
* futuristic AI showcase

AWOS harus terasa:

* profesional
* terpercaya
* fokus pekerjaan
* minimal distraction
* data-first
* productivity-first

Inspirasi utama:

* Linear
* Notion
* Jira Cloud
* Slack
* GitHub

---

# Visual Personality

AWOS harus memberikan kesan:

"Professional Internal Company Platform"

Ketika user membuka aplikasi mereka harus merasa:

* fokus bekerja
* informasi jelas
* tidak lelah melihat layar berjam-jam

JANGAN membuat UI yang terlalu ramai.

---

# Color System

## Primary Color

Gunakan:

Indigo

Tailwind:

indigo-600

Contoh:

* tombol utama
* active navigation
* selected state
* focus state

---

## Secondary Color

Slate

Tailwind:

slate-700
slate-800
slate-900

Digunakan untuk:

* sidebar
* typography
* dashboard shell

---

## Success

green-600

Untuk:

* task completed
* success state

---

## Warning

amber-500

Untuk:

* review state
* warning state

---

## Danger

red-600

Untuk:

* delete
* critical task
* destructive action

---

## Information

blue-500

Untuk:

* informational notification
* help state

---

# Background System

Main background:

slate-50

Card background:

white

Sidebar:

slate-900

Header:

white

Border:

slate-200

---

# Dark Mode

WAJIB support dark mode.

Dark theme:

Background:
slate-950

Card:
slate-900

Border:
slate-800

Text:
slate-100

Primary:
indigo-500

JANGAN membuat dark mode neon.

---

# Typography

Gunakan:

Inter

Fallback:

system-ui

Font weight:

400
500
600

JANGAN:

* Poppins
* Orbitron
* Montserrat untuk seluruh aplikasi

AWOS adalah tool kerja.

---

# Layout Rules

Desktop First:

Sidebar:
240px

Header:
64px

Content:
fluid

Container:
max-w-full

---

# Sidebar Design

Sidebar harus:

* fixed
* collapsible
* icon + label

Menu:

* Dashboard
* Tasks
* Notifications
* Departments
* Users

Active menu:

* indigo highlight
* subtle background

JANGAN gunakan gradient.

---

# Card Design

Gunakan:

* rounded-xl
* border
* subtle shadow

JANGAN:

* shadow besar
* glassmorphism

---

# Button Design

Primary:

indigo

Secondary:

outline

Danger:

red

Ghost:

minimal

JANGAN membuat:

* glowing button
* animated button

---

# Table Design

Karena AWOS adalah aplikasi operasional:

Table adalah komponen utama.

Gunakan:

* sticky header
* hover state
* pagination
* sorting ready

Design harus mirip:

* Linear
* GitHub

---

# Dashboard Design

Dashboard harus:

* ringkas
* actionable

Prioritas:

1. Assigned Tasks
2. Notifications
3. Recent Activity
4. Team Summary

JANGAN:

* chart penuh
* KPI berlebihan

---

# Notification Design

Dropdown style:

* compact
* latest first
* unread indicator

Mirip:

Slack
GitHub

---

# Empty State Rules

Setiap halaman WAJIB punya:

* Empty State
* Loading State
* Error State

JANGAN menampilkan layar kosong.

---

# Mobile Rules

Support:

* tablet
* mobile

Sidebar:

desktop = fixed

mobile = drawer

---

# Forbidden UI Patterns

JANGAN gunakan:

* glassmorphism
* neumorphism
* excessive gradients
* animated background
* floating particles
* AI futuristic theme
* crypto dashboard theme
* rainbow accent

---

# Desired User Experience

Ketika user menggunakan AWOS selama 8 jam kerja:

UI harus terasa:

* ringan
* cepat
* profesional
* tidak melelahkan

Tujuan utama:

Membantu pekerjaan selesai.

Bukan membuat user kagum selama 5 menit lalu lelah selama 8 jam.
