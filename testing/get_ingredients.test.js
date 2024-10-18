const get_matching_ingredients = require('./get_ingredients');

const user_ingredients = ['milk', 'eggs', 'flour'];
const recipe_ingredients = ['milk', 'sugar', 'flour', 'butter'];

const result = [['milk', 'flour'], ['sugar', 'butter']];

test('correctly separates matching and unmatched ingredients', () => {
    expect(get_matching_ingredients(user_ingredients, recipe_ingredients)).toEqual(result);
});
