import React from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}> 
        <Text style={styles.welcomeText}>Welcome, Ashwin!</Text>
        <Text style={styles.subtitle}>Track your progress & stay fit</Text>
      </View>

      {/* Daily Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>5.2 km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>430 kcal</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>45 min</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>

      {/* Navigation Tiles */}
      <View style={styles.tilesContainer}>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("repLogger")}> 
          <Text style={styles.tileText}>Rep Logger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("weightTracker")}> 
          <Text style={styles.tileText}>Weight Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("workoutPlanner")}> 
          <Text style={styles.tileText}>Workout Planner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("MeasurementTracker")}> 
          <Text style={styles.tileText}>Body Measurements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("dietTracker")}> 
          <Text style={styles.tileText}>Meal Tracker</Text>
        </TouchableOpacity>
      </View>

      {/* Motivational Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "Success isn't always about greatness. It's about consistency. Keep pushing forward!"
        </Text>
      </View>

      {/* Start Workout Button */}
      <TouchableOpacity style={styles.startWorkoutButton}>
        <Text style={styles.startWorkoutText}>Start Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  header: {
    marginBottom: height * 0.03,
  },
  welcomeText: {
    fontSize: width * 0.07,
    color: "#C1FF00",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "lightgrey",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.03,
  },
  statBox: {
    backgroundColor: "#222",
    width: width * 0.28,
    paddingVertical: height * 0.025,
    alignItems: "center",
    borderRadius: width * 0.02,
  },
  statNumber: {
    fontSize: width * 0.06,
    color: "#C1FF00",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: width * 0.035,
    color: "lightgrey",
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: height * 0.03,
  },
  tile: {
    backgroundColor: "#333",
    width: width * 0.42,
    paddingVertical: height * 0.03,
    alignItems: "center",
    borderRadius: width * 0.02,
    marginBottom: height * 0.02,
  },
  tileText: {
    color: "#C1FF00",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  quoteContainer: {
    backgroundColor: "#222",
    padding: width * 0.05,
    borderRadius: width * 0.02,
    marginBottom: height * 0.03,
  },
  quoteText: {
    color: "lightgrey",
    fontSize: width * 0.04,
    fontStyle: "italic",
    textAlign: "center",
  },
  startWorkoutButton: {
    backgroundColor: "#C1FF00",
    paddingVertical: height * 0.02,
    alignItems: "center",
    borderRadius: width * 0.02,
  },
  startWorkoutText: {
    color: "black",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});

export default HomeScreen;
