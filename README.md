# ⚡ FocusFlow AI — Smart Productivity & Task Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/FocusFlow-v1.0.0-violet?style=for-the-badge&logo=rocket" alt="Version" />
  <img src="https://img.shields.io/badge/OpenRouter-AI_Powered-indigo?style=for-the-badge&logo=openai" alt="OpenRouter" />
  <img src="https://img.shields.io/badge/Fallback_Engine-Multi--Tier-emerald?style=for-the-badge" alt="Fallback Engine" />
  <img src="https://img.shields.io/badge/Stack-MERN_--_Vite-blue?style=for-the-badge&logo=react" alt="Stack" />
</p>

**FocusFlow AI** is a full-stack, modern productivity application designed to help individuals manage tasks, break down complex goals, track daily streaks, and optimize focus using an integrated **OpenRouter AI Assistant** with **multi-tiered automatic model fallbacks**.

---

## ✨ Features at a Glance

### 🤖 1. Focus AI Assistant & OpenRouter Integration
- **Context-Aware AI Chatbot**: Natural language assistant embedded directly into your workspace. Understands your active tasks, priorities, and daily logs.
- **🛡️ Multi-Tiered Automatic AI Fallback System**:
  - **Tier 1 (High Performance)**: `google/gemini-2.0-flash-001`, `meta-llama/llama-3.3-70b-instruct`, `deepseek/deepseek-chat`
  - **Tier 2 (Free Fallback Models)**: If primary models hit rate limits, payment quotas, or timeouts, Focus AI automatically cascades to free models (`meta-llama/llama-3.2-11b-vision-instruct:free`, `mistralai/mistral-7b-instruct:free`, `qwen/qwen-2.5-coder-32b-instruct:free`, `google/gemini-2.0-flash-exp:free`, `deepseek/deepseek-r1:free`).
- **⚡ AI Auto-Prioritization**: Evaluates your pending tasks and automatically assigns priority levels (`urgent`, `high`, `medium`, `low`), categories, and estimated duration in minutes.

### 🔨 2. Intelligent Task Breakdown & Subtasks
- **1-Click AI Breakdown**: Automatically deconstructs large or overwhelming tasks into actionable subtasks with time estimates.
- **Checklist Management**: Track progress of individual subtasks inside each task card.

### 💡 3. AI Smart Suggestions & Productivity Coach
- **Personalized Insights**: Analyzes task velocity and active streak.
- **Next-Task Recommendations**: Generates top 3 high-impact tasks tailored to your current goals with 1-click "Add to Tasks".
- **Focus Tips**: Actionable advice (Pomodoro technique, batch processing, time-blocking).

### 🎯 4. Modern Task Management (Full CRUD)
- **Rich Task Metadata**: Priority tags, Category badges (Work 💼, Personal 🏠, Learning 📚, Health 🏃, Finance 💰, Other 📌), Due Dates, Est. Minutes.
- **Search & Advanced Filtering**: Filter by Status (`pending`, `working`, `completed`) and Category; sort by Due Date, Priority, or Creation Date.
- **Edit Modal**: Full task editor to update descriptions, subtasks, categories, and due dates.

### 📊 5. Analytics & Daily Streaks
- **Streak Counter**: Tracks consecutive daily task completions (`DailyLog` model).
- **Overall Completion Rate**: Dynamic visual progress bars.

### 🔒 6. Auth & Account Security
- JWT-based authentication with protected routes.
- Bcrypt password hashing.
- Nodemailer OTP verification for secure email and password changes.

---

## 🏗️ Architecture & Technology Stack

