from pydantic import BaseModel
from typing import Optional

class DocumentCreate(BaseModel):
    title: str
    storagePath: str

class Document(BaseModel):
    id: str
    title: str
    storagePath: str
    owner_id: str
    created_at: str
    updated_at: str
