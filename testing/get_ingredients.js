function get_matching_ingredients(user_ingredients, recipe_ingredients) {
    let matching_ingredients = [];
    let unmatched_ingredients = [];

    // Loop through each ingredient in the recipe
    recipe_ingredients.forEach(ingredient => {
        // Normalize the ingredient to lower case
        const normalized_ingredient = ingredient.toLowerCase();

        // Loop through each ingredient the user has
        user_ingredients.forEach(user_ingredients => {
            // If the recipe ingredient includes the user ingredient, add it to the matching ingredients
            const normalized_user_ingredient = user_ingredients.toLowerCase(); 
            if (normalized_ingredient == normalized_user_ingredient){
                matching_ingredients.push(ingredient); 
            }else if(!unmatched_ingredients.includes(ingredient)){
                unmatched_ingredients.push(ingredient);
            }
        });
    });
    
    // Return the list of matching ingredients
    
    return [matching_ingredients, unmatched_ingredients]
}

module.exports = get_matching_ingredients;