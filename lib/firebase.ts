// Fase 2 — substituir mock por Firebase real
// npm install firebase  →  depois preencher .env com as chaves do console

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   apiKey:      process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain:  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
//   projectId:   process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   appId:       process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// };

// export const app  = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db   = getDatabase(app);

export const FIREBASE_PENDING = true;
