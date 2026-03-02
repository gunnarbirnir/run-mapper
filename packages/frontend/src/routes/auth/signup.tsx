import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAuth } from '~/contexts/AuthContext';
import { Button, Form, Text } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/auth/signup')({
  component: SignUp,
});

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      navigate({ to: '/editor/runs' });
    } catch (err: unknown) {
      let errorMessage = 'Failed to create account. Please try again.';

      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            errorMessage =
              'This email is already registered. Please sign in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage =
              'Email/Password authentication is not enabled. Please contact support.';
            break;
          case 'auth/weak-password':
            errorMessage =
              'Password is too weak. Please choose a stronger password.';
            break;
          default:
            errorMessage = firebaseError.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex-1 bg-white" />
      <PageLayout.MainContent className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <div className="mx-auto mb-12 max-w-md rounded-lg bg-gray-50 p-6 opacity-95 shadow-md">
          <Text element="h1" className="text-center">
            Sign Up
          </Text>
          <Form onSubmit={handleSubmit}>
            <Form.TextInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
            />
            <Form.TextInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
            />
            <Form.TextInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            {error && (
              <div className="text-error-600 mt-4 text-sm">{error}</div>
            )}
            <Button
              type="submit"
              isLoading={loading}
              className="mx-auto mt-8 block min-w-40"
            >
              Sign Up
            </Button>
          </Form>
          <Text variant="subtle" className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Text element="a" to="/auth/login">
              Sign in
            </Text>
          </Text>
        </div>
      </PageLayout.MainContent>
    </PageLayout>
  );
}