```
             ┌──────────────────────────────────────────────┐
             │            React + Vite Frontend             │
             │   (Tailwind CSS, Axios, Settings Context)   │
             └──────────────────────┬───────────────────────┘
                                    │ HTTP / REST API
                                    ▼
             ┌──────────────────────────────────────────────┐
             │             Node.js / Express Server          │
             │    (JWT Protect Middleware, Auth, Tasks)    │
             └───────┬──────────────────────────────┬───────┘
                     │                              │
                     ▼                              ▼
        ┌─────────────────────────┐   ┌───────────────────────────┐
        │    MongoDB Database     │   │  OpenRouter AI Fallback   │
        │ (Users, Tasks, DailyLog)│   │  (Primary -> Free Models) │
        └─────────────────────────┘   └───────────────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router v6
- **Backend**: Node.js, Express 5, Mongoose (MongoDB), JWT, Bcrypt, Nodemailer
- **AI Engine**: OpenRouter API with dynamic multi-tiered fallback to free tier models

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
node app.js
```
> The server will start on `http://localhost:3000`.

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> The frontend app will run on `http://localhost:5173`.

---

## ⚙️ Environment Variables Configuration

Create or verify `backend/.env`:

```env
# Server Port
PORT=3000

# Database URI
MONGO_URI=mongodb://127.0.0.1:27017/prodApp

# Authentication Secret
JWT_SECRET=mysecretkey

# OpenRouter AI Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Nodemailer Credentials (for OTP email verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 📡 API Endpoint Reference

### 🔐 Auth & User Routes (`/api/auth`, `/api/user`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user & receive JWT token |
| `GET` | `/api/user/dashboard` | Fetch logged-in user profile & dashboard info |
| `PUT` | `/api/user/update-name` | Update user display name |
| `POST` | `/api/user/request-email-change` | Trigger OTP email for email change |
| `PUT` | `/api/user/verify-email-change` | Verify OTP & apply new email |
| `POST` | `/api/user/request-password-change` | Trigger OTP email for password reset |
| `PUT` | `/api/user/verify-password-change` | Verify OTP & update password |

### 📋 Task Routes (`/api/tasks`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks for current user |
| `POST` | `/api/tasks` | Create a new task (with priority, category, subtasks) |
| `POST` | `/api/tasks/batch` | Create multiple tasks in bulk (AI breakdown insertion) |
| `PUT` | `/api/tasks/:id` | Update task details / toggle complete status |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/tasks/logs` | Fetch daily streak activity logs |

### 🤖 AI Routes (`/api/ai`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Chat with Focus AI Assistant (context aware) |
| `POST` | `/api/ai/breakdown` | Deconstruct a complex task into subtask checklist |
| `POST` | `/api/ai/suggestions` | Generate personalized task ideas & productivity coaching tips |
| `POST` | `/api/ai/auto-organize` | Auto-assign priority, category, & duration to active tasks |

---

## 🛡️ OpenRouter AI Multi-Tier Fallback Mechanism

FocusFlow handles AI model reliability by automatically looping through a sequence of OpenRouter models:

```
[Request]
   │
   ├──> 1. google/gemini-2.0-flash-001
   │       └─> (Success) ──> Return Response
   │       └─> (Fail / 429 / Timeout) ──┐
   ├──> 2. meta-llama/llama-3.3-70b-instruct <──┘
   │       └─> (Success) ──> Return Response
   │       └─> (Fail / 429 / Timeout) ──┐
   ├──> 3. deepseek/deepseek-chat <──┘
   │       └─> (Success) ──> Return Response
   │       └─> (Fail / 429 / Timeout) ──┐
   │                                   ▼
   │                    [FREE MODEL BACKUP TIER]
   ├──> 4. meta-llama/llama-3.2-11b-vision-instruct:free
   ├──> 5. mistralai/mistral-7b-instruct:free
   ├──> 6. qwen/qwen-2.5-coder-32b-instruct:free
   ├──> 7. google/gemini-2.0-flash-exp:free
   └──> 8. deepseek/deepseek-r1:free
```

This guarantees high uptime and instant fallback to zero-cost models if quota or provider outages occur.

---

## 📄 License
This project is open-source under the [ISC License](LICENSE).
