import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Adjust the path as needed
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons
<<<<<<< HEAD
import { MaterialIcons } from '@expo/vector-icons'; 
=======
import { MaterialIcons } from '@expo/vector-icons';
>>>>>>> 5d2d1a8 (errors fixed in merging)

// Define types for questions
interface Question {
  id: string;
  name: string;
  category: string;
  question: string;
  answer: string; // Assuming the answer is stored in Firestore
}

const Questions = ({ navigation }: any) => {
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
      {/* Navigation bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Questions')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Tips')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Tips</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Submitted Questions about Waste Management</Text>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Pencil Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('MyQuestions')} // Replace 'MyQuestions' with the actual route name
      >
        <MaterialIcons name="edit" size={30} color="#008080" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    padding: 20,
<<<<<<< HEAD
    
=======

>>>>>>> 5d2d1a8 (errors fixed in merging)
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1b5e20', // #008080 color
    marginBottom: 10,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  questionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Light gray border
    backgroundColor: '#e0f7e0', // Slightly off-white for item background
    borderRadius: 5,
    marginBottom: 10,
  },
  questionName: {
    fontWeight: 'bold',
    color: 'black', // #008080 color for the name
  },
  questionText: {
    color: '#333', // Dark gray for question text
    marginTop: 5,
  },
  bottomNav: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    marginTop: 50,
  },
  navButton: {
    backgroundColor: '#008080',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50', // Floating button background color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
});

export default Questions;
