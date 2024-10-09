import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/index'; // Adjust the import path

const AddStep = () => {
  const [garbageName, setGarbageName] = useState('');
  const [instruction1, setInstruction1] = useState('');
  const [instruction2, setInstruction2] = useState('');
  const [instruction3, setInstruction3] = useState('');
  const [instruction4, setInstruction4] = useState('');
  const [instruction5, setInstruction5] = useState('');

  const handleUpload = async () => {
    if (!garbageName || !instruction1 || !instruction2 || !instruction3 || !instruction4 || !instruction5) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Save the data in Firestore
      await addDoc(collection(db, 'garbageSteps'), {
        garbageName,
        instructions: [
          instruction1,
          instruction2,
          instruction3,
          instruction4,
          instruction5
        ],
      });

      Alert.alert('Success', 'Data uploaded successfully!');
      setGarbageName('');
      setInstruction1('');
      setInstruction2('');
      setInstruction3('');
      setInstruction4('');
      setInstruction5('');
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

      <TextInput
        placeholder="Enter Instruction 1"
        value={instruction1}
        onChangeText={setInstruction1}
        style={[styles.input, styles.instructionInput]}
        multiline
      />

      <TextInput
        placeholder="Enter Instruction 2"
        value={instruction2}
        onChangeText={setInstruction2}
        style={[styles.input, styles.instructionInput]}
        multiline
      />

      <TextInput
        placeholder="Enter Instruction 3"
        value={instruction3}
        onChangeText={setInstruction3}
        style={[styles.input, styles.instructionInput]}
        multiline
      />

      <TextInput
        placeholder="Enter Instruction 4"
        value={instruction4}
        onChangeText={setInstruction4}
        style={[styles.input, styles.instructionInput]}
        multiline
      />

      <TextInput
        placeholder="Enter Instruction 5"
        value={instruction5}
        onChangeText={setInstruction5}
        style={[styles.input, styles.instructionInput]}
        multiline
      />

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
