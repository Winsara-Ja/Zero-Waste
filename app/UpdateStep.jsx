import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/index'; // Adjust the path

const UpdateStep = ({ route, navigation }) => {
  const { item } = route.params; // Get the step data passed from ViewSteps
  const [garbageName, setGarbageName] = useState(item.garbageName);
  const [instructions, setInstructions] = useState(item.instructions);

  const handleUpdate = async () => {
    if (!garbageName || !instructions.length) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const stepDocRef = doc(db, 'garbageSteps', item.id);
      await updateDoc(stepDocRef, {
        garbageName,
        instructions,
      });

      Alert.alert('Success', 'Step updated successfully!');
      navigation.goBack(); // Go back to the ViewSteps screen
    } catch (error) {
      console.error('Error updating step: ', error);
      Alert.alert('Error', 'Could not update the step.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Step</Text>

      <TextInput
        placeholder="Enter Garbage Name"
        value={garbageName}
        onChangeText={setGarbageName}
        style={styles.input}
      />

      {instructions.map((instruction, index) => (
        <TextInput
          key={index}
          placeholder={`Step ${index + 1}`}
          value={instruction}
          onChangeText={(text) => {
            const newInstructions = [...instructions];
            newInstructions[index] = text;
            setInstructions(newInstructions);
          }}
          style={styles.input}
        />
      ))}

      <Button title="Update" onPress={handleUpdate} />
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
});

export default UpdateStep;
