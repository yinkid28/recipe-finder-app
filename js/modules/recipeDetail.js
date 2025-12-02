// js/modules/recipeDetail.js
// Manages the detailed recipe page display

import apiService from './apiService.js';
import storage from './storage.js';
import utils from './utils.js';

const recipeDetail = {
    currentRecipe: null,
    originalServings: 0,
    currentServings: 0,

    /**
     * Initialize recipe detail page
     * @param {number} recipeId - Recipe ID from URL
     */
    async init(recipeId) {
        if (!recipeId) {
            this.showError('No recipe ID provided');
            return;
        }

        try {
            // Show loading state
            this.showLoading();

            // Fetch recipe details
            const recipe = await apiService.getRecipeDetails(recipeId);
            
            if (!recipe) {
                this.showError('Recipe not found');
                return;
            }

            // Store recipe data
            this.currentRecipe = recipe;
            this.originalServings = recipe.servings || 4;
            this.currentServings = recipe.servings || 4;

            // Display recipe
            this.displayRecipe(recipe);

            // Fetch instructions separately
            await this.loadInstructions(recipeId);

            // Setup interactive features
            this.setupServingAdjuster();
            this.setupFavoriteButton();
            this.setupActionButtons();

        } catch (error) {
            console.error('Error loading recipe:', error);
            this.showError('Failed to load recipe details');
        }
    },

    /**
     * Display recipe information
     * @param {object} recipe - Recipe data
     */
    displayRecipe(recipe) {
        // Hide loading, show content
        const loadingState = document.getElementById('loadingState');
        const recipeContainer = document.getElementById('recipeDetailContainer');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (recipeContainer) recipeContainer.classList.remove('hidden');

        // Set recipe title
        const titleElement = document.getElementById('recipeTitle');
        if (titleElement) {
            titleElement.textContent = recipe.title;
        }

        // Set recipe image
        const imageElement = document.getElementById('recipeImage');
        if (imageElement) {
            imageElement.src = recipe.image || 'assets/images/placeholder.jpg';
            imageElement.alt = recipe.title;
        }

        // Set cuisine badge
        const cuisineBadge = document.getElementById('cuisineBadge');
        if (cuisineBadge && recipe.cuisines && recipe.cuisines.length > 0) {
            cuisineBadge.textContent = recipe.cuisines[0];
        } else if (cuisineBadge) {
            cuisineBadge.textContent = 'International';
        }

        // Set difficulty badge (estimate based on time)
        const difficultyBadge = document.getElementById('difficultyBadge');
        if (difficultyBadge) {
            const difficulty = this.estimateDifficulty(recipe);
            difficultyBadge.textContent = difficulty;
        }

        // Set meta information
        this.displayMetaInfo(recipe);

        // Display ingredients
        this.displayIngredients(recipe);

        // Display nutrition
        this.displayNutrition(recipe);
    },

    /**
     * Display meta information (prep time, cook time, etc.)
     * @param {object} recipe - Recipe data
     */
    displayMetaInfo(recipe) {
        // Prep time
        const prepTimeElement = document.getElementById('prepTime');
        if (prepTimeElement) {
            prepTimeElement.textContent = recipe.preparationMinutes 
                ? `${recipe.preparationMinutes} min` 
                : 'N/A';
        }

        // Cook time
        const cookTimeElement = document.getElementById('cookTime');
        if (cookTimeElement) {
            cookTimeElement.textContent = recipe.cookingMinutes 
                ? `${recipe.cookingMinutes} min` 
                : recipe.readyInMinutes 
                ? `${recipe.readyInMinutes} min` 
                : 'N/A';
        }

        // Servings
        const servingsElement = document.getElementById('servings');
        if (servingsElement) {
            servingsElement.textContent = recipe.servings || '4';
        }

        // Difficulty
        const difficultyElement = document.getElementById('difficulty');
        if (difficultyElement) {
            difficultyElement.textContent = this.estimateDifficulty(recipe);
        }

        // Current servings display
        const currentServingsElement = document.getElementById('currentServings');
        if (currentServingsElement) {
            currentServingsElement.textContent = this.currentServings;
        }
    },

    /**
     * Estimate recipe difficulty
     * @param {object} recipe - Recipe data
     * @returns {string} Difficulty level
     */
    estimateDifficulty(recipe) {
        const time = recipe.readyInMinutes || 0;
        const steps = recipe.analyzedInstructions?.[0]?.steps?.length || 0;

        if (time < 30 && steps < 5) return 'Easy';
        if (time < 60 && steps < 10) return 'Medium';
        return 'Hard';
    },

    /**
     * Display ingredients list
     * @param {object} recipe - Recipe data
     */
    displayIngredients(recipe) {
        const ingredientsList = document.getElementById('ingredientsList');
        if (!ingredientsList) return;

        ingredientsList.innerHTML = '';

        if (!recipe.extendedIngredients || recipe.extendedIngredients.length === 0) {
            ingredientsList.innerHTML = '<li class="ingredient-item">No ingredients information available</li>';
            return;
        }

        recipe.extendedIngredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.className = 'ingredient-item';
            
            const amount = this.calculateAdjustedAmount(
                ingredient.amount,
                this.originalServings,
                this.currentServings
            );

            const unit = ingredient.unit || '';
            const name = ingredient.name || ingredient.original;

            li.innerHTML = `
                <span><strong>${utils.formatAmount(amount)} ${unit}</strong> ${name}</span>
            `;

            ingredientsList.appendChild(li);
        });
    },

    /**
     * Load and display instructions
     * @param {number} recipeId - Recipe ID
     */
    async loadInstructions(recipeId) {
        try {
            const instructions = await apiService.getRecipeInstructions(recipeId);
            this.displayInstructions(instructions);
        } catch (error) {
            console.error('Error loading instructions:', error);
            const instructionsList = document.getElementById('instructionsList');
            if (instructionsList) {
                instructionsList.innerHTML = '<p class="text-secondary">Instructions not available for this recipe.</p>';
            }
        }
    },

    /**
     * Display cooking instructions
     * @param {Array} instructions - Instructions data
     */
    displayInstructions(instructions) {
        const instructionsList = document.getElementById('instructionsList');
        if (!instructionsList) return;

        instructionsList.innerHTML = '';

        if (!instructions || instructions.length === 0 || !instructions[0].steps) {
            instructionsList.innerHTML = '<p class="text-secondary">No instructions available for this recipe.</p>';
            return;
        }

        const steps = instructions[0].steps;

        steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'instruction-step';
            stepDiv.setAttribute('data-step', index + 1);

            const stepText = document.createElement('p');
            stepText.className = 'instruction-text';
            stepText.textContent = step.step;

            stepDiv.appendChild(stepText);
            instructionsList.appendChild(stepDiv);
        });
    },

    /**
     * Display nutrition information
     * @param {object} recipe - Recipe data
     */
    displayNutrition(recipe) {
        const nutritionItems = document.getElementById('nutritionItems');
        if (!nutritionItems) return;

        nutritionItems.innerHTML = '';

        if (!recipe.nutrition || !recipe.nutrition.nutrients) {
            nutritionItems.innerHTML = '<p class="text-center text-secondary">Nutrition information not available</p>';
            return;
        }

        // Key nutrients to display
        const keyNutrients = ['Calories', 'Protein', 'Carbohydrates', 'Fat', 'Fiber', 'Sugar', 'Sodium'];

        recipe.nutrition.nutrients.forEach(nutrient => {
            if (keyNutrients.includes(nutrient.name)) {
                const item = this.createNutritionItem(nutrient);
                nutritionItems.appendChild(item);
            }
        });
    },

    /**
     * Create nutrition item element
     * @param {object} nutrient - Nutrient data
     * @returns {HTMLElement} Nutrition item element
     */
    createNutritionItem(nutrient) {
        const div = document.createElement('div');
        div.className = 'nutrition-item';

        const label = document.createElement('div');
        label.className = 'nutrition-label';
        
        const name = document.createElement('span');
        name.textContent = nutrient.name;
        
        const value = document.createElement('span');
        value.textContent = `${Math.round(nutrient.amount)}${nutrient.unit}`;
        
        label.appendChild(name);
        label.appendChild(value);

        const bar = document.createElement('div');
        bar.className = 'nutrition-bar';

        const fill = document.createElement('div');
        fill.className = 'nutrition-fill';
        
        // Calculate percentage (assuming 2000 calorie diet)
        const percentage = nutrient.percentOfDailyNeeds || 0;
        fill.style.width = `${Math.min(percentage, 100)}%`;

        bar.appendChild(fill);
        div.appendChild(label);
        div.appendChild(bar);

        return div;
    },

    /**
     * Setup serving size adjuster
     */
    setupServingAdjuster() {
        const decreaseBtn = document.getElementById('decreaseServings');
        const increaseBtn = document.getElementById('increaseServings');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                if (this.currentServings > 1) {
                    this.currentServings--;
                    this.updateServings();
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.currentServings++;
                this.updateServings();
            });
        }
    },

    /**
     * Update servings and recalculate ingredients
     */
    updateServings() {
        // Update display
        const currentServingsElement = document.getElementById('currentServings');
        if (currentServingsElement) {
            currentServingsElement.textContent = this.currentServings;
        }

        // Recalculate and update ingredients
        this.displayIngredients(this.currentRecipe);

        utils.showToast(`Adjusted to ${this.currentServings} servings`, 'info');
    },

    /**
     * Calculate adjusted ingredient amount
     * @param {number} originalAmount - Original amount
     * @param {number} originalServings - Original servings
     * @param {number} newServings - New servings
     * @returns {number} Adjusted amount
     */
    calculateAdjustedAmount(originalAmount, originalServings, newServings) {
        return utils.scaleIngredient(originalAmount, originalServings, newServings);
    },

    /**
     * Setup favorite button
     */
    setupFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!favoriteBtn) return;

        const isFavorite = storage.isFavorite(this.currentRecipe.id);
        const icon = favoriteBtn.querySelector('i');

        if (isFavorite) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = 'var(--color-primary-red)';
        }

        favoriteBtn.addEventListener('click', () => {
            const isCurrentlyFavorite = storage.isFavorite(this.currentRecipe.id);

            if (isCurrentlyFavorite) {
                storage.removeFavorite(this.currentRecipe.id);
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = '';
                utils.showToast('Removed from favorites', 'info');
            } else {
                storage.addFavorite({
                    id: this.currentRecipe.id,
                    title: this.currentRecipe.title,
                    image: this.currentRecipe.image,
                    readyInMinutes: this.currentRecipe.readyInMinutes,
                    servings: this.currentRecipe.servings
                });
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = 'var(--color-primary-red)';
                utils.showToast('Added to favorites!', 'success');
            }
        });
    },

    /**
     * Setup action buttons (shopping list, meal plan)
     */
    setupActionButtons() {
        const shoppingListBtn = document.getElementById('addToShoppingListBtn');
        const mealPlanBtn = document.getElementById('addToMealPlanBtn');

        if (shoppingListBtn) {
            shoppingListBtn.addEventListener('click', () => {
                this.addToShoppingList();
            });
        }

        if (mealPlanBtn) {
            mealPlanBtn.addEventListener('click', () => {
                utils.showToast('Meal Planner coming in Week 6!', 'info');
            });
        }
    },

    /**
     * Add all ingredients to shopping list
     */
    addToShoppingList() {
        if (!this.currentRecipe || !this.currentRecipe.extendedIngredients) {
            utils.showToast('No ingredients to add', 'warning');
            return;
        }

        let addedCount = 0;

        this.currentRecipe.extendedIngredients.forEach(ingredient => {
            const amount = this.calculateAdjustedAmount(
                ingredient.amount,
                this.originalServings,
                this.currentServings
            );

            const item = {
                name: ingredient.name || ingredient.original,
                amount: amount,
                unit: ingredient.unit || '',
                category: utils.categorizeIngredient(ingredient.name)
            };

            storage.addToShoppingList(item);
            addedCount++;
        });

        utils.showToast(`Added ${addedCount} ingredients to shopping list!`, 'success');
    },

    /**
     * Show loading state
     */
    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const recipeContainer = document.getElementById('recipeDetailContainer');
        const errorState = document.getElementById('errorState');

        if (loadingState) loadingState.classList.remove('hidden');
        if (recipeContainer) recipeContainer.classList.add('hidden');
        if (errorState) errorState.classList.add('hidden');
    },

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        const loadingState = document.getElementById('loadingState');
        const recipeContainer = document.getElementById('recipeDetailContainer');
        const errorState = document.getElementById('errorState');

        if (loadingState) loadingState.classList.add('hidden');
        if (recipeContainer) recipeContainer.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');

        utils.showToast(message, 'error');
    }
};

export default recipeDetail;