import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import FirestoreService from '../services/firestoreService';
import { getAuth } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

const RepLogger = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return <Text style={styles.errorText}>User not logged in</Text>;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [exercisesList, setExercisesList] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState({});
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const formattedDate = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    fetchCategoriesAndExercises();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedExercise(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchExistingData();
  }, [formattedDate]);

  const fetchCategoriesAndExercises = async () => {
    const data = await FirestoreService.fetchAllData("exerciseCategories");
    if (data.length) {
      const formattedData = data.reduce((acc, item) => {
        acc[item.id] = item.exercises || [];
        return acc;
      }, {});
      setCategories(data.map(item => item.id));
      setExercisesList(formattedData);
    }
  };

  const fetchExistingData = async () => {
    if (!formattedDate || !user) return;
    const data = await FirestoreService.fetchData(`repLogger/${user.uid}`, formattedDate);
    console.log("Fetched Data:", data); // Debugging log
    setExercises(data || {});
  };

  const addSet = async () => {
    if (!selectedCategory || !selectedExercise || !reps || !weight) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formattedDate > today) {
      Alert.alert('Error', 'You cannot add sets for a future date.');
      return;
    }

    const newSet = {
      reps: parseInt(reps),
      weight: parseFloat(weight)
    };

    const updatedExercises = { ...exercises };
    if (!updatedExercises[selectedCategory]) {
      updatedExercises[selectedCategory] = {};
    }
    if (!updatedExercises[selectedCategory][selectedExercise]) {
      updatedExercises[selectedCategory][selectedExercise] = [];
    }

    updatedExercises[selectedCategory][selectedExercise].push(newSet);

    setExercises(updatedExercises);
    setReps('');
    setWeight('');

    await FirestoreService.uploadData(`repLogger/${user.uid}`, formattedDate, updatedExercises);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rep Logger</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowCalendar(true)}>
        <Text style={styles.datePickerText}>📅 {formattedDate}</Text>
      </TouchableOpacity>
      {showCalendar && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (date) setSelectedDate(date);
            setShowCalendar(false);
          }}
        />
      )}
      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Select a category" value={null} />
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedExercise}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedExercise(itemValue)}
      >
        <Picker.Item label="Select an exercise" value={null} />
        {selectedCategory &&
          exercisesList[selectedCategory]?.map((exercise) => (
            <Picker.Item key={exercise} label={exercise} value={exercise} />
          ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Reps"
        placeholderTextColor="#AAA"
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor="#AAA"
        keyboardType="numeric"
        value={weight} // FIXED
        onChangeText={setWeight} // FIXED
      />
      <TouchableOpacity style={styles.button} onPress={addSet}>
        <Text style={styles.buttonText}>Add Set</Text>
      </TouchableOpacity>
      <FlatList
        data={Object.entries(exercises).filter(([_, exercises]) => Object.keys(exercises).length > 0)}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, exercisesInCategory] }) => (
          <View>
            <Text style={styles.categoryTitle}>• {category}</Text>
            {Object.entries(exercisesInCategory).map(([exercise, sets]) => (
              <View key={exercise} style={styles.exerciseContainer}>
                <Text style={styles.exerciseTitle}>  ↳ {exercise}</Text>
                {Array.isArray(sets) && sets.length > 0 ? (
                  sets.map((set, index) => (
                    <Text key={index} style={styles.setText}>
                      &nbsp;&nbsp;&nbsp;&nbsp;• Set {index + 1}: {set.reps} reps of {set.weight} kg
                    </Text>
                  ))
                ) : (
                  <Text style={styles.setText}>  &nbsp;&nbsp;&nbsp;&nbsp;No sets logged</Text>
                )}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: width * 0.05,  // 5% of screen width
    backgroundColor: '#000' 
  },
  header: { 
    fontSize: width * 0.06,  // 6% of screen width
    fontWeight: 'bold', 
    color: '#C1FF00', 
    textAlign: 'center', 
    marginBottom: height * 0.02 // 2% of screen height
  },
  errorText: { 
    color: 'red', 
    textAlign: 'center', 
    marginTop: height * 0.03 // 3% of screen height
  },
  datePickerButton: { 
    backgroundColor: '#222', 
    padding: height * 0.015,  // 1.5% of screen height
    borderRadius: width * 0.02, // 2% of screen width
    alignItems: 'center', 
    marginBottom: height * 0.02 
  },
  datePickerText: { 
    color: '#C1FF00', 
    fontSize: width * 0.045,  // 4.5% of screen width
    fontWeight: 'bold' 
  },
  picker: { 
    backgroundColor: '#222', 
    color: '#FFF', 
    marginBottom: height * 0.015 
  },
  input: { 
    backgroundColor: '#222', 
    color: '#FFF', 
    padding: height * 0.015, 
    marginBottom: height * 0.015, 
    borderRadius: width * 0.02 
  },
  button: { 
    backgroundColor: '#C1FF00', 
    padding: height * 0.02, 
    borderRadius: width * 0.02, 
    alignItems: 'center', 
    marginBottom: height * 0.03 
  },
  buttonText: { 
    fontWeight: 'bold', 
    color: '#000', 
    fontSize: width * 0.045 
  },
  categoryTitle: { 
    fontSize: width * 0.05, 
    fontWeight: 'bold', 
    color: '#C1FF00', 
    marginTop: height * 0.015 
  },
  exerciseContainer: { 
    paddingLeft: width * 0.025 
  },
  exerciseTitle: { 
    fontSize: width * 0.045, 
    fontWeight: 'bold', 
    color: '#C1FF00' 
  },
  setText: { 
    color: '#FFF', 
    fontSize: width * 0.04, 
    paddingLeft: width * 0.05 
  }
});

export default RepLogger;
