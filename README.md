# Recipe Finder 🍳

A web application that helps users find recipes based on available ingredients, plan meals, and manage shopping lists while tracking nutritional information.

## 📋 Overview

Recipe Finder tackles the common problem of food waste and meal planning by allowing users to:
- Search for recipes using ingredients they already have
- Filter recipes by dietary restrictions and cuisine types
- View detailed nutritional information
- Plan weekly meals with an interactive calendar
- Generate smart shopping lists
- Save favorite recipes for quick access

## 🎯 Target Audience

- **College Students & Young Professionals** - Learning to cook on a budget
- **Health-Conscious Individuals** - Tracking nutrition and fitness goals
- **People with Dietary Restrictions** - Finding safe, suitable recipes
- **Busy Parents** - Planning family meals efficiently

## ✨ Key Features

### Core Functionality
1. **Ingredient-Based Recipe Search** - Find recipes using what you have
2. **Comprehensive Dietary Filtering** - Filter by multiple dietary needs simultaneously
3. **Detailed Recipe Information** - Full instructions, prep time, servings, and more
4. **Nutritional Analysis Panel** - Complete nutrition breakdown with visual charts
5. **Smart Shopping List Generator** - Organize ingredients by category

### Additional Features
6. **Weekly Meal Planning Calendar** - Plan breakfast, lunch, and dinner for the week
7. **Recipe Favorites System** - Save and quickly access loved recipes
8. **Dynamic Image Gallery** - High-quality food photography
9. **Adjustable Serving Size** - Automatically recalculate ingredient quantities
10. **Cuisine Type Browsing** - Explore recipes by cuisine (Local, Chinese, Italian, etc.)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - ES6+ modules and features
- **LocalStorage API** - Client-side data persistence

## 🔌 External APIs

- **Spoonacular API** - Recipe data, search, and basic nutrition
- **Nutritionix API** - Detailed nutritional information
- **Unsplash API** - High-quality food photography

## 🎨 Design System

### Color Palette
- **Primary Colors:** Fresh Green (#4CAF50), Warm Orange (#FF6F00), Deep Red (#D32F2F)
- **Neutral Colors:** Dark Charcoal (#333333), Medium Gray (#757575), Light Gray (#F5F5F5)
- **Semantic Colors:** Success Green, Warning Amber, Info Blue

### Typography
- **Headings:** Poppins (Sans-serif)
- **Body:** Inter (Sans-serif)
- **Instructions:** Georgia (Serif)

## 📁 Project Structure

```
recipe-finder-app/
├── index.html              # Main search page
├── recipe-detail.html      # Detailed recipe view
├── favorites.html          # Saved recipes page
├── css/
│   ├── variables.css       # Color and typography variables
│   ├── base.css           # Reset and base styles
│   ├── components.css     # Reusable component styles
│   └── main.css           # Main layout styles
├── js/
│   ├── app.js             # Main application controller
│   └── modules/
│       ├── recipeSearch.js    # Search functionality
│       ├── recipeCard.js      # Recipe card component
│       ├── recipeDetail.js    # Detailed recipe view
│       ├── nutritionPanel.js  # Nutrition display
│       ├── filterBar.js       # Filter interface
│       ├── shoppingList.js    # Shopping list manager
│       ├── mealPlanner.js     # Meal planning calendar
│       ├── favorites.js       # Saved recipes
│       ├── apiService.js      # API communication
│       ├── storage.js         # LocalStorage manager
│       ├── imageHandler.js    # Image management
│       └── utils.js           # Utility functions
└── assets/
    └── images/            # App icons and graphics
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- API Keys for:
  - Spoonacular API
  - Nutritionix API
  - Unsplash API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yinkid28/recipe-finder-app
cd recipe-finder-app
```

2. Create a `config.js` file in the `js` folder:
```javascript
const API_KEYS = {
    spoonacular: 'YOUR_SPOONACULAR_API_KEY',
    nutritionix: {
        appId: 'YOUR_NUTRITIONIX_APP_ID',
        appKey: 'YOUR_NUTRITIONIX_APP_KEY'
    },
    unsplash: 'YOUR_UNSPLASH_ACCESS_KEY'
};
```

3. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

4. Navigate to `http://localhost:8000`

## 📝 Usage

1. **Search for Recipes:**
   - Enter ingredients you have (e.g., "chicken, rice, tomatoes")
   - Apply dietary filters if needed
   - Browse results and click any recipe for details

2. **View Recipe Details:**
   - See full ingredient lists and instructions
   - Check nutritional information
   - Adjust serving sizes as needed
   - Add to favorites or shopping list

3. **Plan Your Week:**
   - Navigate to the meal planner
   - Assign recipes to specific days and meal times
   - Generate a shopping list from your meal plan

4. **Manage Shopping List:**
   - Add ingredients from recipes
   - Check off items as you shop
   - Clear list when complete

## 🗓️ Development Timeline

- **Week 5:** Foundation and core functionality (Search, filters, recipe display)
- **Week 6:** Enhanced features (Nutrition, shopping list, favorites)
- **Week 7:** Meal planning, responsive design, testing, and polish

## 🐛 Known Issues / Roadmap

- [ ] Implement pagination for large result sets
- [ ] Add offline support with service workers
- [ ] Export meal plans and shopping lists as PDF
- [ ] Add user accounts for cross-device sync

## 🤝 Contributing

This is a student project for WDD 330. Feedback and suggestions are welcome!

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yinkid28](https://github.com/yinkid28/recipe-finder-app)
- Project Link: [https://github.com/yinkid28/recipe-finder-app](https://github.com/yinkid28/recipe-finder-app)

## 🙏 Acknowledgments

- Spoonacular API for comprehensive recipe data
- Nutritionix API for nutritional information
- Unsplash for beautiful food photography
- WDD 330 course materials and instructors

---

**Status:** 🚧 In Development - Week 5
**Last Updated:** November 2024