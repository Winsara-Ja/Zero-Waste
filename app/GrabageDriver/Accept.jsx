import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getPendingPickups, updatePickupStatus, saveAcceptedPickup } from '../firebaseService';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DriverPickupList = () => {
    const [pendingPickups, setPendingPickups] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPendingPickups = async () => {
            try {
                const pickups = await getPendingPickups();
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

    const goToPickups = () => {
        navigation.navigate('CollectedGarbage');
    };

    const handleAccept = async (pickup) => {
        try {
            await updatePickupStatus(pickup.id, 'accepted');
            await saveAcceptedPickup(pickup);
            Alert.alert('Pickup accepted!');
            setPendingPickups(pendingPickups.filter(item => item.id !== pickup.id));
        } catch (error) {
            Alert.alert('Error accepting pickup:', error.message);
        }
    };

    const handleReject = async (pickup) => {
        try {
            await updatePickupStatus(pickup.id, 'rejected');
            Alert.alert('Pickup rejected!');
            setPendingPickups(pendingPickups.filter(item => item.id !== pickup.id));
        } catch (error) {
            Alert.alert('Error rejecting pickup:', error.message);
        }
    };

    const renderPickup = ({ item }) => (
        <View style={styles.pickupContainer}>
            <Text style={styles.text}>ID: {item.id}</Text>
            <Text style={styles.text}>User Name: {item.user_name}</Text>
            <Text style={styles.text}>Bin Name: {item.name}</Text>
            <Text style={styles.text}>Waste Type: {item.waste_type}</Text>
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
        <SafeAreaView style={styles.container}>
            <FlatList
                data={pendingPickups}
                renderItem={renderPickup}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

            {/* Buttons in the same row */}
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={styles.smallButton} onPress={goToLocations}>
                    <Text style={styles.smallButtonText}>Go to Location</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={goToPickups}>
                    <Text style={styles.smallButtonText}>View all Pickups</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    listContainer: {
        padding: 16,
    },
    pickupContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 12,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    acceptButton: {
        padding: 10,
        backgroundColor: '#008080',
        borderRadius: 8,
        shadowColor: '#28a745',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    rejectButton: {
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 8,
        shadowColor: '#dc3545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    smallButton: {
        backgroundColor: '#6c757d', // Updated color
        padding: 10, // Smaller padding for a compact button
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#6c757d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 14, // Smaller text
        fontWeight: 'bold',
    },
    bottomButtonsContainer: {
        flexDirection: 'row', // Added to align buttons horizontally
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DriverPickupList;
