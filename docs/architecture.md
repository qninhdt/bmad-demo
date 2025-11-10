# Architecture

## Executive Summary

The architecture for `law-ai` is a modern full-stack application with a separate frontend and backend. The frontend is a Next.js application using `shadcn/ui` for components, and the backend is a FastAPI application. Firebase is used for authentication, database, and file storage. AI features are powered by the OpenRouter API. The architecture is designed to be simple and efficient for an MVP, with a focus on rapid development.

## Project Initialization

First implementation story should execute:
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
```

This establishes the base architecture with these decisions:
-   **Language/TypeScript:** Yes
-   **Styling solution:** Tailwind CSS
-   **Testing framework:** None (by default)
-   **Linting/Formatting:** ESLint
-   **Build tooling:** Next.js
-   **Project structure:** Standard Next.js App Router structure

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
|---|---|---|---|---|
| File Storage | Firebase Storage | 7.1.0 (Python SDK) | Epic 2 | User preference, aligns with PRD, and integrates well with other Firebase services. |
| Vector Database | None | N/A | Epic 3 | User has stated it is unnecessary for the MVP. |
| Prompt Management | Store prompts in the backend codebase or a configuration file. | N/A | Epic 3 | Simplest approach for MVP, fast to implement. |
| Caching Strategy | In-memory cache on the backend (FastAPI). | N/A | Epic 3, NFRs | Improves performance for MVP, reduces API costs. |
| Background Jobs | Use FastAPI's built-in `BackgroundTasks`. | N/A | Epic 3 | User preference, simplest approach for MVP, avoids external dependencies. |
| Error Handling | Standard HTTP status codes with consistent JSON error format: `{"detail": "Error message"}`. | N/A | All | Simplicity and common practice for REST APIs. |
| Logging | Python's built-in `logging` module for console output. | N/A | All | Sufficient for MVP, no external dependencies. |
| API Response Format | Successful responses return JSON data directly, without a wrapper. | N/A | All | Simplicity for MVP. |

## Project Structure

```
/law-ai
├───frontend/
│   ├───.next/
│   ├───node_modules/
│   ├───public/
│   ├───src/
│   │   ├───app/
│   │   ├───components/
│   │   ├───lib/
│   │   ├───styles/
│   │   └───...
│   ├───.env.local
│   ├───next.config.js
│   ├───package.json
│   ├───postcss.config.js
│   ├───tailwind.config.js
│   ├───tsconfig.json
│   └───...
├───backend/
│   ├───venv/
│   ├───app/
│   │   ├───api/
│   │   ├───core/
│   │   ├───models/
│   │   ├───services/
│   │   └───main.py
│   ├───.env
│   ├───requirements.txt
│   └───...
├───docs/
│   ├───PRD.md
│   ├───epics.md
│   ├───ux-design-specification.md
│   ├───architecture.md (This document)
│   └───...
└───README.md
```

## Epic to Architecture Mapping

-   **Epic 1: Foundation & User Authentication:**
    -   Frontend: Next.js project setup, Firebase SDK integration for authentication.
    -   Backend: FastAPI for user management (if needed beyond Firebase Auth), Firebase Admin SDK.
-   **Epic 2: Document Upload & Management:**
    -   Frontend: Next.js components for upload UI, Firebase SDK for client-side storage interaction.
    -   Backend: FastAPI endpoints for document metadata, Firebase Admin SDK for server-side storage interaction.
-   **Epic 3: AI-Powered Document Intelligence:**
    -   Backend: FastAPI services for OCR, summarization, classification using LangChain and OpenRouter API, `BackgroundTasks` for processing.
-   **Epic 4: User Interface & Experience:**
    -   Frontend: Next.js components using `shadcn/ui`, responsive design implementation, dark mode.

## Technology Stack Details

### Core Technologies

-   **Frontend:** Next.js (16.0.1), React, TypeScript, Tailwind CSS, shadcn/ui
-   **Backend:** FastAPI (0.121.0), Python, Pydantic (2.12.4), LangChain (1.0.3), python-dotenv
-   **Database:** Firebase
-   **Authentication:** Firebase Authentication
-   **File Storage:** Firebase Storage (Python SDK 7.1.0)
-   **AI/LLM:** OpenRouter API

### Integration Points

-   **Frontend to Backend:** REST API calls (FastAPI).
-   **Frontend to Firebase:** Direct SDK calls for Authentication and Storage.
-   **Backend to Firebase:** `firebase-admin` SDK for Storage and potentially Database.
-   **Backend to OpenRouter API:** HTTP requests for LLM interactions.

## AI Model Configuration

Each AI task (OCR, summarization, classification) will use a different LLM model. The model IDs will be stored in the backend's `.env` file.

Example `.env` file:
```
OCR_MODEL_ID=...
SUMMARIZATION_MODEL_ID=...
CLASSIFICATION_MODEL_ID=...
```

The backend code will be responsible for loading these model IDs from the `.env` file and using the appropriate model for each task when calling the OpenRouter API.

## Implementation Patterns

### Naming Conventions

-   **Frontend (React/Next.js):** PascalCase for components (e.g., `UserCard.tsx`), kebab-case for utility files (e.g., `date-utils.ts`).
-   **Backend (FastAPI):** snake_case for Python files, functions, and variables. PascalCase for classes.
-   **API Endpoints:** kebab-case for resource paths (e.g., `/documents`, `/users/{user_id}`).

### Code Organization

-   **Frontend:** Organize by feature (e.g., `src/features/auth`, `src/features/documents`).
-   **Backend:** Organize by domain/module (e.g., `app/api/documents`, `app/api/users`). A configuration module should be created to load the model IDs from the `.env` file and provide them to the services that interact with the OpenRouter API.

### Error Handling

-   The API will return standard HTTP status codes (e.g., 400 for bad requests, 500 for server errors) with a consistent JSON error format: `{"detail": "Error message"}`.

### Logging Strategy

-   We will use Python's built-in `logging` module for basic logging to the console.

---

_Generated by BMAD Decision Architecture Workflow v1.3.2_
_Date: 2025-11-06_
_For: qninhdt_
