import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define types for bins and entries
interface Bins {
  Organic: number;
  Paper: number;
  Glass: number;
  Plastic: number;
}

interface DailyEntry {
  id: string;
  date: string; // 'YYYY-MM-DD'
  bins: Bins;
}

const WeeklyTracking = () => {
  const [weeklyEntries, setWeeklyEntries] = useState<DailyEntry[]>([]); // Holds entries for the selected week
  const [selectedDate, setSelectedDate] = useState(new Date()); // To pick a date within the desired week
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null); // For showing details of a day

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const getStartOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay(); // Get current day of the week (0 for Sunday, 6 for Saturday)
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when the week starts on Sunday
    return new Date(date.setDate(diff)); // Return Monday's date
  };

  const getEndOfWeek = (date: Date) => {
    const startOfWeek = getStartOfWeek(new Date(date)); // Get the start of the week
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)); // Add 6 days for Sunday
  };

  useEffect(() => {
    const startOfWeek = getStartOfWeek(selectedDate);
    const endOfWeek = getEndOfWeek(selectedDate);

    const dailyRef = collection(FIREBASE_DB, 'daily');
    const weekQuery = query(
      dailyRef,
      where('date', '>=', startOfWeek.toISOString().split('T')[0]),
      where('date', '<=', endOfWeek.toISOString().split('T')[0])
    );

    const subscriber = onSnapshot(weekQuery, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as DailyEntry));
      setWeeklyEntries(entries);
    });

    return () => subscriber();
  }, [selectedDate]);

  const calculateAverage = (bins: Bins) => {
    const total = bins.Organic + bins.Paper + bins.Glass + bins.Plastic;
    return total / 4; // Average of the 4 bins
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#ffffff', flex: 1 }}>
      <Text style={{ fontSize: 24, marginBottom: 10, color: '#2c3e50' }}>Weekly Waste Tracking</Text>

      {/* Date Picker to select the week */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: '#a8e6cf', // Light green background for the button
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          elevation: 2,
        }}>
        <Text style={{ color: '#2c3e50' }}>
          Select Week: {getStartOfWeek(selectedDate).toDateString()} - {getEndOfWeek(selectedDate).toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Show Daily Entries */}
      <FlatList
        data={weeklyEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setSelectedEntry(item)}
            style={{
              backgroundColor: '#dcedc8', // Light green for the item background
              padding: 15,
              borderRadius: 5,
              marginVertical: 5,
              elevation: 1,
            }}>
            <Text style={{ color: '#2c3e50' }}>
              Day {index + 1} average percentage: {calculateAverage(item.bins).toFixed(2)}%
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Show detailed garbage levels when a day is selected */}
      {selectedEntry && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#ffffff', borderRadius: 5, elevation: 1 }}>
          <Text style={{ fontSize: 18, color: '#2c3e50' }}>Details for {selectedEntry.date}</Text>
          <Text style={{ color: '#2c3e50' }}>Organic: {selectedEntry.bins.Organic}%</Text>
          <Text style={{ color: '#2c3e50' }}>Paper: {selectedEntry.bins.Paper}%</Text>
          <Text style={{ color: '#2c3e50' }}>Glass: {selectedEntry.bins.Glass}%</Text>
          <Text style={{ color: '#2c3e50' }}>Plastic: {selectedEntry.bins.Plastic}%</Text>
        </View>
      )}
    </View>
  );
};

export default WeeklyTracking;
