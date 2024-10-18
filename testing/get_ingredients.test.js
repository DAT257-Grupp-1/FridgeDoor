const get_matching_ingredients = require('./get_ingredients');

const user_ingredients = ['milk', 'eggs', 'flour'];
const recipe_ingredients = ['milk', 'sugar', 'flour', 'butter'];

const result = [['milk', 'flour'], ['sugar', 'butter']];

real_result = get_matching_ingredients(user_ingredients, recipe_ingredients);

console.log(real_result[0]);
console.log(real_result[1]);

test('correctly separates matching and unmatched ingredients', () => {
    expect(real_result).toEqual(result);
});
