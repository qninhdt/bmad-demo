import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadDocument from '../../../src/app/upload/page';
import * as DocumentUploadService from '../../../src/services/DocumentUploadService';

// Mock the DocumentUploadService
jest.mock('../../../src/services/DocumentUploadService', () => ({
  uploadDocument: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('UploadDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the upload form correctly', () => {
    render(<UploadDocument />);
    expect(screen.getByRole('heading', { name: /Upload PDF Document/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Document/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Document/i })).toBeDisabled();
  });

  it('enables the upload button when a file is selected', () => {
    render(<UploadDocument />);
    const fileInput = screen.getByLabelText(/choose file/i);
    const uploadButton = screen.getByRole('button', { name: /Upload Document/i });

    const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(screen.getByText(/Selected file: test.pdf/i)).toBeInTheDocument();
    expect(uploadButton).toBeEnabled();
  });

  it('displays upload progress and success message on successful upload', async () => {
    const mockUploadDocument = DocumentUploadService.uploadDocument as jest.Mock;
    mockUploadDocument.mockImplementation((file, onProgress) => {
      return new Promise((resolve) => {
        onProgress(50);
        onProgress(100);
        resolve('mock-download-url');
      });
    });

    render(<UploadDocument />);
    const fileInput = screen.getByLabelText(/choose file/i);
    const uploadButton = screen.getByRole('button', { name: /Upload Document/i });

    const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.click(uploadButton);

    expect(uploadButton).toBeDisabled();
    expect(screen.getByText(/Uploading \(100.00%\)/i)).toBeInTheDocument();

    await waitFor(async () => {
      expect(screen.getByText(/File uploaded successfully!/i)).toBeInTheDocument();
      const enabledButton = await screen.findByRole('button', { name: /Upload Document/i, enabled: true });
      expect(enabledButton).toBeInTheDocument();
    });
  });

  it('displays error message on upload failure', async () => {
    const mockUploadDocument = DocumentUploadService.uploadDocument as jest.Mock;
    mockUploadDocument.mockRejectedValue(new Error('Network error'));

    render(<UploadDocument />);
    const fileInput = screen.getByLabelText(/choose file/i);
    const uploadButton = screen.getByRole('button', { name: /Upload Document/i });

    const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/Upload failed: Network error/i)).toBeInTheDocument();
    });
    expect(uploadButton).toBeEnabled();
  });
});
