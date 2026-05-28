# INDPRO Task Manager

A simple, complete, and responsive MERN task manager built for the INDPRO intern assignment. The app lets users create an account, sign in securely, and manage tasks across the required three workflow stages: **Todo**, **In Progress**, and **Done**.

The goal of this project is not to over-engineer the assignment, but to deliver a clean full-stack implementation with authentication, database persistence, good UI states, and a straightforward code structure.

## Features

- User registration and login
- JWT authentication with HTTP-only cookies
- Protected task dashboard
- Create, update, and delete tasks
- Task stages: `Todo`, `In Progress`, `Done`
- Task priority: `Low`, `Medium`, `High`
- Optional due dates
- Responsive three-column task board
- Loading states
- Error and success notifications using `react-hot-toast`
- Backend validation using `express-validator`
- MongoDB persistence using Mongoose
- Clean API response and error utilities
- Healthcheck endpoint

## Tech Stack

**Frontend**

- React
- Vite
- Tailwind CSS
- React Hot Toast
- Fetch API

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- Bcrypt
- Express Validator
- Dotenv
- CORS

## Project Structure

```txt
INDPRO/
  backend/
    src/
      controllers/
      db/
      middlewares/
      models/
      routes/
      utils/
      validators/
      app.js
      index.js
    .env.example
    package.json

  frontend/
    src/
      App.jsx
      App.css
      index.css
      main.jsx
    package.json
    vite.config.js
```

## Getting Started

Clone the repository:

```bash
git clone <your-repo-url>
cd INDPRO
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

You can use `backend/.env.example` as a reference:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

For local MongoDB, `MONGO_URI` can look like this:

```env
MONGO_URI=mongodb://127.0.0.1:27017/indpro-task-manager
```

For MongoDB Atlas, paste your Atlas connection string in `MONGO_URI`.

Optional frontend environment variable:

Create `frontend/.env` only if your backend is not running on the default URL.

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

If this variable is not provided, the frontend uses:

```txt
http://localhost:3000/api/v1
```

## Running the App

Start the backend:

```bash
cd backend
npm run dev
```

The backend runs on:

```txt
http://localhost:3000
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## API Overview

Auth routes:

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/current-user
POST /api/v1/auth/refresh-token
POST /api/v1/auth/change-password
```

Task routes:

```txt
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/stats
GET    /api/v1/tasks/:taskId
PATCH  /api/v1/tasks/:taskId
DELETE /api/v1/tasks/:taskId
```

Healthcheck:

```txt
GET /api/v1/healthcheck
```

## Task Model

Each task contains:

- `title`
- `description`
- `stage`: `todo`, `in-progress`, `done`
- `priority`: `low`, `medium`, `high`
- `dueDate`
- `owner`

## Assumptions and Decisions

- Backend was implemented because AI-assisted tooling was used, and the assignment states that backend becomes mandatory in that case.
- Authentication uses JWT stored in HTTP-only cookies for better browser security than plain localStorage token handling.
- The app uses a simple personal task model where each user owns their own tasks.
- The assignment requires three task stages, so the backend uses `stage` with `todo`, `in-progress`, and `done`.
- The UI is intentionally simple and focused on task management instead of adding unnecessary features.
- No drag-and-drop was added because the assignment values a small, complete implementation over a large incomplete one.
- The frontend uses plain React state for forms, not React Hook Form, to keep the implementation easy to understand.

## Build Commands

Frontend production build:

```bash
cd frontend
npm run build
```

Frontend lint:

```bash
cd frontend
npm run lint
```

Backend start:

```bash
cd backend
npm start
```

## Deployment Notes

Frontend can be deployed on platforms like Vercel, Netlify, or Render static hosting.

Backend can be deployed on platforms like Render, Railway, or any Node.js hosting provider.

When deploying:

- Set all backend environment variables on the hosting platform.
- Set `CORS_ORIGIN` to the deployed frontend URL.
- Set `VITE_API_BASE_URL` in the frontend deployment to the deployed backend API URL.
- Use a production MongoDB Atlas URI for `MONGO_URI`.

## Author

**Abhijeet Singh Rajput**  
IIT Dhanbad

Open to collaboration and internship opportunities.
