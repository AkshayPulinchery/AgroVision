'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Hardcoded configuration to ensure stability across environments
const firebaseConfig = {
  apiKey: "AIzaSyAs-demo-key-for-agriyield-ai",
  authDomain: "agriyield-ai.firebaseapp.com",
  projectId: "agriyield-ai",
  storageBucket: "agriyield-ai.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export { app, auth, firestore };
