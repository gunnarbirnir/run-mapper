import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAuth } from '~/contexts/AuthContext';
import { Button, Form, Text } from '~/primitives';
import { PageLayout } from '~/components/PageLayout';

export const Route = createFileRoute('/auth/login')({
  component: Login,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
});

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate({ to: (redirect as string) || '/editor/runs' });
    } catch (err: unknown) {
      let errorMessage = 'Failed to sign in. Please check your credentials.';

      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
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
            Sign in
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
            {error && (
              <div className="text-error-600 mt-4 text-sm">{error}</div>
            )}
            <Button
              type="submit"
              isLoading={loading}
              className="mx-auto mt-8 block min-w-40"
            >
              Sign in
            </Button>
          </Form>
          <Text variant="subtle" className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Text element="a" to="/auth/signup">
              Sign up
            </Text>
          </Text>
        </div>
      </PageLayout.MainContent>
    </PageLayout>
  );
}
