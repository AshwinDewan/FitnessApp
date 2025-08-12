import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatisticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Sleep: 7:56 hrs</Text>
        <Text style={styles.stat}>Steps: 16,225</Text>
        <Text style={styles.stat}>Calories: 761 kcal</Text>
        <Text style={styles.stat}>Distance: 3.5 km</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  statsContainer: { marginTop: 20 },
  stat: { fontSize: 18, color: '#2D2D2D', marginVertical: 5 }
});

export default StatisticsScreen;
