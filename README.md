# TaskFlow — AI-Powered Task & Time Tracking Application

<div align="center">
  <h3>🚀 A production-ready full-stack productivity application</h3>
  <p>React.js · Node.js · Express.js · MongoDB · JWT · Tailwind CSS · Lucide Icons · AI Enhancement</p>

  <br/>

  | 🌐 Live Demo | 📦 GitHub Repo |
  |---|---|
  | https://task-flow-app-sepia.vercel.app/(#) | [github.com/yourusername/task-flow](#) |

  <br/>

  **🔑 Test Credentials (for reviewer)**
  | Field | Value |
  |---|---|
  | Email | `mohansaini798330@gmail.com` |
  | Password | `m.S@7983` |

</div>

---

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure register/login/logout with bcrypt password hashing |
| 🤖 **AI Task Enhancement** | Auto-generates professional titles & descriptions (Gemini API + rule-based fallback) |
| ⏱️ **Real-Time Timers** | Start/stop timers per task with live display, multiple sessions |
| 📊 **Productivity Dashboard** | Daily stats, productivity score, active timer widget, recent activity |
| ✅ **Full Task CRUD** | Create, read, update, delete with status management |
| 🔍 **Search & Filter** | Search by text, filter by status with live counts |
| 📱 **Responsive Design** | Mobile-first dark theme with glassmorphism and animations |

---

## 🏗️ Project Structure

```
task_flow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js      # Register, Login, Logout, GetMe
│   │   │   ├── taskController.js      # Task CRUD + AI enhancement
│   │   │   ├── timeLogController.js   # Start/Stop timer
│   │   │   └── summaryController.js   # Daily dashboard stats
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verify + generateToken
│   │   │   └── errorHandler.js        # Global error handler + AppError
│   │   ├── models/
│   │   │   ├── User.js                # User schema with bcrypt
│   │   │   ├── Task.js                # Task schema with indexes
│   │   │   └── TimeLog.js             # TimeLog schema with virtual
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   ├── timeLogs.js
│   │   │   └── summary.js
│   │   └── services/
│   │       └── aiService.js           # Gemini API + rule-based fallback
│   ├── server.js                      # Express entry point
│   ├── .env                           # Environment variables (git-ignored)
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js               # Axios instance + interceptors
    │   │   ├── auth.js
    │   │   ├── tasks.js
    │   │   ├── timeLogs.js
    │   │   └── summary.js
    │   ├── components/
    │   │   ├── Dashboard/
    │   │   │   └── StatsCard.jsx
    │   │   ├── Layout/
    │   │   │   ├── Layout.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Header.jsx
    │   │   ├── Tasks/
    │   │   │   ├── TaskCard.jsx
    │   │   │   ├── TaskModal.jsx
    │   │   │   └── TaskFilter.jsx
    │   │   ├── Timer/
    │   │   │   └── TimerDisplay.jsx
    │   │   └── UI/
    │   │       ├── ProtectedRoute.jsx
    │   │       └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useTimer.js
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── TasksPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/task-flow.git
cd task_flow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy and configure environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key   # Optional — rule-based fallback used if missing
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy and configure environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

---

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "token": "...", "user": { ... } }
}
```

---

#### POST `/api/auth/logout` 🔒
Logout the current user (client-side token removal).

---

#### GET `/api/auth/me` 🔒
Get the authenticated user's profile.

---

### Tasks

#### GET `/api/tasks` 🔒
Get all tasks for the authenticated user.

**Query Params:** `status`, `sort`, `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "...",
        "title": "Follow Up With Designer — Review Feedback",
        "description": "...",
        "status": "pending",
        "totalTimeSpent": 3600,
        "isAiEnhanced": true,
        "isTimerRunning": false,
        "activeLog": null
      }
    ],
    "pagination": { "total": 10, "page": 1, "limit": 50, "pages": 1 }
  }
}
```

---

#### POST `/api/tasks` 🔒
Create a new task with optional AI enhancement.

**Request Body:**
```json
{
  "title": "follow up with designer",
  "description": "",       // Optional - leave empty for AI to generate
  "status": "pending",
  "enhance": true          // Set false to skip AI enhancement
}
```

