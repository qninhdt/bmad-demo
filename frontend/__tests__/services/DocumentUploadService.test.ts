import { uploadDocument } from '../../src/services/DocumentUploadService';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../src/lib/firebase';

const mockStorageInstance = {}; // A simple mock object for the storage instance

// Mock Firebase Storage functions
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => mockStorageInstance), // Mock getStorage to return a consistent mock object
  ref: jest.fn((storageInstance, path) => ({ storage: storageInstance, _location: { path }, fullPath: path })), // Mock ref to return an object with storage, path, and fullPath
  uploadBytesResumable: jest.fn(() => ({
    on: jest.fn((event, next, error, complete) => {
      if (event === 'state_changed') {
        // Simulate progress
        next({ bytesTransferred: 50, totalBytes: 100 });
      } else if (event === 'state_changed') {
        // Simulate completion
        complete();
      }
    }),
    snapshot: { ref: {} },
  })),
  getDownloadURL: jest.fn(() => Promise.resolve('mock-download-url')),
}));

// Mock firebase/app to ensure `app` is a valid object
jest.mock('../../src/lib/firebase', () => ({
  app: {},
}));

describe('DocumentUploadService', () => {
  const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file successfully and return a download URL', async () => {
    const mockOn = jest.fn((event, next, error, complete) => {
      if (event === 'state_changed') {
        next({ bytesTransferred: 50, totalBytes: 100 });
      }
      if (event === 'state_changed') {
        complete();
      }
    });
    (uploadBytesResumable as jest.Mock).mockReturnValue({
      on: mockOn,
      snapshot: { ref: { fullPath: `documents/${mockFile.name}` } }, // Mock fullPath here
    });
    (getDownloadURL as jest.Mock).mockResolvedValue('mock-download-url');

    const storagePath = await uploadDocument(mockFile);

    expect(getStorage).toHaveBeenCalled();
    expect(ref).toHaveBeenCalledWith(expect.any(Object), `documents/${mockFile.name}`);
    expect(uploadBytesResumable).toHaveBeenCalledWith(expect.any(Object), mockFile);
    expect(mockOn).toHaveBeenCalledWith('state_changed', expect.any(Function), expect.any(Function), expect.any(Function));
    expect(getDownloadURL).not.toHaveBeenCalled(); // getDownloadURL should not be called here anymore
    expect(storagePath).toBe(`documents/${mockFile.name}`);
  });

  it('should call onProgress with upload progress', async () => {
    const mockOnProgress = jest.fn();
    const mockOn = jest.fn((event, next, error, complete) => {
      if (event === 'state_changed') {
        next({ bytesTransferred: 25, totalBytes: 100 });
        next({ bytesTransferred: 75, totalBytes: 100 });
      }
      if (event === 'state_changed') {
        complete();
      }
    });
    (uploadBytesResumable as jest.Mock).mockReturnValue({
      on: mockOn,
      snapshot: { ref: {} },
    });
    (getDownloadURL as jest.Mock).mockResolvedValue('mock-download-url');

    await uploadDocument(mockFile, mockOnProgress);

    expect(mockOnProgress).toHaveBeenCalledWith(25);
    expect(mockOnProgress).toHaveBeenCalledWith(75);
  });

  it('should reject if upload fails', async () => {
    const mockError = new Error('Upload failed');
    const mockOn = jest.fn((event, next, error, complete) => {
      if (event === 'state_changed') {
        error(mockError);
      }
    });
    (uploadBytesResumable as jest.Mock).mockReturnValue({
      on: mockOn,
      snapshot: { ref: {} },
    });

    await expect(uploadDocument(mockFile)).rejects.toThrow(`Upload failed: ${mockError.message}`);
  });
});
