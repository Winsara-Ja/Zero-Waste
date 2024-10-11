import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the AI module

interface Bins {
  Organic: number;
  Paper: number;
  Glass: number;
  Plastic: number;
}

interface DailyEntry {
  id: string;
  date: string;
  bins: Bins;
}

const TipsScreen = () => {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const API_KEY = "AIzaSyDaXB37xFGurV9_b7K1URSCIEX5j20I514"; // Replace with your actual API key

  useEffect(() => {
    fetchSavedEntries(); // Fetch saved entries on initial load
  }, []);

  useEffect(() => {
    if (dailyEntries.length > 0) {
      generateTips(); // Generate tips whenever daily entries change
    }
  }, [dailyEntries]);

  const fetchSavedEntries = async () => {
    const dailyRef = collection(FIREBASE_DB, 'daily');

    onSnapshot(dailyRef, (snapshot) => {
      const entries: DailyEntry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        date: doc.data().date,
        bins: doc.data().bins,
      }));
      setDailyEntries(entries);
    });
  };

  const generateTips = async () => {
    // Aggregate the data for the prompt
    const totalBins = dailyEntries.reduce((acc, entry) => {
      acc.Organic += entry.bins.Organic;
      acc.Paper += entry.bins.Paper;
      acc.Glass += entry.bins.Glass;
      acc.Plastic += entry.bins.Plastic;
      return acc;
    }, { Organic: 0, Paper: 0, Glass: 0, Plastic: 0 });

    const prompt = `Based on the daily waste tracking data, here are some tips for managing waste: Organic: ${totalBins.Organic}, Paper: ${totalBins.Paper}, Glass: ${totalBins.Glass}, Plastic: ${totalBins.Plastic}.`;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setTips(text.split('\n')); // Assuming tips are returned in separate lines
    } catch (error) {
      console.error("Error generating tips:", error);
      Alert.alert('Error', 'Failed to generate tips. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Management Tips</Text>

      {/* ScrollView to allow scrolling for tips */}
      <ScrollView style={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <Text key={index} style={styles.tip}>{tip}</Text>
        ))}
      </ScrollView>

      {/* Button to Refresh Tips */}
      <TouchableOpacity style={styles.button} onPress={generateTips}>
        <Text style={styles.buttonText}>Refresh Tips</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', // Light background color
    justifyContent: 'center',
  },
  title: {
    fontSize: 32, // Larger font size for title
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for title
    marginBottom: 20,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#e0f7e0', // Light green background for tips container
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border for tips container
    marginBottom: 20,
  },
  tip: {
    marginVertical: 5,
    fontSize: 18, // Slightly larger font size for tips
  },
  button: {
    backgroundColor: '#4CAF50', // Green background for button
    paddingVertical: 12, // Vertical padding for button
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text for button
    fontSize: 18, // Font size for button text
    fontWeight: 'bold',
  },
});

export default TipsScreen;
