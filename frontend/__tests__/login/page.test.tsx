import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import LoginPage from '../../src/app/login/page';

// Mock Firebase and Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (onAuthStateChanged as jest.Mock).mockClear();
    (signInWithPopup as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the login button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Login with Google/i })).toBeInTheDocument();
  });

  it('calls signInWithPopup when login button is clicked', async () => {
    render(<LoginPage />);
    await userEvent.click(screen.getByRole('button', { name: /Login with Google/i }));
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });

  it('redirects to home page if user is already authenticated', () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce((auth, callback) => {
      callback({ uid: '123', email: 'test@example.com' }); // Simulate logged-in user
      return jest.fn();
    });
    render(<LoginPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('does not redirect if user is not authenticated', () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce((auth, callback) => {
      callback(null); // Simulate logged-out user
      return jest.fn();
    });
    render(<LoginPage />);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
