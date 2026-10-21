# ClientFlow

ClientFlow is a full-stack client and project management application designed to help freelancers and small businesses manage clients, projects, tasks, and work progress in one place.

The application is being built as an AI-augmented full-stack project, with AI features planned to assist with project planning, task generation, progress summaries, and client communication.

## Features

### Completed

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* User account management
* Client management
* Project management
* Task management
* Resource ownership and authorization
* Input validation
* API error handling
* PostgreSQL database
* REST API

### In Progress

* React frontend
* Dashboard interface
* Client, project, and task user interface

### Planned

* AI-powered project and task assistance
* AI-generated task suggestions
* Project progress summaries
* AI-assisted client update drafts
* Application deployment
* Automated testing

## Tech Stack

### Frontend

* React
* Vite

### Backend

* Node.js
* Express
* Prisma
* PostgreSQL
* JWT
* bcrypt

### Development

* Git
* GitHub

## Project Structure

```text
clientflow/

├── backend/
├── frontend/
├── README.md
├── package.json
└── package-lock.json
```

## Installation

Clone the repository and install the required dependencies for the frontend and backend.

Environment variables are required for the backend, including database connection and JWT configuration.

## Running the Application

Start the backend server and frontend development server separately.

The backend provides the REST API used by the frontend.

## API

The backend provides protected REST API endpoints for:

* Authentication
* User accounts
* Clients
* Projects
* Tasks

Authentication is handled using JWT tokens, and resources are protected using user ownership checks.

## Testing

API functionality has been manually tested during backend development, including:

* Authentication
* Protected routes
* CRUD operations
* Input validation
* Invalid IDs
* Resource ownership
* Error responses
* Token expiration

Automated tests will be added as the project develops.

## Environment Variables

The application uses environment variables for configuration and sensitive information such as database connection details and JWT secrets.

Do not commit `.env` files or secrets to Git.

## Project Status

The backend development phase is complete.

Current development is focused on building the React frontend and connecting it to the REST API.

## Future Plans

* Complete the React frontend
* Build the dashboard
* Connect frontend components to the REST API
* Add AI-powered project and task assistance
* Add AI-generated progress summaries
* Add AI-assisted client communication
* Add automated testing
* Improve security and application reliability
* Deploy the application
