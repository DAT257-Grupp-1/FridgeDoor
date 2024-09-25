//Import list of ingredients from previous page
let user_ingredients = JSON.parse(sessionStorage.getItem('saved_items')) || [];

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

function get_random_cocktail() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const cocktail = data.drinks[0];
            display_cocktail(cocktail);
        })
        .catch(error => {
            console.error('Error fetching cocktail:', error);
            display_cocktail(null); // Show a message if fetching fails
        });
}

function display_cocktail(cocktail) {
    // Get the cocktail section element and clear any existing content
    const cocktail_section = document.getElementById('cocktail');
    cocktail_section.innerHTML = ''; // Clear previous content

    // Create and append a title to the cocktail section
    const title = document.createElement('h3');
    title.textContent = 'Här är en god cocktail att avnjuta med maten!';
    cocktail_section.appendChild(title);

    if (cocktail) {
        // If a cocktail is available, display its name
        const name = document.createElement('h4');
        name.textContent = cocktail.strDrink;
        cocktail_section.appendChild(name);

        // Display the cocktail image
        const image = document.createElement('img');
        image.src = cocktail.strDrinkThumb;
        image.alt = cocktail.strDrink; // Use cocktail name as alternative text for the image
        cocktail_section.appendChild(image);

        // Display the cocktail instructions
        const instructions = document.createElement('p');
        instructions.textContent = cocktail.strInstructions;
        cocktail_section.appendChild(instructions);

        // Create an unordered list element to display the ingredients
        const ingredients_list_cocktail = document.createElement('ul');

        // Loop through the 15 potential ingredients and measurements
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`]; // Get the ingredient name
            const measure = cocktail[`strMeasure${i}`]; // Get the measurement for the ingredient

            if (ingredient) { // Check if the ingredient is present (not null or undefined)
                const list_item = document.createElement('li'); // Create a list item element
                list_item.textContent = `${measure ? measure : ''} ${ingredient}`; // Format and set the text for the list item
                ingredients_list_cocktail.appendChild(list_item); // Add the list item to the ingredients list
            }
        }

        // Append the ingredients list to the cocktail section
        cocktail_section.appendChild(ingredients_list_cocktail);
    } else {
        // If no cocktail data is available, show an error message
        const message = document.createElement('p');
        message.textContent = 'Kunde inte hämta cocktail just nu. Försök igen senare.';
        cocktail_section.appendChild(message);
    }
}

function show_div() {
    document.getElementById('hidden_div').style.visibility = 'visible';
}


// Add an event listener to the button that triggers the random cocktail fetch function when clicked
const show_cocktail_btn = document.getElementById('show_cocktail_btn');
show_cocktail_btn.addEventListener('click', function() {
    show_div();
    get_random_cocktail();
});


document.getElementById('close_cocktail').addEventListener('click', function() {
    document.getElementById('hidden_div').style.visibility = 'hidden';
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

