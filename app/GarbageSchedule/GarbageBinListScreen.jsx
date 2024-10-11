import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming react-navigation is set up
import { SafeAreaView } from 'react-native-safe-area-context';

const bins = [
    { id: '1', name: 'Bin 1', wasteType: 'Plastic', weight: '20 kg', wasteLevel: '50%' },
    { id: '2', name: 'Bin 2', wasteType: 'Organic', weight: '15 kg', wasteLevel: '80%' },
    { id: '3', name: 'Bin 3', wasteType: 'Metal', weight: '30 kg', wasteLevel: '60%' },
    { id: '4', name: 'Bin 4', wasteType: 'Paper', weight: '10 kg', wasteLevel: '40%' },
];

const GarbageBinList = () => {
    const navigation = useNavigation();

    // Function to navigate to details page
    const handleViewDetails = (bin) => {
        navigation.navigate('Schedule', { bin });
    };

    const renderBin = ({ item }) => (
        <SafeAreaView>
            <View className="p-4 bg-gray-200 rounded-lg m-2">
                <Text className="font-bold">Name: {item.name}</Text>
                <Text>Waste Type: {item.wasteType}</Text>
                <Text>Weight: {item.weight}</Text>
                <Text>Waste Level: {item.wasteLevel}</Text>

                <TouchableOpacity className="bg-green-500 rounded-md mt-2" onPress={() => handleViewDetails(item)}>
                    <Text className="text-white text-center p-2">Schedule</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    return (
        <FlatList
            data={bins}
            renderItem={renderBin}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

export default GarbageBinList;
