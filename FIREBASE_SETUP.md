# Firebase Integration Guide

## Current State

Firebase integration has been implemented with a **hybrid mode** that supports both:
- **Mock Authentication** (when Firebase credentials are not available)
- **Real Firebase Authentication** (when credentials are provided)

This allows the app to work fully without Firebase while being ready for immediate activation.

## Files Modified

### 1. `lib/firebase.ts`
- Uncommented and activated Firebase initialization
- Added error handling for missing credentials
- Exports `app`, `auth`, and `db` instances

### 2. `context/AuthContext.tsx`
- Updated to use Firebase Auth methods: `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged`
- Added `loading` state to track authentication initialization
- Implements auto-login via `onAuthStateChanged` listener
- Gracefully falls back to mock authentication when Firebase is not configured

### 3. `.env`
- Created with empty placeholders for Firebase configuration variables
- All variables use `EXPO_PUBLIC_` prefix for Expo to expose them to the app

### 4. `app/_layout.tsx`
- Added route protection based on authentication state
- Displays loading screen while authentication state is determined
- Auto-redirects authenticated users to `/dashboard`
- Auto-redirects unauthenticated users to `/` (login)

### 5. `app/dashboard.tsx`
- Updated `handleSignOut` to be async for Firebase sign-out

## Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "EasyToLearn" (or your preference)
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Set Up Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in methods**
2. Enable **Email/Password** provider
3. Go to **Users** tab (you can add test users here if needed)

### Step 3: Set Up Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Choose your region
4. Start in **Test Mode** (we'll secure it next)
5. Click "Enable"

### Step 4: Security Rules

Replace the database rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

### Step 5: Get Your Credentials

1. Go to Project Settings (⚙️ icon)
2. Click "Your apps" section
3. Click "Web" icon to add a web app
4. Copy your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};
```

### Step 6: Update `.env`

Fill in your `.env` file with the values from Step 5:

```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### Step 7: Restart the App

```bash
npm run web  # or ios/android
```

Firebase will now authenticate real users instead of using mock data.

## How It Works

### With Firebase Credentials

1. User enters email and password on login
2. `signInWithEmailAndPassword()` authenticates against Firebase Auth
3. If successful, user data is set in context
4. `onAuthStateChanged()` listener keeps user logged in across app restarts

### Without Firebase Credentials

1. User can log in with mock credentials:
   - **Morador**: morador@easy.com / 123456
   - **Comércio**: comercio@easy.com / 123456
2. Authentication happens in-memory
3. Data persists only during the current session

## Demo Test Accounts (Mock Mode)

```
Email: morador@easy.com
Password: 123456
Role: Morador (resident)

Email: comercio@easy.com
Password: 123456
Role: Comércio (business)
```

## Next Steps

1. Create Firebase project and follow setup instructions above
2. Implement user data persistence to Realtime Database in `AuthContext`
3. Add role-based security rules to protect sensitive data
4. Implement data migration tools for existing users
5. Add password reset functionality via Firebase

## Troubleshooting

### Firebase not initializing
- Check that `.env` file exists and contains valid credentials
- Clear Expo cache: `expo start --clear`
- Verify all 5 Firebase config variables are filled

### "Firebase initialization warning" in console
- This is normal when `.env` variables are empty
- It will disappear once valid credentials are provided

### Users not persisting between sessions
- Firebase Realtime Database needs to be set up
- User data structure needs to be defined in the database
- See "Data Persistence" section below for implementation

## Data Persistence (Phase 3)

To persist user data to Firebase Realtime Database, modify `AuthContext.tsx`:

```typescript
// After successful signUp or signIn
const db = getDatabase();
await set(ref(db, `users/${user.uid}`), userData);
```

This will save user profile data alongside Firebase Auth credentials.
