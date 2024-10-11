import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Adjust the path as needed
import * as GoogleGenerativeAI from "@google/generative-ai";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon

// Define types for questions
interface Question {
  id: string;
  name: string;
  category: string;
  question: string;
  answer: string; // Placeholder for the answer
}

const MyQuestions = ({ navigation }: any) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState(''); // Placeholder for user's name
  const [category, setCategory] = useState('General');
  const [question, setQuestion] = useState('');

  const API_KEY = "AIzaSyDaXB37xFGurV9_b7K1URSCIEX5j20I514"; // Use a secure method to handle your API keys

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

  // Function to generate an answer using Google Generative AI
  const generateAnswer = async (questionText: string) => {
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
      const result = await model.generateContent(questionText);
      const responseText = result.response.text().replace(/[*]/g, "").replace(/[^\w\s,.!?]/g, ""); // Clean response
      return responseText;
    } catch (error) {
      console.error("Error generating answer:", error);
      Alert.alert("Error", "There was an issue generating the answer.");
      return "Answer generation failed.";
    }
  };

  // Add a new question
  const addQuestion = async () => {
    if (!name || !question || category === '') {
      Alert.alert('Please fill in your name, select a category, and type your question.');
      return;
    }

    try {
      // Add the question to Firestore
      const questionDoc = await addDoc(collection(FIREBASE_DB, 'questions'), {
        name,
        category,
        question,
        answer: 'Pending', // Set answer as 'Pending'
      });

      // Generate an answer for the question
      const answer = await generateAnswer(question);
      
      // Update the question document with the generated answer
      await updateDoc(doc(FIREBASE_DB, 'questions', questionDoc.id), { answer });

      setQuestion(''); // Clear the question input after submission
    } catch (error) {
      console.error('Error adding question:', error);
      Alert.alert('Error', 'There was an issue adding your question.');
    }
  };

  // Delete a question
  const deleteQuestion = async (id: string) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'questions', id));
      Alert.alert('Success', 'Question deleted successfully.');
    } catch (error) {
      console.error('Error deleting question:', error);
      Alert.alert('Error', 'There was an issue deleting the question.');
    }
  };

  return (
    <View style={styles.container}>

      {/* Navigation bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Questions')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Tips')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Tips</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Submit Your Questions</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your Name"
        style={styles.input}
      />
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="General" value="General" />
        <Picker.Item label="Environment" value="Environment" />
        <Picker.Item label="Health" value="Health" />
        <Picker.Item label="Technology" value="Technology" />
      </Picker>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Type your question here..."
        multiline
        style={styles.textArea}
      />
      <Button title="Submit" onPress={addQuestion} color="#4CAF50" />

      <FlatList
        data={questions.filter(q => q.name === name)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.questionText}>{item.question}</Text>
            <Text style={styles.answerText}>Answer: {item.answer}</Text>
            <TouchableOpacity onPress={() => deleteQuestion(item.id)} style={styles.iconContainer}>
              <Icon name="delete" size={24} color="#FF6347" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }} // Add some padding at the bottom for the FlatList
      />
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderColor: '#4CAF50',
    color: '#000',
  },
  picker: {
    marginBottom: 10,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  textArea: {
    borderBottomWidth: 1,
    marginBottom: 10,
    height: 100,
    padding: 8,
    borderColor: '#4CAF50',
    color: '#000',
  },
  questionContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  category: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  questionText: {
    marginTop: 5,
    color: '#000',
  },
  answerText: {
    color: 'gray',
    marginTop: 5,
  },
  iconContainer: {
    marginTop: 10,
    alignItems: 'flex-end', // Align the icon to the right
  },
  bottomNav: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  navButton: {
    backgroundColor: 'green',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyQuestions;
