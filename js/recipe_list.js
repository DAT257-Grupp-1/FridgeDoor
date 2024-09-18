// User's ingredients as a string
const user_ingredients_string = "mjölk, tomatpuré, soja"; 

// Convert the string to an array of ingredients, removing any leading/trailing spaces and converting to lower case
const user_ingredients = user_ingredients_string.split(',').map(ingredient => ingredient.trim().toLowerCase());

// List of ingredients required for the recipe
const recipe_ingredients = [
    'ris',
    'falukorv eller kycklingstekkorv',
    'gul lök',
    'olja',
    'tomatpuré',
    'matlagningsgrädde',
    'mjölk',
    'japansk soja',
    'dijonsenap',
    'peppar',
    'salt'
];

// Function to get matching ingredients between user's ingredients and recipe's ingredients
function get_matching_ingredients(user_ingredients, recipe_ingredients) {
    let matching_ingredients = [];
    
    // Loop through each ingredient in the recipe
    recipe_ingredients.forEach(ingredient => {
        // Normalize the ingredient to lower case
        const normalized_ingredient = ingredient.toLowerCase();

        // Loop through each ingredient the user has
        user_ingredients.forEach(user_ingredients => {
            // If the recipe ingredient includes the user ingredient, add it to the matching ingredients
            if (normalized_ingredient.includes(user_ingredients)) {
                matching_ingredients.push(ingredient); 
            }
        });
    });
    
    // Return the list of matching ingredients
    return matching_ingredients;
}

// Get the matching ingredients
const matching_ingredients = get_matching_ingredients(user_ingredients, recipe_ingredients);

// Get the count of matching ingredients
const match_count = matching_ingredients.length;

// Display the count of matching ingredients in the HTML element with id 'match_count'
document.getElementById('match_count').textContent = `Antal matchande ingredienser: ${match_count}`;

// Get the HTML element with id 'matching_ingredients'
const matching_ingredients_list = document.getElementById('matching_ingredients');

// Loop through each matching ingredient
matching_ingredients.forEach(ingredient => {
    // Create a new list item
    const li = document.createElement('li');
    // Set the text of the list item to the ingredient
    li.textContent = ingredient; 
    // Add the list item to the 'matching_ingredients' list
    matching_ingredients_list.appendChild(li);
});