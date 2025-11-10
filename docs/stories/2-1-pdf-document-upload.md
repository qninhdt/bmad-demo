# Story 2.1: PDF Document Upload

Status: done

## Story

As a user,
I want to upload a PDF document,
so that I can store and manage it in the application.

## Acceptance Criteria

1. Given a logged-in user is on the dashboard, when the user selects a PDF file to upload, then the file should be uploaded to the application and stored securely.
2. And the user should see the uploaded document in their document list.

## Tasks / Subtasks

- [x] Implement frontend UI for PDF upload.

- [x] Implement `DocumentUploadService` on the frontend to handle file upload to Firebase Storage.

- [x] Implement backend API endpoint `POST /api/v1/documents` to create document metadata.
- [x] Implement `Storage Service` on the backend to interact with Firebase Storage.
- [x] Write unit and integration tests for the upload functionality.

### Review Follow-ups (AI)
- [x] [AI-Review][Medium] Implement UI and backend API for displaying a list of uploaded documents to fully satisfy AC2.
- [x] [AI-Review][Low] Refine frontend error handling in `handleUpload` and `uploadTask.on` to use more specific error types or `unknown` with type narrowing. (file: frontend/src/app/upload/page.tsx, frontend/src/services/DocumentUploadService.ts)
- [x] [AI-Review][Low] Standardize on either `downloadURL` or `storagePath` for document references between frontend and backend to avoid potential inconsistencies. If `storagePath` is preferred, ensure frontend can reconstruct `downloadURL` when needed. (file: frontend/src/services/DocumentUploadService.ts, backend/app/main.py)

### Completion Notes List

- Implemented frontend UI for PDF upload, including file selection, progress tracking, and success/error messages.
- Refactored upload logic into a dedicated `DocumentUploadService` on the frontend.
- Implemented backend API endpoint `POST /api/v1/documents` to create document metadata, with authentication and storage path verification.
- Implemented a backend `Storage Service` to verify file existence in Firebase Storage.
- Wrote comprehensive unit and integration tests for both frontend and backend upload functionality, ensuring all acceptance criteria are met and no regressions are introduced.
- frontend/src/app/upload/page.tsx
- frontend/src/lib/firebase.ts
- frontend/.env.local
- frontend/src/services/DocumentUploadService.ts
- backend/app/models.py
- backend/app/main.py
- backend/app/services/storage_service.py
- frontend/__tests__/app/upload/page.test.tsx
- frontend/__tests__/services/DocumentUploadService.test.ts
- backend/tests/test_storage_service.py
- backend/tests/test_main.py
- frontend/src/services/DocumentService.ts
- frontend/src/app/documents/page.tsx
- frontend/__tests__/services/DocumentService.test.ts
- frontend/__tests__/app/documents/page.test.tsx

## Dev Agent Record

### Completion Notes
- ✅ Resolved review finding [Medium]: Implement UI and backend API for displaying a list of uploaded documents to fully satisfy AC2.
- ✅ Resolved review finding [Low]: Refine frontend error handling in `handleUpload` and `uploadTask.on` to use more specific error types or `unknown` with type narrowing.
- ✅ Resolved review finding [Low]: Standardize on either `downloadURL` or `storagePath` for document references between frontend and backend to avoid potential inconsistencies. If `storagePath` is preferred, ensure frontend can reconstruct `downloadURL` when needed.

- frontend/__tests__/app/documents/page.test.tsx

## Senior Developer Review (AI)

**Reviewer**: qninhdt
**Date**: 2025-11-06
**Outcome**: Approve
**Summary**: The story "PDF Document Upload" (2.1) has been thoroughly reviewed. All acceptance criteria and tasks, including the follow-up items from the previous review, have been successfully implemented and verified with comprehensive unit and integration tests. The frontend now provides a complete upload and document listing experience, and the backend handles document metadata and access control appropriately. The code adheres to established best practices and architectural guidelines.

### Key Findings

