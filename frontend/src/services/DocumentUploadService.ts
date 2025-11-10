import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../lib/firebase';

export const uploadDocument = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const storage = getStorage(app);
  const storageRef = ref(storage, `documents/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error: any) => {
        console.error('Upload failed', error);
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        reject(new Error(`Upload failed: ${errorMessage}`));
      },
      async () => {
        try {
          // Resolve with storagePath instead of downloadURL
          resolve(storageRef.fullPath);
        } catch (error: any) {
          console.error('Failed to get storage path', error);
          reject(new Error(`Upload successful, but failed to get storage path: ${error.message}`));
        }
      }
    );
  });
};
