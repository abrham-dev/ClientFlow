# ClientFlow

**A full-stack client, project, and task management application.**

ClientFlow is a web application designed to help users organize their clients, manage projects, track tasks, and monitor their work through a centralized dashboard.

The application uses a Next.js frontend with TypeScript, an Express.js REST API with TypeScript, and PostgreSQL for data storage through Prisma ORM.


## Features

### Authentication and Security
- User registration and login.
- Password hashing with bcryptjs.
- JWT-based authentication.
- Protected frontend routes.
- Backend authentication middleware.
- User-specific data access and authorization checks.
- Automatic logout after 10 minutes of inactivity.
- Environment variables for sensitive configuration.

### Dashboard
- Centralized dashboard for navigating the application.
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
- Update supported profile information, including username and password.

### Data Relationships

ClientFlow uses a hierarchical data structure:

```text
User
 └── Clients
      └── Projects
           └── Tasks
```

Each client belongs to a user, each project belongs to a client, and each task belongs to a project.

The backend checks ownership relationships to prevent users from accessing or modifying resources belonging to other users.

Database relationships support cascading deletion. Deleting a client also deletes its dependent projects and tasks. Deleting a project also deletes its dependent tasks.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Fetch API for backend communication

### Backend
- Node.js
- Express.js
- TypeScript
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
       Next.js + React Frontend
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

The frontend communicates with the backend through HTTP requests. The backend handles authentication, request validation, resource ownership checks, and business logic before accessing the database through Prisma.

The frontend and backend are separate applications and can be developed and deployed independently.

## Project Structure

The repository contains two separate applications: a Next.js frontend and an Express backend.


ClientFlow/
├── frontend-next/             # Next.js + TypeScript frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend-ts/                # Express + TypeScript backend
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── server.ts
│   ├── prisma7.config.ts
│   └── package.json
│
├── .gitignore
└── README.md

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

- Node.js
- npm
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

Navigate to the current backend directory:

```bash
cd backend-ts
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside `backend-ts/`.

Configure the required environment variables:

```env
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
FRONTEND_URL="http://localhost:3000"
PORT=5000
```

Replace the example values with your actual configuration.

- `DATABASE_URL` connects the backend to PostgreSQL.
- `JWT_SECRET` signs authentication tokens.
- `FRONTEND_URL` specifies the allowed frontend origin for CORS.
- `PORT` specifies the backend port. The default is `5000`.

Never commit your actual `.env` file or expose database credentials and authentication secrets publicly.

### 3. Configure the Database

Make sure PostgreSQL is running and the configured database exists.

Generate the Prisma Client:

```bash
npx prisma generate --config prisma7.config.ts
```

Apply existing migrations:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```

Run these commands from the `backend-ts/` directory.

### 4. Start the Backend

From the `backend-ts/` directory, run:

```bash
npm run dev
```

The backend development server runs on:

```text
http://localhost:5000
```

The backend can also be built and started using:

```bash
npm run build
npm start
```

### 5. Configure the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend-next
```

Install the dependencies:

```bash
npm install
```

Create a `.env.local` file inside `frontend-next/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

This variable specifies the backend API base URL used by the Next.js frontend.

Variables prefixed with `NEXT_PUBLIC_` are exposed to browser-side code. Never put passwords, database credentials, JWT secrets, or private API keys in these variables.

### 6. Start the Frontend

From the `frontend-next/` directory, run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
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
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |

Use appropriate environment values for each environment.

For production, configure the deployed frontend origin in the backend's CORS settings and set `NEXT_PUBLIC_API_URL` to the deployed backend URL before building the frontend.

## Security Considerations

ClientFlow includes several security mechanisms:

- Password hashing instead of storing plaintext passwords.
- JWT-based authentication.
- Protected application routes.
- Backend authentication middleware.
- Ownership checks for user-related resources.
- Environment-based configuration.
- CORS configuration for frontend communication.
- Backend validation of incoming requests.

Frontend route protection is not a substitute for backend authorization. The backend must independently verify authentication and ownership for protected operations.

Production deployment should use secure environment variables, appropriate database access controls, and production-ready server configuration.

## Current Project Status

The current TypeScript application has been migrated and tested locally.

The tested functionality includes:

- Next.js frontend.
- Express REST API with TypeScript.
- PostgreSQL database integration through Prisma.
- User registration and login.
- JWT authentication.
- Protected application routes.
- Client, project, and task management.
- User profile and password updates.
- Automatic logout after inactivity.
- Cascade deletion of dependent records.
- Frontend and backend integration.

The frontend and backend production builds have also been checked locally.

The application is currently being prepared for production configuration and deployment.

## Future Improvements

Potential improvements include:

- Automated backend and frontend tests.
- Improved dashboard metrics and reporting.
- Better accessibility and responsive design.
- Production deployment.
- CI/CD automation.
- Improved application documentation.

## Author

**Abrham**

GitHub: https://github.com/abrham-dev

## License

No open-source license has been specified yet. Unless a license is added to the repository, the project should not be assumed to be available for unrestricted reuse.