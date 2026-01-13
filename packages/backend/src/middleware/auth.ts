import { Context, Next } from 'hono';
import { auth } from '../firebase/admin';

export interface AuthUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

export interface AuthContext extends Context {
  user?: AuthUser;
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Missing or invalid Authorization header',
        },
        401,
      );
    }

    const token = authHeader.substring(7);

    const decodedToken = await auth.verifyIdToken(token);
    const user = await auth.getUser(decodedToken.uid);

    (c as AuthContext).user = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    };

    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json(
      {
        success: false,
        error: 'Unauthorized',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to verify authentication token',
      },
      401,
    );
  }
};
