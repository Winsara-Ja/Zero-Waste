import React, { useState, useEffect } from 'react';
import { View, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FIREBASE_AUTH } from '../firebaseConfig'; // Adjust import path based on your file structure
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { storeUserLocation } from './firebaseService'; // Import the new location storing function
import { useUser } from './UserContext';

const Schedule = () => {

    const { user, loading } = useUser();

    const route = useRoute();
    // const { bin } = route.params;
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825, // Default latitude
        longitude: -122.4324, // Default longitude
        latitudeDelta: 0.001,
        longitudeDelta: 0.01,
    });

    const status = 'pending';
    const bin = route?.params?.bin || { name: 'Unknown', wasteType: 'Unknown', weight: 'Unknown', wasteLevel: 'Unknown' };
    // Request location permission and get current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            if (currentLocation) {
                const { latitude, longitude } = currentLocation.coords;

                // Set the map region to the current location
                setMapRegion({
                    ...mapRegion,
                    latitude,
                    longitude,
                });
            }
        })();
    }, []);

    const getCurrentLocation = async () => {
        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            if (currentLocation) {
                const { latitude, longitude } = currentLocation.coords;

                // Update map region to current location
                setMapRegion({
                    ...mapRegion,
                    latitude,
                    longitude,
                });

                // Store location in Firestore
                await storeUserLocation(latitude, longitude, bin.id, bin.name, bin.wasteType, bin.weight, bin.wasteLevel, status, user.name);
                Alert.alert('Your Garbage has been scheduled for Pickup');
            }
        } catch (error) {
            Alert.alert('Error fetching location:', error.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    {location && (
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="Your Location"
                            description="This is where you are currently located"
                        />
                    )}
                </MapView>
            </View>
            {/* Top 50% for information */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Garbage Pickup Scheduler</Text>
                <View className="p-4">
                    <Text className="text-xl font-bold mb-4">{bin.name}</Text>
                    <Text className="text-md">Waste Type: {bin.wasteType}</Text>
                    <Text className="text-md">Weight: {bin.weight}</Text>
                    <Text className="text-md">Waste Level: {bin.wasteLevel}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.pickupButton} onPress={getCurrentLocation}>
                        <Text style={styles.buttonText}>Schedule for Pickup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        flex: 2, // Take up 50% of the screen
        padding: 20,
        backgroundColor: '#ECDFCC',
        justifyContent: 'center',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        flex: 3, // Take up the remaining 50% of the screen
    },
    map: {
        flex: 1,
    },
    pickupButton: {
        padding: 10,
        backgroundColor: '#697565', // Set your desired button color here
        borderRadius: 5, // Optional: add border radius for rounded corners
    },
    buttonText: {
        color: 'white', // Set the text color
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Schedule;
