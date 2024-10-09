import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome for icons

const images = [
    require('../../assets/images/step1.png'),
    require('../../assets/images/step2.png'),
    require('../../assets/images/step5.png'),
];

const Home = () => {
    const router = useRouter(); // Initialize the router
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
    const fadeAnim = useRef(new Animated.Value(1)).current; // Animation value to control fade-in and fade-out

    useEffect(() => {
        const interval = setInterval(() => {
            // Start fade-out animation
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                // After fade-out, change image
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                // Start fade-in animation
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Clear interval on unmount
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Garbage Management System</Text>

            {/* Fading image */}
            <Animated.View style={{ opacity: fadeAnim }}>
                <Image 
                    source={images[currentImageIndex]} // Dynamically show the current image
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>

            <Text style={styles.subtitle}>Choose an option:</Text>
            
            {/* Navigation buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('../screens/MyComponent')} // Navigate to MyComponent
                >
                    <FontAwesome name="trash" size={24} color="white" />
                    <Text style={styles.buttonText}>Garbage Disposal Steps</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => { /* Navigate to recycling info */ }}
                >
                    <FontAwesome name="recycle" size={24} color="white" />
                    <Text style={styles.buttonText}>Recycling Information</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => { /* Navigate to report an issue */ }}
                >
                    <FontAwesome name="exclamation-circle" size={24} color="white" />
                    <Text style={styles.buttonText}>Report an Issue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f9fc', // Light background for better visibility
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'column', // Align buttons vertically
        width: '100%', // Make it full width
    },
    button: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green', // Button background color
        padding: 15,
        marginVertical: 10,
        borderRadius: 10, // Rounded corners for buttons
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10, // Space between icon and text
    },
});

export default Home;
