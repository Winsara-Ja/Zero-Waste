import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Import ProgressBar
import yourImage from '../../assets/images/step5.png'; // Adjust the path according to your project structure
import { FontAwesome } from '@expo/vector-icons'; // Import icon library for stars
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons for navigation
import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons for the home icon
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins'; // Import the font

const Step5 = ({ route, navigation }) => {
  const { selectedGarbage, steps } = route.params;

  // Step 5 out of 5 means 100% progress
  const progress = 5 / 5;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale is 0

  // Load the font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Fade in effect when the component mounts
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

      {/* Display the fifth instruction */}
      <Text style={styles.text}>Step 5: {steps[4]}</Text>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')} // Navigate back to home or any screen after the last step
      >
        <HomeIcon name="home" size={24} color="white" />
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>

      {/* Add Image here with scaling animation */}
      <Animated.Image
        source={yourImage} // Use the imported local image
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]} // Apply scale animation
        resizeMode="contain" // Adjust how the image is resized to fit the container
      />

      {/* Progress bar showing 100% progress for Step 5 */}
      <View style={styles.progressBarWrapper}>
        <ProgressBar progress={progress} color="green" style={styles.progressBar} />
      </View>

      {/* Display stars when the progress is complete */}
      <Text>Steps Completed</Text>

      {/* Button container to hold both buttons in a row */}
      <View style={styles.buttonContainer}>
        {/* Go Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Step4', { selectedGarbage, steps })} // Navigate to Step 4
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Go to Home Button with Home Icon */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('HomePage')} // Navigate back to home or any screen after the last step
        >
          <HomeIcon name="home" size={24} color="white" />
          <Text style={styles.homeButtonText}>Home</Text>
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
  text: {
    fontSize: 18,
    marginBottom: 20,
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
  starsContainer: {
    flexDirection: 'row', // Align stars in a row
    justifyContent: 'center', // Center the stars horizontally
    marginBottom: 20, // Add margin at the bottom
  },
  star: {
    marginHorizontal: 5, // Space between each star
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space out the buttons
    width: '100%', // Make the container full width
    paddingHorizontal: 20, // Horizontal padding for the container
    marginBottom: 0, // Space from the bottom of the screen
  },
  backButton: {
    width: 60, // Set a fixed width
    height: 60, // Set a fixed height to make it circular
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
    backgroundColor: 'green', // Button background color for back
    borderRadius: 30, // Half of width/height for a circular shape
  },
  homeButton: {
    flexDirection: 'row', // Arrange icon and text in a row
    alignItems: 'center', // Center icon and text vertically
    backgroundColor: 'green', // Button background color for home
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10, // Space between icon and text
    fontFamily: 'Poppins_600SemiBold', // Use Poppins semi-bold
    paddingTop: 4
  },
});

export default Step5;
