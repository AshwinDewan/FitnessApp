import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const db = getFirestore();
const auth = getAuth();

const measurementsList = [
  { key: 'chest', label: 'Chest (in)' },
  { key: 'bicepsLeft', label: 'Left Biceps (in)' },
  { key: 'bicepsRight', label: 'Right Biceps (in)' },
  { key: 'thigh', label: 'Thigh (in)' },
  { key: 'waist', label: 'Waist (in)' },
  { key: 'shoulders', label: 'Shoulders (in)' },
  { key: 'calf', label: 'Calf (in)' },
  { key: 'forearmLeft', label: 'Left Forearm (in)' },
  { key: 'forearmRight', label: 'Right Forearm (in)' },
  { key: 'wrist', label: 'Wrist (in)' },
  { key: 'hip', label: 'Hip (in)' },
];

// Generate static month list for dropdown (last 24 months)
const generateStaticMonthList = (monthsBack = 24) => {
  const now = new Date();
  const months = [];

  for (let i = 0; i < monthsBack; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = date.toISOString().slice(0, 7); // "YYYY-MM"
    const label = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    }); // e.g., "April 2025"
    months.push({ label, value });
  }

  return months;
};

export default function MeasurementTracker() {
  const [measurements, setMeasurements] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthList, setMonthList] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    setMonthList(generateStaticMonthList()); // Set static month dropdown
  }, []);

  useEffect(() => {
    if (user && selectedMonth) {
      loadMeasurements();
    }
  }, [selectedMonth, user]);

  const loadMeasurements = async () => {
    try {
      const docRef = doc(db, 'users', user.uid, 'measurements', selectedMonth);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMeasurements(docSnap.data());
      } else {
        setMeasurements({}); // Clear if no data exists
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const handleChange = (key, value) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveMeasurements = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid, 'measurements', selectedMonth), measurements);
      Alert.alert('Saved!', 'Your measurements have been saved for this month.');
    } catch (error) {
      console.error('Error saving measurements:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Measurement Tracker</Text>

      <View style={styles.monthSelector}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
          dropdownIconColor="#C1FF00"
          mode="dropdown">
          {monthList.map((month) => (
            <Picker.Item key={month.value} label={month.label} value={month.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subHeader}>Month: {monthList.find(m => m.value === selectedMonth)?.label}</Text>

      {measurementsList.map(({ key, label }) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={measurements[key]?.toString() || ''}
            onChangeText={(text) => handleChange(key, text)}
            placeholder="Enter value"
            placeholderTextColor="#888"
          />
        </View>
      ))}

      <TouchableOpacity onPress={saveMeasurements} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Measurements</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  header: {
    fontSize: width * 0.07,
    color: '#C1FF00',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  subHeader: {
    fontSize: width * 0.045,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  monthSelector: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: height * 0.02,
  },
  picker: {
    color: '#FFF',
    width: '100%',
  },
  inputGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    color: '#FFF',
    fontSize: width * 0.045,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#FFF',
    padding: 12,
    borderRadius: 6,
    fontSize: width * 0.045,
  },
  saveButton: {
    backgroundColor: '#C1FF00',
    padding: 16,
    borderRadius: 10,
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});
