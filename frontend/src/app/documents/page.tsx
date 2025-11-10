"use client";

import { useEffect, useState } from 'react';
import { fetchDocuments } from '../../services/DocumentService';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../lib/firebase';

interface Document {
  id: string;
  title: string;
  storagePath: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDownloadLink = async (storagePath: string): Promise<string> => {
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, storagePath);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (err) {
      console.error("Error getting download URL for", storagePath, err);
      return "#"; // Fallback link
    }
  };

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const fetchedDocuments = await fetchDocuments();
        // For each document, get its download URL
        const documentsWithUrls = await Promise.all(
          fetchedDocuments.map(async (doc) => ({
            ...doc,
            downloadURL: await getDownloadLink(doc.storagePath),
          }))
        );
        setDocuments(documentsWithUrls);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDocuments();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading documents...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {documents.map((doc) => (
            <li key={doc.id} className="mb-2">
              <a href={(doc as any).downloadURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {doc.title} (ID: {doc.id})
              </a>
              <p className="text-sm text-gray-500">Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
