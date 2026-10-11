# TaskFlow Backend API

RESTful API backend for the Task Management System built with Node.js, Express.js, and MongoDB with Mongoose.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Local MongoDB
- **ORM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **CORS**: cors middleware

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & return JWT
- `GET /api/auth/me` - Get current user profile (Private)

### Tasks (`/api/tasks`)
- `GET /api/tasks` - List tasks with search & filters (Admin & User)
- `GET /api/tasks/stats/summary` - Aggregate metrics for dashboard (Private)
- `GET /api/tasks/:id` - Fetch single task details (Admin & User)
- `POST /api/tasks` - Create new task (Admin only)
- `PUT /api/tasks/:id` - Update task (Admin or assigned user updating status)
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Users (`/api/users`)
- `GET /api/users` - Get list of team members (Private)
- `PUT /api/users/:id/role` - Update user role (Admin only)

## Environment Variables
Create a `.env` file in `backend/` based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task_manager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Seed database (creates admin and sample tasks)
npm run seed

# 3. Start development server
npm run dev

# Or start in production
npm start
```
