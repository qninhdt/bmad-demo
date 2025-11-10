"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument } from '../../services/DocumentUploadService';

export default function UploadDocument() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage('');
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading...');

    try {
      const downloadURL = await uploadDocument(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      setMessage(`File uploaded successfully!`);
      setIsUploading(false);
      setSelectedFile(null);
      setUploadProgress(0);
      router.push('/documents');
    } catch (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error('Upload failed', error);
      setMessage(`Upload failed: ${errorMessage}`);
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload PDF Document</h1>
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          aria-label="choose file"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      {selectedFile && (
        <p className="mb-2">Selected file: {selectedFile.name}</p>
      )}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? `Uploading (${uploadProgress.toFixed(2)}%)` : 'Upload Document'}
      </button>
      {message && (
        <p className={`mt-4 ${isUploading ? 'text-blue-600' : message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
