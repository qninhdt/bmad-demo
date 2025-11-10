# Story 1.2: User Authentication

Status: Approved

## Story

As a user,
I want to log in to the application using my Google account,
So that I can securely access my documents.

## Acceptance Criteria

**Given** a user is on the login page,
**When** the user clicks the "Login with Google" button,
**Then** the user should be redirected to the Google authentication page.
**And** after successful authentication, the user should be redirected back to the application and logged in.

## Tasks / Subtasks

- [x] Implement "Login with Google" button on the frontend
- [x] Set up Firebase Authentication for Google login
- [x] Create a callback page to handle the authentication response
- [x] Secure the backend API to require authentication
- [x] Write tests for the authentication flow

## Dev Notes

- Use Firebase Authentication for Google login.

### Project Structure Notes

- Create a new page for the login functionality.
- The authentication logic should be handled in a separate module.

### References

- [Source: docs/epics.md#Epic-1-Foundation--User-Authentication]
- [Source: docs/architecture.md#Authentication]
- [Source: docs/tech-spec-epic-1.md]

## Dev Agent Record

### Context Reference

- /home/qninh/projects/law-ai/docs/stories/1-2-user-authentication.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List
- Implemented "Login with Google" button on the frontend. User needs to set up Firebase environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) in a .env.local file in the frontend directory.
- The authentication response is handled by the existing login page using `onAuthStateChanged` and `router.push('/')`, so a separate callback page is not required for this basic flow.
- Secured the backend API to require authentication. User needs to provide a Firebase service account key file (e.g., `path/to/your/serviceAccountKey.json`) and update `backend/app/main.py` accordingly.

### File List
- frontend/src/app/login/page.tsx
- frontend/__tests__/login/page.test.tsx
- backend/app/api/dependencies.py
- backend/app/main.py
- backend/requirements.txt
- backend/tests/test_dependencies.py
