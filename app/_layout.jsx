<<<<<<< Updated upstream
import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native'; // Change from 'react-native-web' to 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';  // Correct import for stack navigator

import GarbageBinList from './GarbageBinList';
import Garbage from './Garbage';
import Locations from './Locations';
import Schedule from './Schedule';
import DriverPickupList from './Accept';
import LoginScreen from './LogInScreen';
import SignUpScreen from './SignUpScreen';

// Correct usage of createBottomTabNavigator and createStackNavigator from @react-navigation/stack
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tabs Layout
function TabsLayout() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Garbage" component={Garbage} />
            <Tab.Screen name="GarbageBinList" component={StackLayout} />
            <Tab.Screen name="Locations" component={Locations} />
            <Tab.Screen name="DriverPickupList" component={DriverPickupList} />
        </Tab.Navigator>
    );
}

// Stack Layout for Garbage Bin Lists and Schedule
function StackLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GarbageBins" component={GarbageBinList} options={{ headerShown: false }} />
            <Stack.Screen name="Schedule" component={Schedule} />
        </Stack.Navigator>
    );
}

// Stack Layout for Authentication (Login and SignUp)
function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

// Main Layout
const _layout = () => {
    return (
        <NavigationContainer independent={true}>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator>
                <Stack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{ headerShown: false }} // Hide header for auth screens
                />
                <Stack.Screen
                    name="Main"
                    component={TabsLayout}
                    options={{ headerShown: false }} // Hide header for main app screens
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default _layout;
=======
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable, ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/index'; // Adjust the import path
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  
  const navigation = useNavigation(); // Initialize navigation

  const handleUpload = async () => {
    if (!name || !description || !category || !sellerName || !address || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Save the data in Firestore
      await addDoc(collection(db, 'Products'), {
        name,
        description,
        category,
        sellerName,
        address,
        price: parseFloat(price), // Ensure price is stored as a number
      });

      Alert.alert('Success', 'Product uploaded successfully!');
      
      // Clear input fields
      setName('');
      setDescription('');
      setCategory('');
      setSellerName('');
      setAddress('');
      setPrice('');

      // Navigate to shop screen
      navigation.navigate('shop'); // Ensure the screen name matches the one in your navigator

    } catch (error) {
      console.error('Upload Error: ', error);
      Alert.alert('Error', 'Something went wrong during upload.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Product</Text>

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          placeholder="Enter Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          placeholder="Enter Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <Text style={styles.label}>Seller Name</Text>
        <TextInput
          placeholder="Enter Seller Name"
          value={sellerName}
          onChangeText={setSellerName}
          style={styles.input}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          placeholder="Enter Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Enter Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />

        <Pressable onPress={handleUpload} style={styles.button}>
          <Text style={styles.buttonText}>Upload</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 15,
    marginTop: 30, // Increased upper margin
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 15,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddProduct;
>>>>>>> Stashed changes
