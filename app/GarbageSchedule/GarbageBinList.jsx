import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bins = [
    { id: '1', name: 'Bin 1', wasteType: 'Plastic', weight: '20 kg', wasteLevel: '50%' },
    { id: '2', name: 'Bin 2', wasteType: 'Organic', weight: '15 kg', wasteLevel: '80%' },
    { id: '3', name: 'Bin 3', wasteType: 'Metal', weight: '30 kg', wasteLevel: '60%' },
    { id: '4', name: 'Bin 4', wasteType: 'Paper', weight: '10 kg', wasteLevel: '40%' },
];

const GarbageBinList = () => {
    const navigation = useNavigation();

    const handleViewDetails = (bin) => {
        navigation.navigate('Schedule', { bin });
    };

    const renderBin = ({ item }) => (
        <SafeAreaView>
            <View style={styles.card}>
                <Text style={styles.binName}>{item.name}</Text>
                <Text style={styles.binDetails}>Waste Type: {item.wasteType}</Text>
                <Text style={styles.binDetails}>Weight: {item.weight}</Text>
                <Text style={styles.binDetails}>Waste Level: {item.wasteLevel}</Text>

                <TouchableOpacity style={styles.scheduleButton} onPress={() => handleViewDetails(item)}>
                    <Text style={styles.scheduleButtonText}>Schedule</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    return (
        <FlatList
            data={bins}
            renderItem={renderBin}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#f5f5f5', // Light background for the card
        padding: 16,
        marginVertical: 2,
        borderRadius: 12, // Rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4, // For Android shadow
    },
    binName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    binDetails: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    scheduleButton: {
        marginTop: 10,
        backgroundColor: '#008080', // Modern teal button color
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    scheduleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GarbageBinList;
