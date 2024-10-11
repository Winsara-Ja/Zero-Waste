import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native'; // Use useNavigation from react-navigation
import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome for icons

const images = [
    require('../assets/images/step1.png'),
    require('../assets/images/step2.png'),
    require('../assets/images/step5.png'),
];

const Home = () => {
    const navigation = useNavigation(); // Use useNavigation for navigation
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {  
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>

            <Animated.View style={{ opacity: fadeAnim }}>
                <Image 
                    source={images[currentImageIndex]} 
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>

            <Text style={styles.subtitle}>Choose an option:</Text>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('GarbageSort' )} 
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

                {/* New Button to navigate to AddStep */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('AddStep' )} // Navigate to AddStep
                >
                    <FontAwesome name="plus" size={24} color="white" />
                    <Text style={styles.buttonText}>Add Step</Text>
                </TouchableOpacity>

                {/* New Button to navigate to Questions */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('Questions')} // Navigate to Questions
                >
                    <FontAwesome name="question-circle" size={24} color="white" />
                    <Text style={styles.buttonText}>Q/A & Tips</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles remain unchanged
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
