// js/modules/recipeSearch.js
// Handles ingredient input processing and recipe search functionality

import apiService from './apiService.js';
import recipeCard from './recipeCard.js';
import storage from './storage.js';
import utils from './utils.js';

const recipeSearch = {
    currentResults: [],
    currentFilters: {
        diet: [],
        cuisine: []
    },

    /**
     * Initialize search functionality
     */
    init() {
        this.setupSearchInput();
        this.setupSearchButton();
        this.loadSavedFilters();
    },

    /**
     * Setup search input field with debounce
     */
    setupSearchInput() {
        const searchInput = document.getElementById('ingredientSearch');
        if (!searchInput) {
            console.warn('Search input element not found');
            return;
        }

        // Add debounced search on input
        const debouncedSearch = utils.debounce(() => {
            const query = searchInput.value.trim();
            if (query.length >= 3) {
                // Optional: Show autocomplete suggestions
                console.log('Search query:', query);
            }
        }, 500);

        searchInput.addEventListener('input', debouncedSearch);

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    },

    /**
     * Setup search button
     */
    setupSearchButton() {
        const searchBtn = document.getElementById('searchBtn');
        if (!searchBtn) {
            console.warn('Search button element not found');
            return;
        }

        searchBtn.addEventListener('click', () => {
            this.performSearch();
        });
    },

    /**
     * Load saved filters from localStorage
     */
    loadSavedFilters() {
        const savedDietary = storage.getDietaryFilters();
        const savedCuisine = storage.getCuisineFilters();

        this.currentFilters.diet = savedDietary;
        this.currentFilters.cuisine = savedCuisine;

        // Check the appropriate checkboxes
        savedDietary.forEach(filter => {
            const checkbox = document.querySelector(`#dietaryFilters input[value="${filter}"]`);
            if (checkbox) checkbox.checked = true;
        });

        savedCuisine.forEach(filter => {
            const checkbox = document.querySelector(`#cuisineFilters input[value="${filter}"]`);
            if (checkbox) checkbox.checked = true;
        });
    },

    /**
     * Get current filter selections
     * @returns {object} Filter object
     */
    getCurrentFilters() {
        const dietaryFilters = [];
        const cuisineFilters = [];

        // Get dietary filters
        const dietaryCheckboxes = document.querySelectorAll('#dietaryFilters input[type="checkbox"]:checked');
        dietaryCheckboxes.forEach(checkbox => {
            dietaryFilters.push(checkbox.value);
        });

        // Get cuisine filters
        const cuisineCheckboxes = document.querySelectorAll('#cuisineFilters input[type="checkbox"]:checked');
        cuisineCheckboxes.forEach(checkbox => {
            cuisineFilters.push(checkbox.value);
        });

        // Save filters to localStorage
        storage.saveDietaryFilters(dietaryFilters);
        storage.saveCuisineFilters(cuisineFilters);

        this.currentFilters = {
            diet: dietaryFilters,
            cuisine: cuisineFilters
        };

        return this.currentFilters;
    },

    /**
     * Perform recipe search
     */
    async performSearch() {
        const searchInput = document.getElementById('ingredientSearch');
        
        if (!searchInput) {
            console.error('Search input not found!');
            utils.showToast('Search input not found. Please refresh the page.', 'error');
            return;
        }
        
        const query = searchInput.value.trim();

        // Validate input
        if (!query) {
            utils.showToast('Please enter ingredients to search', 'warning');
            searchInput.focus();
            return;
        }

        // Get current filters
        const filters = this.getCurrentFilters();

        // Show loading state
        this.showLoadingState();

        try {
            // Add to search history
            storage.addToSearchHistory(query);

            // Call API
            const results = await apiService.searchRecipesByIngredients(query, filters);

            // Store results
            this.currentResults = results;

            // Display results
            this.displayResults(results);

        } catch (error) {
            console.error('Search error:', error);
            this.showErrorState('Failed to search recipes. Please try again.');
            utils.showToast('Search failed. Please check your connection.', 'error');
        }
    },

    /**
     * Display search results
     * @param {Array} results - Array of recipe results
     */
    displayResults(results) {
        const emptyState = document.getElementById('emptyState');
        const noResultsState = document.getElementById('noResultsState');
        const loadingState = document.getElementById('loadingState');
        const recipeGrid = document.getElementById('recipeGrid');

        // Hide all states
        if (emptyState) emptyState.classList.add('hidden');
        if (noResultsState) noResultsState.classList.add('hidden');
        if (loadingState) loadingState.classList.add('hidden');

        if (!results || results.length === 0) {
            // Show no results state
            if (noResultsState) noResultsState.classList.remove('hidden');
            if (recipeGrid) recipeGrid.classList.add('hidden');
            return;
        }

        // Show recipe grid
        if (recipeGrid) recipeGrid.classList.remove('hidden');

        // Render recipe cards
        recipeCard.renderCards(results, recipeGrid);

        // Scroll to results
        utils.scrollTo(recipeGrid, 100);

        // Show success message
        utils.showToast(`Found ${results.length} recipes!`, 'success');
    },

    /**
     * Show loading state
     */
    showLoadingState() {
        const emptyState = document.getElementById('emptyState');
        const noResultsState = document.getElementById('noResultsState');
        const loadingState = document.getElementById('loadingState');
        const recipeGrid = document.getElementById('recipeGrid');

        if (emptyState) emptyState.classList.add('hidden');
        if (noResultsState) noResultsState.classList.add('hidden');
        if (recipeGrid) recipeGrid.classList.add('hidden');
        if (loadingState) loadingState.classList.remove('hidden');
    },

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showErrorState(message) {
        const loadingState = document.getElementById('loadingState');
        const recipeGrid = document.getElementById('recipeGrid');

        if (loadingState) loadingState.classList.add('hidden');
        if (recipeGrid) recipeGrid.classList.add('hidden');

        // You can create a custom error state or use toast
        utils.showToast(message, 'error', 5000);
    },

    /**
     * Clear all filters
     */
    clearFilters() {
        // Uncheck all dietary filters
        const dietaryCheckboxes = document.querySelectorAll('#dietaryFilters input[type="checkbox"]');
        dietaryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Uncheck all cuisine filters
        const cuisineCheckboxes = document.querySelectorAll('#cuisineFilters input[type="checkbox"]');
        cuisineCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear from storage
        storage.saveDietaryFilters([]);
        storage.saveCuisineFilters([]);

        // Update current filters
        this.currentFilters = {
            diet: [],
            cuisine: []
        };

        utils.showToast('All filters cleared', 'info');

        // Re-run search if there are current results
        if (this.currentResults.length > 0) {
            this.performSearch();
        }
    },

    /**
     * Setup clear filters button
     */
    setupClearFiltersButton() {
        const clearBtn = document.getElementById('clearFiltersBtn');
        if (!clearBtn) return;

        clearBtn.addEventListener('click', () => {
            this.clearFilters();
        });
    },

    /**
     * Setup filter change listeners
     */
    setupFilterListeners() {
        // Listen for dietary filter changes
        const dietaryFilters = document.getElementById('dietaryFilters');
        if (dietaryFilters) {
            dietaryFilters.addEventListener('change', () => {
                // Auto-search when filters change (optional)
                const searchInput = document.getElementById('ingredientSearch');
                if (searchInput && searchInput.value.trim()) {
                    this.performSearch();
                }
            });
        }

        // Listen for cuisine filter changes
        const cuisineFilters = document.getElementById('cuisineFilters');
        if (cuisineFilters) {
            cuisineFilters.addEventListener('change', () => {
                // Auto-search when filters change (optional)
                const searchInput = document.getElementById('ingredientSearch');
                if (searchInput && searchInput.value.trim()) {
                    this.performSearch();
                }
            });
        }
    }
};

export default recipeSearch;