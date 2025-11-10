# Epic Technical Specification: Document Upload & Management

Date: 2025-11-06
Author: qninhdt
Epic ID: 2
Status: Draft

---

## Overview

This epic enables users to upload and manage their legal documents. It covers both PDF uploads and capturing documents using a mobile device. This is a core feature of the application, allowing users to get their documents into the system for further processing.

## Objectives and Scope

*   **In-Scope:**
    *   PDF document upload (up to 20 pages).
    *   Mobile document capture (up to 10 pages).
    *   Displaying a list of uploaded documents.
    *   Viewing the content of a document.
    *   Searching for documents by title or content.
*   **Out-of-Scope:**
    *   Document editing.
    *   Sharing documents with other users.
    *   Advanced document organization features like folders or tags (beyond search).

## System Architecture Alignment

This epic leverages the Firebase Storage for document storage, as specified in the architecture. The frontend will use the Firebase SDK for client-side uploads, and the backend will use the Firebase Admin SDK for server-side management. The document list and search functionality will be implemented using FastAPI endpoints and a database solution (Firebase Firestore is a likely choice, though not explicitly stated in the architecture for this purpose).

## Detailed Design

### Services and Modules

*   **Frontend:**
    *   `DocumentUploadService`: A module to handle both PDF and mobile image uploads to Firebase Storage.
    *   `DocumentListComponent`: A component to display the list of documents.
    *   `DocumentViewComponent`: A component to display the content of a single document.
    *   `DocumentSearchComponent`: A component to handle user search queries.
*   **Backend:**
    *   `Document API`: API endpoints for managing document metadata (create, list, get, search).
    *   `Storage Service`: A service to interact with Firebase Storage.

### Data Models and Contracts

*   **Document:**
    *   `id`: string (UUID)
    *   `userId`: string (Firebase user ID)
    *   `title`: string
    *   `storagePath`: string
    *   `createdAt`: timestamp
    *   `updatedAt`: timestamp
*   **API Error Response:**
    *   `detail`: string (error message)

### APIs and Interfaces

*   **Frontend -> Backend:**
    *   `POST /api/v1/documents`: Creates a new document metadata entry.
    *   `GET /api/v1/documents`: Retrieves a list of documents for the current user.
    *   `GET /api/v1/documents/{documentId}`: Retrieves a single document's metadata.
    *   `GET /api/v1/documents/search?q={query}`: Searches for documents.
*   **Backend API:**
    *   `POST /api/v1/documents`:
        *   Request: `{ "title": "...", "storagePath": "..." }`
        *   Response (201 Created): `{ "id": "...", "userId": "...", "title": "...", "storagePath": "...", "createdAt": "...", "updatedAt": "..." }`
    *   `GET /api/v1/documents`:
        *   Response (200 OK): `[ { "id": "...", "title": "...", "createdAt": "..." }, ... ]`
    *   `GET /api/v1/documents/{documentId}`:
        *   Response (200 OK): `{ "id": "...", "title": "...", "storagePath": "...", "createdAt": "...", "updatedAt": "..." }`
    *   `GET /api/v1/documents/search?q={query}`:
        *   Response (200 OK): `[ { "id": "...", "title": "...", "createdAt": "..." }, ... ]`

### Workflows and Sequencing

1.  **PDF Upload Flow:**
    1.  User selects a PDF file on the frontend.
    2.  Frontend uploads the file directly to Firebase Storage.
    3.  Upon successful upload, the frontend sends a request to the backend `POST /api/v1/documents` with the document title and storage path.
    4.  Backend creates a new document metadata entry in the database.
2.  **Mobile Capture Flow:**
    1.  User captures document pages using the mobile app.
    2.  Mobile app uploads the images to Firebase Storage.
    3.  Mobile app sends a request to the backend to a (to be defined) endpoint to process the images into a single document.
    4.  Backend processes the images and creates a new document metadata entry.
3.  **Document List and View Flow:**
    1.  User navigates to the document list page.
    2.  Frontend sends a request to `GET /api/v1/documents`.
    3.  Backend retrieves the list of documents for the user from the database and returns it.
    4.  User clicks on a document.
    5.  Frontend sends a request to `GET /api/v1/documents/{documentId}`.
    6.  Backend retrieves the document metadata, including the `storagePath`.
    7.  Frontend uses the `storagePath` to download and display the document from Firebase Storage.

## Non-Functional Requirements

### Performance

*   PDF uploads should start within 2 seconds of file selection.
*   Document list should load in under 2 seconds.
*   Document search should return results in under 2 seconds.

### Security

*   Users can only access their own documents.
*   Direct access to Firebase Storage URLs should be restricted.

### Reliability/Availability

*   The application should have an uptime of at least 99% for the MVP.
*   Document uploads should be resumable in case of network interruption.

### Observability

*   The backend will log any errors during document upload or processing.
*   The frontend will log any errors during file upload or API requests.

## Dependencies and Integrations

*   **Frontend:**
    *   `firebase`: latest (for Storage)
*   **Backend:**
    *   `firebase-admin`: 7.1.0 (for Storage)
    *   `python-multipart`: for file uploads in FastAPI

## Acceptance Criteria (Authoritative)

*   **Story 2.1: PDF Document Upload**
    *   Given a logged-in user is on the dashboard, when the user selects a PDF file to upload, then the file should be uploaded to the application and stored securely.
    *   And the user should see the uploaded document in their document list.
*   **Story 2.2: Mobile Document Capture**
    *   Given a logged-in user is on the mobile application, when the user opens the capture mode, then the user should be able to capture multiple pages consecutively.
    *   And the captured pages should be uploaded and assembled into a single document.
*   **Story 2.3: Document List and View**
    *   Given a logged-in user has uploaded documents, when the user navigates to the document list, then the user should see a list of their documents with titles and upload dates.
    *   And the user can click on a document to view its content.
*   **Story 2.4: Document Search**
    *   Given a logged-in user has multiple documents, when the user enters a search query, then the user should see a list of documents that match the query in their title or content.

## Traceability Mapping

| AC | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| 2.1.1 | Detailed Design | Frontend: `DocumentUploadService`, Backend: `Document API` | E2E test for PDF upload |
| 2.1.2 | Detailed Design | Frontend: `DocumentListComponent` | Verify uploaded document appears in list |
| 2.2.1 | Detailed Design | Mobile App | E2E test for mobile capture |
| 2.2.2 | Detailed Design | Mobile App, Backend | Verify captured pages are assembled |
| 2.3.1 | Detailed Design | Frontend: `DocumentListComponent`, Backend: `Document API` | Verify document list is displayed correctly |
| 2.3.2 | Detailed Design | Frontend: `DocumentViewComponent`, Backend: `Document API` | Verify document content is displayed |
| 2.4.1 | Detailed Design | Frontend: `DocumentSearchComponent`, Backend: `Document API` | E2E test for document search |

## Risks, Assumptions, Open Questions

*   **Risk:** Mobile document capture quality may be poor, affecting OCR accuracy.
    *   **Mitigation:** Provide clear instructions and feedback to the user during capture.
*   **Assumption:** Firebase Storage will be sufficient for the MVP's storage needs.
*   **Question:** What is the maximum file size for PDF uploads? (PRD says 20 pages, but not a file size).

## Test Strategy Summary

*   **Unit Tests:** Unit tests will be written for the `DocumentUploadService` and backend API endpoints.
*   **Integration Tests:** Integration tests will verify the interaction between the frontend, backend, and Firebase Storage.
*   **E2E Tests:** End-to-end tests will cover the full document upload, list, view, and search flows.
