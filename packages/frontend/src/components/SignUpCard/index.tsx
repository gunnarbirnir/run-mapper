import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useAuthState } from '~/hooks/useAuthState';
import { Button, Form, Text } from '~/primitives';

import { parseSignUpError, validateSignUpForm } from './utils';

export function SignUpCard() {
  const { signUp } = useAuthState();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateSignUpForm({ password, confirmPassword });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      navigate({ to: '/runs' });
    } catch (err: unknown) {
      setError(parseSignUpError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-12 max-w-md rounded-lg bg-gray-50/95 p-6 shadow-md">
      <Text element="h1" className="text-center">
        Sign up
      </Text>
      <Form onSubmit={handleSubmit} className="space-y-5">
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
        {error && <div className="text-error-600 mt-4 text-sm">{error}</div>}
        <Button
          type="submit"
          isLoading={loading}
          className="mx-auto mt-8 min-w-40"
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
  );
}
