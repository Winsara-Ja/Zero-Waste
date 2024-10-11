// AddPost.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig'; // Adjust the path as needed
import { collection, addDoc } from 'firebase/firestore';

const AddPost = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [nameseller, setNameseller] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');

    const handleAddPost = async () => {
        try {
            const docRef = await addDoc(collection(FIREBASE_DB, 'Products'), {
                name,
                category,
                image,
                description,
                nameseller,
                address,
                price,
            });
            Alert.alert('Product added!', `Document written with ID: ${docRef.id}`);
            // Clear the form fields
            setName('');
            setCategory('');
            setImage('');
            setDescription('');
            setNameseller('');
            setAddress('');
            setPrice('');
        } catch (error) {
            Alert.alert('Error adding product', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Seller Name"
                value={nameseller}
                onChangeText={setNameseller}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                keyboardType="numeric"
                onChangeText={setPrice}
            />
            <Button title="Add Product" onPress={handleAddPost} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
});

export default AddPost;
