function get_matching_ingredients(user_ingredients, recipe_ingredients) {
    let matching_ingredients = [];
    let unmatched_ingredients = [];

    // Loop through each ingredient in the recipe
    recipe_ingredients.forEach(recipe_ingredient => {
        // Normalize the recipe_ingredient to lower case
        const normalized_recipe_ingredient = recipe_ingredient.toLowerCase();
        let isMatched = false; 

        // Loop through each ingredient the user has
        user_ingredients.forEach(user_ingredient => {
            // If the recipe ingredient includes the user ingredient, add it to the matching ingredients
            const normalized_user_ingredient = user_ingredient.toLowerCase(); 
            if (normalized_recipe_ingredient == normalized_user_ingredient){
                matching_ingredients.push(normalized_recipe_ingredient);
                isMatched = true; 
            }
        });

        if(!isMatched && !unmatched_ingredients.includes(normalized_recipe_ingredient)){
            unmatched_ingredients.push(normalized_recipe_ingredient);
        }
    });
    
    // Return the list of matching ingredients
    return [matching_ingredients, unmatched_ingredients]
}

module.exports = get_matching_ingredients;