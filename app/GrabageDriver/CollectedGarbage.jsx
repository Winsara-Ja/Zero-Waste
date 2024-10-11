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
            <Text style={styles.itemText}>Pickup ID: <Text style={styles.itemValue}>{item.id}</Text></Text>
            <Text style={styles.itemText}>User Name: <Text style={styles.itemValue}>{item.user_name}</Text></Text>
            <Text style={styles.itemText}>Weight Collected: <Text style={styles.itemValue}>{item.weight}</Text></Text>
            <Text style={styles.itemText}>Pickup Time: <Text style={styles.itemValue}>{new Date(item.acceptedAt).toLocaleString()}</Text></Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#008080" />
            ) : (
                <FlatList
                    data={collectedGarbage}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>No collected garbage records found.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    itemContainer: {
        backgroundColor: '#f0f8f0',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    itemValue: {
        fontWeight: 'bold',
        color: '#008080',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
        marginTop: 20,
    },
});

export default CollectedGarbage;
