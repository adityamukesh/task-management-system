# TaskFlow Project Issues & Roadmap (32 Actionable Issues)

This document contains **32 detailed, production-ready GitHub issues** created for team members to collaborate on via Git branches and Pull Requests. Every member can pick issues according to their role and submit PRs according to the grading requirements.

---

### Issue #1: [Setup] Repository Scaffolding & Monorepo Directory Structure
- **Category**: DevOps / Setup
- **Branch**: `feature/repo-scaffolding`
- **Labels**: `setup`, `priority-high`
- **Description**: Establish the root directory structure containing isolated `frontend/` and `backend/` sub-projects, along with `.gitignore` rules to prevent node_modules and credentials from leaking.
- **Acceptance Criteria**:
  - [ ] Initialize `frontend/` with Vite and `backend/` with Express.
  - [ ] Add root and subdirectory `.gitignore` files preventing `.env` and `node_modules` commits.
  - [ ] Provide `.env.example` templates in both folders.

---

### Issue #2: [Backend] MongoDB Atlas Connection & Mongoose Client Setup
- **Category**: Backend / Database
- **Branch**: `feature/mongodb-connection`
- **Labels**: `backend`, `database`, `priority-high`
- **Description**: Implement a robust MongoDB connection module using Mongoose in `backend/src/config/db.js`.
- **Acceptance Criteria**:
  - [ ] Connect using `process.env.MONGO_URI`.
  - [ ] Log host upon connection success.
  - [ ] Catch errors and cleanly exit process (`process.exit(1)`).

---

### Issue #3: [Backend] Express Server Bootstrap with CORS and JSON Parsing
- **Category**: Backend / Core
- **Branch**: `feature/express-server-init`
- **Labels**: `backend`, `priority-high`
- **Description**: Set up `server.js` with express initialization, JSON body parsing, CORS middleware for frontend communication, and a `/api/health` sanity route.
- **Acceptance Criteria**:
  - [ ] Configure `cors` middleware with proper origin handling.
  - [ ] Configure `express.json()` parser.
  - [ ] Return `{ status: 'healthy', timestamp: ... }` on `GET /api/health`.

---

### Issue #4: [Backend] Centralized Error Handling & 404 Middleware
- **Category**: Backend / Core
- **Branch**: `feature/error-handling-middleware`
- **Labels**: `backend`, `bug-fix`, `priority-medium`
- **Description**: Build centralized error handling middleware to catch Mongoose CastError, duplicate key (11000) errors, and validation errors.
- **Acceptance Criteria**:
  - [ ] Create `errorHandler` returning appropriate status codes (400, 404, 500).
  - [ ] Hide error stack traces in `NODE_ENV === 'production'`.
  - [ ] Create `notFound` middleware for undefined endpoints.

---

### Issue #5: [Backend] User Model with Password Hashing via bcrypt
- **Category**: Backend / Auth
- **Branch**: `feature/user-model`
- **Labels**: `backend`, `auth`, `priority-high`
- **Description**: Create Mongoose schema for `User` with fields: `name`, `email` (unique), `password` (minlength 6), `role` (`'user'` or `'admin'`), and timestamps.
- **Acceptance Criteria**:
  - [ ] Add Mongoose pre-save hook to hash password using `bcryptjs`.
  - [ ] Add `matchPassword` method to schema for comparing candidate passwords.
  - [ ] Sanitize email to lowercase and trimmed strings.

---

### Issue #6: [Backend] User Registration REST API (`POST /api/auth/register`)
- **Category**: Backend / Auth
- **Branch**: `feature/auth-register-api`
- **Labels**: `backend`, `auth`, `priority-high`
- **Description**: Implement registration endpoint that validates payload, ensures email uniqueness, creates user record, and issues a JWT token.
- **Acceptance Criteria**:
  - [ ] Validate presence of name, email, and password.
  - [ ] Verify if email already exists (return 400 with descriptive error).
  - [ ] Generate signed JWT token with 30-day expiration.
  - [ ] Return `_id`, `name`, `email`, `role`, and `token`.

---

