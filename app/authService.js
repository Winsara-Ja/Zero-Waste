// authService.js
import { collection, doc, addDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { FIREBASE_DB } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const signUp = async (email, password, userInfo) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        const user = userCredential.user;

        // Save additional user info to Firestore
        await setDoc(doc(FIREBASE_DB, 'users', user.uid), {
            email: user.email,
            ...userInfo, // Spread additional user info here (e.g., name, phone, etc.)
        });

        return user; // Return the user object
    } catch (error) {
        throw new Error(error.message);
    }
};


export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        return userCredential.user; // Return the user object
    } catch (error) {
        throw new Error(error.message);
    }
};
