// js/app.js
// Main application controller - initializes and coordinates all modules

import recipeSearch from './modules/recipeSearch.js';
import storage from './modules/storage.js';
import utils from './modules/utils.js';

const app = {
    /**
     * Initialize the application
     */
    init() {
        console.log('Recipe Finder App Initializing...');
        
        // Determine which page we're on
        const currentPage = this.getCurrentPage();
        
        // Initialize common components
        this.setupMobileMenu();
        this.setupNavigation();
        
        // Initialize page-specific functionality
        switch (currentPage) {
            case 'index':
                this.initIndexPage();
                break;
            case 'recipe-detail':
                this.initRecipeDetailPage();
                break;
            case 'favorites':
                this.initFavoritesPage();
                break;
            default:
                console.log('Unknown page');
        }
        
        console.log('Recipe Finder App Initialized!');
    },

    /**
     * Get current page name from URL
     * @returns {string} Page name
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        
        if (page === '' || page === 'index.html') return 'index';
        if (page === 'recipe-detail.html') return 'recipe-detail';
        if (page === 'favorites.html') return 'favorites';
        
        return 'index'; // Default
    },

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!menuToggle || !navMenu) return;
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Update icon
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    },

    /**
     * Setup navigation links
     */
    setupNavigation() {
        // Shopping list link
        const shoppingListLink = document.getElementById('shoppingListLink');
        if (shoppingListLink) {
            shoppingListLink.addEventListener('click', (e) => {
                e.preventDefault();
                utils.showToast('Shopping List feature coming in Week 6!', 'info');
            });
        }
        
        // Meal planner link
        const mealPlannerLink = document.getElementById('mealPlannerLink');
        if (mealPlannerLink) {
            mealPlannerLink.addEventListener('click', (e) => {
                e.preventDefault();
                utils.showToast('Meal Planner feature coming in Week 6!', 'info');
            });
        }
    },

    /**
     * Initialize index (search) page
     */
    initIndexPage() {
        console.log('Initializing Index Page...');
        
        // Import and initialize filter bar
        import('./modules/filterBar.js').then(({ default: filterBar }) => {
            filterBar.init();
        });
        
        // Initialize recipe search module
        recipeSearch.init();
        recipeSearch.setupClearFiltersButton();
        recipeSearch.setupFilterListeners();
        
        console.log('Index Page Ready!');
    },

    /**
     * Initialize recipe detail page
     */
    async initRecipeDetailPage() {
        console.log('Initializing Recipe Detail Page...');
        
        // Get recipe ID from URL
        const params = utils.getUrlParams();
        const recipeId = params.id;
        
        if (!recipeId) {
            this.showRecipeError('No recipe ID provided');
            return;
        }
        
        // Import and initialize recipe detail module
        const { default: recipeDetail } = await import('./modules/recipeDetail.js');
        await recipeDetail.init(recipeId);
        
        console.log('Recipe Detail Page Ready!');
    },

    /**
     * Initialize favorites page
     */
    initFavoritesPage() {
        console.log('Initializing Favorites Page...');
        
        this.loadFavorites();
        this.setupClearAllFavorites();
        
        console.log('Favorites Page Ready!');
    },

    /**
     * Load and display favorite recipes
     */
    loadFavorites() {
        const favorites = storage.getFavorites();
        const favoritesGrid = document.getElementById('favoritesGrid');
        const emptyState = document.getElementById('emptyState');
        const loadingState = document.getElementById('loadingState');
        const favoritesCount = document.getElementById('favoritesCount');
        
        // Hide loading
        if (loadingState) {
            loadingState.classList.add('hidden');
        }
        
        // Update count
        if (favoritesCount) {
            favoritesCount.textContent = favorites.length;
        }
        
        if (!favorites || favorites.length === 0) {
            // Show empty state
            if (emptyState) emptyState.classList.remove('hidden');
            if (favoritesGrid) favoritesGrid.classList.add('hidden');
            return;
        }
        
        // Hide empty state and show grid
        if (emptyState) emptyState.classList.add('hidden');
        if (favoritesGrid) {
            favoritesGrid.classList.remove('hidden');
            
            // Import recipeCard module to create cards
            import('./modules/recipeCard.js').then(({ default: recipeCard }) => {
                favoritesGrid.innerHTML = '';
                favorites.forEach(recipe => {
                    const card = recipeCard.createFavoriteCard(recipe);
                    favoritesGrid.appendChild(card);
                });
            });
        }
    },

    /**
     * Setup clear all favorites button
     */
    setupClearAllFavorites() {
        const clearBtn = document.getElementById('clearAllFavoritesBtn');
        if (!clearBtn) return;
        
        clearBtn.addEventListener('click', () => {
            const favorites = storage.getFavorites();
            
            if (favorites.length === 0) {
                utils.showToast('No favorites to clear', 'info');
                return;
            }
            
            if (confirm(`Are you sure you want to remove all ${favorites.length} favorite recipes?`)) {
                storage.set(storage.KEYS.FAVORITES, []);
                
                // Reload the page
                this.loadFavorites();
                
                utils.showToast('All favorites cleared', 'success');
            }
        });
    },

    /**
     * Show recipe error on detail page
     * @param {string} message - Error message
     */
    showRecipeError(message) {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const recipeDetailContainer = document.getElementById('recipeDetailContainer');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (recipeDetailContainer) recipeDetailContainer.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');
        
        utils.showToast(message, 'error');
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for potential external use
export default app;