### Issue #7: [Backend] User Login REST API (`POST /api/auth/login`)
- **Category**: Backend / Auth
- **Branch**: `feature/auth-login-api`
- **Labels**: `backend`, `auth`, `priority-high`
- **Description**: Implement authentication endpoint verifying email and password match, returning user profile and token.
- **Acceptance Criteria**:
  - [ ] Check email exists and call `user.matchPassword(password)`.
  - [ ] Return 401 for invalid credentials.
  - [ ] Return user object with JWT token on success.

---

### Issue #8: [Backend] Role-Based Authentication Middleware (`authenticateUser` & `requireAdmin`)
- **Category**: Backend / Security
- **Branch**: `feature/auth-middleware`
- **Labels**: `backend`, `security`, `priority-high`
- **Description**: Build middleware functions in `backend/src/middleware/auth.js` to protect routes and verify admin privileges.
- **Acceptance Criteria**:
  - [ ] Extract and verify Bearer token from `Authorization` header.
  - [ ] Attach user instance (without password) to `req.user`.
  - [ ] `requireAdmin` returns 403 Forbidden if `req.user.role !== 'admin'`.

---

### Issue #9: [Backend] Task Mongoose Model Design
- **Category**: Backend / Database
- **Branch**: `feature/task-model`
- **Labels**: `backend`, `database`, `priority-high`
- **Description**: Create `Task` schema in `backend/src/models/Task.js` with fields: `title`, `description`, `status`, `priority`, `dueDate`, `assignedTo`, `createdBy`, and timestamps.
- **Acceptance Criteria**:
  - [ ] Enum for `status`: `['pending', 'in_progress', 'completed']`.
  - [ ] Enum for `priority`: `['low', 'medium', 'high', 'urgent']`.
  - [ ] Reference `assignedTo` and `createdBy` to `User` model.

---

### Issue #10: [Backend] Task Creation Endpoint (`POST /api/tasks`)
- **Category**: Backend / Tasks
- **Branch**: `feature/task-create-api`
- **Labels**: `backend`, `tasks`, `priority-high`
- **Description**: Build admin-restricted endpoint to create new tasks and optionally assign to team members.
- **Acceptance Criteria**:
  - [ ] Protect with `authenticateUser` and `requireAdmin`.
  - [ ] Validate required `title`.
  - [ ] Set `createdBy` to `req.user._id`.
  - [ ] Return populated `assignedTo` and `createdBy` fields with 201 Created.

---

### Issue #11: [Backend] Task Querying with Search & Filters (`GET /api/tasks`)
- **Category**: Backend / Tasks
- **Branch**: `feature/task-read-api`
- **Labels**: `backend`, `tasks`, `priority-high`
- **Description**: Implement endpoint to retrieve tasks with filtering by `status`, `priority`, search substring, and personal view.
- **Acceptance Criteria**:
  - [ ] Support `?status=...` and `?priority=...` query parameters.
  - [ ] Implement regex search for title and description.
  - [ ] Support `?view=my-tasks` for standard users to fetch assigned/created tasks.
  - [ ] Sort by `createdAt` descending.

---

### Issue #12: [Backend] Task Update Endpoint (`PUT /api/tasks/:id`)
- **Category**: Backend / Tasks
- **Branch**: `feature/task-update-api`
- **Labels**: `backend`, `tasks`, `priority-high`
- **Description**: Implement endpoint allowing Admins to edit all task details, while standard users can update the status of tasks assigned to them.
- **Acceptance Criteria**:
  - [ ] Allow Admin to update title, description, status, priority, dueDate, assignedTo.
  - [ ] Allow assigned standard user to update `status`.
  - [ ] Reject unauthorized modifications with 403 status code.

---

### Issue #13: [Backend] Task Deletion Endpoint (`DELETE /api/tasks/:id`)
- **Category**: Backend / Tasks
- **Branch**: `feature/task-delete-api`
- **Labels**: `backend`, `tasks`, `priority-high`
- **Description**: Implement Admin-only route to delete tasks by ID.
- **Acceptance Criteria**:
  - [ ] Enforce `requireAdmin` middleware.
  - [ ] Return 404 if task not found.
  - [ ] Delete document from MongoDB and return confirmation message and id.

