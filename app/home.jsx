// Home.js

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const images = [
  require('../assets/images/step1.png'),
  require('../assets/images/step2.png'),
  require('../assets/images/step5.png'),
];

const Home = () => {
  const navigation = useNavigation();
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
          onPress={() => navigation.navigate('GarbageSort')}
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddStep')}
        >
          <FontAwesome name="plus" size={24} color="white" />
          <Text style={styles.buttonText}>Add Step</Text>
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
    flexDirection: 'column',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Home;
