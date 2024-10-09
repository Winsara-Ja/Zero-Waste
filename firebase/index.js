// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD1N4Fen0fnSjoYpQWrecVrACX03IYm6Q",
  authDomain: "waste-1d9cd.firebaseapp.com",
  projectId: "waste-1d9cd",
  storageBucket: "waste-1d9cd.appspot.com",
  messagingSenderId: "37468775995",
  appId: "1:37468775995:web:ca2291566bad02f43bde1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Create a root reference
const storage = getStorage();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//export{app, db, getFirestore, collection, addDoc }
export { db };