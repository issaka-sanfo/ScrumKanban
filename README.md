# ScrumKanban Board

A full-stack Agile Scrum/Kanban board application for managing projects, sprints, and tasks. Built with **Spring Boot 3.2**, **Angular 17**, **PostgreSQL 16**, and **Docker**.

## Tech Stack

| Layer        | Technology                                      |
|--------------|------------------------------------------------|
| Frontend     | Angular 17.3, TypeScript 5.4, SCSS, Angular CDK |
| Backend      | Java 21, Spring Boot 3.2.3, Spring Security, Spring Data JPA |
| Database     | PostgreSQL 16                                   |
| Auth         | JWT (jjwt 0.12.5), BCrypt                       |
| ORM          | Hibernate, Flyway migrations                    |
| Mapping      | MapStruct 1.5.5                                 |
| API Docs     | SpringDoc OpenAPI 2.3.0 (Swagger UI)            |
| Deployment   | Docker, Docker Compose, Nginx                   |

## Features

- **User Authentication** — Register, login, JWT-based sessions (24h expiry), role-based access (ADMIN, SCRUM_MASTER, DEVELOPER)
- **Project Management** — Create projects, manage members, track progress
- **Sprint Management** — Plan, activate, and complete sprints with goal tracking
- **Kanban Board** — Drag-and-drop task cards across 6 status columns (Backlog, To Do, In Progress, Code Review, Testing, Done)
- **Task Management** — Create/edit tasks with priority levels, story points, labels, and multi-user assignment via searchable dropdown
- **Comments** — Threaded discussions on tasks
- **Dashboard** — Project statistics and sprint metrics
- **Labels** — Categorize tasks (Bug, Feature, Enhancement, Documentation, Technical Debt)

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Run with Docker Compose

```bash
git clone https://github.com/issaka-sanfo/ScrumKanban.git
cd ScrumKanban
docker-compose up --build
```

The app will be available at:

| Service    | URL                              |
|------------|----------------------------------|
| Frontend   | http://localhost                  |
| Backend API| http://localhost:8080/api         |
| Swagger UI | http://localhost:8080/api/swagger-ui.html |
| PostgreSQL | localhost:5432                    |

### Default Users (Seed Data)

| Email                    | Password      | Role          |
|--------------------------|---------------|---------------|
| admin@scrumkanban.com    | password123   | ADMIN         |
| sm@scrumkanban.com       | password123   | SCRUM_MASTER  |
| dev1@scrumkanban.com     | password123   | DEVELOPER     |
| dev2@scrumkanban.com     | password123   | DEVELOPER     |

A sample project ("E-Commerce Platform") with a sprint and 10 tasks is pre-loaded.

## Local Development

### Backend

```bash
cd backend
# Requires Java 21 and Maven 3.9+
# Start PostgreSQL first (via Docker or locally)
mvn spring-boot:run
```

Backend runs on `http://localhost:8080/api`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200` and proxies API calls to `http://localhost:8080/api`.

## Project Structure

