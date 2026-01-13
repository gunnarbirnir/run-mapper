import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Form, Text } from '~/primitives';

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
      navigate({ to: '/runs' });
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
    <div className="mx-auto mt-12 max-w-md">
      <Text element="h1" className="mb-6">
        Sign Up
      </Text>
      <Form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </Form>
      <div className="mt-4 text-center">
        <Text>
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </Text>
      </div>
    </div>
  );
}
