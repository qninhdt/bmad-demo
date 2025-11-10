import { fetchDocuments } from '../../src/services/DocumentService';
import { getAuth } from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth', () => {
  const mockGetIdToken = jest.fn(() => Promise.resolve('mock-id-token'));
  const mockCurrentUser = {
    getIdToken: mockGetIdToken,
  };
  const mockGetAuth = jest.fn(() => ({
    currentUser: mockCurrentUser,
  }));
  return {
    getAuth: mockGetAuth,
  };
});

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('DocumentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch documents successfully', async () => {
    const mockDocuments = [
      {
        id: '1',
        title: 'Doc 1',
        storagePath: 'path/to/doc1.pdf',
        owner_id: 'user1',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
      {
        id: '2',
        title: 'Doc 2',
        storagePath: 'path/to/doc2.pdf',
        owner_id: 'user1',
        created_at: '2023-01-02',
        updated_at: '2023-01-02',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockDocuments),
    });

    const documents = await fetchDocuments();

    expect(getAuth().currentUser?.getIdToken).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/documents',
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer mock-id-token',
          'Content-Type': 'application/json',
        },
      }),
    );
    expect(documents).toEqual(mockDocuments);
  });

  it('should throw an error if user is not authenticated', async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({
      currentUser: null,
    });

    await expect(fetchDocuments()).rejects.toThrow('User not authenticated.');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should throw an error if fetching documents fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Failed to retrieve documents' }),
    });

    await expect(fetchDocuments()).rejects.toThrow('Failed to retrieve documents');
    expect(getAuth().currentUser?.getIdToken).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/documents',
      expect.any(Object),
    );
  });
});