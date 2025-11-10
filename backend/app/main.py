from fastapi import FastAPI, Depends, HTTPException, status
import firebase_admin
from firebase_admin import credentials
from app.api.dependencies import verify_token
from app.models import DocumentCreate, Document
from app.services.storage_service import verify_file_exists
import os
from dotenv import load_dotenv
from datetime import datetime
from uuid import uuid4

load_dotenv()

# Initialize Firebase Admin SDK
cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH"))
firebase_admin.initialize_app(cred)

app = FastAPI()

# In-memory database for demonstration purposes
db: list[Document] = []

@app.get("/", dependencies=[Depends(verify_token)])
def read_root():
    return {"Hello": "World"}

@app.post("/api/v1/documents", response_model=Document, status_code=status.HTTP_201_CREATED)
async def create_document(document: DocumentCreate, decoded_token: dict = Depends(verify_token)):
    owner_id = decoded_token['uid']

    # Verify if the file exists in Firebase Storage
    if not verify_file_exists(document.storagePath):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File not found in storage or invalid storage path.")

    new_document = Document(
        id=str(uuid4()),
        title=document.title,
        storagePath=document.storagePath,
        owner_id=owner_id,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
    )
    db.append(new_document)
    return new_document

@app.get("/api/v1/documents", response_model=list[Document])
async def get_documents(decoded_token: dict = Depends(verify_token)):
    owner_id = decoded_token['uid']
    user_documents = [doc for doc in db if doc.owner_id == owner_id]
    return user_documents
