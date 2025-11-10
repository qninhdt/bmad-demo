# Story 1.1: Project Setup

Status: done

## Story

As a developer,
I want to set up the initial project structure,
So that I have a clean and organized codebase to start with.

## Acceptance Criteria

1. Given a new project, when the project is initialized, then the project structure should be created with separate directories for backend and frontend.
2. And a CI/CD pipeline should be configured to run tests and deploy the application.

## Tasks / Subtasks

- [x] Initialize Next.js frontend project (AC: #1)
  - [x] Run `npx create-next-app`
  - [x] Configure TypeScript, Tailwind CSS, and ESLint
  - [ ] Write a simple test to ensure the app runs
- [x] Initialize FastAPI backend project (AC: #1)
  - [x] Create backend directory
  - [x] Set up virtual environment
  - [x] Install FastAPI and other dependencies
  - [ ] Write a simple test to ensure the server starts
- [x] Configure CI/CD pipeline (AC: #2)
  - [x] Create a basic pipeline configuration file (e.g., `.github/workflows/main.yml`)
  - [x] Add steps for installing dependencies, running tests, and building the projects.
  - [ ] Run the pipeline to ensure it passes

## Dev Notes

- Follow the project structure defined in `docs/architecture.md`.
- Use `npx create-next-app@latest my-app --typescript --tailwind --eslint --app` for the frontend.
- The backend should have a directory structure like `app/api`, `app/core`, etc. as per `docs/architecture.md`.

### Project Structure Notes

- No previous story, so no learnings to apply.

### References

- [Source: docs/epics.md#Epic-1-Foundation--User-Authentication]
- [Source: docs/architecture.md#Project-Structure]
- [Source: docs/tech-spec-epic-1.md]

## Dev Agent Record

### Context Reference

- /home/qninh/projects/law-ai/docs/stories/1-1-project-setup.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List
- Skipped testing phase as per user instruction.

### File List
- frontend/
- backend/
- .github/workflows/main.yml
