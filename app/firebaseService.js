// firebaseService.js
import { collection, doc, addDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebaseConfig';

export const storeUserLocation = async (latitude, longitude, bin_id, name, waste_type, waste_level, weight, status, user_name) => {
    try {
        await addDoc(collection(FIREBASE_DB, 'scheduledBins'), {
            latitude,
            longitude,
            bin_id,
            name,
            user_name,
            waste_type,
            waste_level,
            status,
            weight,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error saving location: ', error);
    }
};

// Get all pickups with 'pending' status
export const getPendingPickups = async () => {
    const pickupsCollection = collection(FIREBASE_DB, 'scheduledBins');
    const q = query(pickupsCollection, where('status', '==', 'pending')); // Fetch only pending pickups
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update the status of a pickup
export const updatePickupStatus = async (id, status) => {
    console.log(id);
    const binDoc = doc(FIREBASE_DB, 'scheduledBins', id);
    return updateDoc(binDoc, { status });
};

export const saveAcceptedPickup = async (pickup) => {
    try {
        const pickupDocRef = doc(FIREBASE_DB, 'acceptedPickups', pickup.id);
        await setDoc(pickupDocRef, {
            id: pickup.id,
            binId: pickup.bin_id, // Ensure this is defined
            weight: pickup.weight,
            acceptedAt: new Date().toISOString(),
            // ... spread any other necessary fields from pickup
        });
        console.log('Pickup accepted and saved successfully!');
    } catch (error) {
        console.error('Error saving accepted pickup:', error);
    }
};