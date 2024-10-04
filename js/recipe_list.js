//Import list of ingredients from previous page
let user_ingredients = JSON.parse(sessionStorage.getItem('saved_items')) || [];

// List of ingredients required for the recipe
const recipe_ingredients = [];

// Function to get matching ingredients between user's ingredients and recipe's ingredients
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
            if (normalized_ingredient == user_ingredients){
                matching_ingredients.push(ingredient); 
            }else if(!unmatched_ingredients.includes(ingredient)){
                unmatched_ingredients.push(ingredient);
            }
        });
    });
    
    // Return the list of matching ingredients
    return [matching_ingredients, unmatched_ingredients]
}

// Get the matching ingredients
const matching_ingredients = get_matching_ingredients(user_ingredients, recipe_ingredients)[0];

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

function parseStringToDecimal(input) {
    // Split the string by the dash to get the first number
    let firstPart = input.split(' - ')[0];
    
    // Replace the comma with a dot
    firstPart = firstPart.replace(',', '.');
    
    // Convert the string to a float
    let decimalNumber = parseFloat(firstPart);
    
    return decimalNumber;
}

// Function to sort recepies
function sort_recipes(data){
    // The sorting algoritm
    let sorted_recipe_list = []

    // For each recipe
    for(let m = 0; m < data.length; m++){
        // Find matching ingredients
        let matched_and_unmatched = get_matching_ingredients(user_ingredients, data[m]["ingredient_tags"]);
        let climateimpact = parseStringToDecimal(data[m]["climateimpact"]["value"])
        let limit = Math.round(user_ingredients.length / 2)
        if(matched_and_unmatched[0].length >= limit){
            sorted_recipe_list.push([m, matched_and_unmatched, climateimpact])  // [index, [number_of_matched, number_of_unmatched], climateimpact]
        }
    }
    sorted_recipe_list.sort((a, b) => {
        // First, compare the number of matched ingredients (in descending order)
        const matchedDiff = b[1][0].length - a[1][0].length;
        
        if (matchedDiff !== 0) {
            return matchedDiff; // If the number of matched ingredients is different, return this difference
        }
        
        // If the number of matched ingredients is the same, compare the number of unmatched ingredients (in ascending order)
        const unmatchedDiff = a[1][1].length - b[1][1].length;
        
        if (unmatchedDiff !== 0) {
            return unmatchedDiff; // If the number of unmatched ingredients is different, return this difference
        }
        
        // If both matched and unmatched ingredients are the same, compare climate impact (in ascending order)
        return a[2] - b[2];
    });
    
    return sorted_recipe_list
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('web_scraper/data.json')
    .then(response => response.json())
    .then(data => {
        // Sorting indexes
        let sorted_recipe_list = sort_recipes(data)
        
        // Create recipe cards for all sorted recipes
        sorted_recipe_list.forEach(([recipeIndex, _]) => {
            const recipe = data[recipeIndex];
            create_recipe_card(recipe);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        const testh2 = document.createElement('h2');
        testh2.textContent = "Sorry, this page cannot be loaded";
        recipeDiv.appendChild(testh2);
        document.getElementById('recipeList').appendChild(recipeDiv);
    });
});

/* Moved the code to this function to create a card for a recommended recipe */
function create_recipe_card(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    // Create and append the recipe title
    const titleElement = document.createElement('h2');
    titleElement.classList.add('recipe_name');
    titleElement.textContent = recipe.title;
    recipeDiv.appendChild(titleElement);
    
    // Create and append the recipe image
    const imageElement = document.createElement('img');
    imageElement.src = recipe.image;
    imageElement.alt = recipe.title;
    recipeDiv.appendChild(imageElement);

    // // Create and append the recipe link
    // const linkElement = document.createElement('a');
    // // linkElement.id = "goToRecipe";
    // linkElement.href = recipe_link;
    // // linkElement.textContent = "Gå till recept";
    // recipeDiv.appendChild(linkElement);
    // //Create and append the recipe button
    // const buttonElement = document.createElement('button');
    // buttonElement.id = "goToRecipe";
    // buttonElement.textContent = "Gå till recept";
    // linkElement.appendChild(buttonElement);

    // Create and append the recipe link
    const linkElement = document.createElement('button');
    linkElement.id = "goToRecipe";
    linkElement.textContent = "Gå till recept";
    linkElement.addEventListener('click', function() {
        save_to_session_storage('link', recipe.link);
        window.location.href = 'recipe_page.html';
    });
    recipeDiv.appendChild(linkElement);

    // Create and append the ingredient list
    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient_list');
    const full_ingredients_name = recipe.ingredient_tags;
    
    const matching = get_matching_ingredients(user_ingredients, full_ingredients_name)[0];
    const matching_count = document.createElement('h3');
    matching_count.textContent = `Matchande ingredienser: ${matching.length}`;
    ingredientList.appendChild(matching_count);
    
    // Filter and display only matching ingredients
    const matchingIngredients = recipe.ingredient_tags.filter(ingredient => matching.includes(ingredient));
    
    matchingIngredients.forEach(ingredient => {
        const ingredientElement = document.createElement('li');
        ingredientElement.textContent = ingredient;
        ingredientElement.style.color = 'green';
        ingredientList.appendChild(ingredientElement);
    });

    recipeDiv.appendChild(ingredientList);
    
    // Create and append the slider element
    const footprintSlider = document.createElement('div');
    footprintSlider.classList.add('footprint');
    recipeDiv.appendChild(footprintSlider);
    
    // Create and append the slider element
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 3;
    slider.value = parseFloat(recipe.climateimpact.value[0] + "." + recipe.climateimpact.value[2]);
    slider.id = recipe.title + "colorSlider";
    slider.classList.add('slider');
    slider.disabled = true;
    footprintSlider.appendChild(slider);

    // Create and append the warning element
    const warning = document.createElement('p');
    warning.id = recipe.title + 'warning';
    warning.classList.add('warning');
    warning.textContent = "";
    footprintSlider.appendChild(warning);

    // Create and append the footprint text element
    const footprintText = document.createElement('p');
    footprintText.id = recipe.title + "footprintText";
    footprintText.classList.add('footprint_text');
    footprintText.textContent = "";
    footprintSlider.appendChild(footprintText);

    // Append the recipe div to the existing div with id 'recipeList'
    document.getElementById('recipeList').appendChild(recipeDiv);
    displayWarning(slider.value, warning.id);
    updateThumbColor(slider.value, slider.id);
    updateFootprintText(recipe.climateimpact.value, footprintText.id);
}

function updateThumbColor(value, sliderId) {
    const slider = document.getElementById(sliderId); // gets the slider element
    const percentage = value / slider.max; // create a precentage value of the input value to change color of thumb accordingly

    var color;
    if (percentage <= 0.5) {
    
        const greenToYellow = percentage * 2;
        color = `rgb(${255 * greenToYellow}, 255, 0)`; // sets the color of the thumb to go from green to yellow
    } else {
        
        const yellowToRed = (percentage - 0.5) * 2;
        color = `rgb(255, ${255 * (1 - yellowToRed)}, 0)`; // sets the color of the thumb to go from yellow to red
    }

    slider.style.setProperty('--thumb-color', color); // sets the color of the thumb
}
function updateFootprintText(value, footprintId) { // simple function to change the text of the paragraph at a certain place
    const footprintText = document.getElementById(footprintId);
    footprintText.textContent = `Klimatavtryck: ${value} kg CO2e / portion`;
}

function displayWarning(value, warningId) { // creates a warning for impact on climate
    const warning = document.getElementById(warningId);
    const percentage = value / 100; // same idea as before to create a percentage value

    if (percentage <= 0.33) { // 33% for each value to change color and text: 0-33% = Low, 33-66% = Medium, 66-100% = High
        // Green zone
        warning.textContent = "Low";
        warning.style.color = "green";
    } else if (percentage <= 0.66) {
        // Yellow zone
        warning.textContent = "Medium";
        warning.style.color = "yellow";
    } else {
        // Red zone
        warning.textContent = "High";
        warning.style.color = "red";
    }
}