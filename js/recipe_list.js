//Import list of ingredients from previous page
let user_ingredients = JSON.parse(sessionStorage.getItem('saved_items')) || [];

// List of ingredients required for the recipe
const recipe_ingredients = [];

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

// Function to sort recepies by ingredients
function sort_recipes(){
    // The sorting algoritm
    let sorted_recipe_list = []

    // For each recipe
    for(let m = 0; m < json_data.length; m++){
        // Ingredi
        let matched = [];
        // For each ingredient tag in the recipe
        for(let i = 0; i < json_data[m]["ingredients"].length; i++){    // Should be "ingredient_tags" instead of "ingredients"
            // For each ingredient in the ingredients_list we search with
            for(j = 0; j < ingredients_list.length; j++){
                if (json_data[m]["ingredients"]["name"][i] == ingredients_list[j]){     // Should be ["ingredient_tags"] instead of ["ingredients"]["name"]
                    matched.push(ingredients_list[j]);
                }
            }
        }
        let limit = Math.round(ingredients_list.length / 2)
        console.log(limit)
        // For each recipe
        if(matched.length >= limit){          // Perhaps make the limit depend on ingredients_list.length to shorten quicksorting time
            sorted_recipe_list.push([m, matched])
        }
    }

    quickSort(sorted_recipe_list, 0, sorted_recipe_list.length - 2)     // Perhaps a slight bug. Ordering of recipes with the same amount of
                                                                        // matched ingredients depends on the input order of the ingredients.

    // Debugging
    console.log(sorted_recipe_list);

    return sorted_recipe_list
}


document.addEventListener("DOMContentLoaded", () => { // listen for the DOMContentLoaded event aka when the page is loaded

    fetch('../web_scraper/data.json')
    .then(response => response.json())
    .then(data => {

        //sorting indexes
        let sorted_recipe_list = sort_recipes()
        // creates recipes after sort

        const recipe = data[sorted_recipe_list[0][0]]; // Get the first recipe for demonstration

        // Extract recipe title and ingredients
        const recipe_title = recipe.title;
        const recipe_ingredients = recipe.ingredients;
        const recipe_image = recipe.image;
        const recipe_link = recipe.link;
        const recipe_CO2 = recipe.climateimpact;


        // Create a div element for the recipe
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        // Create and append the recipe title
        const titleElement = document.createElement('h2');
        titleElement.classList.add('recipe_name');
        titleElement.textContent = recipe_title;
        recipeDiv.appendChild(titleElement);
        
        // Create and append the recipe image
        const imageElement = document.createElement('img');
        imageElement.src = recipe_image;
        imageElement.alt = recipe_title;
        recipeDiv.appendChild(imageElement);

        // Create and append the recipe link
        const linkElement = document.createElement('button');
        linkElement.textContent = "Gå till recept";
        linkElement.addEventListener('click', function() {
            save_to_session_storage('link', recipe_link);
            window.location.href = 'recipe_page.html';
        });
        recipeDiv.appendChild(linkElement);

        // Create and append the ingredient list
        const ingredientList = document.createElement('div');
        ingredientList.classList.add('ingredient_list');
        const full_ingredients_name = [];
        recipe_ingredients.forEach(ingredient => {
            full_ingredients_name.push(ingredient.name);
        });
        
        const matching = get_matching_ingredients(user_ingredients, full_ingredients_name);
        const matching_count = document.createElement('h3');
        matching_count.textContent = `Matchande ingredienser: ${matching.length}`;
        ingredientList.appendChild(matching_count);
        
        // Filter and display only matching ingredients
        const matchingIngredients = recipe_ingredients.filter(ingredient => matching.includes(ingredient.name));
        
        matchingIngredients.forEach(ingredient => {
            const ingredientElement = document.createElement('li');
            ingredientElement.textContent = ingredient.name;
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
        slider.value = parseFloat(recipe_CO2.value[0] + "." + recipe_CO2.value[2]); // OBS ugly but works :)
        slider.id = recipe.title + "colorSlider";
        slider.classList.add('slider');
        slider.disabled = true;
        footprintSlider.appendChild(slider);
        //updateThumbColor(slider.value, slider.id);

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
        updateFootprintText(recipe_CO2.value, footprintText.id);
    })
    .catch(error => {console.error('Error fetching data:', error)
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        const testh2 = document.createElement('h2');
        testh2.textContent = "hello this page cannot be loaded";
        recipeDiv.appendChild(testh2);
        document.getElementById('recipeList').appendChild(recipeDiv);
    });
});


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


/* Create a div with two buttons for age verification popup
function create_popup_age_verification() {
    return new Promise((resolve) => {
    
      const container = document.createElement('div');
      container.className = 'age_verify_container';
  
      
      const popup = document.createElement('div');
      popup.className = 'age_verify_popup';
  
      
      popup.innerHTML = `
        <h2>Bekräfta din ålder</h2>
        <p>För att se drink förslag måste du ha fyllt 18 år.</p>
        <button id="over18">Jag har fyllt 18 år</button>
        <button id="under18">Jag är under 18 år</button>
      `;
  
      
      container.appendChild(popup);
  
      
      document.body.appendChild(container);
  
      
      document.getElementById('over18').addEventListener('click', () => {
        container.remove();
        resolve('over18');
      });
  
      document.getElementById('under18').addEventListener('click', () => {
        container.remove();
        resolve('under18');
      });
    });
  }
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

Gets non-alcoholic drink suggestions from the database
function get_mocktail() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic')
      .then(response => response.json())
      .then(data => {
        const mocktail = data.drinks[Math.floor(Math.random() * data.drinks.length)];
        // Fetch full details for the selected mocktail
        return fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${mocktail.idDrink}`);
      })
      .then(response => response.json())
      .then(data => {
        display_cocktail(data.drinks[0]);
      })
      .catch(error => {
        console.error('Error fetching mocktail:', error);
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


Add an event listener to the button that triggers the age verification popup and 
   recommends alcoholic or non-alcoholic drinks based on user response

const show_cocktail_btn = document.getElementById('show_cocktail_btn');
show_cocktail_btn.addEventListener('click', async function() {
    try {
        let ageStatus = sessionStorage.getItem('ageStatus');

        if (!ageStatus) {
            ageStatus = await create_popup_age_verification();
            sessionStorage.setItem('ageStatus', ageStatus); 
        }

        if (ageStatus === 'over18') {
            // User is over 18, proceed to show cocktail
            show_div();
            get_random_cocktail();
        } else {
            // User is under 18
            show_div();
            get_mocktail();
        }
    } catch (error) {
        console.error('Ett fel uppstod vid åldersverifiering:', error);
    }
});
document.getElementById('close_cocktail').addEventListener('click', function() {
    document.getElementById('hidden_div').style.visibility = 'hidden';
});*/