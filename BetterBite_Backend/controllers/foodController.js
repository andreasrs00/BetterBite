const fs = require('fs').promises;
const path = require('path');

class FoodService {
  constructor() {
    this.foodData = null;
    this.dataPath = path.join(__dirname, '../data/food_categories.json');
  }

  async loadData() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.foodData = JSON.parse(data).map(item => ({
        ...item,
        category: item.category.toLowerCase()
      }));
    } catch (error) {
      console.error('Error loading food data:', error);
      throw error;
    }
  }

  async getAllFoods() {
    if (!this.foodData) await this.loadData();
    return this.foodData;
  }

  async getFoodsByCategory(category) {
    if (!this.foodData) await this.loadData();
    const categoryLower = category.toLowerCase();
    return this.foodData.filter(item => item.category === categoryLower);
  }


  async getCategories() {
    if (!this.foodData) await this.loadData();
    const categories = [...new Set(this.foodData.map(item => item.category))];
    return categories.map(category => ({
      name: category,
      count: this.foodData.filter(item => item.category === category).length
    }));
  }

  async searchFoods(query) {
    if (!this.foodData) await this.loadData();
    const searchTerm = query.toLowerCase();
    return this.foodData.filter(item => 
      item.food.toLowerCase().includes(searchTerm) || 
      item.category.toLowerCase().includes(searchTerm)
    );
  }
}

module.exports = new FoodService();