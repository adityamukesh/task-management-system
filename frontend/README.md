# TaskFlow Frontend Client

Client-side rendered React application built with Vite for collaborative task management.

## Tech Stack
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios with token interceptor
- **State Management**: React `useState`, `useEffect`, `useContext`
- **Styling**: Vanilla CSS with modern custom design system

## Features
- Client-Side Rendering (CSR) with instant page transitions
- JWT Session persistence in localStorage
- Role-based routing (`<ProtectedRoute>` and `<AdminRoute>`)
- Controlled forms with real-time error handling
- Dynamic task search and filtering by status, priority, and assignee
- Quick-fill demo credentials for testing and evaluation

## Environment Variables
Create `.env` in `frontend/` based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Vite development server
npm run dev

# 3. Build for production (Vercel)
npm run build
```