---

#### PUT `/api/tasks/:id` 🔒
Update a task by ID.

**Request Body:** Any of `title`, `description`, `status`

---

#### DELETE `/api/tasks/:id` 🔒
Delete a task and all its associated time logs.

---

### Time Tracking

#### POST `/api/timelogs/start` 🔒
Start a timer for a task. Auto-stops any currently running timer.

**Request Body:**
```json
{ "taskId": "task_id_here" }
```

---

#### POST `/api/timelogs/stop` 🔒
Stop a running timer and calculate duration.

**Request Body:**
```json
{ "taskId": "task_id_here" }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "duration": 3721,
    "formattedDuration": "01:02:01",
    "task": { "totalTimeSpent": 3721, ... }
  }
}
```

---

#### GET `/api/timelogs` 🔒
Get all time logs. Supports `taskId`, `date`, `isRunning` query filters.

---

#### GET `/api/timelogs/running` 🔒
Get the currently running timer (if any).

---

### Summary

#### GET `/api/summary/today` 🔒
Get today's productivity summary.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTasks": 12,
      "pendingTasks": 4,
      "inProgressTasks": 3,
      "completedTasks": 5,
      "tasksWorkedOnToday": 3,
      "totalTodayTime": 14400,
      "formattedTodayTime": "04:00:00",
      "productivityScore": 78,
      "activeTimer": null
    },
    "recentActivity": [...]
  }
}
```

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens expire after **7 days** (configurable)
- All task/timelog routes verify user ownership
- Input validation via **express-validator**
- Mongoose schema-level validation
- CORS restricted to frontend URL

---

## 🗄️ Database Models

### User
| Field | Type | Description |
|---|---|---|
| `name` | String | Full name (2-50 chars) |
| `email` | String | Unique, indexed |
| `password` | String | bcrypt hashed, never returned |
| `createdAt` | Date | Auto |

### Task
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId | Reference to User |
| `originalInput` | String | Raw user input before AI |
| `title` | String | Enhanced title |
| `description` | String | AI-generated description |
| `status` | Enum | pending / in-progress / completed |
| `totalTimeSpent` | Number | Seconds accumulated |
| `isAiEnhanced` | Boolean | Was AI used? |

### TimeLog
| Field | Type | Description |
|---|---|---|
| `taskId` | ObjectId | Reference to Task |
| `userId` | ObjectId | Reference to User |
| `startTime` | Date | When timer started |
| `endTime` | Date | When timer stopped |
| `duration` | Number | Seconds |
| `isRunning` | Boolean | Active timer flag |

---

## 🌐 Deployment Guide

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables (same as `.env`):
   - `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL=https://your-app.vercel.app`
5. Deploy

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0)
3. Create a database user
4. Whitelist IPs (0.0.0.0/0 for Render)
5. Get connection string and set as `MONGO_URI`

---

## 🤖 AI Enhancement

### With Gemini API
Set `GEMINI_API_KEY` in your `.env`. The system uses `gemini-1.5-flash` to intelligently analyze task input and generate professional titles and structured descriptions.

### Without API Key (Rule-Based Fallback)
The system automatically detects keywords and applies structured templates for 14 categories:
- Communication (follow-up, email, call)
- Development (build, fix, implement)
- Design (UI, mockup, wireframe)
- Testing, DevOps, Documentation, Research, Planning, Reporting, etc.

---

## 📝 Scripts

### Backend
```bash
npm start        # Production server
npm run dev      # Development with nodemon
```

### Frontend
```bash
npm run dev      # Development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router DOM v6, Axios, Tailwind CSS 3 |
| **UI** | react-hot-toast, react-icons, date-fns |
| **Backend** | Node.js 18+, Express 4, Morgan |
| **Database** | MongoDB, Mongoose 8 |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Validation** | express-validator |
| **AI** | Google Gemini 1.5 Flash (+ rule-based fallback) |
| **Build** | Vite 5 |
| **Deploy** | Vercel (FE), Render (BE), MongoDB Atlas (DB) |

---

## 📜 License

MIT © 2025 TaskFlow
