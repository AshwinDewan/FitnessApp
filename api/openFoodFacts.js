import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';

export const fetchFoodData = async (barcode) => {
  try {
    const response = await axios.get(`${BASE_URL}/${barcode}.json`);
    
    if (response.data && response.data.product) {
      const product = response.data.product;

      return {
        name: product.product_name || 'Unknown Food',
        calories: product.nutriments?.energy_kcal || 0,
        protein: product.nutriments?.proteins || 0,
        carbs: product.nutriments?.carbohydrates || 0,
        fats: product.nutriments?.fat || 0,
        image: product.image_url || null,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching food data:', error);
    return null;
  }
};
