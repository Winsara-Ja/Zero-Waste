import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { storeUserLocation } from '../firebaseService'; // Adjust path as needed
import { useUser } from '../UserContext';

const Schedule = () => {
    const { user, userId } = useUser();
    const route = useRoute();
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.001,
        longitudeDelta: 0.01,
    });
    const [modalVisible, setModalVisible] = useState(false); // For showing the custom modal

    const status = 'pending';
    const bin = route?.params?.bin || { name: 'Unknown', wasteType: 'Unknown', weight: 'Unknown', wasteLevel: 'Unknown' };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showAlert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            if (currentLocation) {
                const { latitude, longitude } = currentLocation.coords;
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

                setMapRegion({
                    ...mapRegion,
                    latitude,
                    longitude,
                });

                await storeUserLocation(latitude, longitude, bin.id, bin.name, bin.wasteType, bin.weight, bin.wasteLevel, status, user.name, userId);
                setModalVisible(true); // Show custom modal instead of alert
            }
        } catch (error) {
            showAlert('Error', error.message);
        }
    };

    const showAlert = (title, message) => {
        setModalVisible(true); // Show custom modal for both success and error alerts
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

            <View style={styles.infoContainer}>
                <Text style={styles.title}>Garbage Pickup Scheduler</Text>
                <View style={styles.binDetails}>
                    <Text style={styles.binName}>{bin.name}</Text>
                    <Text style={styles.binInfo}>Waste Type: {bin.wasteType}</Text>
                    <Text style={styles.binInfo}>Weight: {bin.weight}</Text>
                    <Text style={styles.binInfo}>Waste Level: {bin.wasteLevel}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.pickupButton} onPress={getCurrentLocation}>
                        <Text style={styles.buttonText}>Schedule Pickup</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Custom Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Success!</Text>
                        <Text style={styles.modalMessage}>Your garbage has been scheduled for pickup.</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 3,
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        flex: 2,
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'center',
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        color: '#008080',
        marginBottom: 10,
    },
    binDetails: {
        marginVertical: 15,
    },
    binName: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
        textAlign: 'center',
        color: '#333',
    },
    binInfo: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    pickupButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#008080',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#008080',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    closeButton: {
        backgroundColor: '#008080',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Schedule;
