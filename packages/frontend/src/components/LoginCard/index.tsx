import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { useAuthState } from '~/hooks/useAuthState';
import { Button, Form, Text } from '~/primitives';

import { parseLoginError, validateLoginForm } from './utils';

export const LoginCard = () => {
  const { signIn } = useAuthState();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/auth/login' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateLoginForm({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      navigate({ to: redirect ?? '/runs' });
    } catch (err: unknown) {
      setError(parseLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-12 max-w-md rounded-lg bg-gray-50/95 p-6 shadow-md">
      <Text element="h1" className="text-center">
        Sign in
      </Text>
      <Form onSubmit={handleSubmit} className="space-y-6">
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
        {error && <div className="text-error-600 mt-4 text-sm">{error}</div>}
        <Button
          type="submit"
          isLoading={loading}
          className="mx-auto mt-8 min-w-40"
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
  );
};
