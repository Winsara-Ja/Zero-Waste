import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext'; // Import your UserContext
import { useNavigation } from '@react-navigation/native';

const CurrentUserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useUser(); // Get userId from UserContext
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserDetails = async (uid) => {
            try {
                const userDocRef = doc(FIREBASE_DB, 'users', uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    console.log("User data found in Firestore:", userDoc.data());
                    setUserData(userDoc.data());
                } else {
                    console.log('No user document found in Firestore for UID:', uid);
                }
            } catch (error) {
                console.error('Error fetching user data from Firestore: ', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            console.log("Fetching user details for User ID:", userId);
            fetchUserDetails(userId); // Fetch user data if userId exists
        } else {
            console.log("No user is currently logged in");
            setLoading(false);
        }
    }, [userId]); // Dependency array includes userId

    const handleSignOut = async () => {
        try {
            // Assuming your signOut function is available in UserContext or similar
            await signOut(); // Call your sign-out function from context if necessary
            console.log("User signed out successfully.");
            navigation.navigate('Auth', { screen: 'LogInScreen' }); // Redirect to the Login screen
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!userData) {
        return <Text>No user data available. Please log in.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            {userData.profilePicture && (
                <Image
                    source={{ uri: userData.profilePicture }} // Assuming profilePicture is stored in Firestore
                    style={styles.profileImage}
                />
            )}
            <Text style={styles.itemText}>Name: {userData.name}</Text>
            <Text style={styles.itemText}>Email: {userData.email}</Text>
            <Button title="Sign Out" onPress={handleSignOut} color="#FF5733" />
            {/* Button to navigate to the Garbage screen */}
            <TouchableOpacity style={styles.navigateButton} onPress={() => navigation.navigate('Garbage')}>
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
