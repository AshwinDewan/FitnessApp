import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure this is correctly imported
import HomeScreen from '../screens/HomeScreen';
import RepLogger from './screens/RepLogger';
import WorkoutPlanner from '../screens/WorkoutPlanner';
import WeightTracker from '../screens/WeightTracker';
import StatisticsScreen from '../screens/StatisticsScreen';
import MealTracker from '../screens/DietTracker';
import MeasurementTracker from '../screens/MeasurementTracker';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }
          else if (route.name === 'Workout') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hides the header on all tabs
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutPlanner} />
      <Tab.Screen name="Weight" component={WeightTracker} />
      <Tab.Screen name="Rep Logger" component={RepLogger} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Meal Tracker" component={MealTracker} />
      <Tab.Screen name="Settings" component={MeasurementTracker} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
