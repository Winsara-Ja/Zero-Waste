import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import { useUser } from '../UserContext';

const Garbage = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, userId } = useUser();

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

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(FIREBASE_DB, 'scheduledBins', id));
            setLocations(locations.filter(item => item.id !== id));
            Alert.alert('Garbage item deleted successfully!');
        } catch (error) {
            Alert.alert('Error deleting garbage item:', error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Bin ID: {item.bin_id}</Text>
            <Text style={styles.itemText}>Name: {user.name}</Text>
            <Text style={styles.itemText}>Type: {item.waste_type}</Text>
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
        backgroundColor: '#f0f4f7', // Light modern background
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderColor: '#dcdcdc',
        borderWidth: 1,
    },
    itemText: {
        fontSize: 16,
        color: '#333', // Softer text color
        marginBottom: 4,
        fontFamily: 'System',
    },
    completed: {
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#008080',
        marginTop: 10,
        paddingVertical: 6,
        borderRadius: 6,
        textAlign: 'center',
    },
    pending: {
        color: '#000',
        fontWeight: 'bold',
        backgroundColor: '#FFDC7F',
        marginTop: 10,
        paddingVertical: 6,
        borderRadius: 6,
        textAlign: 'center',
    },
    canceled: {
        color: '#dc3545',
        fontWeight: 'bold',
        backgroundColor: '#f8d7da',
        marginTop: 10,
        paddingVertical: 6,
        borderRadius: 6,
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff5252',
        paddingVertical: 6,
        paddingHorizontal: 6,
        marginTop: 12,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#ff5252',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Garbage;
