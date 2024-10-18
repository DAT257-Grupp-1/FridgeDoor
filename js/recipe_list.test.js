const get_matching_ingredients = require('./recipe_list.js'); // Replace with the actual file name

describe('get_matching_ingredients', () => {
    beforeAll(() => {
      // Mock data for sessionStorage
      const savedItems = JSON.stringify(['milk', 'eggs', 'flour']);
      sessionStorage.setItem('saved_items', savedItems);
    });
  
    test('matching and unmatched ingredients should be unique', () => {
      const user_ingredients = ['milk', 'eggs', 'flour']; // You can also fetch this from sessionStorage in your function
      const recipe_ingredients = ['milk', 'sugar', 'flour', 'butter'];
  
      const [matching_ingredients, unmatched_ingredients] = get_matching_ingredients(user_ingredients, recipe_ingredients);
  
      // Check if matching_ingredients and unmatched_ingredients are unique
      const all_ingredients = [...matching_ingredients, ...unmatched_ingredients];
      const unique_ingredients = new Set(all_ingredients);
  
      expect(all_ingredients.length).toBe(unique_ingredients.size);
  
      // Check if matching_ingredients don't appear in unmatched_ingredients
      matching_ingredients.forEach(ingredient => {
        expect(unmatched_ingredients).not.toContain(ingredient);
      });
  
      // Check if unmatched_ingredients don't appear in matching_ingredients
      unmatched_ingredients.forEach(ingredient => {
        expect(matching_ingredients).not.toContain(ingredient);
      });
  
      // Check expected results
      expect(matching_ingredients).toEqual(['milk', 'flour']);
      expect(unmatched_ingredients).toEqual(['sugar', 'butter']);
    });
  });