---

### Issue #14: [Backend] Task Statistics Summary Endpoint (`GET /api/tasks/stats/summary`)
- **Category**: Backend / Analytics
- **Branch**: `feature/task-stats-api`
- **Labels**: `backend`, `analytics`, `priority-medium`
- **Description**: Add aggregate endpoint returning counts for total tasks, pending, in-progress, completed, and urgent tasks for dashboard widgets.
- **Acceptance Criteria**:
  - [ ] Count tasks by status using Mongoose countDocuments.
  - [ ] Return JSON `{ total, pending, inProgress, completed, urgent }`.
  - [ ] Ensure fast query execution.

---

### Issue #15: [Backend] Team Member Directory Endpoints (`/api/users`)
- **Category**: Backend / Admin
- **Branch**: `feature/users-directory-api`
- **Labels**: `backend`, `admin`, `priority-medium`
- **Description**: Provide endpoints for listing users (for task assignments) and updating user roles (Admin console).
- **Acceptance Criteria**:
  - [ ] `GET /api/users`: Return user list excluding passwords.
  - [ ] `PUT /api/users/:id/role`: Admin-only endpoint to toggle roles between `'admin'` and `'user'`.

---

### Issue #16: [Backend] Database Seeder Script for Sample Data
- **Category**: Backend / Tooling
- **Branch**: `feature/db-seeder-script`
- **Labels**: `backend`, `tooling`, `priority-medium`
- **Description**: Create `backend/src/utils/seed.js` script to populate Admin account, sample members, and realistic demo tasks.
- **Acceptance Criteria**:
  - [ ] Clean previous collections before inserting.
  - [ ] Create `admin@taskflow.com` and `user@taskflow.com` accounts.
  - [ ] Insert at least 5 sample tasks with diverse statuses and priorities.
  - [ ] Provide `npm run seed` script in `package.json`.

---

### Issue #17: [Frontend] Axios API Client with JWT Request Interceptor
- **Category**: Frontend / Services
- **Branch**: `feature/axios-client`
- **Labels**: `frontend`, `services`, `priority-high`
- **Description**: Build centralized Axios instance in `frontend/src/services/api.js` that automatically attaches JWT tokens from localStorage.
- **Acceptance Criteria**:
  - [ ] Configure `baseURL` using `import.meta.env.VITE_API_URL`.
  - [ ] Request interceptor adding `Authorization: Bearer <token>`.
  - [ ] Response interceptor catching 401 responses and clearing expired tokens.

---

### Issue #18: [Frontend] Authentication Context & State Management
- **Category**: Frontend / Auth
- **Branch**: `feature/auth-context`
- **Labels**: `frontend`, `auth`, `priority-high`
- **Description**: Create `AuthContext` and custom `useAuth` hook managing user profile, token persistence, login, register, and logout.
- **Acceptance Criteria**:
  - [ ] Check and validate token on application mount.
  - [ ] Provide `user`, `loading`, `login`, `register`, `logout`, and `isAdmin` flags.
  - [ ] Gracefully handle expired sessions.

---

### Issue #19: [Frontend] Client-Side Routing & Route Guards (`<ProtectedRoute>` & `<AdminRoute>`)
- **Category**: Frontend / Routing
- **Branch**: `feature/route-guards`
- **Labels**: `frontend`, `routing`, `priority-high`
- **Description**: Set up React Router DOM routes with guard components to restrict authenticated pages and admin sections.
- **Acceptance Criteria**:
  - [ ] `<ProtectedRoute>` redirects unauthenticated visitors to `/login`.
  - [ ] `<AdminRoute>` redirects non-admins to `/dashboard`.
  - [ ] Support loading state while verifying auth session.

---

