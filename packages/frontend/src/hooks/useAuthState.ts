import { useMemo } from 'react';
import { useRouteContext } from '@tanstack/react-router';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth';

import { auth } from '~/firebase/config';

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
}

const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = async () => {
  await signOut(auth);
};

const getIdToken = async (forceRefresh = false) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  return currentUser.getIdToken(forceRefresh);
};

export const useAuthState = (): AuthState => {
  const context = useRouteContext({ from: '__root__' });

  return useMemo(
    () => ({
      ...context.auth,
      signIn,
      signUp,
      logOut,
      getIdToken,
    }),
    [context.auth],
  );
};
