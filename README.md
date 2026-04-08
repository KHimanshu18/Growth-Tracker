🔗 Live Demo: https://growth-tracker-drab.vercel.app/

---

## 🚀 Features

### 🔐 Authentication & RBAC

- Login-based system (no public signup)
- Role-based access:
  - **Admin**
  - **Visitor**
- Secure authentication using JWT (cookies)

---

### 👨‍💼 Admin Features

- Add new visitors
- Automatically creates a linked user account (default password: `12345678`)
- View all visitors
- Add follow-ups for any visitor
- Dashboard insights:
  - Total visitors
  - Monthly visitors
  - Follow-ups (pending/overdue)
  - Status breakdown (Interested, Joined, Rejected, etc.)
  - Graph visualization

---

### 👤 Visitor Features

- Login with assigned credentials
- View personal dashboard
- Access personal details
- Track own follow-ups and status

---

### 📊 Dashboard

- Line graph showing visitor growth over time
- Real-time stats fetched from database
- Status-based segmentation

---

## 🏗️ Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (jose), bcrypt
- **State Management**: Context API

---
