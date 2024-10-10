// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAnO0NtbK2wyTD_4kHerELTtx06wPsd4O4",
    authDomain: "zero-waste-2ed6a.firebaseapp.com",
    projectId: "zero-waste-2ed6a",
    storageBucket: "zero-waste-2ed6a.appspot.com",
    messagingSenderId: "441813540462",
    appId: "1:441813540462:web:3d47eafe3b52708546d07f",
    measurementId: "G-6G43127MDD"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(firebaseApp);
export const FIREBASE_AUTH = getAuth(firebaseApp);
