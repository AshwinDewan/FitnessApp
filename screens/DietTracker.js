import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { fetchFoodData } from '../api/openFoodFacts';
import { fetchEdamamData } from '../api/edamam';

const MealTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foodData, setFoodData] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    let data = await fetchFoodData(searchTerm);

    if (!data) {
      console.log('Fallback to Edamam API...');
      data = await fetchEdamamData(searchTerm);
    }

    setFoodData(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Food Name / Barcode"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Button title="Search" onPress={handleSearch} />

      {foodData && (
        <View style={styles.resultContainer}>
          {foodData.image && <Image source={{ uri: foodData.image }} style={styles.image} />}
          <Text style={styles.foodName}>{foodData.name}</Text>
          <Text>Calories: {foodData.calories} kcal</Text>
          <Text>Protein: {foodData.protein} g</Text>
          <Text>Carbs: {foodData.carbs} g</Text>
          <Text>Fats: {foodData.fats} g</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C1FF00',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#C1FF00',
    borderRadius: 5,
    color: '#FFF',
    marginBottom: 10,
    backgroundColor: '#222',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default MealTracker;
