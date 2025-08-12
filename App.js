import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig";
import LinearGradient from 'react-native-linear-gradient';
import HomeScreen from "./screens/HomeScreen"; // Import the HomeScreen
import RepLoggerScreen from "./screens/RepLogger"; // Add this
import WeightTrackerScreen from "./screens/WeightTracker"; // Add this
import WorkoutPlannerScreen from './screens/WorkoutPlanner';
import MealTracker from './screens/DietTracker';
import MeasurementTracker from './screens/MeasurementTracker';

const auth = getAuth(app);
const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup Successful!");
      navigation.replace("Home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#c1ff00" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#c1ff00" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
      navigation.replace("Home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888A88" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888A88" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="repLogger" component={RepLoggerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="weightTracker" component={WeightTrackerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="workoutPlanner" component={WorkoutPlannerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="dietTracker" component={MealTracker} options={{ headerShown: false }} />
        <Stack.Screen name="MeasurementTracker" component={MeasurementTracker} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer> 
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    padding: width * 0.05,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    color: "#C1FF00",
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  input: {
    width: "90%",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
    // backgroundColor: "#333",
    borderColor: "#FFF",
    borderWidth: 2,
    color: "#D3D3D3",
    borderRadius: width * 0.02,
    fontSize: width * 0.045,
  },
  button: {
    backgroundColor: "#C1FF00",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    width: "90%",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  linkText: {
    color: "#888A88",
    marginTop: height * 0.02,
    textDecorationLine: "underline",
    fontSize: width * 0.04,
  },
});