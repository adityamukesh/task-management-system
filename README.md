# TaskFlow - Collaborative Task Management System

> **Assignment - 4: Full Stack CRUD with Client-Side Rendering**  
> **Deadline**: 12 October 2026 (9:00 AM)  
> **Architecture**: Client-Side Rendering (CSR) with React.js (Vite) + Node.js/Express REST API + MongoDB Atlas

---

## 📌 Project Description
**TaskFlow** is a modern, responsive web application designed for teams to manage tasks, track project deadlines, and organize workflows with role-based access control. Built with a full-stack JavaScript architecture, the system provides real-time client-side rendering (CSR), secure authentication using JWT, granular role permissions (Admin vs. Standard User), and complete CRUD operations.

---

## 👥 Team Information

| Role | Name | Roll Number | GitHub Profile |
| :--- | :--- | :--- | :--- |
| **Team Lead** | AMAN KUMAR (TL) | *[Roll No]* | [@armnkumar321-spec](https://github.com/armnkumar321-spec) |
| **Member 1** | *[Member Name]* | *[Roll No]* | [@member1](https://github.com/) |
| **Member 2** | *[Member Name]* | *[Roll No]* | [@member2](https://github.com/) |
| **Member 3** | *[Member Name]* | *[Roll No]* | [@member3](https://github.com/) |
| **Member 4** | *[Member Name]* | *[Roll No]* | [@member4](https://github.com/) |

---

## 🚀 Live Deployment Links

- **Frontend (Vercel)**: [https://task-management-system-frontend.vercel.app](https://task-management-system-frontend.vercel.app) *(Update with your live URL)*
- **Backend API (Render / Railway)**: [https://task-management-system-backend.onrender.com](https://task-management-system-backend.onrender.com) *(Update with your live URL)*
- **GitHub Repository**: [https://github.com/armnkumar321-spec/task-management-system](https://github.com/armnkumar321-spec/task-management-system)

---

## ✨ Features

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **User Registration & Login**: Password hashing with bcrypt, stateless JWT token authentication.
- **Admin Role**: Full system control — create tasks, edit all fields, assign tasks to any team member, delete tasks, and promote/demote members.
- **Standard User Role**: View all tasks, view personal tasks, inspect task details, and update the execution status (`pending` ➔ `in_progress` ➔ `completed`) of assigned tasks.

### 📋 Task Management (CRUD)
- **Create**: Modal form with controlled inputs for title, description, priority, deadline date, and assignee.
- **Read**: Dynamic listing with live search, status filters (`Pending`, `In Progress`, `Completed`), priority filters (`Low`, `Medium`, `High`, `Urgent`), and personal view toggle (`All Tasks` vs. `My Tasks`).
- **Update**: In-place status updates, detailed task edit dialog.
- **Delete**: Protected deletion with confirmation guards for Admin.
- **Dashboard Metrics**: Summary cards computing total tasks, active in-progress items, finished items, and urgent tasks.

### 💻 Client-Side Architecture
- Fast development & production bundling with **Vite**.
- Component-driven React structure using hooks (`useState`, `useEffect`, `useContext`, `useCallback`).
- Custom `useTasks` and `useAuth` hooks for separation of concerns.
- Centralized Axios client with automatic Bearer token injection and 401 error interceptors.
- Protected client-side routing via React Router v6.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Vanilla CSS (Modern Design System) |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), bcryptjs, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB |
| **Hosting** | Vercel (Frontend), Render / Railway (Backend) |
| **VCS** | Git, GitHub (Branches + Pull Requests + Issues) |

---

## 📁 Repository Structure

```text
task-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilter.jsx
│   │   │   └── TaskFormModal.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── TaskDetailPage.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   └── userService.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useTasks.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   │   └── vite.svg
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   └── seed.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── ISSUES.md
├── README.md
└── .gitignore
```

---

## 📡 API Endpoints Specification

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | User / Admin | Get profile of logged-in user |

### 2. Task Management (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | User / Admin | Fetch tasks with query filters (`status`, `priority`, `search`) |
| `GET` | `/api/tasks/stats/summary` | User / Admin | Get aggregate counts for dashboard metrics |
| `GET` | `/api/tasks/:id` | User / Admin | Fetch details for a specific task |
| `POST` | `/api/tasks` | **Admin Only** | Create a new task |
| `PUT` | `/api/tasks/:id` | Admin / Assigned | Edit task details (Admin) or update task status (Assignee) |
| `DELETE` | `/api/tasks/:id` | **Admin Only** | Permanently delete a task |

### 3. User & Team Directory (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | User / Admin | Get directory of users for task assignments |
| `PUT` | `/api/users/:id/role` | **Admin Only** | Update user access role (`admin` or `user`) |

---

## ⚙️ Environment Variables

> ⚠️ **CRITICAL SECURITY NOTE**: Never commit `.env` files to GitHub. Only commit `.env.example`.

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task_manager?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_taskflow_2026
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/amankumar/task-management-system.git
cd task-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy sample environment configuration
cp .env.example .env

# Populate sample data (Admin & User accounts + demo tasks)
npm run seed

# Run backend development server
npm run dev
```
*Backend runs at `http://localhost:5000`.*

### 3. Frontend Setup
```bash
# In a new terminal tab:
cd ../frontend
npm install

# Copy sample environment configuration
cp .env.example .env

# Run Vite dev server
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

### 4. Default Seed Credentials
For evaluation and rapid testing:
- **Admin Account**: `admin@taskflow.com` | Password: `adminpassword123`
- **User Account**: `alex@taskflow.com` | Password: `userpassword123`

---

## 🌿 GitHub Team Workflow & Contribution Rules

To simulate real industry agile development and satisfy assignment grading rules:

1. **Repository Setup**: Team Lead creates the repository with the baseline structure and `.gitignore`.
2. **Branching Model**: Never push directly to `main`. Every feature or fix must be developed on a dedicated branch:
   - `feature/auth`
   - `feature/task-crud`
   - `feature/dashboard-metrics`
   - `feature/filter-search`
   - `fix/error-handling`
3. **Pull Request Protocol**:
   - Push branch: `git push origin feature/your-feature-name`
   - Open Pull Request targeting `main`.
   - Team Lead or peer reviews code changes, tests functionality, and approves.
   - Merge via GitHub PR merge button.
4. **Mandatory Grading Requirement**:
   - **Every team member must have at least 2 meaningful PRs merged** to ensure collaborative contribution.

---

## 📸 Screenshots

*(Add screenshots of your application here)*

1. **Dashboard & Metrics Overview**: `screenshots/dashboard.png`
2. **Task Management & Filter Bar**: `screenshots/tasks-view.png`
3. **Task Creation / Edit Dialog**: `screenshots/task-modal.png`
4. **Role Management Console**: `screenshots/admin-panel.png`
5. **Login & Registration**: `screenshots/login.png`

---

## 📝 Final Submission Checklist

- [x] React.js + Vite Frontend with Client-Side Rendering
- [x] State management with `useState`, `useEffect`, and `useContext`
- [x] Controlled forms for Auth & Tasks
- [x] Axios instance with Bearer token interceptor
- [x] Role-Based Access Control (`Admin` & `User`)
- [x] Express REST API with full CRUD operations
- [x] MongoDB Atlas schema with Mongoose models
- [x] Robust error handling & 404 middleware
- [x] `.env` excluded via `.gitignore` and `.env.example` committed
- [x] 30+ Actionable GitHub Issues created for team members
- [x] Detailed README with all required sections
