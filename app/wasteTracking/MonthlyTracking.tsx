import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Import your Firestore configuration
import { Calendar } from 'react-native-calendars'; // Import the Calendar component

const screenWidth = Dimensions.get('window').width;

// Define a type for the garbage data structure
type GarbageData = {
  Organic: number;
  Paper: number;
  Glass: number;
  Plastic: number;
};

// Define the type for the daily entry data structure
interface DailyEntry {
  id: string;
  date: string;
  bins: GarbageData;
}

const MonthlyTracking = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [monthlyData, setMonthlyData] = useState<GarbageData>({
    Organic: 0,
    Paper: 0,
    Glass: 0,
    Plastic: 0,
  });
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [showMonthly, setShowMonthly] = useState<boolean>(false); // New state for toggling view

  // Fetch daily entries from Firestore
  useEffect(() => {
    const dailyRef = collection(FIREBASE_DB, 'daily');
    const subscriber = onSnapshot(dailyRef, {
      next: (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DailyEntry[]; // Explicit type
        setDailyEntries(entries);
      },
    });

    return () => subscriber();
  }, []);

  // Handle date selection from the calendar
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const entry = dailyEntries.find((entry) => entry.date === day.dateString);

    if (entry) {
      setMonthlyData(entry.bins);
    } else {
      Alert.alert('No data available for the selected date.');
      setMonthlyData({
        Organic: 0,
        Paper: 0,
        Glass: 0,
        Plastic: 0,
      });
    }
  };

  // Function to aggregate monthly data
  const aggregateMonthlyData = (month: string) => {
    const monthEntries = dailyEntries.filter((entry) => entry.date.startsWith(month));
    const aggregatedData = monthEntries.reduce((acc, entry) => {
      acc.Organic += entry.bins.Organic;
      acc.Paper += entry.bins.Paper;
      acc.Glass += entry.bins.Glass;
      acc.Plastic += entry.bins.Plastic;
      return acc;
    }, { Organic: 0, Paper: 0, Glass: 0, Plastic: 0 });

    return aggregatedData;
  };

  // Pie chart data
  const pieData = [
    {
      name: 'Organic',
      population: showMonthly ? monthlyData.Organic : monthlyData.Organic,
      color: '#4caf50', // Soft green
      legendFontColor: '#2c3e50',
      legendFontSize: 15,
    },
    {
      name: 'Paper',
      population: showMonthly ? monthlyData.Paper : monthlyData.Paper,
      color: '#ffeb3b', // Yellow for paper
      legendFontColor: '#2c3e50',
      legendFontSize: 15,
    },
    {
      name: 'Glass',
      population: showMonthly ? monthlyData.Glass : monthlyData.Glass,
      color: '#8bc34a', // Light green
      legendFontColor: '#2c3e50',
      legendFontSize: 15,
    },
    {
      name: 'Plastic',
      population: showMonthly ? monthlyData.Plastic : monthlyData.Plastic,
      color: '#f44336', // Red for plastic
      legendFontColor: '#2c3e50',
      legendFontSize: 15,
    },
  ];

  // Handle toggle between monthly and daily view
  const handleToggleView = () => {
    if (showMonthly) {
      // Reset to daily data when switching back
      const entry = dailyEntries.find((entry) => entry.date === selectedDate);
      if (entry) {
        setMonthlyData(entry.bins);
      }
    } else {
      // Aggregate monthly data
      const month = selectedDate.split('-').slice(0, 2).join('-'); // Get YYYY-MM format
      const aggregatedData = aggregateMonthlyData(month);
      setMonthlyData(aggregatedData);
    }
    setShowMonthly(!showMonthly);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monthly Tracking</Text>

      {/* Full Calendar */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#4caf50' },
        }}
      />

      {/* Toggle Button */}
      <Button title={showMonthly ? 'Show Daily Data' : 'Show Monthly Data'} onPress={handleToggleView} color="#4caf50" />

      {/* Display pie chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Garbage Breakdown</Text>
        <PieChart
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff', // White background for the chart
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`, // Dark text for legend
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Show percentage inside chart
        />
      </View>

      {/* Display selected data in text format */}
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>Selected Data:</Text>
        <Text style={styles.dataText}>Organic: {monthlyData.Organic}% , Paper: {monthlyData.Paper}% , Glass: {monthlyData.Glass}% , Plastic: {monthlyData.Plastic}%</Text>
        {/* <Text style={styles.dataText}>Paper: {monthlyData.Paper}%</Text>
        <Text style={styles.dataText}>Glass: {monthlyData.Glass}%</Text>
        <Text style={styles.dataText}>Plastic: {monthlyData.Plastic}%</Text> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff', // Main background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark text color for title
    marginBottom: 20,
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark text color for chart title
    marginBottom: 10,
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9', // Light grey background for data display
    borderRadius: 8,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50', // Dark text color for data title
  },
  dataText: {
    fontSize: 16,
    color: '#2c3e50', // Dark text color for data values
  },
});

export default MonthlyTracking;
