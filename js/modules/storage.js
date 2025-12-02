// js/modules/storage.js
// Manages all localStorage operations for the application

const storage = {
    // Storage keys
    KEYS: {
        FAVORITES: 'recipeFinder_favorites',
        SHOPPING_LIST: 'recipeFinder_shoppingList',
        MEAL_PLAN: 'recipeFinder_mealPlan',
        DIETARY_FILTERS: 'recipeFinder_dietaryFilters',
        CUISINE_FILTERS: 'recipeFinder_cuisineFilters',
        SEARCH_HISTORY: 'recipeFinder_searchHistory',
        USER_PREFERENCES: 'recipeFinder_userPreferences'
    },

    /**
     * Get data from localStorage
     * @param {string} key - The storage key
     * @returns {any} Parsed data or null
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return null;
        }
    },

    /**
     * Set data in localStorage
     * @param {string} key - The storage key
     * @param {any} value - The value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - The storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    },

    /**
     * Clear all app data from localStorage
     */
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // ============ FAVORITES ============

    /**
     * Get all favorite recipes
     * @returns {Array} Array of favorite recipe objects
     */
    getFavorites() {
        return this.get(this.KEYS.FAVORITES) || [];
    },

    /**
     * Add recipe to favorites
     * @param {object} recipe - Recipe object to save
     * @returns {boolean} Success status
     */
    addFavorite(recipe) {
        const favorites = this.getFavorites();
        
        // Check if already in favorites
        if (favorites.some(fav => fav.id === recipe.id)) {
            console.log('Recipe already in favorites');
            return false;
        }

        favorites.push({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            dateAdded: new Date().toISOString()
        });

        return this.set(this.KEYS.FAVORITES, favorites);
    },

    /**
     * Remove recipe from favorites
     * @param {number} recipeId - Recipe ID to remove
     * @returns {boolean} Success status
     */
    removeFavorite(recipeId) {
        const favorites = this.getFavorites();
        const filtered = favorites.filter(fav => fav.id !== recipeId);
        return this.set(this.KEYS.FAVORITES, filtered);
    },

    /**
     * Check if recipe is in favorites
     * @param {number} recipeId - Recipe ID to check
     * @returns {boolean} True if in favorites
     */
    isFavorite(recipeId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === recipeId);
    },

    // ============ SHOPPING LIST ============

    /**
     * Get shopping list
     * @returns {Array} Array of shopping list items
     */
    getShoppingList() {
        return this.get(this.KEYS.SHOPPING_LIST) || [];
    },

    /**
     * Add item to shopping list
     * @param {object} item - Item object {name, amount, unit, category, checked}
     * @returns {boolean} Success status
     */
    addToShoppingList(item) {
        const shoppingList = this.getShoppingList();
        
        // Check if item already exists
        const existingIndex = shoppingList.findIndex(
            listItem => listItem.name.toLowerCase() === item.name.toLowerCase()
        );

        if (existingIndex !== -1) {
            // Update existing item
            shoppingList[existingIndex] = {
                ...shoppingList[existingIndex],
                amount: item.amount,
                unit: item.unit
            };
        } else {
            // Add new item
            shoppingList.push({
                id: Date.now(),
                name: item.name,
                amount: item.amount,
                unit: item.unit,
                category: item.category || 'Other',
                checked: false,
                dateAdded: new Date().toISOString()
            });
        }

        return this.set(this.KEYS.SHOPPING_LIST, shoppingList);
    },

    /**
     * Remove item from shopping list
     * @param {number} itemId - Item ID to remove
     * @returns {boolean} Success status
     */
    removeFromShoppingList(itemId) {
        const shoppingList = this.getShoppingList();
        const filtered = shoppingList.filter(item => item.id !== itemId);
        return this.set(this.KEYS.SHOPPING_LIST, filtered);
    },

    /**
     * Toggle item checked status
     * @param {number} itemId - Item ID to toggle
     * @returns {boolean} Success status
     */
    toggleShoppingListItem(itemId) {
        const shoppingList = this.getShoppingList();
        const item = shoppingList.find(item => item.id === itemId);
        
        if (item) {
            item.checked = !item.checked;
            return this.set(this.KEYS.SHOPPING_LIST, shoppingList);
        }
        
        return false;
    },

    /**
     * Clear all checked items from shopping list
     * @returns {boolean} Success status
     */
    clearCheckedItems() {
        const shoppingList = this.getShoppingList();
        const unchecked = shoppingList.filter(item => !item.checked);
        return this.set(this.KEYS.SHOPPING_LIST, unchecked);
    },

    /**
     * Clear entire shopping list
     * @returns {boolean} Success status
     */
    clearShoppingList() {
        return this.set(this.KEYS.SHOPPING_LIST, []);
    },

    // ============ MEAL PLAN ============

    /**
     * Get meal plan
     * @returns {object} Meal plan object organized by date
     */
    getMealPlan() {
        return this.get(this.KEYS.MEAL_PLAN) || {};
    },

    /**
     * Add recipe to meal plan
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} mealType - 'breakfast', 'lunch', or 'dinner'
     * @param {object} recipe - Recipe object
     * @returns {boolean} Success status
     */
    addToMealPlan(date, mealType, recipe) {
        const mealPlan = this.getMealPlan();
        
        if (!mealPlan[date]) {
            mealPlan[date] = {};
        }

        mealPlan[date][mealType] = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            servings: recipe.servings
        };

        return this.set(this.KEYS.MEAL_PLAN, mealPlan);
    },

    /**
     * Remove recipe from meal plan
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} mealType - 'breakfast', 'lunch', or 'dinner'
     * @returns {boolean} Success status
     */
    removeFromMealPlan(date, mealType) {
        const mealPlan = this.getMealPlan();
        
        if (mealPlan[date] && mealPlan[date][mealType]) {
            delete mealPlan[date][mealType];
            
            // Remove date if no meals left
            if (Object.keys(mealPlan[date]).length === 0) {
                delete mealPlan[date];
            }
            
            return this.set(this.KEYS.MEAL_PLAN, mealPlan);
        }
        
        return false;
    },

    /**
     * Clear entire meal plan
     * @returns {boolean} Success status
     */
    clearMealPlan() {
        return this.set(this.KEYS.MEAL_PLAN, {});
    },

    // ============ FILTERS ============

    /**
     * Get saved dietary filters
     * @returns {Array} Array of selected dietary filters
     */
    getDietaryFilters() {
        return this.get(this.KEYS.DIETARY_FILTERS) || [];
    },

    /**
     * Save dietary filters
     * @param {Array} filters - Array of filter strings
     * @returns {boolean} Success status
     */
    saveDietaryFilters(filters) {
        return this.set(this.KEYS.DIETARY_FILTERS, filters);
    },

    /**
     * Get saved cuisine filters
     * @returns {Array} Array of selected cuisine filters
     */
    getCuisineFilters() {
        return this.get(this.KEYS.CUISINE_FILTERS) || [];
    },

    /**
     * Save cuisine filters
     * @param {Array} filters - Array of filter strings
     * @returns {boolean} Success status
     */
    saveCuisineFilters(filters) {
        return this.set(this.KEYS.CUISINE_FILTERS, filters);
    },

    // ============ SEARCH HISTORY ============

    /**
     * Get search history
     * @returns {Array} Array of recent searches
     */
    getSearchHistory() {
        return this.get(this.KEYS.SEARCH_HISTORY) || [];
    },

    /**
     * Add search to history
     * @param {string} searchQuery - Search query string
     * @returns {boolean} Success status
     */
    addToSearchHistory(searchQuery) {
        const history = this.getSearchHistory();
        
        // Remove if already exists
        const filtered = history.filter(item => item.query !== searchQuery);
        
        // Add to beginning
        filtered.unshift({
            query: searchQuery,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 searches
        const trimmed = filtered.slice(0, 10);
        
        return this.set(this.KEYS.SEARCH_HISTORY, trimmed);
    },

    /**
     * Clear search history
     * @returns {boolean} Success status
     */
    clearSearchHistory() {
        return this.set(this.KEYS.SEARCH_HISTORY, []);
    }
};

export default storage;