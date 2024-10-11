import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


interface GarbageData {
  Organic: number;
  Paper: number;
  Glass: number;
  Plastic: number;
}

interface MonthlyEntry {
  date: string;
  bins: GarbageData;
}

const MonthlyReport = () => {
  const [monthlyEntries, setMonthlyEntries] = useState<MonthlyEntry[]>([]);
  const [month, setMonth] = useState<string>(new Date().toISOString().split('T')[0].slice(0, 7)); // Default to current month (YYYY-MM)

  useEffect(() => {
    const monthlyRef = collection(FIREBASE_DB, 'daily');
    const subscriber = onSnapshot(monthlyRef, {
      next: (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          date: doc.id,
          ...doc.data(),
        })) as MonthlyEntry[];

        const filteredEntries = entries.filter((entry) => entry.date.startsWith(month));
        setMonthlyEntries(filteredEntries);
      },
    });

    return () => subscriber();
  }, [month]);

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Monthly Waste Report for ${month}</h1>
      <table style="width: 100%; border: 1px solid black;">
        <thead>
          <tr>
            <th>Date</th>
            <th>Organic</th>
            <th>Paper</th>
            <th>Glass</th>
            <th>Plastic</th>
          </tr>
        </thead>
        <tbody>
          ${monthlyEntries
            .map(
              (entry) => `
            <tr>
              <td>${entry.date}</td>
              <td>${entry.bins.Organic}</td>
              <td>${entry.bins.Paper}</td>
              <td>${entry.bins.Glass}</td>
              <td>${entry.bins.Plastic}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    const options = {
      html: htmlContent,
      fileName: `monthly_report_${month}`,
      directory: 'Documents', // Change directory if needed
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF saved to: ${file.filePath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Monthly Report</Text>

      {/* Month Selector */}
      <Text style={{ marginVertical: 10 }}>Current Month: {month}</Text>

      {/* Monthly Details */}
      <View style={{ marginVertical: 20 }}>
        {monthlyEntries.map((entry) => (
          <View key={entry.date} style={{ marginBottom: 15 }}>
            <Text>Date: {entry.date}</Text>
            <Text>Organic: {entry.bins.Organic}</Text>
            <Text>Paper: {entry.bins.Paper}</Text>
            <Text>Glass: {entry.bins.Glass}</Text>
            <Text>Plastic: {entry.bins.Plastic}</Text>
          </View>
        ))}
      </View>

      {/* Download Button */}
      <Button title="Download Monthly Report (PDF)" onPress={generatePDF} />
    </ScrollView>
  );
};

export default MonthlyReport;
