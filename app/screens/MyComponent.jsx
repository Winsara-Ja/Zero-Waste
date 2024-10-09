import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import GarbageNamePicker from '../components/GarbageNamePicker'; // Adjust path
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/index'; // Adjust path

// Import Step Components
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import ChatApp from './chatApp'; // Import your new page component (ensure correct path)

const Stack = createStackNavigator();

const MyComponent = ({ navigation }) => {
  const [selectedGarbage, setSelectedGarbage] = useState('');
  const [steps, setSteps] = useState([]);

  // Fetch the steps related to the selected garbage
  useEffect(() => {
    const fetchSteps = async () => {
      if (selectedGarbage) {
        try {
          const querySnapshot = await getDocs(collection(db, 'garbageSteps'));
          const selectedSteps = querySnapshot.docs
            .filter(doc => doc.data().garbageName === selectedGarbage)
            .map(doc => doc.data().instructions);

          // Set steps array for selected garbage
          if (selectedSteps.length > 0) {
            setSteps(selectedSteps[0]); // Fetch instructions array
          }
        } catch (error) {
          console.error('Error fetching steps: ', error);
        }
      }
    };

    fetchSteps();
  }, [selectedGarbage]);

  if (!selectedGarbage || steps.length === 0) {
    return (
      <View style={styles.container}>
        {/* Navigate to ChatApp when the GIF image is pressed */}
        <TouchableOpacity onPress={() => navigation.navigate('chatApp')}>
          <Image
            source={require('../../assets/images/chat-bot.gif')} // Adjust path to your GIF
            style={styles.gifImage}
          />
        </TouchableOpacity>

        {/* Garbage Picker */}
        <GarbageNamePicker
          selectedGarbage={selectedGarbage}
          onGarbageChange={setSelectedGarbage}
          style={styles.selectBox} // Apply styles to the select box
        />

        {/* Add an Image under the select box */}
        <Image
          source={require('../../assets/images/garbageSort.jpg')} // Replace with your image path
          style={styles.bottomImage}
        />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Step1">
      <Stack.Screen
        name="Step1"
        component={Step1}
        initialParams={{ selectedGarbage, steps }}
      />
      <Stack.Screen
        name="Step2"
        component={Step2}
        initialParams={{ selectedGarbage, steps }}
      />
      <Stack.Screen
        name="Step3"
        component={Step3}
        initialParams={{ selectedGarbage, steps }}
      />
      <Stack.Screen
        name="Step4"
        component={Step4}
        initialParams={{ selectedGarbage, steps }}
      />
      <Stack.Screen
        name="Step5"
        component={Step5}
        initialParams={{ selectedGarbage, steps }}
      />
     <Stack.Screen name="chatApp" component={ChatApp} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: 'white',
    position: 'relative',
  },
  gifImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: -40,
    right: -50,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
  selectBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 20,
    borderColor: 'black',
  },
  bottomImage: {
    width: '135%',
    height: 300, // Adjust image size as needed
    marginTop: 20,
    marginStart:-60,
    resizeMode: 'contain',
  },
});

export default MyComponent;
