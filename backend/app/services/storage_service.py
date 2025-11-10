from firebase_admin import storage

def verify_file_exists(storage_path: str) -> bool:
    """Verifies if a file exists at the given storage path in Firebase Storage."""
    try:
        bucket = storage.bucket()
        blob = bucket.blob(storage_path)
        return blob.exists()
    except Exception as e:
        print(f"Error verifying file existence: {e}")
        return False
