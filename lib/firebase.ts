import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:      process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:   process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId:       process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase if config is available
let app, auth, db;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

export { app, auth, db };
