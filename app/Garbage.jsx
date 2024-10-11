import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import { FIREBASE_DB } from '../firebaseConfig';
import { useUser } from './UserContext';

const Garbage = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, userId } = useUser();

    // Fetch locations from Firestore
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const querySnapshot = await getDocs(collection(FIREBASE_DB, 'scheduledBins'));
                const locationData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const filteredData = user ? locationData.filter(item => item.userId === userId) : [];

                if (filteredData.length > 0) {
                    setLocations(filteredData);
                } else {
                    console.log('No collected garbage found for the current user.');
                }
            } catch (error) {
                console.error('Error fetching locations: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Function to handle deleting a garbage item by its document ID
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(FIREBASE_DB, 'scheduledBins', id)); // Delete the document from Firestore
            setLocations(locations.filter(item => item.id !== id)); // Update the UI after deletion
            Alert.alert('Garbage item deleted successfully!');
        } catch (error) {
            Alert.alert('Error deleting garbage item:', error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Bin ID: {item.bin_id}</Text>
            <Text style={styles.itemText}>Name: {user.name}</Text>
            <Text style={styles.itemText}>Type: {item.Type}</Text>
            <Text style={styles.itemText}>Weight: {item.weight}</Text>
            <Text style={styles.itemText}>Date: {new Date(item.timestamp).toLocaleDateString()}</Text>
            <Text style={styles.itemText}>Time: {new Date(item.timestamp).toLocaleTimeString()}</Text>

            {item.status === 'accepted' ? (
                <Text style={styles.completed}>{item.status}</Text>
            ) : item.status === 'pending' ? (
                <Text style={styles.pending}>{item.status}</Text>
            ) : (
                <Text style={styles.canceled}>{item.status}</Text>
            )}

            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
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
    deleteButton: {
        backgroundColor: '#ff5252',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Garbage;