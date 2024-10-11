import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

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

const WeeklyTracking = ({ navigation }: any) => {
  const [weeklyEntries, setWeeklyEntries] = useState<DailyEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const getStartOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getEndOfWeek = (date: Date) => {
    const startOfWeek = getStartOfWeek(new Date(date));
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
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
    return total / 4;
  };

  return (
    <ScrollView style={{ padding: 20, flex: 1 }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: '700',
          marginBottom: 20,
          color: '#1b5e20',
          textAlign: 'center',
          marginTop: 50,
        }}>
        Weekly Waste Tracking
      </Text>

      {/* Navigation bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('DailyTracking')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('WeeklyTracking')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MonthlyTracking')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Monthly</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: '#66bb6a',
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        }}>
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
          Select Week: {getStartOfWeek(selectedDate).toDateString()} - {getEndOfWeek(selectedDate).toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
      )}

      {weeklyEntries.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => setSelectedEntry(item)}
          style={{
            backgroundColor: '#008080',
            padding: 16,
            borderRadius: 10,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}>
          <Text style={{ color: '#ffffff', fontWeight: '500', fontSize: 16 }}>
            Day {index + 1} - Average Bin Usage: {calculateAverage(item.bins).toFixed(2)}%
          </Text>
        </TouchableOpacity>
      ))}

      {selectedEntry && (
        <View
          style={{
            marginTop: 20,
            marginBottom: 40,
            padding: 20,
            backgroundColor: '#ffffff',
            borderRadius: 10,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#1b5e20',
              marginBottom: 10,
              textAlign: 'center',
            }}>
            Details for {selectedEntry.date}
          </Text>
          <Text style={{ color: '#008080', marginBottom: 5 }}>Organic: {selectedEntry.bins.Organic}%</Text>
          <Text style={{ color: '#008080', marginBottom: 5 }}>Paper: {selectedEntry.bins.Paper}%</Text>
          <Text style={{ color: '#008080', marginBottom: 5 }}>Glass: {selectedEntry.bins.Glass}%</Text>
          <Text style={{ color: '#008080', marginBottom: 5 }}>Plastic: {selectedEntry.bins.Plastic}%</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,

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
    fontWeight: 'bold',
  },
});

export default WeeklyTracking;
