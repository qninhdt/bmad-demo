import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DocumentList from '../../../src/app/documents/page';
import *as DocumentService from '../../../src/services/DocumentService';

// Mock Firebase modules
jest.mock('../../../src/lib/firebase', () => {
  const mockApp = {};
  const mockAuth = {};
  const mockStorage = {};
  return {
    app: mockApp,
    auth: mockAuth,
    storage: mockStorage,
  };
});

// Mock the DocumentService
jest.mock('../../../src/services/DocumentService', () => ({
  fetchDocuments: jest.fn(),
}));

describe('DocumentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (DocumentService.fetchDocuments as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolve
    render(<DocumentList />);
    expect(screen.getByText(/Loading documents.../i)).toBeInTheDocument();
  });

  it('renders documents when fetched successfully', async () => {
    const mockDocuments = [
      {
        id: '1',
        title: 'Test Document 1',
        storagePath: 'path/to/test1.pdf',
        owner_id: 'user1',
        created_at: '2023-01-01T10:00:00Z',
        updated_at: '2023-01-01T10:00:00Z',
      },
      {
        id: '2',
        title: 'Test Document 2',
        storagePath: 'path/to/test2.pdf',
        owner_id: 'user1',
        created_at: '2023-01-02T11:00:00Z',
        updated_at: '2023-01-02T11:00:00Z',
      },
    ];
    (DocumentService.fetchDocuments as jest.Mock).mockResolvedValueOnce(mockDocuments);

    render(<DocumentList />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /My Documents/i })).toBeInTheDocument();
      expect(screen.getByText(/Test Document 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Document 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Uploaded: 1\/1\/2023/i)).toBeInTheDocument();
      expect(screen.getByText(/Uploaded: 1\/2\/2023/i)).toBeInTheDocument();
    });
  });

  it('renders no documents message when no documents are available', async () => {
    (DocumentService.fetchDocuments as jest.Mock).mockResolvedValueOnce([]);

    render(<DocumentList />);

    await waitFor(() => {
      expect(screen.getByText(/No documents uploaded yet./i)).toBeInTheDocument();
    });
  });

  it('renders error message when fetching documents fails', async () => {
    (DocumentService.fetchDocuments as jest.Mock).mockRejectedValueOnce(new Error('Failed to load documents'));

    render(<DocumentList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to load documents/i)).toBeInTheDocument();
    });
  });
});
