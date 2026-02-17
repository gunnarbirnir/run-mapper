import 'dotenv/config';
import admin from 'firebase-admin';

const requiredEnvVars = {
  ADMIN_PROJECT_ID: process.env.ADMIN_PROJECT_ID,
  ADMIN_CLIENT_EMAIL: process.env.ADMIN_CLIENT_EMAIL,
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
};

if (!admin.apps.length) {
  try {
    const hasServiceAccountEnv = Object.values(requiredEnvVars).every(Boolean);

    if (hasServiceAccountEnv) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: requiredEnvVars.ADMIN_PROJECT_ID!,
          clientEmail: requiredEnvVars.ADMIN_CLIENT_EMAIL!,
          privateKey: requiredEnvVars.ADMIN_PRIVATE_KEY!.replace(
            /\\n/g,
            '\n',
          ),
        }),
      });
    } else {
      // In Cloud Functions/Cloud Run this uses the runtime service account.
      admin.initializeApp();
    }
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

export const firebaseAdmin = admin;
export const auth = admin.auth();
export const db = admin.firestore();