### Issue #20: [Frontend] User Registration Page with Controlled Form
- **Category**: Frontend / Auth
- **Branch**: `feature/register-page`
- **Labels**: `frontend`, `forms`, `priority-high`
- **Description**: Develop controlled registration form in `RegisterPage.jsx` with input validations and role selection.
- **Acceptance Criteria**:
  - [ ] Controlled inputs for name, email, password, confirmPassword, role.
  - [ ] Validate minimum password length and match check before submit.
  - [ ] Display error alerts if registration fails.
  - [ ] Redirect to `/dashboard` upon successful registration.

---

### Issue #21: [Frontend] User Login Page with Quick-Fill Demo Helpers
- **Category**: Frontend / Auth
- **Branch**: `feature/login-page`
- **Labels**: `frontend`, `forms`, `priority-high`
- **Description**: Build `LoginPage.jsx` with email/password inputs, submission state, error alert, and one-click demo credentials fill buttons.
- **Acceptance Criteria**:
  - [ ] Controlled inputs for email and password.
  - [ ] "Fill Admin Account" and "Fill Member Account" buttons for evaluators.
  - [ ] Link to Register page.
  - [ ] Smooth redirect to `/dashboard` on login.

---

### Issue #22: [Frontend] Responsive Navigation Header & Mobile Menu
- **Category**: Frontend / Components
- **Branch**: `feature/navbar-component`
- **Labels**: `frontend`, `ui`, `priority-medium`
- **Description**: Implement responsive `Navbar.jsx` with brand logo, route links, role badge (`ADMIN` / `USER`), and mobile drawer.
- **Acceptance Criteria**:
  - [ ] Highlight active route.
  - [ ] Only show "Team Management" link to Admins.
  - [ ] Mobile hamburger toggle button.
  - [ ] Logout button that clears session and navigates to `/login`.

---

### Issue #23: [Frontend] Task Card Component with Status & Priority Badges
- **Category**: Frontend / Components
- **Branch**: `feature/task-card-component`
- **Labels**: `frontend`, `ui`, `priority-high`
- **Description**: Build `TaskCard.jsx` displaying task title, truncated description, colored priority badge, status badge, assignee, due date, and action buttons.
- **Acceptance Criteria**:
  - [ ] Color-coded status borders (green for completed, blue for progress, amber for pending).
  - [ ] Quick-status selector dropdown for assigned users and admins.
  - [ ] Edit and Delete buttons visible only for Admins.
  - [ ] Link to task detail page.

---

### Issue #24: [Frontend] Controlled Task Filter Bar with Real-time Search
- **Category**: Frontend / Components
- **Branch**: `feature/task-filter-component`
- **Labels**: `frontend`, `components`, `priority-medium`
- **Description**: Create `TaskFilter.jsx` with controlled inputs for searching keywords, status dropdown, priority dropdown, and view toggle.
- **Acceptance Criteria**:
  - [ ] Search input triggering query state update.
  - [ ] Select menus for Status and Priority filters.
  - [ ] "My Tasks" vs "All Tasks" view toggle.
  - [ ] "Reset Filters" button restoring default criteria.

---

### Issue #25: [Frontend] Controlled Task Creation & Edit Modal Form
- **Category**: Frontend / Components
- **Branch**: `feature/task-form-modal`
- **Labels**: `frontend`, `forms`, `priority-high`
- **Description**: Implement `TaskFormModal.jsx` to create new tasks or edit existing tasks with controlled inputs and assignee dropdown.
- **Acceptance Criteria**:
  - [ ] Controlled form for title, description, status, priority, dueDate, assignedTo.
  - [ ] Populate assignee options dynamically from `userService.getUsers()`.
  - [ ] Validate required title field.
  - [ ] Smooth open/close transitions with backdrop click handler.

---

### Issue #26: [Frontend] Single Task Detail Page (`/tasks/:id`)
- **Category**: Frontend / Pages
- **Branch**: `feature/task-detail-page`
- **Labels**: `frontend`, `pages`, `priority-medium`
- **Description**: Build `TaskDetailPage.jsx` displaying complete metadata, creator, assignee, created date, and direct status buttons.
- **Acceptance Criteria**:
  - [ ] Fetch task by ID using `useParams()`.
  - [ ] Display full description and timestamps.
  - [ ] Status toggle buttons for assignees and admins.
  - [ ] Admin actions for task edit modal and task deletion.

