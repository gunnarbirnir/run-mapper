export const validateLoginForm = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!email) {
    return 'Email is required.';
  }
  if (!password) {
    return 'Password is required.';
  }
  return null;
};

export const parseLoginError = (error: unknown) => {
  let errorMessage = 'Failed to sign in. Please check your credentials.';

  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string; message?: string };
    switch (firebaseError.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid credentials.';
        break;
      // Log error here and handle more of them
    }
  }

  return errorMessage;
};
