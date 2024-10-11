import { View, Text, Button, FlatList, TouchableOpacity, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

const DailyTracking = ({navigation}: any) => {

  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bins, setBins] = useState<Bins>({
    Organic: 0,
    Paper: 0,
    Glass: 0,
    Plastic: 0,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const getYesterday = (date: Date) => {
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    return yesterday;
  };

  useEffect(() => {
    fetchSavedEntries(); // Fetch saved entries on initial load
    const today = new Date();
    setSelectedDate(today);
    fetchBinsForDate(today); // Fetch today's bins initially
  }, []);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      fetchBinsForDate(selectedDate); // Fetch bins for the selected date
    }
  };

  const fetchBinsForDate = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dailyRef = collection(FIREBASE_DB, 'daily');
    const q = query(dailyRef, where('date', '==', dateString));

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const entry = snapshot.docs[0].data() as DailyEntry;
      setBins(entry.bins);
    } else {
      // If no entry exists, fetch the previous day's bins
      const previousDay = getYesterday(date);
      const previousDateString = previousDay.toISOString().split('T')[0];
      const prevQ = query(dailyRef, where('date', '==', previousDateString));

      const prevSnapshot = await getDocs(prevQ);
      if (!prevSnapshot.empty) {
        const prevEntry = prevSnapshot.docs[0].data() as DailyEntry;
        setBins(prevEntry.bins); // Set bins from the previous day
      } else {
        setBins({ Organic: 0, Paper: 0, Glass: 0, Plastic: 0 }); // Default to zero if no previous entry
      }
    }
  };

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

  const saveDailyEntry = async () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const dailyRef = collection(FIREBASE_DB, 'daily');
    const q = query(dailyRef, where('date', '==', dateString));

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // If entry exists, update it
      const entryId = snapshot.docs[0].id;
      const entryRef = doc(FIREBASE_DB, 'daily', entryId); // Get the document reference
      await updateDoc(entryRef, { bins }); // Update the existing entry
      Alert.alert('Success', 'Entry updated successfully!');
    } else {
      // If no entry exists, create a new one
      await addDoc(dailyRef, {
        date: dateString,
        bins,
      });
      Alert.alert('Success', 'New entry saved successfully!');
    }
  };

  const handleBinOverflow = (type: keyof Bins) => {
    Alert.alert(
      'Bin Full',
      `The ${type} bin is above 90%. Do you want to empty it?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Empty Bin',
          onPress: () => {
            setBins((prevBins) => ({ ...prevBins, [type]: 0 }));
          },
        },
      ]
    );
  };

  const updateBinLevel = (type: keyof Bins, change: number) => {
    setBins((prevBins) => {
      const newLevel = Math.min(Math.max(prevBins[type] + change, 0), 100);
      if (newLevel > 90) {
        handleBinOverflow(type);
      }
      return { ...prevBins, [type]: newLevel };
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const renderItem = ({ item }: { item: DailyEntry }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.id)}>
      <View style={styles.entryItem}>
        <Text style={styles.entryDate}>{item.date}</Text>
        {expandedItem === item.id && (
          <View>
            <Text>Organic: {item.bins.Organic}%</Text>
            <Text>Paper: {item.bins.Paper}%</Text>
            <Text>Glass: {item.bins.Glass}%</Text>
            <Text>Plastic: {item.bins.Plastic}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    // Remove the ScrollView and change the FlatList to include the header
<SafeAreaView style={styles.container}>
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Daily Waste Tracking</Text>
  </View>
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




  <FlatList
    data={dailyEntries}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
    showsVerticalScrollIndicator={false}
    style={styles.flatList} // Ensure FlatList has full height
    ListHeaderComponent={
      <>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Bin Levels with + and - buttons */}
        <View style={styles.binContainer}>
          {(['Organic', 'Paper', 'Glass', 'Plastic'] as Array<keyof Bins>).map((type) => (
            <View key={type} style={styles.binItem}>
              <Text style={styles.binTitle}>{type} - {bins[type]}%</Text>
              <View style={styles.binOuter}>
                <View
                  style={[
                    styles.binInner,
                    { height: `${bins[type]}%`, backgroundColor: bins[type] >= 80 ? 'red' : '#4caf50' },
                  ]}
                />
              </View>
              <View style={styles.binButtons}>
                <Button title="-" onPress={() => updateBinLevel(type, -10)} color="#f44336" />
                <Button title="+" onPress={() => updateBinLevel(type, 10)} color="#4caf50" />
              </View>
            </View>
          ))}
        </View>

        <Button title="Save" onPress={saveDailyEntry} color="#4caf50" />
        <Text style={styles.subtitle}>Previous Entries:</Text>
      </>
    }
  />
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 30, // Added margin at the top
  },
  bottomNav: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  navButton: {
    backgroundColor: '#4caf50', // Green background for buttons
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
  },
  datePicker: {
    marginBottom: 10,
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
  },
  binContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  binItem: {
    width: '45%',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e0f2f1',
    borderRadius: 10,
  },
  binTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  binOuter: {
    height: 200,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  binInner: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 10,
  },
  binButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entriesContainer: {
    flex: 1,
    marginTop: 20,
  },
  entryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
});

export default DailyTracking;
