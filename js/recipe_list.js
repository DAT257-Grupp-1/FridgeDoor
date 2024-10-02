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

    console.log("Sorted: ")
    console.log(sorted_recipe_list)
    
    return sorted_recipe_list
}

/*
function sort_unmatched_ingredients(sorted_matched_ingredients){
    arr_length = sorted_recipe_list.length; 
    for (int i = 0; i < arr_length - 1 ; i++){
        lowest_unmatched_index = i

        for(int j =  i + 1; j < arr_length; j++ ){
            if (sorted_recipe_list[i][2] != sorted_recipe_list[j][2]){
                return;
            }
            
            if (sorted_recipe_list[j][2] < sorted_recipe_list[lowest_unmatched][2]){
                lowest_unmatched = j; 
            }
        }
        
        if (lowest_unmatched_index != i){
            let temp = sorted_recipe_list[i];
            sorted_recipe_list[i] = sorted_recipe_list[lowest_unmatched_index]; 
            sorted_recipe_list[lowest_unmatched_index] = temp; 
        }
    }
}
*/

function slice_on_matched_number(sorted_recipe_list){
    let array = []
    let result = []
    let max_number_of_matched = sorted_recipe_list[0][1][0].length
    console.log("Max matched: " + max_number_of_matched)
    for(let i = 0; i < sorted_recipe_list.length; i++){
        if(sorted_recipe_list[i][1][0].length != max_number_of_matched){
            result.push(array)
            array = []
            max_number_of_matched--;
        }else{
            array.push(sorted_recipe_list[i])
        }
    }
    return result
}

document.addEventListener("DOMContentLoaded", () => { // listen for the DOMContentLoaded event aka when the page is loaded
    fetch('recipie_normalizer/raw_data.json')
    .then(response => response.json())
    .then(data => {

        // Sorting indexes
        let sorted_recipe_list = sort_recipes(data)
        
        // Should create recipe cards after sort but only shows the first (best) one for now
        const recipe = data[sorted_recipe_list[0][0]]; // Get the first recipe for demonstration

        // Extract recipe title and ingredients
        const recipe_title = recipe.title;
        const recipe_ingredients = recipe.ingredient_tags;
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
            full_ingredients_name.push(ingredient);
        });
        
        const matching = get_matching_ingredients(user_ingredients, full_ingredients_name)[0];
        const matching_count = document.createElement('h3');
        matching_count.textContent = `Matchande ingredienser: ${matching.length}`;
        ingredientList.appendChild(matching_count);
        
        // Filter and display only matching ingredients
        const matchingIngredients = recipe_ingredients.filter(ingredient => matching.includes(ingredient));
        
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

