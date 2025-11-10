from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import pytest

# Mock Firebase Admin SDK initialization before importing app.main
with patch('firebase_admin.credentials') as mock_credentials:
    mock_credentials.Certificate.return_value = MagicMock()
    with patch('firebase_admin.initialize_app') as mock_init_app:
        from app.main import app

from app.models import Document
from app.api.dependencies import verify_token
from fastapi import HTTPException, status

client = TestClient(app)

# Patch verify_file_exists at the module level where it's imported in app.main
@patch('app.main.verify_file_exists', return_value=True)
def test_create_document_success(mock_verify_file_exists):
    # Override the verify_token dependency for this test
    app.dependency_overrides[verify_token] = lambda: {'uid': 'test_user_id'}
    response = client.post(
        "/api/v1/documents",
        headers={
            "Authorization": "Bearer valid_token"
        },
        json={
            "title": "Test Document",
            "storagePath": "documents/test.pdf"
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()['title'] == "Test Document"
    assert response.json()['owner_id'] == "test_user_id"
    mock_verify_file_exists.assert_called_once_with("documents/test.pdf")
    app.dependency_overrides.clear() # Clear overrides after test

@patch('app.main.verify_file_exists', return_value=False)
def test_create_document_file_not_found(mock_verify_file_exists):
    # Override the verify_token dependency for this test
    app.dependency_overrides[verify_token] = lambda: {'uid': 'test_user_id'}
    response = client.post(
        "/api/v1/documents",
        headers={
            "Authorization": "Bearer valid_token"
        },
        json={
            "title": "Test Document",
            "storagePath": "documents/nonexistent.pdf"
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()['detail'] == "File not found in storage or invalid storage path."
    mock_verify_file_exists.assert_called_once_with("documents/nonexistent.pdf")
    app.dependency_overrides.clear() # Clear overrides after test

def test_create_document_unauthorized_no_token():
    # No token provided, so verify_token will raise HTTPException
    response = client.post(
        "/api/v1/documents",
        json={
            "title": "Test Document",
            "storagePath": "documents/test.pdf"
        }
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN # FastAPI returns 403 for missing auth header by default

def test_create_document_unauthorized_invalid_token():
    # Override the verify_token dependency to simulate an invalid token
    # The verify_token dependency itself raises HTTPException, so we mock the dependency function directly
    def mock_verify_token_raise_exception():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    app.dependency_overrides[verify_token] = mock_verify_token_raise_exception
    response = client.post(
        "/api/v1/documents",
        headers={
            "Authorization": "Bearer invalid_token"
        },
        json={
            "title": "Test Document",
            "storagePath": "documents/test.pdf"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()['detail'] == "Invalid authentication token"
    app.dependency_overrides.clear() # Clear overrides after test

def test_get_documents_success():
    # Override the verify_token dependency for this test
    app.dependency_overrides[verify_token] = lambda: {'uid': 'test_user_id'}

    # Add some dummy documents to the in-memory db
    from app.main import db
    from app.models import Document
    from datetime import datetime
    from uuid import uuid4

    db.clear() # Clear previous test data
    doc1 = Document(id=str(uuid4()), title="User Doc 1", storagePath="path/to/doc1.pdf", owner_id="test_user_id", created_at=datetime.now().isoformat(), updated_at=datetime.now().isoformat())
    doc2 = Document(id=str(uuid4()), title="Other User Doc", storagePath="path/to/other.pdf", owner_id="other_user_id", created_at=datetime.now().isoformat(), updated_at=datetime.now().isoformat())
    doc3 = Document(id=str(uuid4()), title="User Doc 2", storagePath="path/to/doc2.pdf", owner_id="test_user_id", created_at=datetime.now().isoformat(), updated_at=datetime.now().isoformat())
    db.extend([doc1, doc2, doc3])

    response = client.get(
        "/api/v1/documents",
        headers=
            {
            "Authorization": "Bearer valid_token"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    response_json = response.json()
    assert len(response_json) == 2
    assert all(doc['owner_id'] == "test_user_id" for doc in response_json)
    assert any(doc['title'] == "User Doc 1" for doc in response_json)
    assert any(doc['title'] == "User Doc 2" for doc in response_json)
    app.dependency_overrides.clear() # Clear overrides after test

def test_get_documents_unauthorized():
    response = client.get(
        "/api/v1/documents"
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN # FastAPI returns 403 for missing auth header by default
