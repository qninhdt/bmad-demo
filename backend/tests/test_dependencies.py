import pytest
from fastapi import HTTPException
from unittest.mock import AsyncMock, patch
from app.api.dependencies import verify_token
from fastapi.security import HTTPAuthorizationCredentials

@pytest.mark.asyncio
async def test_verify_token_valid_token():
    with patch('firebase_admin.auth.verify_id_token', return_value={'uid': 'test_uid'}) as mock_verify_id_token:
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")
        decoded_token = await verify_token(credentials)
        mock_verify_id_token.assert_called_once_with("valid_token")
        assert decoded_token == {'uid': 'test_uid'}

@pytest.mark.asyncio
async def test_verify_token_invalid_token():
    with patch('firebase_admin.auth.verify_id_token', side_effect=Exception("Invalid token")) as mock_verify_id_token:
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid_token")
        with pytest.raises(HTTPException) as exc_info:
            await verify_token(credentials)
        mock_verify_id_token.assert_called_once_with("invalid_token")
        assert exc_info.value.status_code == 401
        assert "Invalid authentication token" in exc_info.value.detail
