import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig';
import { Calendar } from 'react-native-calendars';

const screenWidth = Dimensions.get('window').width;

type GarbageData = {
  Organic: number;
  Paper: number;
  Glass: number;
  Plastic: number;
};

interface DailyEntry {
  id: string;
  date: string;
  bins: GarbageData;
}

const MonthlyTracking = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [monthlyData, setMonthlyData] = useState<GarbageData>({
    Organic: 0,
    Paper: 0,
    Glass: 0,
    Plastic: 0,
  });
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [showMonthly, setShowMonthly] = useState<boolean>(false);

  useEffect(() => {
    const dailyRef = collection(FIREBASE_DB, 'daily');
    const subscriber = onSnapshot(dailyRef, {
      next: (snapshot) => {
        const entries = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DailyEntry[];
        setDailyEntries(entries);
      },
    });

    return () => subscriber();
  }, []);

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

  const aggregateMonthlyData = (month: string) => {
    const monthEntries = dailyEntries.filter((entry) =>
      entry.date.startsWith(month)
    );
    const aggregatedData = monthEntries.reduce(
      (acc, entry) => {
        acc.Organic += entry.bins.Organic;
        acc.Paper += entry.bins.Paper;
        acc.Glass += entry.bins.Glass;
        acc.Plastic += entry.bins.Plastic;
        return acc;
      },
      { Organic: 0, Paper: 0, Glass: 0, Plastic: 0 }
    );

    return aggregatedData;
  };

  const calculatePercentages = (data: GarbageData) => {
    const total = data.Organic + data.Paper + data.Glass + data.Plastic;
    if (total === 0) return { Organic: 0, Paper: 0, Glass: 0, Plastic: 0 };

    const organicPercentage = Math.round((data.Organic / total) * 100);
    const paperPercentage = Math.round((data.Paper / total) * 100);
    const glassPercentage = Math.round((data.Glass / total) * 100);
    const plasticPercentage = 100 - (organicPercentage + paperPercentage + glassPercentage); // Ensure total is 100%

    return {
      Organic: organicPercentage,
      Paper: paperPercentage,
      Glass: glassPercentage,
      Plastic: plasticPercentage,
    };
  };

  const pieData = () => {
    const percentages = calculatePercentages(monthlyData);
    return [
      {
        name: '% Organic',
        population: percentages.Organic,
        color: '#4caf50',
        legendFontColor: '#2c3e50',
        legendFontSize: 15,
      },
      {
        name: '% Paper',
        population: percentages.Paper,
        color: '#ffeb3b',
        legendFontColor: '#2c3e50',
        legendFontSize: 15,
      },
      {
        name: '% Glass',
        population: percentages.Glass,
        color: '#8bc34a',
        legendFontColor: '#2c3e50',
        legendFontSize: 15,
      },
      {
        name: '% Plastic',
        population: percentages.Plastic,
        color: '#f44336',
        legendFontColor: '#2c3e50',
        legendFontSize: 15,
      },
    ];
  };

  const handleToggleView = () => {
    if (showMonthly) {
      const entry = dailyEntries.find((entry) => entry.date === selectedDate);
      if (entry) {
        setMonthlyData(entry.bins);
      }
    } else {
      const month = selectedDate.split('-').slice(0, 2).join('-');
      const aggregatedData = aggregateMonthlyData(month);
      setMonthlyData(aggregatedData);
    }
    setShowMonthly(!showMonthly);
  };

  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>Monthly Waste Tracking</Text>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DailyTracking')}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('WeeklyTracking')}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('MonthlyTracking')}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>Monthly</Text>
          </TouchableOpacity>
        </View>

        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: '#4caf50',
            },
          }}
          style={{
            width: 400,
            height: 300,
            alignSelf: 'center',
          }}
          theme={{
            textDayFontSize: 12,
            textMonthFontSize: 14,
            textDayHeaderFontSize: 12,
            'stylesheet.calendar.main': {
              week: {
                marginTop: 2,
                marginBottom: 2,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
          }}
        />

        <Button
          title={showMonthly ? 'Show Daily Data' : 'Show Monthly Data'}
          onPress={handleToggleView}
          color="#4caf50"
        />

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Garbage Breakdown</Text>
          <PieChart
            data={pieData()}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#f0f0f0',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#1b5e20',
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
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

export default MonthlyTracking;
