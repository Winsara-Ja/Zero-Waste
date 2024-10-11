import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getPendingPickups, updatePickupStatus, saveAcceptedPickup } from './firebaseService'; // Functions for interacting with Firestore
import { useNavigation } from '@react-navigation/native';

const DriverPickupList = () => {
    const [pendingPickups, setPendingPickups] = useState([]);
    const navigation = useNavigation();

    // Fetch pending pickups from Firebase
    useEffect(() => {
        const fetchPendingPickups = async () => {
            try {
                const pickups = await getPendingPickups(); // Fetch only pickups with 'pending' status
                setPendingPickups(pickups);
            } catch (error) {
                console.error('Error fetching pending pickups:', error);
            }
        };

        fetchPendingPickups();
    }, []);

    const goToLocations = () => {
        navigation.navigate('Locations');
    };

    // Handle accept action
    const handleAccept = async (pickup) => {
        try {
            await updatePickupStatus(pickup.id, 'accepted');
            await saveAcceptedPickup(pickup); // Save the accepted pickup to a new collection
            Alert.alert('Pickup accepted!');
            setPendingPickups(pendingPickups.filter(item => item.id !== pickup.id)); // Remove the accepted pickup from the list
        } catch (error) {
            Alert.alert('Error accepting pickup:', error.message);
        }
    };

    // Handle reject action
    const handleReject = async (pickup) => {
        try {
            await updatePickupStatus(pickup.id, 'rejected');
            Alert.alert('Pickup rejected!');
            setPendingPickups(pendingPickups.filter(item => item.id !== pickup.id)); // Remove the rejected pickup from the list
        } catch (error) {
            Alert.alert('Error rejecting pickup:', error.message);
        }
    };

    const renderPickup = ({ item }) => (
        <View style={styles.pickupContainer}>
            <Text style={styles.text}>ID: {item.id}</Text>
            <Text style={styles.text}>User Name: {item.user_name}</Text>
            <Text style={styles.text}>Bin Name: {item.name}</Text>
            <Text style={styles.text}>Waste Type: {item.wasteType}</Text>
            <Text style={styles.text}>Weight: {item.weight}</Text>
            <Text style={styles.text}>Waste Level: {item.wasteLevel}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item)}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <View>
                <TouchableOpacity style={styles.navigateButton} onPress={goToLocations}>
                    <Text style={styles.navigateButtonText}>Go to Garbage</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={pendingPickups}
                renderItem={renderPickup}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    pickupContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 1,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acceptButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    rejectButton: {
        padding: 10,
        backgroundColor: '#F44336',
        borderRadius: 5,
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
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default DriverPickupList;
