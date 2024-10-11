// authService.js
import { collection, doc, addDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const signUp = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        const user = userCredential.user;

        // Store user info in Firestore
        await setDoc(doc(FIREBASE_DB, 'users', user.uid), {
            name: name,
            email: user.email,
        });

        return user;
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
