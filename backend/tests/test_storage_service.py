import pytest
from unittest.mock import patch, MagicMock
from app.services.storage_service import verify_file_exists

def test_verify_file_exists_true():
    with patch('firebase_admin.storage.bucket') as mock_bucket:
        mock_bucket.return_value.blob.return_value.exists.return_value = True
        assert verify_file_exists('documents/test.pdf') is True
        mock_bucket.return_value.blob.assert_called_with('documents/test.pdf')
        mock_bucket.return_value.blob.return_value.exists.assert_called_once()

def test_verify_file_exists_false():
    with patch('firebase_admin.storage.bucket') as mock_bucket:
        mock_bucket.return_value.blob.return_value.exists.return_value = False
        assert verify_file_exists('documents/nonexistent.pdf') is False
        mock_bucket.return_value.blob.assert_called_with('documents/nonexistent.pdf')
        mock_bucket.return_value.blob.return_value.exists.assert_called_once()

def test_verify_file_exists_error():
    with patch('firebase_admin.storage.bucket') as mock_bucket:
        mock_bucket.return_value.blob.side_effect = Exception("Firebase error")
        assert verify_file_exists('documents/error.pdf') is False
        mock_bucket.return_value.blob.assert_called_with('documents/error.pdf')