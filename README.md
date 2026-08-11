# ZenFlow

> AI-assisted project collaboration and management platform built for modern software teams.

ZenFlow is a full-stack project collaboration platform designed to bring **project management, team collaboration, task management, and AI assistance** into a single workspace.

The project is being developed with a production-oriented architecture using **Next.js, TypeScript, Express.js, PostgreSQL, and Prisma**, with an AI assistant integrated directly into the platform.

---

## Overview

Modern development teams often rely on multiple tools for project management, communication, task tracking, and AI assistance.

ZenFlow aims to bring these workflows together into one platform.

The system provides a shared workspace where teams can:

* Manage projects
* Organize teams
* Create and track tasks
* Manage project workflows
* Collaborate with team members
* Track project progress
* Interact with an AI assistant
* Manage authentication and user access

The architecture is designed to provide a strong foundation for expanding ZenFlow into a larger SaaS-style platform.

---

## Core Features

### Authentication & User Management

* User registration and authentication
* Secure session management
* Protected application routes
* User profiles
* Role-aware application access

### Project Management

* Create and manage projects
* Project details and metadata
* Project members
* Project-specific workflows
* Project progress tracking

### Task Management

* Create and manage tasks
* Task assignment
* Task status management
* Task priorities
* Task descriptions
* Task due dates
* Drag-and-drop workflow management

### Team Collaboration

* Team/project membership
* Member management
* Shared project workspace
* Collaboration-oriented project structure

### AI Assistant

ZenFlow integrates an AI assistant directly into the project management workflow.

The assistant is designed to help users interact with project information and improve productivity through natural-language interactions.

Potential AI capabilities include:

* Project-related questions
* Task assistance
* Project information retrieval
* Productivity assistance
* AI-generated responses based on application context

The AI layer is designed to evolve as additional project-aware capabilities are introduced.

---

## Architecture

ZenFlow follows a modern full-stack architecture designed to separate application concerns while keeping the system maintainable and extensible.

```text
                    ┌─────────────────────┐
                    │      Client         │
                    │   Next.js / React   │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │      Express        │
                    │      API Layer      │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │    Prisma    │      │ AI Services  │
             │ ORM / Data   │      │ AI Assistant │
             │    Access    │      │              │
             └──────┬───────┘      └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │ PostgreSQL   │
             │   Database   │
             └──────────────┘
```

The architecture is intended to keep the frontend, API layer, data access, and AI functionality sufficiently separated so individual parts can evolve independently.

---

## Technology Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Chakra UI**
* **Tailwind CSS**
* **Framer Motion**
* **React Icons**

### Backend

* **Node.js**
* **Express.js**
* REST API architecture

### Database

* **PostgreSQL**
* **Prisma ORM**

### Authentication

* **NextAuth / Auth.js**
* Secure session-based authentication
* Protected application resources

### AI

* AI-powered project assistant
* LLM integration
* Context-aware project assistance

### Development

* TypeScript
* ESLint
* Git
* npm

---

## Database Architecture

ZenFlow uses **PostgreSQL** as its primary relational database.

Prisma provides the database abstraction layer and type-safe access to application data.

The relational model is designed around core entities such as:

```text
User
 │
 ├── Accounts
 ├── Sessions
 └── Project Memberships
          │
          ▼
        Project
          │
          ├── Tasks
          ├── Members
          └── Project Data
```

This relational approach allows ZenFlow to maintain clear relationships between users, projects, memberships, tasks, and other platform resources.

---

## Project Structure

The application is organized around a modern Next.js application architecture with a dedicated backend/API layer.

A simplified structure:

```text
zenflow/
│
├── app/
│   ├── dashboard/
│   ├── projects/
│   ├── teams/
│   ├── inbox/
│   ├── api/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── projects/
│   ├── tasks/
│   └── ...
│
├── lib/
│   ├── auth/
│   ├── prisma/
│   ├── api/
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── ...
│
├── public/
│
├── package.json
└── README.md
```

The exact structure may evolve as the platform continues to grow.

---

## Development

### Prerequisites

Before running ZenFlow locally, make sure you have:

* Node.js
* npm
* PostgreSQL
* Git

### Clone the repository

```bash
git clone https://github.com/AsimAliMurtaza/zenflow.git

cd zenflow
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and configure the required environment variables.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/zenflow"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Add additional authentication,
# AI and application variables here.
```

Never commit real credentials or secrets to the repository.

---

## Database Setup

After configuring PostgreSQL and the database connection:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate dev
```

For development, you can inspect the database using:

```bash
npx prisma studio
```

---

## Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Create a production build:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

---

## API Architecture

ZenFlow uses an API-oriented backend architecture so application functionality can be consumed independently from the user interface.

This provides a foundation for future clients such as:

* Web applications
* Mobile applications
* Desktop applications
* Third-party integrations

The API layer is intentionally separated from presentation concerns to make the platform easier to extend as the product grows.

---

## Security

Security is an important part of the application architecture.

The platform is designed around:

* Authenticated application access
* Protected resources
* Server-side authorization
* Secure password handling where applicable
* Environment-based secret management
* Database-level relationships and constraints
* Input validation
* API-level authorization

Additional security controls will be introduced as the platform evolves toward production deployment.

---

## Roadmap

ZenFlow is actively evolving toward a more complete project collaboration platform.

### Current

* Authentication
* Project management
* Team management
* Task management
* Project workflows
* AI assistant
* PostgreSQL migration
* Prisma-based database layer

### Planned

* Advanced project analytics
* Notifications
* Improved inbox and messaging workflows
* AI-powered project insights
* AI task generation and assistance
* Advanced permissions
* Activity history
* Real-time collaboration
* Mobile application
* Production deployment
* SaaS/multi-tenant capabilities

---

## Engineering Goals

ZenFlow is being developed with an emphasis on:

* Maintainable architecture
* Type safety
* Clear separation of concerns
* Scalable backend design
* Relational data modeling
* Reusable components
* Secure authentication
* AI integration
* Extensibility for future clients

The goal is not simply to build a project management UI, but to establish a foundation that can evolve into a **production-grade collaboration platform**.

---

## Status

**Active Development**

ZenFlow is an ongoing engineering project. Architecture, features, and implementation details are continuously evolving as the platform moves toward a more production-ready system.

---

## Author

**Asim Ali Murtaza**

Software Engineer focused on AI engineering and full-stack development.

* GitHub: https://github.com/AsimAliMurtaza
* LinkedIn: https://www.linkedin.com/in/asimalimurtaza/
* Portfolio: https://asimalimurtaza.lovable.app/

---

## License

This project is currently under active development. Licensing and contribution guidelines may be added as the project matures.
