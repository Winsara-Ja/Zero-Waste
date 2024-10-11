import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const CurrentUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation(); // Get the navigation object

    useEffect(() => {
        const fetchUserDetails = async (uid) => {
            try {
                const userDocRef = doc(FIREBASE_DB, 'users', uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    console.log("User data found in Firestore:", userDoc.data());
                    setUser(userDoc.data());
                } else {
                    console.log('No user document found in Firestore for UID:', uid);
                }
            } catch (error) {
                console.error('Error fetching user data from Firestore: ', error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            if (currentUser) {
                console.log("Authenticated user UID:", currentUser.uid);
                fetchUserDetails(currentUser.uid);
            } else {
                console.log('No user is currently logged in');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const goToGarbage = () => {
        navigation.navigate('Garbage'); // Navigate to the Garbage screen
    };

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            console.log("User signed out successfully.");
            navigation.navigate('Auth', { screen: 'LogInScreen' }); // Redirect to the Login screen
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!user) {
        return <Text>No user data available. Please log in.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            {user.profilePicture && (
                <Image
                    source={{ uri: user.profilePicture }} // Assuming profilePicture is stored in Firestore
                    style={styles.profileImage}
                />
            )}
            <Text style={styles.itemText}>Name: {user.name}</Text>
            <Text style={styles.itemText}>Email: {user.email}</Text>
            <Button title="Sign Out" onPress={handleSignOut} color="#FF5733" />
            {/* Button to navigate to the Garbage screen */}
            <TouchableOpacity style={styles.navigateButton} onPress={goToGarbage}>
                <Text style={styles.navigateButtonText}>Go to Garbage</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center', // Center align items
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    itemText: {
        fontSize: 16,
        marginVertical: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Make the image circular
        marginBottom: 10,
    },
    navigateButton: {
        backgroundColor: '#56CCF2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 20,
    },
    navigateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CurrentUserProfile;
