import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';

const CollectedGarbage = () => {
    const [collectedGarbage, setCollectedGarbage] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch collected garbage data from Firestore
    useEffect(() => {
        const fetchCollectedGarbage = async () => {
            try {
                const querySnapshot = await getDocs(collection(FIREBASE_DB, 'acceptedPickups'));
                const garbageData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (garbageData.length > 0) {
                    setCollectedGarbage(garbageData);
                } else {
                    console.log('No collected garbage found.');
                }
            } catch (error) {
                console.error('Error fetching collected garbage: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollectedGarbage();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Pickup ID: {item.id}</Text>
            <Text style={styles.itemText}>User Name: {item.user_name}</Text>
            <Text style={styles.itemText}>Weight Collected: {item.weight}</Text>
            <Text style={styles.itemText}>Pickup Time: {new Date(item.acceptedAt).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={collectedGarbage}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text>No collected garbage records found.</Text>}
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
});

export default CollectedGarbage;
