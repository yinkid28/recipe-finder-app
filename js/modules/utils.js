// js/modules/utils.js
// Utility functions used throughout the application

const utils = {
    /**
     * Debounce function - delays execution until after wait time
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Format time in minutes to readable format
     * @param {number} minutes - Time in minutes
     * @returns {string} Formatted time string
     */
    formatTime(minutes) {
        if (!minutes || minutes === 0) return 'N/A';
        
        if (minutes < 60) {
            return `${minutes} min`;
        }
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (mins === 0) {
            return `${hours} hr`;
        }
        
        return `${hours} hr ${mins} min`;
    },

    /**
     * Format date to readable string
     * @param {string|Date} date - Date object or string
     * @param {string} format - Format type: 'short', 'long', 'full'
     * @returns {string} Formatted date string
     */
    formatDate(date, format = 'short') {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        const options = {
            short: { month: 'short', day: 'numeric' },
            long: { month: 'long', day: 'numeric', year: 'numeric' },
            full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        };

        return dateObj.toLocaleDateString('en-US', options[format] || options.short);
    },

    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text with ellipsis
     */
    truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    /**
     * Capitalize first letter of each word
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        if (!str) return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },

    /**
     * Convert fraction string to decimal
     * @param {string} fraction - Fraction string (e.g., "1/2", "1 1/2")
     * @returns {number} Decimal value
     */
    fractionToDecimal(fraction) {
        if (!fraction) return 0;
        
        // Handle mixed numbers (e.g., "1 1/2")
        const parts = fraction.trim().split(' ');
        let result = 0;
        
        parts.forEach(part => {
            if (part.includes('/')) {
                const [numerator, denominator] = part.split('/').map(Number);
                result += numerator / denominator;
            } else {
                result += Number(part);
            }
        });
        
        return result;
    },

    /**
     * Scale ingredient amount based on serving size change
     * @param {number} originalAmount - Original amount
     * @param {number} originalServings - Original servings
     * @param {number} newServings - New servings
     * @returns {number} Scaled amount
     */
    scaleIngredient(originalAmount, originalServings, newServings) {
        if (!originalServings || originalServings === 0) return originalAmount;
        return (originalAmount * newServings) / originalServings;
    },

    /**
     * Format ingredient amount for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted amount string
     */
    formatAmount(amount) {
        if (!amount || amount === 0) return '';
        
        // Round to 2 decimal places
        const rounded = Math.round(amount * 100) / 100;
        
        // Convert to fraction if close to common fractions
        const fractions = {
            0.25: '¼',
            0.33: '⅓',
            0.5: '½',
            0.67: '⅔',
            0.75: '¾'
        };
        
        const decimal = rounded % 1;
        const whole = Math.floor(rounded);
        
        for (const [dec, frac] of Object.entries(fractions)) {
            if (Math.abs(decimal - parseFloat(dec)) < 0.05) {
                return whole > 0 ? `${whole} ${frac}` : frac;
            }
        }
        
        return rounded.toString();
    },

    /**
     * Categorize ingredients for shopping list
     * @param {string} ingredientName - Ingredient name
     * @returns {string} Category name
     */
    categorizeIngredient(ingredientName) {
        const name = ingredientName.toLowerCase();
        
        const categories = {
            'Produce': ['lettuce', 'tomato', 'onion', 'garlic', 'potato', 'carrot', 
                       'pepper', 'cucumber', 'spinach', 'apple', 'banana', 'orange',
                       'lemon', 'lime', 'berry', 'fruit', 'vegetable'],
            'Meat': ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon',
                    'tuna', 'shrimp', 'meat', 'steak', 'bacon', 'sausage'],
            'Dairy': ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'egg'],
            'Pantry': ['flour', 'sugar', 'salt', 'pepper', 'oil', 'rice', 'pasta',
                      'bread', 'cereal', 'oats', 'beans', 'sauce', 'spice'],
            'Frozen': ['frozen', 'ice cream'],
            'Beverages': ['water', 'juice', 'soda', 'coffee', 'tea', 'milk']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => name.includes(keyword))) {
                return category;
            }
        }

        return 'Other';
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID string
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Smooth scroll to element
     * @param {string|HTMLElement} target - Element or selector to scroll to
     * @param {number} offset - Offset from top in pixels
     */
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
            
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds
     */
    showToast(message, type = 'info', duration = 3000) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} toast`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 250px;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;

        // Add to DOM
        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Show/hide loading spinner
     * @param {boolean} show - Whether to show or hide
     * @param {string} message - Optional loading message
     */
    toggleLoading(show, message = 'Loading...') {
        let loader = document.getElementById('globalLoader');
        
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'globalLoader';
                loader.className = 'loading-overlay';
                loader.innerHTML = `
                    <div class="spinner spinner-lg"></div>
                    <p class="mt-md text-secondary">${message}</p>
                `;
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                `;
                document.body.appendChild(loader);
            }
        } else {
            if (loader) {
                loader.remove();
            }
        }
    },

    /**
     * Parse URL parameters
     * @returns {object} Object with URL parameters
     */
    getUrlParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        
        return params;
    },

    /**
     * Set URL parameter without page reload
     * @param {string} key - Parameter key
     * @param {string} value - Parameter value
     */
    setUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }
};

export default utils;