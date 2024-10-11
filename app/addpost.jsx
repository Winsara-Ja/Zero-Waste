import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/index'; // Adjust the import path
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // To store the selected image

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true, // Add base64 to get image data
    });

    if (!result.canceled) { // Adjusted for correct property usage
      setImage(result.base64); // Set the image as base64 string
    }
  };

  const handleUpload = async () => {
    if (!name || !description || !category || !sellerName || !address || !price || !image) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Save the product data including the image (base64 string) in Firestore
      await addDoc(collection(db, 'Products'), {
        name,
        description,
        category,
        sellerName,
        address,
        price: parseFloat(price), // Ensure price is stored as a number
        image, // Store the image as base64 string
      });

      Alert.alert('Success', 'Product uploaded successfully!');
      setName('');
      setDescription('');
      setCategory('');
      setSellerName('');
      setAddress('');
      setPrice('');
      setImage(null); // Clear the selected image
    } catch (error) {
      console.error('Upload Error: ', error);
      Alert.alert('Error', 'Something went wrong during upload.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <Pressable onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </Pressable>

      {/* Display the image if one is selected */}
      {image && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${image}` }}
          style={styles.image}
        />
      )}

      <Pressable onPress={handleUpload} style={styles.button}>
        <Text style={styles.buttonText}>Upload</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
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
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 15,
    alignSelf: 'center',
  },
});

export default AddProduct;