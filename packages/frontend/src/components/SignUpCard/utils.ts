export const validateSignUpForm = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
};

export const parseSignUpError = (error: unknown) => {
  let errorMessage = 'Failed to create account. Please try again.';

  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string; message?: string };
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
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};
