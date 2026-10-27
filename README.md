# ClientFlow

**A full-stack client, project, and task management application.**

ClientFlow is a web application designed to help users organize their clients, manage projects, track tasks, and monitor their work through a centralized dashboard.

The application uses a React frontend and a Node.js/Express backend, with PostgreSQL for data storage and Prisma ORM for database access. JWT authentication and ownership-based authorization protect user data.

## Features

### Authentication and Security
- User registration and login.
- Password hashing with bcryptjs.
- JWT-based authentication.
- Protected frontend routes.
- Backend authentication middleware.
- User-specific data access and authorization checks.
- Environment variables for sensitive configuration.

### Dashboard
- Centralized dashboard for navigating the application.
- Overview of the application's main sections.
- Access to client, project, task, and profile pages.

### Client Management
- Create clients.
- View client information.
- Update client details.
- Delete clients.

### Project Management
- Create projects associated with clients.
- View project information.
- Update project details and status.
- Delete projects.

### Task Management
- Create tasks associated with projects.
- View task information.
- Update task details and status.
- Delete tasks.

### User Profile
- View the authenticated user's profile.
- Update supported profile information.

### Data Relationships
ClientFlow uses a hierarchical data structure:

```text
User
 └── Clients
      └── Projects
           └── Tasks
```

Each client belongs to a user, each project belongs to a client, and each task belongs to a project.

The backend checks these ownership relationships to prevent users from accessing or modifying resources belonging to other users.

Database relationships also support cascading deletion, so deleting a parent record can delete its dependent records according to the configured database relationships.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript (ES modules)
- React Router
- Tailwind CSS
- Fetch API for backend communication

### Backend
- Node.js
- Express.js
- JavaScript (ES modules)
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS

### Development Tools
- Visual Studio Code
- Git
- GitHub
- npm

## Application Architecture

ClientFlow separates the frontend, backend, and database into distinct layers.

```text
                 User
                  |
                  v
        React + Vite Frontend
                  |
                  | HTTP requests
                  | JSON responses
                  v
          Express REST API
                  |
                  v
       Authentication Middleware
                  |
                  v
          Route Handlers
                  |
                  v
       Controllers and Business Logic
                  |
                  v
           Prisma ORM
                  |
                  v
             PostgreSQL
```

The frontend communicates with the backend through HTTP requests. The backend validates requests, authenticates users, checks resource ownership, and accesses the database through Prisma.

The frontend and backend can be developed and deployed separately.

## Project Structure

The repository is organized into two main applications.

```text
ClientFlow/
├── backend/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── routes/
│   ├── server.js
│   ├── prisma7.config.ts
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

This is a logical overview of the project structure. Individual filenames and folders may change as development continues.

## API Overview

The backend exposes REST API endpoints for authentication, user profiles, clients, projects, tasks, and health checks.

| Resource | Endpoint | Purpose |
|---|---|---|
| Health | `GET /api/health` | Check backend availability |
| Authentication | `POST /api/auth/register` | Register a user |
| Authentication | `POST /api/auth/login` | Authenticate a user |
| Users | `GET /api/users/me` | Retrieve the authenticated user's profile |
| Users | `PUT /api/users/me` | Update supported profile information |
| Clients | `/api/clients` | Manage client records |
| Projects | `/api/projects` | Manage project records |
| Tasks | `/api/tasks` | Manage task records |

The client, project, and task endpoints support CRUD operations according to their implemented routes.

Protected endpoints require authentication. Requests to protected resources must include a valid JWT in the authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is obtained through the login endpoint.

## Getting Started

### Prerequisites

Install the following software before running ClientFlow:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/abrham-dev/ClientFlow.git
```

Navigate into the project:

```bash
cd ClientFlow
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install its dependencies:

```bash
npm install
```

Create a `.env` file in the `backend/` directory.

Configure the required environment variables:

```env
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
FRONTEND_URL="http://localhost:5173"
```

Replace the example values with your actual configuration.

- `DATABASE_URL` connects the backend to PostgreSQL.
- `JWT_SECRET` signs authentication tokens.
- `FRONTEND_URL` specifies the allowed frontend origin for CORS.

Never commit your actual `.env` file or expose database credentials and authentication secrets publicly.

### 3. Configure the Database

Make sure PostgreSQL is running and the configured database exists.

Apply existing production migrations using Prisma's migration deployment command, from the backend directory:

```bash
npx prisma migrate deploy
```

If your project uses a custom Prisma configuration filename, supply the appropriate configuration option supported by your installed Prisma CLI.

Do not run development migrations against a production database without understanding their effects.

### 4. Start the Backend

From the `backend/` directory, start the server:

```bash
node server.js
```

This assumes the backend dependencies are installed and the environment variables and database are configured correctly.

The default backend port is `5000`, unless overridden by the `PORT` environment variable.

### 5. Configure the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd ~/fullstack/clientflow/frontend
```

Install the frontend dependencies:

```bash
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

This variable specifies the backend API base URL used by the Vite frontend.

Vite exposes variables prefixed with `VITE_` to frontend code. Never put passwords, database credentials, or private API secrets in these variables.

### 6. Start the Frontend

From the `frontend/` directory:

```bash
npm run dev
```

Open the local address displayed by Vite, normally:

```text
http://localhost:5173
```

The backend and frontend must both be running for the application to work correctly.

## Environment Configuration

ClientFlow uses environment variables to separate configuration from application code.

| Variable | Application | Purpose |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection |
| `JWT_SECRET` | Backend | JWT signing secret |
| `FRONTEND_URL` | Backend | Allowed frontend origin |
| `PORT` | Backend | Optional server port |
| `VITE_API_URL` | Frontend | Backend API base URL |

Use appropriate environment values for each environment.

For production, configure the actual deployed frontend origin in the backend's CORS settings and set `VITE_API_URL` to the deployed backend URL before building the frontend.

## Security Considerations

ClientFlow includes several important security mechanisms:

- Password hashing instead of storing plaintext passwords.
- JWT-based authentication.
- Protected application routes.
- Backend authorization checks.
- Ownership checks for user-related resources.
- Environment-based configuration.
- CORS configuration for frontend communication.

Frontend route protection is not a substitute for backend authorization. The backend must independently verify authentication and ownership for protected operations.

Before production deployment, review input validation, error handling, authentication token storage, rate limiting, logging, database access, and production environment configuration.

## Current Project Status

ClientFlow has progressed beyond its initial interface and backend setup.

The current application includes:

- A React-based frontend.
- An Express REST API.
- PostgreSQL database integration through Prisma.
- User registration and login.
- JWT authentication.
- Protected application pages.
- Client, project, and task management.
- User profile functionality.
- User-specific resource authorization.
- Database migrations.

The project is currently being prepared for further review, cleanup, and deployment.

The existing frontend uses React, Vite, and JavaScript. A possible future migration to Next.js and TypeScript is a separate development step and is not part of the current stack described above.

## Future Improvements

Potential improvements include:

- Automated backend and frontend tests.
- Stronger request validation and consistent error responses.
- Improved dashboard metrics and reporting.
- Better accessibility and responsive design.
- Production deployment and environment configuration.
- CI/CD automation.
- Improved application documentation.

## Author

**Abrham**

GitHub: https://github.com/abrham-dev

## License

No open-source license has been specified yet. Unless a license is added to the repository, the project should not be assumed to be available for unrestricted reuse.