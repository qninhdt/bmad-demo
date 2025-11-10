import { getAuth } from 'firebase/auth';

interface Document {
  id: string;
  title: string;
  storagePath: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const fetchDocuments = async (): Promise<Document[]> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated.');
  }

  const token = await user.getIdToken();

  const response = await fetch('/api/v1/documents', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch documents');
  }

  return response.json();
};