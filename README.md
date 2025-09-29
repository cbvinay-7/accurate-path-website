# 🚀 TalentConnect: Full-Stack Career & Project Platform

TalentConnect is a comprehensive platform designed to connect **talent with opportunities** — jobs, projects, and mentorship — while also providing **career-building tools** such as a Resume Builder and an AI-powered Job Agent.  
The app is built with **React + TypeScript** and **Supabase**, and features **real-time synchronization**, **monetization with Razorpay**, and a dedicated **Admin CMS**.

---

## 🌟 Features

### 👩‍💼 Career & Opportunity Hub
- **Real-time Job Board (`/jobs`)** – Browse and search jobs with instant updates from Supabase Realtime.
- **Mentorship Directory (`/mentors`)** – Explore mentors by expertise and ratings; includes booking/chat integration.
- **Project Showcase (`/projects`)** – Curated developer projects with GitHub/live demo links.
- **Premium Downloads** – Integrated with Razorpay; purchase & download source files (ZIP/RAR) stored securely in Supabase.

### 🧑‍🎓 Advanced User Tools
- **Modular Resume Builder (`/account`)** – Structured forms with granular cards: Education, Certificates, Languages, and more.
- **AI Job Agent (`/index`)** – Placeholder for LLM-powered career advice and job matching.
- **Profile Gamification** – ProfileCompletionCard encourages users to complete their data.

### 🛡️ Dedicated Admin CMS
- **Secure Admin Login (`/admin/login`)** – Separate authentication for admins.
- **Dashboard (`/admin/dashboard`)** – Manage Jobs, Projects, and Mentors.
- **CRUD Interfaces** – Full content management with Supabase + TanStack Query.
- **File Uploads** – Admins can upload screenshots and ZIP/RAR files to Supabase storage.

---

## 🛠️ Tech Stack

| Area              | Technology                 | Role in Project |
|-------------------|----------------------------|-----------------|
| **Frontend**      | React + TypeScript         | Type-safe, component-based UI |
| **Styling**       | TailwindCSS + Shadcn/ui    | Utility-first styling + accessible UI components |
| **Backend/DB**    | Supabase (Postgres, Auth, Storage) | Database, authentication, file storage |
| **Realtime**      | Supabase Realtime          | Live updates for jobs, mentors, projects |
| **State Mgmt.**   | TanStack Query (React Query) | Data fetching, caching, mutations |
| **Routing**       | React Router DOM           | Declarative navigation and protected routes |
| **Payments**      | Razorpay                   | Monetization of project downloads |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── account/          # Resume Builder form cards (EducationCard, CertificatesCard, etc.)
│   ├── ui/               # Shadcn/ui components (Button, Card, Input, Select, Dialog)
│   ├── AIJobAgent.tsx    # AI-powered job assistant (placeholder)
│   ├── Header.tsx        # Global navigation
│   └── ...               # Other shared components
├── contexts/
│   ├── AuthContext.tsx       # User authentication (Supabase)
│   └── AdminAuthContext.tsx  # Admin authentication
├── hooks/
│   ├── useAuth.ts            # Auth logic for users
│   ├── useAdminAuth.ts       # Auth logic for admins
│   ├── useProfile.ts         # Profile management
│   └── useToast.ts           # Toast/notification hook
├── integrations/
│   └── supabase/             # Supabase client configuration
└── pages/
    ├── App.tsx               # Router + Context setup
    ├── Index.tsx             # Main user dashboard
    ├── Auth.tsx              # User Sign In / Sign Up
    ├── Account.tsx           # Resume Builder page
    ├── AllJobs.tsx           # Job listings
    ├── AllProjects.tsx       # Project showcase
    ├── ProjectDetail.tsx     # Project purchase/download page
    ├── AllMentors.tsx        # Mentor directory
    ├── AdminDashboard.tsx    # Admin CMS landing
    ├── AdminJobs.tsx         # Admin CRUD for jobs
    ├── AdminProjects.tsx     # Admin CRUD for projects (with file uploads)
    ├── AdminMentors.tsx      # Admin CRUD for mentors
    └── NotFound.tsx          # 404 page
```

---

## 🗺️ Routing Map

| Path              | Component          | Access   | Description |
|-------------------|-------------------|----------|-------------|
| `/`               | LandingPage       | Public   | Initial landing page |
| `/auth`           | Auth              | Public   | User sign in / sign up |
| `/index`          | Index             | User     | Dashboard (AI Agent, Resume Builder) |
| `/account`        | Account           | User     | Resume Builder forms |
| `/jobs`           | AllJobs           | Public   | Job listings |
| `/projects`       | AllProjects       | Public   | Project showcase |
| `/projects/:id`   | ProjectDetail     | Public   | Project purchase/download |
| `/mentors`        | AllMentors        | Public   | Mentor directory |
| `/admin/login`    | AdminLogin        | Public   | Admin login |
| `/admin/dashboard`| AdminDashboard    | Admin    | CMS hub |
| `/admin/jobs`     | AdminJobs         | Admin    | Manage jobs |
| `/admin/projects` | AdminProjects     | Admin    | Manage projects & files |
| `/admin/mentors`  | AdminMentors      | Admin    | Manage mentors |
| `*`               | NotFound          | Public   | 404 fallback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- A **Supabase** project (for DB, Auth, Storage)
- A **Razorpay** account (for payments)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/talentconnect.git
   cd talentconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**  
   Create a `.env` file in the root:
   ```env
   # Supabase
   VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
   VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

   # Razorpay
   VITE_RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"
   ```

   ⚠️ Make sure your Supabase tables (`jobs`, `projects`, `mentors`, `profiles`) and storage bucket (`admin-files`) are configured.

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   App runs on: **http://localhost:5173**

---

## 📌 Future Enhancements
- Integration of **AI Job Agent** with LLMs for smart recommendations.
- Resume export (PDF/Word) with professional templates.
- Mentor session booking with calendar integration.
- Advanced analytics for admins.

---

## 📜 License
This project is open source under the [MIT License](LICENSE).
