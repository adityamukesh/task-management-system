#!/usr/bin/env node

const { execFileSync } = require('child_process');

const issues = [
  {
    num: 1,
    title: "[Setup] Repository Scaffolding & Monorepo Directory Structure",
    body: `### Overview
Establish the root directory structure containing isolated frontend/ and backend/ sub-projects, along with .gitignore rules to prevent node_modules and credentials from leaking.

### Recommended Branch
feature/repo-scaffolding

### Acceptance Criteria
- [ ] Initialize frontend/ with Vite and backend/ with Express.
- [ ] Add root and subdirectory .gitignore files preventing .env and node_modules commits.
- [ ] Provide .env.example templates in both folders.`
  },
  {
    num: 2,
    title: "[Backend] MongoDB Atlas Connection & Mongoose Client Setup",
    body: `### Overview
Implement a robust MongoDB connection module using Mongoose in backend/src/config/db.js.

### Recommended Branch
feature/mongodb-connection

### Acceptance Criteria
- [ ] Connect using process.env.MONGO_URI.
- [ ] Log host upon connection success.
- [ ] Catch errors and cleanly exit process (process.exit(1)).`
  },
  {
    num: 3,
    title: "[Backend] Express Server Bootstrap with CORS and JSON Parsing",
    body: `### Overview
Set up server.js with express initialization, JSON body parsing, CORS middleware for frontend communication, and a /api/health sanity route.

### Recommended Branch
feature/express-server-init

### Acceptance Criteria
- [ ] Configure cors middleware with proper origin handling.
- [ ] Configure express.json() parser.
- [ ] Return { status: 'healthy', timestamp: ... } on GET /api/health.`
  },
  {
    num: 4,
    title: "[Backend] Centralized Error Handling & 404 Middleware",
    body: `### Overview
Build centralized error handling middleware to catch Mongoose CastError, duplicate key (11000) errors, and validation errors.

### Recommended Branch
feature/error-handling-middleware

### Acceptance Criteria
- [ ] Create errorHandler returning appropriate status codes (400, 404, 500).
- [ ] Hide error stack traces in production environment.
- [ ] Create notFound middleware for undefined endpoints.`
  },
  {
    num: 5,
    title: "[Backend] User Model with Password Hashing via bcrypt",
    body: `### Overview
Create Mongoose schema for User with fields: name, email (unique), password (minlength 6), role ('user' or 'admin'), and timestamps.

### Recommended Branch
feature/user-model

### Acceptance Criteria
- [ ] Add Mongoose pre-save hook to hash password using bcryptjs.
- [ ] Add matchPassword method to schema for comparing candidate passwords.
- [ ] Sanitize email to lowercase and trimmed strings.`
  },
  {
    num: 6,
    title: "[Backend] User Registration REST API (POST /api/auth/register)",
    body: `### Overview
Implement registration endpoint that validates payload, ensures email uniqueness, creates user record, and issues a JWT token.

### Recommended Branch
feature/auth-register-api

### Acceptance Criteria
- [ ] Validate presence of name, email, and password.
- [ ] Verify if email already exists (return 400 with descriptive error).
- [ ] Generate signed JWT token with 30-day expiration.
- [ ] Return _id, name, email, role, and token.`
  },
  {
    num: 7,
    title: "[Backend] User Login REST API (POST /api/auth/login)",
    body: `### Overview
Implement authentication endpoint verifying email and password match, returning user profile and token.

### Recommended Branch
feature/auth-login-api

### Acceptance Criteria
- [ ] Check email exists and call user.matchPassword(password).
- [ ] Return 401 for invalid credentials.
- [ ] Return user object with JWT token on success.`
  },
  {
    num: 8,
    title: "[Backend] Role-Based Authentication Middleware (authenticateUser & requireAdmin)",
    body: `### Overview
Build middleware functions in backend/src/middleware/auth.js to protect routes and verify admin privileges.

### Recommended Branch
feature/auth-middleware

### Acceptance Criteria
- [ ] Extract and verify Bearer token from Authorization header.
- [ ] Attach user instance (without password) to req.user.
- [ ] requireAdmin returns 403 Forbidden if req.user.role !== 'admin'.`
  },
  {
    num: 9,
    title: "[Backend] Task Mongoose Model Design",
    body: `### Overview
Create Task schema in backend/src/models/Task.js with fields: title, description, status, priority, dueDate, assignedTo, createdBy, and timestamps.

### Recommended Branch
feature/task-model

### Acceptance Criteria
- [ ] Enum for status: ['pending', 'in_progress', 'completed'].
- [ ] Enum for priority: ['low', 'medium', 'high', 'urgent'].
- [ ] Reference assignedTo and createdBy to User model.`
  },
  {
    num: 10,
    title: "[Backend] Task Creation Endpoint (POST /api/tasks)",
    body: `### Overview
Build admin-restricted endpoint to create new tasks and optionally assign to team members.

### Recommended Branch
feature/task-create-api

### Acceptance Criteria
- [ ] Protect with authenticateUser and requireAdmin.
- [ ] Validate required title.
- [ ] Set createdBy to req.user._id.
- [ ] Return populated assignedTo and createdBy fields with 201 Created.`
  },
  {
    num: 11,
    title: "[Backend] Task Querying with Search & Filters (GET /api/tasks)",
    body: `### Overview
Implement endpoint to retrieve tasks with filtering by status, priority, search substring, and personal view.

### Recommended Branch
feature/task-read-api

### Acceptance Criteria
- [ ] Support ?status=... and ?priority=... query parameters.
- [ ] Implement regex search for title and description.
- [ ] Support ?view=my-tasks for standard users to fetch assigned/created tasks.
- [ ] Sort by createdAt descending.`
  },
  {
    num: 12,
    title: "[Backend] Task Update Endpoint (PUT /api/tasks/:id)",
    body: `### Overview
Implement endpoint allowing Admins to edit all task details, while standard users can update the status of tasks assigned to them.

### Recommended Branch
feature/task-update-api

### Acceptance Criteria
- [ ] Allow Admin to update title, description, status, priority, dueDate, assignedTo.
- [ ] Allow assigned standard user to update status.
- [ ] Reject unauthorized modifications with 403 status code.`
  },
  {
    num: 13,
    title: "[Backend] Task Deletion Endpoint (DELETE /api/tasks/:id)",
    body: `### Overview
Implement Admin-only route to delete tasks by ID.

### Recommended Branch
feature/task-delete-api

### Acceptance Criteria
- [ ] Enforce requireAdmin middleware.
- [ ] Return 404 if task not found.
- [ ] Delete document from MongoDB and return confirmation message and id.`
  },
  {
    num: 14,
    title: "[Backend] Task Statistics Summary Endpoint (GET /api/tasks/stats/summary)",
    body: `### Overview
Add aggregate endpoint returning counts for total tasks, pending, in-progress, completed, and urgent tasks for dashboard widgets.

### Recommended Branch
feature/task-stats-api

### Acceptance Criteria
- [ ] Count tasks by status using Mongoose countDocuments.
- [ ] Return JSON { total, pending, inProgress, completed, urgent }.
- [ ] Ensure fast query execution.`
  },
  {
    num: 15,
    title: "[Backend] Team Member Directory Endpoints (/api/users)",
    body: `### Overview
Provide endpoints for listing users (for task assignments) and updating user roles (Admin console).

### Recommended Branch
feature/users-directory-api

### Acceptance Criteria
- [ ] GET /api/users: Return user list excluding passwords.
- [ ] PUT /api/users/:id/role: Admin-only endpoint to toggle roles between 'admin' and 'user'.`
  },
  {
    num: 16,
    title: "[Backend] Database Seeder Script for Sample Data",
    body: `### Overview
Create backend/src/utils/seed.js script to populate Admin account, sample members, and realistic demo tasks.

### Recommended Branch
feature/db-seeder-script

### Acceptance Criteria
- [ ] Clean previous collections before inserting.
- [ ] Create admin@taskflow.com and user@taskflow.com accounts.
- [ ] Insert at least 5 sample tasks with diverse statuses and priorities.
- [ ] Provide npm run seed script in package.json.`
  },
  {
    num: 17,
    title: "[Frontend] Axios API Client with JWT Request Interceptor",
    body: `### Overview
Build centralized Axios instance in frontend/src/services/api.js that automatically attaches JWT tokens from localStorage.

### Recommended Branch
feature/axios-client

### Acceptance Criteria
- [ ] Configure baseURL using import.meta.env.VITE_API_URL.
- [ ] Request interceptor adding Authorization: Bearer <token>.
- [ ] Response interceptor catching 401 responses and clearing expired tokens.`
  },
  {
    num: 18,
    title: "[Frontend] Authentication Context & State Management",
    body: `### Overview
Create AuthContext and custom useAuth hook managing user profile, token persistence, login, register, and logout.

### Recommended Branch
feature/auth-context

### Acceptance Criteria
- [ ] Check and validate token on application mount.
- [ ] Provide user, loading, login, register, logout, and isAdmin flags.
- [ ] Gracefully handle expired sessions.`
  },
  {
    num: 19,
    title: "[Frontend] Client-Side Routing & Route Guards (<ProtectedRoute> & <AdminRoute>)",
    body: `### Overview
Set up React Router DOM routes with guard components to restrict authenticated pages and admin sections.

### Recommended Branch
feature/route-guards

### Acceptance Criteria
- [ ] <ProtectedRoute> redirects unauthenticated visitors to /login.
- [ ] <AdminRoute> redirects non-admins to /dashboard.
- [ ] Support loading state while verifying auth session.`
  },
  {
    num: 20,
    title: "[Frontend] User Registration Page with Controlled Form",
    body: `### Overview
Develop controlled registration form in RegisterPage.jsx with input validations and role selection.

### Recommended Branch
feature/register-page

### Acceptance Criteria
- [ ] Controlled inputs for name, email, password, confirmPassword, role.
- [ ] Validate minimum password length and match check before submit.
- [ ] Display error alerts if registration fails.
- [ ] Redirect to /dashboard upon successful registration.`
  },
  {
    num: 21,
    title: "[Frontend] User Login Page with Quick-Fill Demo Helpers",
    body: `### Overview
Build LoginPage.jsx with email/password inputs, submission state, error alert, and one-click demo credentials fill buttons.

### Recommended Branch
feature/login-page

### Acceptance Criteria
- [ ] Controlled inputs for email and password.
- [ ] Fill Admin Account and Fill Member Account buttons for evaluators.
- [ ] Link to Register page.
- [ ] Smooth redirect to /dashboard on login.`
  },
  {
    num: 22,
    title: "[Frontend] Responsive Navigation Header & Mobile Menu",
    body: `### Overview
Implement responsive Navbar.jsx with brand logo, route links, role badge (ADMIN / USER), and mobile drawer.

### Recommended Branch
feature/navbar-component

### Acceptance Criteria
- [ ] Highlight active route.
- [ ] Only show Team Management link to Admins.
- [ ] Mobile hamburger toggle button.
- [ ] Logout button that clears session and navigates to /login.`
  },
  {
    num: 23,
    title: "[Frontend] Task Card Component with Status & Priority Badges",
    body: `### Overview
Build TaskCard.jsx displaying task title, truncated description, colored priority badge, status badge, assignee, due date, and action buttons.

### Recommended Branch
feature/task-card-component

### Acceptance Criteria
- [ ] Color-coded status borders (green for completed, blue for progress, amber for pending).
- [ ] Quick-status selector dropdown for assigned users and admins.
- [ ] Edit and Delete buttons visible only for Admins.
- [ ] Link to task detail page.`
  },
  {
    num: 24,
    title: "[Frontend] Controlled Task Filter Bar with Real-time Search",
    body: `### Overview
Create TaskFilter.jsx with controlled inputs for searching keywords, status dropdown, priority dropdown, and view toggle.

### Recommended Branch
feature/task-filter-component

### Acceptance Criteria
- [ ] Search input triggering query state update.
- [ ] Select menus for Status and Priority filters.
- [ ] My Tasks vs All Tasks view toggle.
- [ ] Reset Filters button restoring default criteria.`
  },
  {
    num: 25,
    title: "[Frontend] Controlled Task Creation & Edit Modal Form",
    body: `### Overview
Implement TaskFormModal.jsx to create new tasks or edit existing tasks with controlled inputs and assignee dropdown.

### Recommended Branch
feature/task-form-modal

### Acceptance Criteria
- [ ] Controlled form for title, description, status, priority, dueDate, assignedTo.
- [ ] Populate assignee options dynamically from userService.getUsers().
- [ ] Validate required title field.
- [ ] Smooth open/close transitions with backdrop click handler.`
  },
  {
    num: 26,
    title: "[Frontend] Single Task Detail Page (/tasks/:id)",
    body: `### Overview
Build TaskDetailPage.jsx displaying complete metadata, creator, assignee, created date, and direct status buttons.

### Recommended Branch
feature/task-detail-page

### Acceptance Criteria
- [ ] Fetch task by ID using useParams().
- [ ] Display full description and timestamps.
- [ ] Status toggle buttons for assignees and admins.
- [ ] Admin actions for task edit modal and task deletion.`
  },
  {
    num: 27,
    title: "[Frontend] Analytics Dashboard with Summary Metric Cards",
    body: `### Overview
Build Dashboard.jsx featuring StatsCard widgets, welcome banner with role identifier, and grid of recent tasks.

### Recommended Branch
feature/dashboard-page

### Acceptance Criteria
- [ ] Display metrics for Total, In Progress, Completed, and Urgent tasks.
- [ ] Show preview of latest 6 tasks with full card interactions.
- [ ] Admin + Create New Task quick button.
- [ ] Loading spinner during data fetching.`
  },
  {
    num: 28,
    title: "[Frontend] Admin Team Role Management Console (/admin/users)",
    body: `### Overview
Create AdminUsersPage.jsx displaying a table of all registered team members and allowing admins to toggle user roles.

### Recommended Branch
feature/admin-users-page

### Acceptance Criteria
- [ ] Responsive table showing name, email, join date, current role.
- [ ] Role select menu allowing instant promotion/demotion between user and admin.
- [ ] Prevent self-demotion to avoid losing admin access.
- [ ] Success and error feedback banners.`
  },
  {
    num: 29,
    title: "[Frontend] Custom CSS Design System & Responsive Layout",
    body: `### Overview
Establish modern CSS tokens, typography, grid layouts, badge color schemes, and mobile responsive media queries in index.css.

### Recommended Branch
feature/css-design-system

### Acceptance Criteria
- [ ] Integrate Google Fonts ('Plus Jakarta Sans').
- [ ] Implement consistent CSS variables for colors, borders, and shadows.
- [ ] Responsive grid for dashboard metrics and task cards.
- [ ] Mobile responsive navigation styles.`
  },
  {
    num: 30,
    title: "[QA] 404 Fallback Page & Global Error Notifications",
    body: `### Overview
Implement NotFoundPage.jsx for undefined client routes and ensure consistent error alerts across all forms.

### Recommended Branch
feature/error-404-fallback

### Acceptance Criteria
- [ ] Clean 404 illustration/message with navigation back to /dashboard.
- [ ] Uniform error alert boxes across Auth and Task forms.
- [ ] Graceful fallback for empty task filter queries.`
  },
  {
    num: 31,
    title: "[DevOps] Vercel Frontend Deployment & Client Routing Config",
    body: `### Overview
Prepare the frontend for Vercel deployment, configure build settings, SPA fallback routing (vercel.json), and document deployment steps.

### Recommended Branch
feature/vercel-deployment

### Acceptance Criteria
- [ ] Add vercel.json rewrites for React Router single-page navigation.
- [ ] Configure VITE_API_URL environment variable on Vercel.
- [ ] Verify production build passes with npm run build.`
  },
  {
    num: 32,
    title: "[DevOps] Backend Cloud Deployment & Production Environment Configuration",
    body: `### Overview
Configure backend for deployment on Render, Railway, or Cyclic with MongoDB Atlas cloud connectivity.

### Recommended Branch
feature/backend-cloud-deployment

### Acceptance Criteria
- [ ] Configure production start script (npm start).
- [ ] Set PORT, MONGO_URI, and JWT_SECRET in cloud provider settings.
- [ ] Verify CORS allows requests from the deployed Vercel domain.
- [ ] Confirm /api/health returns healthy status in production.`
  }
];

function run() {
  console.log(`Checking existing issues on GitHub...`);
  const existingListRaw = execFileSync('gh', ['issue', 'list', '--limit', '100', '--json', 'title'], {
    encoding: 'utf8',
    env: process.env,
  });
  const existingTitles = new Set(JSON.parse(existingListRaw).map((i) => i.title));
  console.log(`Found ${existingTitles.size} existing issues.`);

  for (const item of issues) {
    if (existingTitles.has(item.title)) {
      console.log(`[-] Skipping already created: ${item.title}`);
      continue;
    }

    console.log(`[+] Creating: ${item.title}`);
    try {
      execFileSync('gh', ['issue', 'create', '--title', item.title, '--body', item.body], {
        stdio: 'inherit',
        env: process.env,
      });
    } catch (err) {
      console.error(`Failed to create ${item.title}:`, err.message);
    }
  }

  console.log('All issues checked and synchronized successfully!');
}

run();
