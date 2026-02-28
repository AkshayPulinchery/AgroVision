
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyABuT2GCtu3GyDOKugh51iY9dhi15V6G4Q",
  authDomain: "studio-6018643022-dffb6.firebaseapp.com",
  projectId: "studio-6018643022-dffb6",
  storageBucket: "studio-6018643022-dffb6.appspot.com",
  messagingSenderId: "6018643022",
  appId: "1:6018643022:web:agriyieldai"
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
