import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Use FIREBASE_DB for Firestore

const AddStep = () => {
  const [garbageName, setGarbageName] = useState('');
  const [instructions, setInstructions] = useState(Array(5).fill('')); // Using an array to store instructions

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const handleUpload = async () => {
    if (!garbageName || instructions.some(instruction => !instruction)) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Save the data in Firestore
      await addDoc(collection(FIREBASE_DB, 'garbageSteps'), {
        garbageName,
        instructions,
      });

      Alert.alert('Success', 'Data uploaded successfully!');
      setGarbageName('');
      setInstructions(Array(5).fill('')); // Reset instructions to empty
    } catch (error) {
      console.error('Upload Error: ', error);
      Alert.alert('Error', 'Something went wrong during upload.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Steps</Text>

      <TextInput
        placeholder="Enter Garbage Name"
        value={garbageName}
        onChangeText={setGarbageName}
        style={[styles.input, styles.garbageNameInput]}
      />

      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          placeholder={`Enter Instruction ${index + 1}`}
          value={instruction}
          onChangeText={(value) => handleInstructionChange(index, value)}
          style={[styles.input, styles.instructionInput]}
          multiline
        />
      ))}

      <Pressable onPress={handleUpload} style={styles.button}>
        <Text style={styles.buttonText}>Upload</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  garbageNameInput: {
    height: 60, // Increased height for garbage name input
  },
  instructionInput: {
    height: 60, // Adjusted height for each instruction input
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddStep;
