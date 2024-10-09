import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/index'; // Adjust the import path
import { useFonts } from 'expo-font'; // Import useFonts
import { Poppins_400Regular } from '@expo-google-fonts/poppins'; // Import the font

const GarbageNamePicker = ({ selectedGarbage, onGarbageChange }) => {
  const [garbageNames, setGarbageNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Load the font
  let [fontsLoaded] = useFonts({
    Poppins_400Regular, // Load Poppins Regular
  });

  useEffect(() => {
    const fetchGarbageNames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garbageSteps'));
        const namesArray = querySnapshot.docs.map(doc => doc.data().garbageName);
        setGarbageNames(namesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchGarbageNames();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSelect = (item) => {
    onGarbageChange(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Garbage Name:</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedValue}>
          {selectedGarbage || 'Select a garbage type'}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying garbage names */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={garbageNames}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={styles.item}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    paddingTop: 300,
    marginBottom: 50,
    width:320,
    marginStart:-20
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular', // Use Poppins font for the label
    marginStart:10
  },
  picker: {
    height: 50,
    width: '120%',
    borderWidth: 2,            // Add border width
    borderColor: 'black',      // Set border color to black
    borderRadius: 20,          // Set border radius
    paddingHorizontal: 10,     // Add horizontal padding
    backgroundColor: 'green',
    justifyContent: 'center',   // Center the text vertically
  },
  selectedValue: {
    fontFamily: 'Poppins_400Regular', // Use Poppins font for selected value
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto',
  },
  item: {
    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontFamily: 'Poppins_400Regular', // Use Poppins font for items
  },
  closeButton: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular', // Use Poppins font for close button
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GarbageNamePicker;
