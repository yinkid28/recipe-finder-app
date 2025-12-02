// js/modules/apiService.js
// Handles all external API calls to Spoonacular, Nutritionix, and Unsplash

import API_KEYS from '../config.js';

const apiService = {
    // Base URLs
    SPOONACULAR_BASE_URL: 'https://api.spoonacular.com',
    NUTRITIONIX_BASE_URL: 'https://trackapi.nutritionix.com/v2',
    UNSPLASH_BASE_URL: 'https://api.unsplash.com',

    /**
     * Search recipes by ingredients
     * @param {string} ingredients - Comma-separated list of ingredients
     * @param {object} filters - Dietary and cuisine filters
     * @returns {Promise<Array>} Array of recipe results
     */
    async searchRecipesByIngredients(ingredients, filters = {}) {
        try {
            // Build query parameters
            const params = new URLSearchParams({
                apiKey: API_KEYS.spoonacular,
                ingredients: ingredients,
                number: 12, // Number of results to return
                ranking: 2, // Maximize used ingredients
                ignorePantry: true
            });

            // Add dietary filters if present
            if (filters.diet && filters.diet.length > 0) {
                params.append('diet', filters.diet.join(','));
            }

            // Add cuisine filters if present
            if (filters.cuisine && filters.cuisine.length > 0) {
                params.append('cuisine', filters.cuisine.join(','));
            }

            // Add intolerances if present
            if (filters.intolerances && filters.intolerances.length > 0) {
                params.append('intolerances', filters.intolerances.join(','));
            }

            const url = `${this.SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Spoonacular API error: ${response.status}`);
            }

            const data = await response.json();
            return data.results || [];

        } catch (error) {
            console.error('Error searching recipes:', error);
            throw error;
        }
    },

    /**
     * Get detailed recipe information by ID
     * @param {number} recipeId - The recipe ID
     * @returns {Promise<object>} Recipe details
     */
    async getRecipeDetails(recipeId) {
        try {
            const params = new URLSearchParams({
                apiKey: API_KEYS.spoonacular,
                includeNutrition: true
            });

            const url = `${this.SPOONACULAR_BASE_URL}/recipes/${recipeId}/information?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch recipe details: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching recipe details:', error);
            throw error;
        }
    },

    /**
     * Get analyzed recipe instructions
     * @param {number} recipeId - The recipe ID
     * @returns {Promise<Array>} Step-by-step instructions
     */
    async getRecipeInstructions(recipeId) {
        try {
            const params = new URLSearchParams({
                apiKey: API_KEYS.spoonacular
            });

            const url = `${this.SPOONACULAR_BASE_URL}/recipes/${recipeId}/analyzedInstructions?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch instructions: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching recipe instructions:', error);
            throw error;
        }
    },

    /**
     * Get nutrition information for a recipe
     * @param {number} recipeId - The recipe ID
     * @returns {Promise<object>} Nutrition data
     */
    async getRecipeNutrition(recipeId) {
        try {
            const params = new URLSearchParams({
                apiKey: API_KEYS.spoonacular
            });

            const url = `${this.SPOONACULAR_BASE_URL}/recipes/${recipeId}/nutritionWidget.json?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch nutrition: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching nutrition:', error);
            throw error;
        }
    },

    /**
     * Search for food images on Unsplash
     * @param {string} query - Search query (recipe name or cuisine)
     * @returns {Promise<string>} Image URL
     */
    async searchFoodImage(query) {
        try {
            // Check if Unsplash key is available
            if (!API_KEYS.unsplash || API_KEYS.unsplash === 'LATER') {
                console.warn('Unsplash API key not configured');
                return null;
            }

            const params = new URLSearchParams({
                query: `${query} food`,
                per_page: 1,
                orientation: 'landscape'
            });

            const url = `${this.UNSPLASH_BASE_URL}/search/photos?${params}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Client-ID ${API_KEYS.unsplash}`
                }
            });

            if (!response.ok) {
                throw new Error(`Unsplash API error: ${response.status}`);
            }

            const data = await response.json();
            return data.results[0]?.urls?.regular || null;

        } catch (error) {
            console.error('Error fetching Unsplash image:', error);
            return null;
        }
    },

    /**
     * Get detailed nutrition from Nutritionix
     * @param {string} foodName - Name of the food/recipe
     * @returns {Promise<object>} Detailed nutrition data
     */
    async getNutritionixData(foodName) {
        try {
            // Check if Nutritionix keys are available
            if (!API_KEYS.nutritionix.appId || API_KEYS.nutritionix.appId === 'LATER') {
                console.warn('Nutritionix API keys not configured');
                return null;
            }

            const url = `${this.NUTRITIONIX_BASE_URL}/natural/nutrients`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': API_KEYS.nutritionix.appId,
                    'x-app-key': API_KEYS.nutritionix.appKey
                },
                body: JSON.stringify({
                    query: foodName
                })
            });

            if (!response.ok) {
                throw new Error(`Nutritionix API error: ${response.status}`);
            }

            const data = await response.json();
            return data.foods[0] || null;

        } catch (error) {
            console.error('Error fetching Nutritionix data:', error);
            return null;
        }
    },

    /**
     * Get random recipes (for homepage/inspiration)
     * @param {number} number - Number of random recipes to fetch
     * @returns {Promise<Array>} Array of random recipes
     */
    async getRandomRecipes(number = 6) {
        try {
            const params = new URLSearchParams({
                apiKey: API_KEYS.spoonacular,
                number: number
            });

            const url = `${this.SPOONACULAR_BASE_URL}/recipes/random?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch random recipes: ${response.status}`);
            }

            const data = await response.json();
            return data.recipes || [];

        } catch (error) {
            console.error('Error fetching random recipes:', error);
            throw error;
        }
    },

    /**
     * Autocomplete ingredient search
     * @param {string} query - Partial ingredient name
     * @returns {Promise<Array>} Suggested ingredients
     */
    async autocompleteIngredient(query) {
        try {
            const params = new URLSearchParams({
                apiKey: API_KEYS.spoonacular,
                query: query,
                number: 10
            });

            const url = `${this.SPOONACULAR_BASE_URL}/food/ingredients/autocomplete?${params}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Autocomplete error: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error with autocomplete:', error);
            return [];
        }
    }
};

export default apiService;