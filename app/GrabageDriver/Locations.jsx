import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.78825, // Default latitude
        longitude: -122.4324, // Default longitude
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    // Fetch locations from Firestore
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const querySnapshot = await getDocs(collection(FIREBASE_DB, 'scheduledBins'));
                const locationData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Filter locations to include only pending bins
                const pendingLocations = locationData.filter(location => location.status === 'pending');

                if (pendingLocations.length > 0) {
                    setLocations(pendingLocations);

                    // Set initial region to the first pending location
                    setInitialRegion({
                        latitude: pendingLocations[0].latitude,
                        longitude: pendingLocations[0].longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                } else {
                    Alert.alert('No pending locations found', 'No pending bins to display on the map.');
                }
            } catch (error) {
                console.error('Error fetching locations: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                >
                    {locations.map((location) => (
                        <Marker
                            key={location.id}
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                        >
                            <Callout>
                                <View style={styles.callout}>
                                    <Text style={{ fontWeight: 'bold' }}>ID: {location.id}</Text>
                                    <Text style={{ fontWeight: 'bold' }}>Name: {location.user_name}</Text>
                                    <Text>Waste Type: {location.waste_type}</Text>
                                    <Text>Weight: {location.weight}</Text>
                                    <Text>Date: {new Date(location.timestamp).toLocaleDateString()}</Text>
                                    <Text>Time: {new Date(location.timestamp).toLocaleTimeString()}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    callout: {
        width: 200,
        borderRadius: 8,
    },
});

export default Locations;
