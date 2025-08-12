import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, setDoc, doc, updateDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";

const firestore = getFirestore(app);
const auth = getAuth(app);

const { width, height } = Dimensions.get('window');

const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkoutPlannerScreen = () => {
  const [workouts, setWorkouts] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);
  const [exercisesList, setExercisesList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    fetchExercises();
    fetchWorkouts();
  
    // Get today's day (0 = Sunday, 6 = Saturday)
    const todayIndex = new Date().getDay();
  
    // Map JavaScript's getDay() index to your workoutDays array
    const mappedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  
    console.log("Today's day (JS index):", todayIndex);
    console.log("Mapped Workout Day:", workoutDays[mappedIndex]);
  
    setExpandedDay(workoutDays[mappedIndex]);
  }, []);

  const fetchExercises = async () => {
    try {
      const categoriesRef = collection(firestore, "exerciseCategories");
      const snapshot = await getDocs(categoriesRef);
      if (snapshot.empty) return;

      let exercisesArray = [];
      snapshot.docs.forEach(doc => {
        const category = doc.id;
        const data = doc.data();
        if (data.exercises && Array.isArray(data.exercises)) {
          data.exercises.forEach(exercise => {
            exercisesArray.push({ name: exercise, category });
          });
        }
      });

      setExercisesList(exercisesArray);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(firestore, 'workoutPlanner'), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const data = {};
      querySnapshot.forEach((doc) => {
        const workoutData = doc.data();
        data[workoutData.day] = workoutData.exercises || [];
      });

      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const addExercise = async (day) => {
    if (!selectedExercise || workouts[day]?.includes(selectedExercise)) return;

    const updatedWorkouts = { ...workouts };
    if (!updatedWorkouts[day]) updatedWorkouts[day] = [];
    updatedWorkouts[day].push(selectedExercise);

    setWorkouts(updatedWorkouts);
    setSelectedExercise(null);

    const user = auth.currentUser;
    if (!user) return;

    const workoutData = {
      userId: user.uid,
      day: day,
      exercises: updatedWorkouts[day],
    };

    await setDoc(doc(firestore, 'workoutPlanner', `${user.uid}_${day}`), workoutData);
  };

  const toggleEditMode = (day) => {
    setEditMode((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const deleteExercise = async (day, exercise) => {
    const updatedWorkouts = { ...workouts };
    updatedWorkouts[day] = updatedWorkouts[day].filter(ex => ex !== exercise);

    setWorkouts(updatedWorkouts);

    const user = auth.currentUser;
    if (!user) return;

    const workoutRef = doc(firestore, 'workoutPlanner', `${user.uid}_${day}`);
    await updateDoc(workoutRef, { exercises: updatedWorkouts[day] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Planner</Text>
      <ScrollView>
        {workoutDays.map((day) => (
          <View key={day} style={styles.dayContainer}>
            <TouchableOpacity onPress={() => setExpandedDay(expandedDay === day ? null : day)} style={styles.dayHeader}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.expandIcon}>{expandedDay === day ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {expandedDay === day && (
              <View style={styles.exerciseContainer}>
                {workouts[day]?.length > 0 ? (
                  <>
                    {workouts[day].map((exercise, index) => (
                      <View key={index} style={styles.exerciseRow}>
                        <Text style={styles.exerciseText}>• {exercise}</Text>
                        {editMode[day] && (
                          <TouchableOpacity onPress={() => deleteExercise(day, exercise)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    {editMode[day] && (
                      <>
                        <Picker
                          selectedValue={selectedExercise}
                          style={styles.picker}
                          onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                        >
                          <Picker.Item label="Select an exercise" value="" />

                          {Array.isArray(exercisesList) && [  // Ensure exercisesList is an array before using filter
                            "Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Forearms", "Core"
                          ].map((category) => (
                            exercisesList.filter(ex => ex.category === category).length > 0 && [
                              <Picker.Item
                                key={`${category}-title`}
                                label={`─── ${category.toUpperCase()} ───`}
                                value=""
                                enabled={false}
                                style={styles.categoryTitle}
                              />,
                              ...exercisesList
                                .filter(ex => ex.category === category)
                                .map((exercise, index) => (
                                  <Picker.Item
                                    key={`${category}-${index}`}
                                    label={`  • ${exercise.name}`}
                                    value={exercise.name}
                                    style={styles.exerciseItem}
                                  />
                                ))
                            ]
                          ))}
                        </Picker>

                        <TouchableOpacity onPress={() => addExercise(day)} style={styles.addButton}>
                          <Text style={styles.addButtonText}>Add Exercise</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    <TouchableOpacity onPress={() => toggleEditMode(day)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>{editMode[day] ? "Done" : "Edit"}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Picker
                      selectedValue={selectedExercise}
                      style={styles.picker}
                      onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                    >
                      <Picker.Item label="Select an exercise" value="" />

                      {Array.isArray(exercisesList) && [  // Ensure exercisesList is an array before using filter
                        "Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Forearms", "Core"
                      ].map((category) => (
                        exercisesList.filter(ex => ex.category === category).length > 0 && [
                          <Picker.Item
                            key={`${category}-title`}
                            label={`─── ${category.toUpperCase()} ───`}
                            value=""
                            enabled={false}
                            style={styles.categoryTitle}
                          />,
                          ...exercisesList
                            .filter(ex => ex.category === category)
                            .map((exercise, index) => (
                              <Picker.Item
                                key={`${category}-${index}`}
                                label={`  • ${exercise.name}`}
                                value={exercise.name}
                                style={styles.exerciseItem}
                              />
                            ))
                        ]
                      ))}
                    </Picker>

                    <TouchableOpacity onPress={() => addExercise(day)} style={styles.addButton}>
                      <Text style={styles.addButtonText}>Add Exercise</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: width * 0.05, // 5% of screen width
  },
  title: {
    color: '#C1FF00',
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02, // 2% of screen height
  },
  dayContainer: {
    backgroundColor: '#222',
    borderRadius: width * 0.02, // 2% of screen width
    marginBottom: height * 0.015, // 1.5% of screen height
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.04, // 4% of screen width
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dayText: {
    color: '#FFF',
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
  },
  expandIcon: {
    color: '#C1FF00',
    fontSize: width * 0.04, // 4% of screen width
  },
  exerciseContainer: {
    padding: width * 0.04, // 4% of screen width
    backgroundColor: '#333',
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.007, // 0.7% of screen height
  },
  exerciseText: {
    color: '#FFF',
    fontSize: width * 0.045, // 4.5% of screen width
    marginLeft: width * 0.03, // 3% of screen width
  },
  picker: {
    backgroundColor: '#222',
    marginVertical: height * 0.01, // 1% of screen height
  },
  categoryTitle: {
    fontWeight: 'bold',
    color: '#C1FF00',
  },
  exerciseItem: {
    color: '#FFF',
    marginLeft: width * 0.03, // 3% of screen width
  },
  addButton: {
    backgroundColor: '#C1FF00',
    paddingVertical: height * 0.015, // 1.5% of screen height
    paddingHorizontal: width * 0.05, // 5% of screen width
    borderRadius: width * 0.02, // 2% of screen width
    alignItems: 'center',
    marginTop: height * 0.01, // 1% of screen height
  },
  addButtonText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: width * 0.045, // 4.5% of screen width
  },
  deleteButton: {
    paddingHorizontal: width * 0.03, // 3% of screen width
    paddingVertical: height * 0.005, // 0.5% of screen height
    borderRadius: width * 0.02, // 2% of screen width
  },
  deleteButtonText: {
    color: 'red',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: height * 0.015, // 1.5% of screen height
    paddingVertical: height * 0.008, // 0.8% of screen height
    paddingHorizontal: width * 0.04, // 4% of screen width
    backgroundColor: '#C1FF00',
    borderRadius: width * 0.02, // 2% of screen width
  },
  editButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.04, // 4% of screen width
  },
});


export default WorkoutPlannerScreen;
