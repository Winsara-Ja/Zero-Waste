import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebaseConfig';

const Garbage = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch locations from Firestore
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const querySnapshot = await getDocs(collection(FIREBASE_DB, 'scheduledBins'));
                const locationData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLocations(locationData);
            } catch (error) {
                console.error('Error fetching locations: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);


    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Bin ID: {item.bin_id}</Text>
            <Text style={styles.itemText}>Name: {item.Name}</Text>
            <Text style={styles.itemText}>Type: {item.Type}</Text>
            <Text style={styles.itemText}>Weight: {item.weight}Kg</Text>
            <Text style={styles.itemText}>Date: {new Date(item.timestamp).toLocaleDateString()}</Text>
            <Text style={styles.itemText}>Time: {new Date(item.timestamp).toLocaleTimeString()}</Text>

            {item.status === 'accepted' ? (
                <Text style={styles.completed}>{item.status}</Text>
            ) : item.status === 'pending' ? (
                <Text style={styles.pending}>{item.status}</Text>
            ) : (
                <Text style={styles.canceled}>{item.status}</Text>
            )}

        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={locations}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text>No locations saved yet.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 1,
    },
    itemText: {
        fontSize: 16,
    },
    completed: {
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'lightgreen',
        marginTop: 5,
        padding: 5,
        borderRadius: 5,
        textAlign: 'center',
    },
    pending: {
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'yellow',
        marginTop: 5,
        padding: 5,
        borderRadius: 5,
        textAlign: 'center',
    },

    canceled: {
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'red',
        marginTop: 5,
        padding: 5,
        borderRadius: 5,
        textAlign: 'center',
    },
});

export default Garbage;