*   **LOW**: The backend uses an in-memory database (`db: list[Document]`) for document metadata, meaning data is not persistent across application restarts. This is a known limitation for an MVP and should be addressed in future iterations for production readiness.
*   **LOW**: E2E tests are mentioned in `story-context.xml` but are not explicitly implemented as part of this story. While unit and integration tests provide good coverage, E2E tests would offer additional confidence for critical user flows.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|---|---|---|---|
| AC1 | Given a logged-in user is on the dashboard, when the user selects a PDF file to upload, then the file should be uploaded to the application and stored securely. | IMPLEMENTED | `frontend/src/app/upload/page.tsx` (UI for file selection and upload initiation), `frontend/src/services/DocumentUploadService.ts` (Handles upload to Firebase Storage), `backend/app/main.py` (`POST /api/v1/documents`), `backend/app/services/storage_service.py`. Tests: `frontend/__tests__/app/upload/page.test.tsx`, `frontend/__tests__/services/DocumentUploadService.test.ts`, `backend/tests/test_main.py`, `backend/tests/test_storage_service.py`. |
| AC2 | And the user should see the uploaded document in their document list. | IMPLEMENTED | `frontend/src/app/documents/page.tsx`, `frontend/src/services/DocumentService.ts`, `backend/app/main.py` (`GET /api/v1/documents`). Tests: `frontend/__tests__/app/documents/page.test.tsx`, `frontend/__tests__/services/DocumentService.test.ts`. |

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|---|---|---|---|
| Implement frontend UI for PDF upload. | Complete | VERIFIED COMPLETE | `frontend/src/app/upload/page.tsx` (lines 10-60), `frontend/__tests__/app/upload/page.test.tsx` (lines 15-25). |
| Implement `DocumentUploadService` on the frontend to handle file upload to Firebase Storage. | Complete | VERIFIED COMPLETE | `frontend/src/services/DocumentUploadService.ts` (lines 4-27), `frontend/__tests__/services/DocumentUploadService.test.ts` (lines 20-70). |
| Implement backend API endpoint `POST /api/v1/documents` to create document metadata. | Complete | VERIFIED COMPLETE | `backend/app/main.py` (lines 25-44), `backend/tests/test_main.py` (lines 13-68). |
| Implement `Storage Service` on the backend to interact with Firebase Storage. | Complete | VERIFIED COMPLETE | `backend/app/services/storage_service.py` (lines 3-10), `backend/tests/test_storage_service.py` (lines 3-20). |
| Write unit and integration tests for the upload functionality. | Complete | VERIFIED COMPLETE | `frontend/__tests__/app/upload/page.test.tsx`, `frontend/__tests__/services/DocumentUploadService.test.ts`, `backend/tests/test_main.py`, `backend/tests/test_storage_service.py`. |
| [AI-Review][Medium] Implement UI and backend API for displaying a list of uploaded documents to fully satisfy AC2. | Complete | VERIFIED COMPLETE | `backend/app/main.py` (new `GET /api/v1/documents` endpoint), `frontend/src/services/DocumentService.ts`, `frontend/src/app/documents/page.tsx`, and their respective tests. |
| [AI-Review][Low] Refine frontend error handling in `handleUpload` and `uploadTask.on` to use more specific error types or `unknown` with type narrowing. (file: frontend/src/app/upload/page.tsx, frontend/src/services/DocumentUploadService.ts) | Complete | VERIFIED COMPLETE | `frontend/src/app/upload/page.tsx` (lines 38-50), `frontend/src/services/DocumentUploadService.ts` (lines 18-25). |
| [AI-Review][Low] Standardize on either `downloadURL` or `storagePath` for document references between frontend and backend to avoid potential inconsistencies. If `storagePath` is preferred, ensure frontend can reconstruct `downloadURL` when needed. (file: frontend/src/services/DocumentUploadService.ts, backend/app/main.py) | Complete | VERIFIED COMPLETE | `frontend/src/services/DocumentUploadService.ts` (line 30 `resolve(storageRef.fullPath)`), `frontend/src/app/documents/page.tsx` (lines 20-30 `getDownloadLink` function). |

### Test Coverage and Gaps
Comprehensive unit and integration tests are present for both frontend and backend upload and document listing functionality. E2E tests are mentioned in `story-context.xml` but are not explicitly implemented.

### Architectural Alignment
The implementation aligns with the architectural decisions outlined in `architecture.md`, particularly regarding Firebase Storage for file storage and FastAPI for backend APIs.

### Security Notes
Authentication is enforced for both `POST /api/v1/documents` and `GET /api/v1/documents` endpoints. `owner_id` is derived from the authenticated user, ensuring users only access their own documents. `storagePath` is verified against Firebase Storage.

### Best-Practices and References
*   **Frontend**: Next.js, React, TypeScript, Tailwind CSS. PascalCase for components, kebab-case for utility files. Organized by feature.
*   **Backend**: FastAPI, Python, Pydantic. snake_case for Python files, functions, variables; PascalCase for classes. Organized by domain/module. Error handling uses standard HTTP status codes with `{"detail": "Error message"}`. Logging uses Python's built-in `logging`.

### Action Items

**Advisory Notes:**
- Note: The backend currently uses an in-memory database (`db: list[Document]`) for document metadata. For production, a persistent database solution (e.g., Firestore, PostgreSQL) should be implemented.
- Note: Consider adding E2E tests for the full document upload and listing flow as mentioned in the `story-context.xml` for comprehensive coverage.

