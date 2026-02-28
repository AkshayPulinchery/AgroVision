'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Note: These values are typically provided by the Firebase Console.
// For the purpose of this prototype, we're using placeholders that follow the expected format.
const firebaseConfig = {
  apiKey: "AIzaSyAgriYieldAI_Placeholder_Key_12345",
  authDomain: "agriyield-ai.firebaseapp.com",
  projectId: "agriyield-ai",
  storageBucket: "agriyield-ai.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:agriyieldai123456"
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
firestore = getFirestore(app);

export { app, auth, firestore };
