import 'dotenv/config';
import admin from 'firebase-admin';

const requiredEnvVars = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

if (!admin.apps.length) {
  try {
    const hasServiceAccountEnv = Object.values(requiredEnvVars).every(Boolean);

    if (hasServiceAccountEnv) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: requiredEnvVars.FIREBASE_PROJECT_ID!,
          clientEmail: requiredEnvVars.FIREBASE_CLIENT_EMAIL!,
          privateKey: requiredEnvVars.FIREBASE_PRIVATE_KEY!.replace(
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
