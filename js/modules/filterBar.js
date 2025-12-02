// js/modules/filterBar.js
// Manages the UI for dietary restriction checkboxes and cuisine type selections

import storage from './storage.js';
import utils from './utils.js';

const filterBar = {
    /**
     * Initialize filter bar
     */
    init() {
        this.loadSavedFilters();
        this.setupFilterListeners();
        this.addFilterCounter();
    },

    /**
     * Load saved filters from localStorage
     */
    loadSavedFilters() {
        const savedDietary = storage.getDietaryFilters();
        const savedCuisine = storage.getCuisineFilters();

        // Check the appropriate checkboxes for dietary filters
        savedDietary.forEach(filter => {
            const checkbox = document.querySelector(`#dietaryFilters input[value="${filter}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Check the appropriate checkboxes for cuisine filters
        savedCuisine.forEach(filter => {
            const checkbox = document.querySelector(`#cuisineFilters input[value="${filter}"]`);
            if (checkbox) checkbox.checked = true;
        });

        this.updateFilterCount();
    },

    /**
     * Setup filter change listeners
     */
    setupFilterListeners() {
        // Listen for dietary filter changes
        const dietaryFilters = document.getElementById('dietaryFilters');
        if (dietaryFilters) {
            dietaryFilters.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.saveFilters();
                    this.updateFilterCount();
                }
            });
        }

        // Listen for cuisine filter changes
        const cuisineFilters = document.getElementById('cuisineFilters');
        if (cuisineFilters) {
            cuisineFilters.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.saveFilters();
                    this.updateFilterCount();
                }
            });
        }
    },

    /**
     * Save current filter selections to localStorage
     */
    saveFilters() {
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

        // Save to localStorage
        storage.saveDietaryFilters(dietaryFilters);
        storage.saveCuisineFilters(cuisineFilters);
    },

    /**
     * Get current filter selections
     * @returns {object} Filter object with diet and cuisine arrays
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

        return {
            diet: dietaryFilters,
            cuisine: cuisineFilters
        };
    },

    /**
     * Clear all filters
     */
    clearAllFilters() {
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

        // Update filter count
        this.updateFilterCount();

        utils.showToast('All filters cleared', 'info');
    },

    /**
     * Add filter counter to show number of active filters
     */
    addFilterCounter() {
        const filterSidebar = document.querySelector('.filter-sidebar');
        if (!filterSidebar) return;

        // Check if counter already exists
        if (document.getElementById('filterCount')) return;

        // Create counter element
        const counter = document.createElement('div');
        counter.id = 'filterCount';
        counter.className = 'badge badge-primary';
        counter.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            display: none;
        `;
        counter.textContent = '0';

        // Make sidebar position relative for absolute positioning
        filterSidebar.style.position = 'relative';
        filterSidebar.insertBefore(counter, filterSidebar.firstChild);
    },

    /**
     * Update filter count badge
     */
    updateFilterCount() {
        const counter = document.getElementById('filterCount');
        if (!counter) return;

        const filters = this.getCurrentFilters();
        const totalCount = filters.diet.length + filters.cuisine.length;

        if (totalCount > 0) {
            counter.textContent = totalCount;
            counter.style.display = 'inline-block';
        } else {
            counter.style.display = 'none';
        }
    },

    /**
     * Highlight active filters
     */
    highlightActiveFilters() {
        // Add visual feedback for checked filters
        const allCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
        
        allCheckboxes.forEach(checkbox => {
            const wrapper = checkbox.closest('.checkbox-wrapper');
            if (!wrapper) return;

            if (checkbox.checked) {
                wrapper.style.backgroundColor = 'var(--color-light-gray)';
                wrapper.style.padding = '8px';
                wrapper.style.borderRadius = 'var(--radius-md)';
            } else {
                wrapper.style.backgroundColor = '';
                wrapper.style.padding = '';
                wrapper.style.borderRadius = '';
            }
        });
    }
};

export default filterBar;