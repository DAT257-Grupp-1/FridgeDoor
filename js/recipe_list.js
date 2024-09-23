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

document.addEventListener("DOMContentLoaded", () => { // listen for the DOMContentLoaded event aka when the page is loaded
    const slider = document.getElementById("colorSlider");
    const footprintInput = document.getElementById("footprintInput");

    footprintInput.addEventListener("input", () => { // right now takes the input value and sets the slider value to it will be changed to take value from database and remove input field
        const CO2value = footprintInput.value;
        if (CO2value >= 0 && CO2value <= 100) { //OBS!!! Change to the "value" to be the value from the database
            slider.value = CO2value;
            updateThumbColor(CO2value); // changes color of slider thumb
            updateFootprintText(CO2value); // changes paragraph text
            displayWarning(CO2value);  // displays warning for climate impact Low/Medium/High = Green/Yellow/Red
        }
    });
});

function updateThumbColor(value) {
    const slider = document.getElementById("colorSlider"); // gets the slider element
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
function updateFootprintText(value) { // simple function to change the text of the paragraph at a certain place
    const footprintText = document.getElementById("footprintText");
    footprintText.textContent = `Klimatavtryck: ${value} kg/CO2`;
}

function displayWarning(value) { // creates a warning for impact on climate
    const warning = document.getElementById("warning");
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