import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; // Import font styles
import { createStackNavigator } from '@react-navigation/stack';
import GarbageNamePicker from './GarbageNamePicker'; // Adjust path
import { getDocs, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Adjust path
import { Link } from 'expo-router';
// Import Step Components
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import ChatApp from './chatApp'; // Import your new page component (ensure correct path)

const Stack = createStackNavigator();

const MyComponent = () => {
  const [selectedGarbage, setSelectedGarbage] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load the fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular, // Normal weight font
    Poppins_700Bold, // Bold weight font
  });

  useEffect(() => {
    const fetchSteps = async () => {
      if (selectedGarbage) {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(FIREBASE_DB, 'garbageSteps')); // Use FIREBASE_DB
          const selectedSteps = querySnapshot.docs
            .filter(doc => doc.data().garbageName === selectedGarbage)
            .map(doc => doc.data().instructions);

          // Set steps array for selected garbage
          if (selectedSteps.length > 0) {
            setSteps(selectedSteps[0]); // Fetch instructions array
          }
        } catch (error) {
          console.error('Error fetching steps: ', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSteps();
  }, [selectedGarbage]);

  // Show a loading screen until fonts are loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!selectedGarbage || steps.length === 0) {
    return (
      <View style={styles.container}>
        {/* Navigate to ChatApp when the GIF image is pressed */}
        <TouchableOpacity> 
          <Image
            source={require('../../assets/images/chat-bot.gif')} // Adjust path to your GIF
            style={styles.gifImage}
            accessibilityLabel="Chat bot image"
          />
          <Text style={styles.gifText}>Need help?</Text>
        </TouchableOpacity>

        {/* Add text in the top-left corner */}
        <Text style={styles.disposeText}>How To Dispose?</Text>
        <Image
          source={require('../../assets/images/recycle-bin.png')} // Replace with your image path
          style={styles.bin}
          accessibilityLabel="Garbage sorting illustration"
        />

        {/* Garbage Picker */}
        <GarbageNamePicker
          selectedGarbage={selectedGarbage}
          onGarbageChange={setSelectedGarbage}
          style={styles.selectBox} // Apply styles to the select box
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Image
            source={require('../../assets/images/garbageSort.jpg')} // Replace with your image path
            style={styles.bottomImage}
            accessibilityLabel="Garbage sorting illustration"
          />
        )}
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
    width: 130,
    height: 130,
    position: 'absolute',
    top: 150,
    right: -50,
  },
  disposeText: {
    position: 'absolute',
    top: 60,
    left: 10,
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold', // Add custom font
    letterSpacing: 1.2, // Add letter spacing
    textTransform: 'uppercase', // Transform text to uppercase
  },
  gifText: {
    fontSize: 20,
    color: 'black',
    position: 'absolute',
    top: 130, // Position it below the GIF image
    right: -30,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular', // Apply regular font
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
    marginStart: -60,
    resizeMode: 'contain',
  },
  bin: {
    width: 100,
    height: 100,
    marginTop: 50,
    marginHorizontal: 100,
  }
});

export default MyComponent;
