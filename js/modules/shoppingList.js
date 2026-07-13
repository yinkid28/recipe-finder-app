// js/modules/shoppingList.js
// Shopping List Manager - Handles the shopping list UI and interactions

import storage from './storage.js';
import utils from './utils.js';

const shoppingList = {
    /**
     * Initialize shopping list page
     */
    init() {
        this.loadShoppingList();
        this.setupEventListeners();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Add item button
        const addItemBtn = document.getElementById('addItemBtn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.handleAddItem());
        }

        // Add item on Enter key
        const newItemInput = document.getElementById('newItemInput');
        if (newItemInput) {
            newItemInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddItem();
                }
            });
        }

        // Clear checked button
        const clearCheckedBtn = document.getElementById('clearCheckedBtn');
        if (clearCheckedBtn) {
            clearCheckedBtn.addEventListener('click', () => this.handleClearChecked());
        }

        // Clear all button
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.handleClearAll());
        }
    },

    /**
     * Load and display shopping list
     */
    loadShoppingList() {
        const items = storage.getShoppingList();
        const emptyState = document.getElementById('emptyState');
        const shoppingListContainer = document.getElementById('shoppingListContainer');

        if (!items || items.length === 0) {
            // Show empty state
            if (emptyState) emptyState.classList.remove('hidden');
            if (shoppingListContainer) shoppingListContainer.classList.add('hidden');
            this.updateCounts(0, 0);
            return;
        }

        // Hide empty state, show list
        if (emptyState) emptyState.classList.add('hidden');
        if (shoppingListContainer) shoppingListContainer.classList.remove('hidden');

        // Group items by category
        const groupedItems = this.groupItemsByCategory(items);

        // Clear all category containers
        const categories = ['produce', 'meat', 'dairy', 'pantry', 'frozen', 'beverages', 'other'];
        categories.forEach(category => {
            const container = document.getElementById(`${category}-items`);
            if (container) container.innerHTML = '';
            
            const section = document.getElementById(`category-${category}`);
            if (section) section.style.display = 'none';
        });

        // Display items by category
        Object.entries(groupedItems).forEach(([category, categoryItems]) => {
            this.displayCategoryItems(category, categoryItems);
        });

        // Update counts
        const checkedCount = items.filter(item => item.checked).length;
        this.updateCounts(items.length, checkedCount);
    },

    /**
     * Group items by category
     * @param {Array} items - Shopping list items
     * @returns {Object} Items grouped by category
     */
    groupItemsByCategory(items) {
        const grouped = {};

        items.forEach(item => {
            const category = item.category || 'Other';
            const categoryKey = category.toLowerCase();

            if (!grouped[categoryKey]) {
                grouped[categoryKey] = [];
            }

            grouped[categoryKey].push(item);
        });

        return grouped;
    },

    /**
     * Display items for a specific category
     * @param {string} category - Category name
     * @param {Array} items - Items in the category
     */
    displayCategoryItems(category, items) {
        const container = document.getElementById(`${category}-items`);
        const section = document.getElementById(`category-${category}`);

        if (!container || !section) return;

        // Show the category section
        section.style.display = 'block';

        // Clear existing items
        container.innerHTML = '';

        // Create item elements
        items.forEach(item => {
            const itemElement = this.createItemElement(item);
            container.appendChild(itemElement);
        });
    },

    /**
     * Create shopping list item element
     * @param {Object} item - Shopping list item
     * @returns {HTMLElement} Item element
     */
    createItemElement(item) {
        const div = document.createElement('div');
        div.className = `shopping-list-item ${item.checked ? 'checked' : ''}`;
        div.setAttribute('data-item-id', item.id);

        const amountText = item.amount && item.unit 
            ? `${utils.formatAmount(item.amount)} ${item.unit}` 
            : '';

        div.innerHTML = `
            <label class="checkbox-wrapper" style="flex: 1; cursor: pointer; margin: 0;">
                <input 
                    type="checkbox" 
                    class="checkbox item-checkbox" 
                    ${item.checked ? 'checked' : ''}
                    data-item-id="${item.id}"
                >
                <span style="flex: 1;">
                    <strong>${utils.sanitizeHTML(utils.capitalize(item.name))}</strong>
                    ${amountText ? `<span class="text-secondary ml-sm">${amountText}</span>` : ''}
                </span>
            </label>
            <button 
                class="btn-icon delete-item-btn" 
                data-item-id="${item.id}"
                aria-label="Delete item"
            >
                <i class="fa-solid fa-trash" style="color: var(--color-error);"></i>
            </button>
        `;

        // Add event listeners
        const checkbox = div.querySelector('.item-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.handleToggleItem(item.id, e.target.checked);
        });

        const deleteBtn = div.querySelector('.delete-item-btn');
        deleteBtn.addEventListener('click', () => {
            this.handleDeleteItem(item.id);
        });

        return div;
    },

    /**
     * Handle add new item
     */
    handleAddItem() {
        const input = document.getElementById('newItemInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text) {
            utils.showToast('Please enter an item', 'warning');
            return;
        }

        // Parse the input (could be "2 cups rice" or just "rice")
        const parsed = this.parseItemInput(text);

        const item = {
            name: parsed.name,
            amount: parsed.amount,
            unit: parsed.unit,
            category: utils.categorizeIngredient(parsed.name)
        };

        storage.addToShoppingList(item);
        
        // Clear input
        input.value = '';
        
        // Reload list
        this.loadShoppingList();
        
        utils.showToast('Item added to shopping list', 'success');
    },

    /**
     * Parse item input text
     * @param {string} text - Input text
     * @returns {Object} Parsed item with name, amount, unit
     */
    parseItemInput(text) {
        // Simple parsing: "2 cups rice" -> {amount: 2, unit: "cups", name: "rice"}
        const parts = text.split(' ');
        
        // Check if first part is a number
        const firstPart = parts[0];
        const isNumber = !isNaN(parseFloat(firstPart));

        if (isNumber && parts.length >= 2) {
            const amount = parseFloat(firstPart);
            const unit = parts[1];
            const name = parts.slice(2).join(' ') || unit; // If no name after unit, use unit as name

            return { amount, unit, name };
        }

        // No amount/unit, just a name
        return { amount: null, unit: '', name: text };
    },

    /**
     * Handle toggle item checked status
     * @param {number} itemId - Item ID
     * @param {boolean} checked - New checked status
     */
    handleToggleItem(itemId, checked) {
        storage.toggleShoppingListItem(itemId);
        
        // Update the item element
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            if (checked) {
                itemElement.classList.add('checked');
            } else {
                itemElement.classList.remove('checked');
            }
        }

        // Update counts
        const items = storage.getShoppingList();
        const checkedCount = items.filter(item => item.checked).length;
        this.updateCounts(items.length, checkedCount);
    },

    /**
     * Handle delete item
     * @param {number} itemId - Item ID
     */
    handleDeleteItem(itemId) {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        
        if (itemElement) {
            // Animate removal
            itemElement.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                storage.removeFromShoppingList(itemId);
                this.loadShoppingList();
                utils.showToast('Item removed', 'info');
            }, 300);
        } else {
            storage.removeFromShoppingList(itemId);
            this.loadShoppingList();
        }
    },

    /**
     * Handle clear checked items
     */
    handleClearChecked() {
        const items = storage.getShoppingList();
        const checkedItems = items.filter(item => item.checked);

        if (checkedItems.length === 0) {
            utils.showToast('No checked items to clear', 'info');
            return;
        }

        if (confirm(`Remove ${checkedItems.length} checked items?`)) {
            storage.clearCheckedItems();
            this.loadShoppingList();
            utils.showToast('Checked items cleared', 'success');
        }
    },

    /**
     * Handle clear all items
     */
    handleClearAll() {
        const items = storage.getShoppingList();

        if (items.length === 0) {
            utils.showToast('Shopping list is already empty', 'info');
            return;
        }

        if (confirm(`Remove all ${items.length} items from shopping list?`)) {
            storage.clearShoppingList();
            this.loadShoppingList();
            utils.showToast('Shopping list cleared', 'success');
        }
    },

    /**
     * Update item counts display
     * @param {number} total - Total items
     * @param {number} checked - Checked items
     */
    updateCounts(total, checked) {
        const totalElement = document.getElementById('totalItemsCount');
        const checkedElement = document.getElementById('checkedItemsCount');

        if (totalElement) totalElement.textContent = total;
        if (checkedElement) checkedElement.textContent = checked;
    }
};

export default shoppingList;