---

### Issue #27: [Frontend] Analytics Dashboard with Summary Metric Cards
- **Category**: Frontend / Pages
- **Branch**: `feature/dashboard-page`
- **Labels**: `frontend`, `analytics`, `priority-high`
- **Description**: Build `Dashboard.jsx` featuring `StatsCard` widgets, welcome banner with role identifier, and grid of recent tasks.
- **Acceptance Criteria**:
  - [ ] Display metrics for Total, In Progress, Completed, and Urgent tasks.
  - [ ] Show preview of latest 6 tasks with full card interactions.
  - [ ] Admin "+ Create New Task" quick button.
  - [ ] Loading spinner during data fetching.

---

### Issue #28: [Frontend] Admin Team Role Management Console (`/admin/users`)
- **Category**: Frontend / Admin
- **Branch**: `feature/admin-users-page`
- **Labels**: `frontend`, `admin`, `priority-medium`
- **Description**: Create `AdminUsersPage.jsx` displaying a table of all registered team members and allowing admins to toggle user roles.
- **Acceptance Criteria**:
  - [ ] Responsive table showing name, email, join date, current role.
  - [ ] Role select menu allowing instant promotion/demotion between `user` and `admin`.
  - [ ] Prevent self-demotion to avoid losing admin access.
  - [ ] Success and error feedback banners.

---

### Issue #29: [Frontend] Custom CSS Design System & Responsive Layout
- **Category**: Frontend / Styling
- **Branch**: `feature/css-design-system`
- **Labels**: `frontend`, `ui`, `styling`, `priority-medium`
- **Description**: Establish modern CSS tokens, typography, grid layouts, badge color schemes, and mobile responsive media queries in `index.css`.
- **Acceptance Criteria**:
  - [ ] Integrate Google Fonts ('Plus Jakarta Sans').
  - [ ] Implement consistent CSS variables for colors, borders, and shadows.
  - [ ] Responsive grid for dashboard metrics and task cards.
  - [ ] Mobile responsive navigation styles.

---

### Issue #30: [QA] 404 Fallback Page & Global Error Notifications
- **Category**: Frontend / UX
- **Branch**: `feature/error-404-fallback`
- **Labels**: `frontend`, `ux`, `priority-low`
- **Description**: Implement `NotFoundPage.jsx` for undefined client routes and ensure consistent error alerts across all forms.
- **Acceptance Criteria**:
  - [ ] Clean 404 illustration/message with navigation back to `/dashboard`.
  - [ ] Uniform error alert boxes across Auth and Task forms.
  - [ ] Graceful fallback for empty task filter queries.

---

### Issue #31: [DevOps] Vercel Frontend Deployment & Client Routing Config
- **Category**: DevOps / Deployment
- **Branch**: `feature/vercel-deployment`
- **Labels**: `devops`, `deployment`, `priority-high`
- **Description**: Prepare the frontend for Vercel deployment, configure build settings, SPA fallback routing (`vercel.json`), and document deployment steps.
- **Acceptance Criteria**:
  - [ ] Add `vercel.json` rewrites for React Router single-page navigation.
  - [ ] Configure `VITE_API_URL` environment variable on Vercel.
  - [ ] Verify production build passes with `npm run build`.

---

### Issue #32: [DevOps] Backend Cloud Deployment & Production Environment Configuration
- **Category**: DevOps / Deployment
- **Branch**: `feature/backend-cloud-deployment`
- **Labels**: `devops`, `deployment`, `priority-high`
- **Description**: Configure backend for deployment on Render, Railway, or Cyclic with MongoDB Atlas cloud connectivity.
- **Acceptance Criteria**:
  - [ ] Configure production start script (`npm start`).
  - [ ] Set `PORT`, `MONGO_URI`, and `JWT_SECRET` in cloud provider settings.
  - [ ] Verify CORS allows requests from the deployed Vercel domain.
  - [ ] Confirm `/api/health` returns healthy status in production.