```
ScrumKanban/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/scrumkanban/
│       ├── application/          # DTOs, mappers, use cases
│       ├── domain/               # Entities, repository interfaces
│       ├── infrastructure/       # JPA repositories, config
│       └── web/
│           ├── controllers/      # REST controllers
│           └── security/         # JWT, Spring Security config
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/app/
        ├── auth/                 # Login, Register
        ├── core/                 # Guards, interceptors, services, models
        ├── dashboard/            # Dashboard view
        ├── kanban-board/         # Kanban board with drag-and-drop
        ├── projects/             # Project list and detail
        ├── tasks/                # Task detail view
        └── shared/               # Navbar and shared components
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login, returns JWT  |
| GET    | `/api/auth/me`       | Get current user    |

### Projects

| Method | Endpoint                              | Description            |
|--------|---------------------------------------|------------------------|
| GET    | `/api/projects`                       | List all projects      |
| GET    | `/api/projects/my`                    | List user's projects   |
| GET    | `/api/projects/{id}`                  | Get project by ID      |
| POST   | `/api/projects`                       | Create project         |
| GET    | `/api/projects/{id}/members`          | Get project members    |
| POST   | `/api/projects/{id}/members/{userId}` | Add member to project  |

### Sprints

| Method | Endpoint                                              | Description       |
|--------|-------------------------------------------------------|-------------------|
| GET    | `/api/projects/{projectId}/sprints`                   | List sprints      |
| POST   | `/api/projects/{projectId}/sprints`                   | Create sprint     |
| GET    | `/api/projects/{projectId}/sprints/{sprintId}`        | Get sprint        |
| PUT    | `/api/projects/{projectId}/sprints/{sprintId}/activate` | Start sprint    |
| PUT    | `/api/projects/{projectId}/sprints/{sprintId}/complete` | Complete sprint |

### Tasks

| Method | Endpoint                        | Description            |
|--------|---------------------------------|------------------------|
| POST   | `/api/tasks`                    | Create task            |
| GET    | `/api/tasks/{id}`               | Get task by ID         |
| PUT    | `/api/tasks/{id}`               | Update task            |
| PUT    | `/api/tasks/{id}/status`        | Update task status     |
| DELETE | `/api/tasks/{id}`               | Delete task            |
| GET    | `/api/tasks/sprint/{sprintId}`  | Get tasks by sprint    |
| GET    | `/api/tasks/project/{projectId}`| Get tasks by project   |
| GET    | `/api/tasks/my`                 | Get my assigned tasks  |

### Comments

| Method | Endpoint                                      | Description     |
|--------|-----------------------------------------------|-----------------|
| GET    | `/api/tasks/{taskId}/comments`                | List comments   |
| POST   | `/api/tasks/{taskId}/comments`                | Add comment     |
| DELETE | `/api/tasks/{taskId}/comments/{commentId}`    | Delete comment  |

### Labels

| Method | Endpoint                                       | Description     |
|--------|------------------------------------------------|-----------------|
| GET    | `/api/projects/{projectId}/labels`             | List labels     |
| POST   | `/api/projects/{projectId}/labels`             | Create label    |
| DELETE | `/api/projects/{projectId}/labels/{labelId}`   | Delete label    |

### Dashboard

| Method | Endpoint                                  | Description        |
|--------|-------------------------------------------|--------------------|
| GET    | `/api/dashboard`                          | User dashboard     |
| GET    | `/api/dashboard/sprint/{sprintId}/metrics`| Sprint metrics     |

## Database Schema

```
users ──────────── project_members ──────────── projects
  │                                                │
  │                                                ├── sprints
  │                                                │       │
  │                                                ├── labels
  │                                                │       │
  └── comments ──── tasks ──── task_assignments    │
                      │                            │
                      ├── task_labels ─────────────┘
                      └── sprint (FK)
```

**Tables**: users, projects, project_members, sprints, tasks, task_assignments, task_labels, labels, comments

## Environment Variables

| Variable     | Default        | Description            |
|-------------|----------------|------------------------|
| `DB_HOST`   | localhost       | PostgreSQL host        |
| `DB_PORT`   | 5432            | PostgreSQL port        |
| `DB_NAME`   | scrumkanban     | Database name          |
| `DB_USER`   | scrumkanban     | Database username      |
| `DB_PASS`   | scrumkanban     | Database password      |
| `JWT_SECRET`| (base64 key)   | JWT signing key (256+ bit) |

## Architecture

The backend follows **Clean Architecture** principles:

- **Web** — Controllers, security filters, JWT handling
- **Application** — DTOs, mappers (MapStruct), use cases (business logic)
- **Domain** — Entities, repository interfaces (ports)
- **Infrastructure** — JPA repository adapters, database configuration

The frontend uses **Angular standalone components** with:

- Route guards for authentication
- HTTP interceptors for JWT token injection
- Reactive services with RxJS
- Angular CDK for drag-and-drop

## License

This project is for educational and demonstration purposes.
