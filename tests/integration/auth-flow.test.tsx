import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { getSession } from '@/lib/storage';
import { signUp } from '@/lib/auth';

describe('auth flow', () => {
  beforeEach(() => localStorage.clear());

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);

    await userEvent.type(
      screen.getByTestId('auth-signup-email'),
      'newuser@test.com'
    );
    await userEvent.type(
      screen.getByTestId('auth-signup-password'),
      'Password1'
    );
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('newuser@test.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    signUp('existing@test.com', 'Password1');

    render(<SignupForm />);
    await userEvent.type(
      screen.getByTestId('auth-signup-email'),
      'existing@test.com'
    );
    await userEvent.type(
      screen.getByTestId('auth-signup-password'),
      'Password1'
    );
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'User already exists'
      );
    });
  });

  it('submits the login form and stores the active session', async () => {
    signUp('loginuser@test.com', 'Password1');
    localStorage.setItem('habit-tracker-session', JSON.stringify(null));

    render(<LoginForm />);
    await userEvent.type(
      screen.getByTestId('auth-login-email'),
      'loginuser@test.com'
    );
    await userEvent.type(
      screen.getByTestId('auth-login-password'),
      'Password1'
    );
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe('loginuser@test.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    await userEvent.type(
      screen.getByTestId('auth-login-email'),
      'nobody@test.com'
    );
    await userEvent.type(
      screen.getByTestId('auth-login-password'),
      'WrongPass1'
    );
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid email or password'
      );
    });
  });
});
