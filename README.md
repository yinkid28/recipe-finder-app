# Recipe Finder 🍳

A comprehensive web application that helps users find recipes based on available ingredients, manage shopping lists, save favorites, and track nutritional information - all while reducing food waste and making meal planning easier.

**Live Demo:** [https://YOUR-USERNAME.github.io/recipe-finder-app](https://YOUR-USERNAME.github.io/recipe-finder-app)

**GitHub Repository:** [https://github.com/YOUR-USERNAME/recipe-finder-app](https://github.com/YOUR-USERNAME/recipe-finder-app)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Functionalities](#key-functionalities)
- [API Integration](#api-integration)
- [Local Storage](#local-storage)
- [Responsive Design](#responsive-design)
- [Future Enhancements](#future-enhancements)
- [Development Process](#development-process)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Overview

Recipe Finder was developed as a comprehensive solution to common food-related challenges:
- **Food Waste Reduction:** Use ingredients you already have before they spoil
- **Dietary Management:** Filter recipes by dietary restrictions and preferences
- **Meal Planning:** Organize your grocery shopping with smart lists
- **Nutritional Awareness:** Make informed decisions with detailed nutrition information

### Target Audience
- College students learning to cook on a budget
- Health-conscious individuals tracking nutrition
- People with dietary restrictions or allergies
- Busy families planning weekly meals

---

## ✨ Features

### 🔍 Recipe Search
- **Ingredient-based search:** Enter what you have, find what you can make
- **Real-time results:** Powered by Spoonacular API with 150 daily requests
- **Smart filtering:** Combine multiple ingredients for precise results
- **Debounced input:** Optimized search prevents excessive API calls

### 🎛️ Advanced Filtering System
- **Dietary Restrictions:** Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, Paleo
- **Cuisine Types:** African, Chinese, Italian, Mexican, American, Indian
- **Filter Persistence:** Selections saved to localStorage
- **Filter Counter:** Visual badge showing active filters
- **Quick Clear:** Remove all filters with one click

### 📖 Detailed Recipe View
- **High-quality images:** From Spoonacular API
- **Complete ingredient lists:** With precise measurements
- **Step-by-step instructions:** Clear, numbered cooking steps
- **Recipe metadata:** Prep time, cook time, servings, difficulty level
- **Cuisine and diet badges:** Quick identification of recipe type

### 📊 Nutritional Information
- **Comprehensive nutrition panel:** Calories, protein, carbs, fat, fiber, sugar, sodium
- **Visual progress bars:** Easy-to-understand nutrient levels
- **Daily value percentages:** Based on 2000 calorie diet
- **Per-serving calculations:** Accurate nutritional data

### 🔢 Serving Size Adjuster
- **Dynamic scaling:** Increase or decrease servings
- **Automatic recalculation:** All ingredient amounts update instantly
- **Precise measurements:** Maintains accuracy with fractions
- **User feedback:** Toast notifications confirm changes

### 🛒 Shopping List Management
- **Category organization:** Items sorted by Produce, Meat, Dairy, Pantry, Frozen, Beverages, Other
- **Add from recipes:** One-click addition of all recipe ingredients
- **Manual entry:** Add custom items with amounts (e.g., "2 cups milk")
- **Check/uncheck items:** Track what you've purchased
- **Smart deletion:** Remove individual items or clear all checked items
- **Item counter:** Track total and checked items
- **Persistent storage:** Shopping list saved across sessions

### ❤️ Favorites System
- **Save recipes:** One-click favorite button on any recipe
- **Dedicated favorites page:** View all saved recipes
- **Quick access:** Jump directly to favorite recipe details
- **Date tracking:** See when recipes were added
- **Easy management:** Remove favorites individually or clear all
- **Visual feedback:** Heart icon changes color when favorited

### 📱 Responsive Design
- **Mobile-optimized:** Works seamlessly on phones and tablets
- **Hamburger menu:** Collapsible navigation on small screens
- **Flexible layouts:** CSS Grid and Flexbox for adaptability
- **Touch-friendly:** Large buttons and tap targets

### ♿ Accessibility Features
- **Semantic HTML:** Proper heading hierarchy and landmarks
- **ARIA labels:** Screen reader support on interactive elements
- **Keyboard navigation:** Full app usable without mouse
- **Focus indicators:** Clear visual feedback for keyboard users
- **Alt text:** Descriptive text for all images

---

## 🛠️ Technologies Used

### Frontend
- **HTML5:** Semantic markup structure
- **CSS3:** Modern styling with custom properties
  - CSS Grid & Flexbox for layouts
  - CSS Variables for theming
  - Media queries for responsiveness
- **JavaScript (ES6+):** Modern features
  - ES6 Modules for code organization
  - Async/await for API calls
  - Arrow functions and destructuring
  - Template literals for dynamic HTML

### APIs
- **Spoonacular API:** Recipe data, search, nutrition
  - Recipe search by ingredients
  - Detailed recipe information
  - Nutritional data
  - Cooking instructions
- **Nutritionix API:** Enhanced nutritional information (Optional)
- **Unsplash API:** High-quality food photography (Optional)

### Storage
- **LocalStorage:** Client-side data persistence
  - Favorites list
  - Shopping list items
  - Filter preferences
  - Search history

### Development Tools
- **Git & GitHub:** Version control and hosting
- **GitHub Pages:** Free static site hosting
- **VS Code:** Code editor
- **Browser DevTools:** Debugging and testing

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- Spoonacular API key (free tier available)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR-USERNAME/recipe-finder-app.git
cd recipe-finder-app
```

2. **Get API Keys:**
   - Sign up at [Spoonacular](https://spoonacular.com/food-api)
   - Get your free API key (150 requests/day)

3. **Configure API Keys:**
   - Create `js/config.js` file:
```javascript
const API_KEYS = {
    spoonacular: 'YOUR_SPOONACULAR_API_KEY',
    nutritionix: {
        appId: 'OPTIONAL',
        appKey: 'OPTIONAL'
    },
    unsplash: 'OPTIONAL'
};

export default API_KEYS;
```

4. **Run Locally:**
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Then open: http://localhost:8000
```

5. **Open in Browser:**
   - Navigate to `http://localhost:8000`
   - Or open `index.html` directly

---

## 📁 Project Structure

```
recipe-finder-app/
├── index.html              # Main search page
├── recipe-detail.html      # Recipe details page
├── favorites.html          # Saved recipes page
├── shopping-list.html      # Shopping list page
├── README.md               # Project documentation
├── css/
│   ├── variables.css       # CSS custom properties
│   ├── base.css           # Reset and base styles
│   ├── components.css     # Reusable components
│   └── main.css           # Layout and page styles
├── js/
│   ├── app.js             # Main application controller
│   ├── config.js          # API keys (gitignored)
│   └── modules/
│       ├── apiService.js      # API communication layer
│       ├── recipeSearch.js    # Search functionality
│       ├── recipeCard.js      # Recipe card component
│       ├── recipeDetail.js    # Recipe detail page logic
│       ├── filterBar.js       # Filter interface
│       ├── shoppingList.js    # Shopping list manager
│       ├── storage.js         # LocalStorage operations
│       ├── utils.js           # Utility functions
│       └── nutritionPanel.js  # Nutrition display (integrated)
└── assets/
    └── images/            # App icons and placeholders
```

---

## 🔑 Key Functionalities

### 1. Recipe Search
**File:** `js/modules/recipeSearch.js`

Search recipes by ingredients with advanced filtering:
```javascript
// User enters: "chicken, rice, tomatoes"
// API returns: Recipes using those ingredients
// Filters applied: Vegetarian, Italian cuisine
```

**Key Features:**
- Debounced input for performance
- Multiple filter combinations
- Real-time search results
- Error handling with user feedback

### 2. Recipe Display
**Files:** `js/modules/recipeCard.js`, `js/modules/recipeDetail.js`

Display recipe information with full details:
```javascript
// Recipe Card: Title, image, time, servings
// Recipe Detail: Full ingredients, instructions, nutrition
```

**Key Features:**
- Lazy loading images
- Responsive card grid
- Smooth navigation
- Loading states

### 3. Shopping List
**File:** `js/modules/shoppingList.js`

Organize groceries by category:
```javascript
// Add from recipe: All ingredients at once
// Manual add: "2 cups milk"
// Categories: Produce, Meat, Dairy, etc.
```

**Key Features:**
- Category-based organization
- Check/uncheck tracking
- Item parsing (amount, unit, name)
- Persistent storage

### 4. Favorites
**File:** `js/modules/storage.js`

Save and manage favorite recipes:
```javascript
// Add favorite: Click heart icon
// View favorites: Dedicated page
// Remove: Click heart again or delete button
```

**Key Features:**
- One-click save/remove
- Favorites page with all saved recipes
- Date tracking
- LocalStorage persistence

---

## 🔌 API Integration

### Spoonacular API
**Base URL:** `https://api.spoonacular.com`

**Key Endpoints Used:**

1. **Complex Search:**
```javascript
GET /recipes/complexSearch
Parameters: ingredients, diet, cuisine, number
```

2. **Recipe Information:**
```javascript
GET /recipes/{id}/information
Parameters: includeNutrition=true
```

3. **Recipe Instructions:**
```javascript
GET /recipes/{id}/analyzedInstructions
```

4. **Nutrition Widget:**
```javascript
GET /recipes/{id}/nutritionWidget.json
```

**Rate Limiting:**
- Free tier: 150 requests/day
- Caching: User data stored locally
- Error handling: Graceful degradation

---

## 💾 Local Storage

### Data Stored

1. **Favorites:**
```javascript
{
  id: 12345,
  title: "Chicken Pasta",
  image: "url",
  readyInMinutes: 30,
  servings: 4,
  dateAdded: "2025-01-15T10:30:00Z"
}
```

2. **Shopping List:**
```javascript
{
  id: 67890,
  name: "tomatoes",
  amount: 2,
  unit: "cups",
  category: "Produce",
  checked: false,
  dateAdded: "2025-01-15T10:30:00Z"
}
```

3. **Filters:**
```javascript
{
  dietaryFilters: ["vegetarian", "gluten-free"],
  cuisineFilters: ["italian"]
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Responsive Features
- Hamburger menu on mobile
- Stacked layouts on small screens
- Touch-friendly buttons
- Optimized image sizes
- Flexible grid layouts

---

## 🚀 Future Enhancements

### Planned Features
1. **Meal Planner:**
   - Weekly calendar view
   - Drag-and-drop recipe assignment
   - Generate shopping list from meal plan

2. **Unsplash Integration:**
   - Fallback images when Spoonacular lacks photos
   - Higher quality food photography

3. **Advanced Features:**
   - Recipe ratings and reviews
   - User accounts with cloud sync
   - Share recipes via social media
   - Print recipes
   - Export shopping list
   - Offline mode with Service Workers

4. **Performance:**
   - API response caching
   - Image optimization
   - Code splitting
   - Progressive Web App (PWA)

---

## 📈 Development Process

### Week 5: Foundation
- Project setup and structure
- HTML templates
- CSS framework
- API integration
- Basic search functionality

### Week 6: Core Features
- Shopping list implementation
- Nutrition panel enhancement
- Favorites system
- Recipe detail page
- LocalStorage integration

### Week 7: Polish & Deployment
- Responsive design refinement
- Bug fixes
- Documentation
- GitHub Pages deployment
- Video demonstration

---

## 🎓 Learning Outcomes

This project demonstrates mastery of:
- **Modern JavaScript:** ES6+ features, modules, async/await
- **API Integration:** REST APIs, error handling, rate limiting
- **Data Management:** LocalStorage, state management
- **Responsive Design:** Mobile-first approach, media queries
- **UI/UX:** User feedback, loading states, error handling
- **Code Organization:** Modular architecture, separation of concerns
- **Version Control:** Git workflow, GitHub collaboration
- **Deployment:** Static site hosting, production builds

---

## 🙏 Acknowledgments

- **Spoonacular API:** Recipe and nutrition data
- **Font Awesome:** Icon library
- **Google Fonts:** Poppins and Inter typefaces
- **WDD 330:** Course materials and guidance
- **Instructor:** [Your Instructor's Name]

---

## 📄 License

This project was created for educational purposes as part of WDD 330 coursework.

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/yinkid28/recipe-finder-app/tree/main)
- Project: [Recipe Finder](https://yinkid28.github.io/recipe-finder-app/)

---

