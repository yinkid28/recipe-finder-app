// js/modules/recipeCard.js
// Creates and renders individual recipe preview cards

import storage from './storage.js';
import utils from './utils.js';

const recipeCard = {
    /**
     * Create a recipe card element
     * @param {object} recipe - Recipe data object
     * @returns {HTMLElement} Recipe card element
     */
    create(recipe) {
        // Create card container
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.id);

        // Check if recipe is in favorites
        const isFavorite = storage.isFavorite(recipe.id);

        // Build card HTML
        card.innerHTML = `
            <img 
                src="${recipe.image || 'assets/images/placeholder.jpg'}" 
                alt="${utils.sanitizeHTML(recipe.title)}"
                class="recipe-card-image"
                loading="lazy"
            >
            <div class="recipe-card-content">
                <h3 class="recipe-card-title">${utils.sanitizeHTML(recipe.title)}</h3>
                
                <div class="recipe-card-meta">
                    ${recipe.readyInMinutes ? `
                        <div class="recipe-card-meta-item">
                            <i class="fa-solid fa-clock"></i>
                            <span>${recipe.readyInMinutes} min</span>
                        </div>
                    ` : ''}
                    
                    ${recipe.servings ? `
                        <div class="recipe-card-meta-item">
                            <i class="fa-solid fa-utensils"></i>
                            <span>${recipe.servings} servings</span>
                        </div>
                    ` : ''}
                </div>

                <div class="recipe-card-actions">
                    <button 
                        class="btn btn-primary btn-sm view-recipe-btn"
                        data-recipe-id="${recipe.id}"
                        aria-label="View recipe details"
                    >
                        <i class="fa-solid fa-eye"></i>
                        View Recipe
                    </button>
                    
                    <button 
                        class="btn-icon favorite-btn ${isFavorite ? 'active' : ''}"
                        data-recipe-id="${recipe.id}"
                        aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
                    >
                        <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart" style="${isFavorite ? 'color: var(--color-primary-red);' : ''}"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachEventListeners(card, recipe);

        return card;
    },

    /**
     * Attach event listeners to card elements
     * @param {HTMLElement} card - Card element
     * @param {object} recipe - Recipe data
     */
    attachEventListeners(card, recipe) {
        // View recipe button
        const viewBtn = card.querySelector('.view-recipe-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleViewRecipe(recipe.id);
        });

        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleToggleFavorite(recipe, favoriteBtn);
        });

        // Click on card to view recipe
        card.addEventListener('click', () => {
            this.handleViewRecipe(recipe.id);
        });
    },

    /**
     * Handle view recipe action
     * @param {number} recipeId - Recipe ID
     */
    handleViewRecipe(recipeId) {
        // Navigate to recipe detail page
        window.location.href = `recipe-detail.html?id=${recipeId}`;
    },

    /**
     * Handle toggle favorite action
     * @param {object} recipe - Recipe data
     * @param {HTMLElement} button - Favorite button element
     */
    handleToggleFavorite(recipe, button) {
        const isFavorite = storage.isFavorite(recipe.id);
        const icon = button.querySelector('i');

        if (isFavorite) {
            // Remove from favorites
            storage.removeFavorite(recipe.id);
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = '';
            button.classList.remove('active');
            button.setAttribute('aria-label', 'Add to favorites');
            utils.showToast('Removed from favorites', 'info');
        } else {
            // Add to favorites
            storage.addFavorite(recipe);
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = 'var(--color-primary-red)';
            button.classList.add('active');
            button.setAttribute('aria-label', 'Remove from favorites');
            utils.showToast('Added to favorites!', 'success');
        }
    },

    /**
     * Render multiple recipe cards to a container
     * @param {Array} recipes - Array of recipe objects
     * @param {HTMLElement|string} container - Container element or selector
     */
    renderCards(recipes, container) {
        const containerElement = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!containerElement) {
            console.error('Container not found');
            return;
        }

        // Clear existing content
        containerElement.innerHTML = '';

        // Check if recipes array is empty
        if (!recipes || recipes.length === 0) {
            containerElement.innerHTML = '<p class="text-center text-secondary">No recipes found.</p>';
            return;
        }

        // Create and append recipe cards
        recipes.forEach(recipe => {
            const card = this.create(recipe);
            containerElement.appendChild(card);
        });
    },

    /**
     * Create a simplified recipe card for favorites page
     * @param {object} recipe - Recipe data object
     * @returns {HTMLElement} Recipe card element
     */
    createFavoriteCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.id);

        card.innerHTML = `
            <img 
                src="${recipe.image || 'assets/images/placeholder.jpg'}" 
                alt="${utils.sanitizeHTML(recipe.title)}"
                class="recipe-card-image"
                loading="lazy"
            >
            <div class="recipe-card-content">
                <h3 class="recipe-card-title">${utils.sanitizeHTML(recipe.title)}</h3>
                
                <div class="recipe-card-meta">
                    ${recipe.readyInMinutes ? `
                        <div class="recipe-card-meta-item">
                            <i class="fa-solid fa-clock"></i>
                            <span>${recipe.readyInMinutes} min</span>
                        </div>
                    ` : ''}
                    
                    ${recipe.servings ? `
                        <div class="recipe-card-meta-item">
                            <i class="fa-solid fa-utensils"></i>
                            <span>${recipe.servings} servings</span>
                        </div>
                    ` : ''}
                    
                    <div class="recipe-card-meta-item">
                        <i class="fa-solid fa-calendar"></i>
                        <span>${utils.formatDate(recipe.dateAdded, 'short')}</span>
                    </div>
                </div>

                <div class="recipe-card-actions">
                    <button 
                        class="btn btn-primary btn-sm view-recipe-btn"
                        data-recipe-id="${recipe.id}"
                    >
                        <i class="fa-solid fa-eye"></i>
                        View Recipe
                    </button>
                    
                    <button 
                        class="btn-icon remove-favorite-btn"
                        data-recipe-id="${recipe.id}"
                        aria-label="Remove from favorites"
                    >
                        <i class="fa-solid fa-trash" style="color: var(--color-error);"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const viewBtn = card.querySelector('.view-recipe-btn');
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleViewRecipe(recipe.id);
        });

        const removeBtn = card.querySelector('.remove-favorite-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRemoveFavorite(recipe.id, card);
        });

        card.addEventListener('click', () => {
            this.handleViewRecipe(recipe.id);
        });

        return card;
    },

    /**
     * Handle remove favorite action
     * @param {number} recipeId - Recipe ID
     * @param {HTMLElement} card - Card element to remove
     */
    handleRemoveFavorite(recipeId, card) {
        // Confirm removal
        if (confirm('Remove this recipe from favorites?')) {
            storage.removeFavorite(recipeId);
            
            // Animate card removal
            card.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                card.remove();
                
                // Check if favorites is now empty
                const container = document.getElementById('favoritesGrid');
                if (container && container.children.length === 0) {
                    document.getElementById('emptyState').classList.remove('hidden');
                    container.classList.add('hidden');
                }
                
                // Update count
                const countElement = document.getElementById('favoritesCount');
                if (countElement) {
                    const favorites = storage.getFavorites();
                    countElement.textContent = favorites.length;
                }
            }, 300);
            
            utils.showToast('Removed from favorites', 'info');
        }
    }
};

export default recipeCard;