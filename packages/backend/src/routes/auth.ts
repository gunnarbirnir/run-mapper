import { Hono } from 'hono';
import { auth as firebaseAuth } from '../firebase/admin';
import { authMiddleware, type AuthContext } from '../middleware/auth';

const auth = new Hono();

auth.use('*', authMiddleware);

auth.get('/me', async (c: AuthContext) => {
  try {
    const userRecord = await firebaseAuth.getUser(c.user!.uid);

    return c.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        createdAt: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

export default auth;
