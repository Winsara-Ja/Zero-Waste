import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Adjust the path as needed

// Define types for questions
interface Question {
  id: string;
  name: string;
  category: string;
  question: string;
  answer: string; // Assuming the answer is stored in Firestore
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  // Fetch questions from Firestore
  useEffect(() => {
    const questionsRef = collection(FIREBASE_DB, 'questions');
    const subscriber = onSnapshot(questionsRef, {
      next: (snapshot) => {
        const fetchedQuestions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[];
        setQuestions(fetchedQuestions);
      },
    });

    return () => subscriber();
  }, []);

  const renderItem = ({ item }: { item: Question }) => (
    <TouchableOpacity
      onPress={() => Alert.alert(item.question, `Answer: ${item.answer}`)}
      style={styles.questionItem}
    >
      <Text style={styles.questionName}>{item.name} ({item.category}):</Text>
      <Text style={styles.questionText}>{item.question}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submitted Questions</Text>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  questionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light gray border
    backgroundColor: '#f9f9f9', // Slightly off-white for item background
    borderRadius: 5,
    marginBottom: 10,
  },
  questionName: {
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for the name
  },
  questionText: {
    color: '#333', // Dark gray for question text
    marginTop: 5,
  },
});

export default Questions;
