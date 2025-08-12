import axios from 'axios';

const APP_ID = 'db29b2a9';
const APP_KEY = '756077cad96ff915771cd515c278c9f4';
// const APP_KEY = '756077cad96ff915771cd515c278c9f4	—';
const BASE_URL = 'https://api.edamam.com/api/food-database/v2/parser';

export const fetchEdamamData = async (foodItem) => {
  try {
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(
      foodItem
    )}&nutrition-type=cooking`;

    console.log("Fetching data from Edamam API:", url);

    const response = await axios.get(url);

    if (response.data && response.data.parsed.length > 0) {
      const food = response.data.parsed[0].food;
      return {
        name: food.label,
        calories: food.nutrients.ENERC_KCAL || 0,
        protein: food.nutrients.PROCNT || 0,
        carbs: food.nutrients.CHOCDF || 0,
        fats: food.nutrients.FAT || 0,
        image: food.image || null,
      };
    } else {
      console.log("⚠️ No food data found in Edamam API.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching food data from Edamam:", error.response ? error.response.data : error.message);
    return null;
  }
};
