import { useRouter } from '@tanstack/react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

import { auth } from '~/firebase/config';

export const useAuthProvider = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      router.update({
        context: { auth: { user: firebaseUser, isLoaded: true } },
      });
      router.invalidate();
    });

    return unsubscribe;
  }, [router]);
};
