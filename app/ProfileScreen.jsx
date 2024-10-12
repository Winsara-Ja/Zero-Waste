import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext'; // Import your UserContext
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const headerImage = require('../assets/images/bg3.png');
const placeholderImage = require('../assets/images/man.png');

const CurrentUserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId, signOut } = useUser(); // Get userId from UserContext
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
            await signOut(); // Call your sign-out function from context if necessary
            Toast.show({
                text1: 'Sign Out Successful',
                text2: 'You have signed out successfully!',
                type: 'success',
            });
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
        <SafeAreaView style={styles.container}>
            <Image
                source={headerImage} // Add your top half image here
                style={styles.headerImage}
            />
            <View style={styles.profileContainer}>
                {userData.profilePicture ? (
                    <Image
                        source={{ uri: userData.profilePicture }} // Assuming profilePicture is stored in Firestore
                        style={styles.profileImage}
                    />
                ) : (
                    <Image
                        source={placeholderImage} // Placeholder image
                        style={styles.profileImage}
                    />
                )}
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>

                {/* Sign Out Button */}
                <TouchableOpacity style={styles.button1} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>

                {/* Navigate to Garbage Screen Button */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Garbage')}>
                    <Text style={styles.buttonText}>Go to Garbage</Text>
                </TouchableOpacity>
                <View style={styles.line} />
                {/* Navigate to Garbage Screen Button */}
                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('PickupList')}>
                    <Text style={styles.buttonText}>Garbage Driver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    headerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    line: {
        borderBottomColor: '#000000', // Line color
        borderBottomWidth: 2, // Line thickness
        marginVertical: 20, // Space around the line
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: -60, // Pull the image up to overlap the top image
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    email: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    button1: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        marginVertical: 10,
    },
    button2: {
        backgroundColor: 'gray',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#006769',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CurrentUserProfile;
