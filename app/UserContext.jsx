import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null); // Changed setUseID to setUserId
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                    setUserId(currentUser.uid); // Set the user ID when user is authenticated
                } else {
                    console.log('No user document found');
                }
            } else {
                setUser(null);
                setUserId(null); // Reset user ID when no user is authenticated
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(FIREBASE_AUTH); // Call Firebase's signOut function
            console.log("User signed out successfully.");
            // Reset state here if needed
            setUser(null);
            setUserId(null);
        } catch (error) {
            console.error("Error signing out: ", error);
            throw error; // You may want to handle this in the calling component
        }
    };

    return (
        <UserContext.Provider value={{ user, userId, loading, signOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
