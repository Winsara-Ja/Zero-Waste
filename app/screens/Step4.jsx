import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Import ProgressBar
import yourImage from '../../assets/images/step1.png'; // Adjust the path according to your project structure
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'; // Import the font

const Step4 = ({ route, navigation }) => {
  const { selectedGarbage, steps } = route.params;

  // Step 4 out of 5 means 80% progress
  const progress = 4 / 5;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale is 0

  // Load the font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Fade in effect and scale effect when the component mounts
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to full opacity
      duration: 500, // Duration of the fade effect
      useNativeDriver: true, // Use native driver for performance
    }).start();

    // Scale animation for the image
    Animated.timing(scaleAnim, {
      toValue: 1, // Scale to full size
      duration: 500, // Duration of the scale effect
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, [fadeAnim, scaleAnim]);

  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Garbage: {selectedGarbage}</Text>

      {/* Display the fourth instruction */}
      <Text style={styles.stepText}>Step 4:</Text>
      <Text style={styles.instruction}>{steps[3]}</Text>

      {/* Add Image here with scaling animation */}
      <Animated.Image
        source={yourImage} // Use the imported local image
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]} // Apply scale animation
        resizeMode="contain" // Adjust how the image is resized to fit the container
      />

      {/* Progress bar wrapped in a view for rounded corners */}
      <View style={styles.progressBarWrapper}>
        <ProgressBar progress={progress} color="green" style={styles.progressBar} />
      </View>

      {/* Button container to hold both buttons in a row */}
      <View style={styles.buttonContainer}>
        {/* Previous Step Button */}
        <TouchableOpacity 
          style={styles.prevButton}
          onPress={() => navigation.navigate('Step3', { selectedGarbage, steps })} // Navigate to Step 3
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Next Step Button with Right Arrow */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate('Step5', { selectedGarbage, steps })}
        >
          <Icon name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Use space-between to push content to the top and bottom
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20, // Add padding to avoid content touching edges
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Poppins_600SemiBold', // Use Poppins semi-bold
  },
  stepText: {
    fontSize: 26,
    marginBottom: 10,
    fontFamily: 'Poppins_600SemiBold', // Use Poppins semi-bold
  },
  instruction: {
    textAlign: 'center', // Center text for better readability
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular', // Use Poppins regular
  },
  image: {
    width: '100%', // Adjust width according to your layout
    height: 400, // Adjust height as needed
    marginVertical: -10, // Space around the image
  },
  progressBarWrapper: {
    width: '80%',
    backgroundColor: 'white', // Adding background color for visibility
    padding: 5, // Padding to make sure the bar is not squeezed
    marginTop: 20,
    borderRadius: 100, // Border radius for rounded corners
    overflow: 'hidden', // Ensure the progress bar stays within the rounded corners
  },
  progressBar: {
    height: 10,
    borderRadius: 100, // Additional border radius for the progress bar
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space out the buttons
    width: '100%', // Make the container full width
    paddingHorizontal: 20, // Horizontal padding for the container
    marginBottom: 0, // Space from the bottom of the screen
  },
  prevButton: {
    width: 60, // Set a fixed width
    height: 60, // Set a fixed height to make it circular
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
    backgroundColor: 'green', // Button background color for previous
    borderRadius: 30, // Half of width/height for a circular shape
  },
  nextButton: {
    width: 60, // Set a fixed width
    height: 60, // Set a fixed height to make it circular
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
    backgroundColor: 'green', // Button background color for next
    borderRadius: 30, // Half of width/height for a circular shape
  },
});

export default Step4;
