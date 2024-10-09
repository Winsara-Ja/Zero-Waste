import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/index'; // Adjust the import path

const ViewSteps = ({ navigation }) => {
  const [stepsData, setStepsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStepsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garbageSteps'));
        const stepsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStepsData(stepsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchStepsData();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this step?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'garbageSteps', id));
              setStepsData(stepsData.filter(item => item.id !== id));
              Alert.alert('Success', 'Step deleted successfully!');
            } catch (error) {
              console.error('Error deleting step: ', error);
              Alert.alert('Error', 'Could not delete the step.');
            }
          }
        }
      ]
    );
  };

  const handleUpdate = (item) => {
    // Navigate to UpdateStep page with the step's data (including its id)
    navigation.navigate('UpdateStep', { item });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garbage Disposal Steps</Text>

      <FlatList
        data={stepsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.stepCard}>
            <Text style={styles.garbageName}>{item.garbageName}</Text>
            {/* Check if instructions exist and is an array */}
            {Array.isArray(item.instructions) ? (
              item.instructions.map((instruction, index) => (
                <Text key={index} style={styles.instruction}>
                  Step {index + 1}: {instruction}
                </Text>
              ))
            ) : (
              <Text style={styles.instruction}>No instructions available.</Text>
            )}

            {/* Delete button */}
            <Button
              title="Delete"
              color="red"
              onPress={() => handleDelete(item.id)}
            />

            {/* Update button */}
            <Button
              title="Update"
              onPress={() => handleUpdate(item)} // Pass the entire step object to the update page
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  stepCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  garbageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewSteps;
