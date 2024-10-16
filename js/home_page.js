let json_data = null;
let ingredients_list = []

/* loads saved_items when the home_page window is loaded. */
window.onload = function(){
    const container = document.getElementById("ingredients_buttons");
    container.style.display = 'none'; // Initially hide the container

    const saved_items = sessionStorage.getItem('saved_items');
    if(saved_items) {
        ingredients_list = JSON.parse(saved_items);
        display_ingredients();
    }
}

function add_ingredient() {
    // store vales searched and clear text field
    let text = document.getElementById("input_field").value;
    document.getElementById("input_field").value = "";

    if (text && !ingredients_list.includes(text)) {  
        ingredients_list.push(text);
        save_to_session_storage('saved_items', ingredients_list);
        display_ingredients();  
    }
}

/* Creates a div container and buttons for each ingredient within the div. */
function display_ingredients() {
    delete_ingredients();
    const container = document.getElementById("ingredients_buttons");
    
    if (ingredients_list.length === 0) {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
        ingredients_list.forEach(ingredient => {
            const button = document.createElement("button");
            // Create a span for the cross (X)
            const closeSpan = document.createElement("span");
            closeSpan.textContent = "×"; // This is the HTML entity for a multiplication sign (cross)
            closeSpan.classList.add("close-button");

            // Append the ingredient text and close button to the button
            button.appendChild(document.createTextNode(ingredient));
            button.appendChild(closeSpan);
            
            button.id = "ingredient";
            
            // Event listener for the cross ("×") click
            closeSpan.addEventListener('click', (event) => {
                event.stopPropagation();
                splice_ingredient(ingredient); 
                save_to_session_storage('saved_items', ingredients_list);
                display_ingredients();
            });

            // Event listener for button click
            button.addEventListener('click', clicked_button => {
                const clickedIngredient = clicked_button.target.innerText.replace("×", "").trim();
                splice_ingredient(clickedIngredient);
                save_to_session_storage('saved_items', ingredients_list);
                display_ingredients();
            });
            container.appendChild(button);
        });
    }
    fetch_ingredient_keys(); 
}

/* Deletes all elements within div container.  */
function delete_ingredients(){
    document.getElementById("ingredients_buttons").innerHTML = "";
    const container = document.getElementById("ingredients_buttons");
    container.style.display = 'none';
}
function clear_ingredients(){
    ingredients_list = [];
    delete_ingredients();
    save_to_session_storage('saved_items', ingredients_list);
    fetch_ingredient_keys(); 
}

/* Helper function to return the index of given ingredient in ingredients_list.*/
function get_ingredient_index(ingredient){
    for (let i = 0; i < ingredients_list.length; i++) {
        if(ingredients_list[i] == ingredient){
            return i;
        }
    }
    return -1;
}

/* Removes an ingredient from the ingredients_list */
function splice_ingredient(ingredient){             
    let index = get_ingredient_index(ingredient);
    ingredients_list.splice(index, 1);
}

/* Updates the contents of saved_items to equal ingredients_list */
function amount_of_ingredients(){
    ingredients_list.c
}

// document.getElementById("input_field").addEventListener("keydown", function(event) {
//     if (event.key === "Enter") {
//         add_ingredient(); 
//     }
// });


function hitta_recept(){
    if(ingredients_list.length != 0){
        document.location.href = "recipe_list.html";
    }
}


info_button.addEventListener(
    "click",
    function () {
        myPopup.classList.add("show");
    }
);
closePopup.addEventListener(
    "click",
    function () {
        myPopup.classList.remove(
            "show"
        );
    }
);
window.addEventListener(
    "click",
    function (event) {
        if (event.target == myPopup) {
            myPopup.classList.remove(
                "show"
            );
        }
    }
);



// // Fetch the JSON data and store it
// fetch('./structure.json')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         json_data = data; // Store fetched data in a higher-scope variable
//         console.log('Data fetched and stored.');
//     })
//     .catch(error => {
//         console.error('Error fetching the JSON file:', error);
//     });

document.addEventListener('DOMContentLoaded', function() {
    fetch_ingredient_keys();
});

function fetch_ingredient_keys() {
    fetch('recipe_normalizer/ingredient_tags.json')
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
        })
        .catch(error => console.error('Error fetching ingredient tags:', error));
}

function populateDropdown(options) {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = ''; // Clear existing options
    dropdown.style.display = 'none'; // Hide dropdown by default

    const filteredOptions = options.filter(option => !ingredients_list.includes(option));

    filteredOptions.forEach(option =>  {
        const buttonElement = document.createElement('button');
        buttonElement.id = 'ingredient'; // Set button ID to 'ingredient'
        buttonElement.textContent = option;
        buttonElement.addEventListener('click', () => {
            document.getElementById('input_field').value = option;
            add_ingredient(option);
            dropdown.style.display = 'none'; // Hide dropdown after selection
            buttonElement.style.display = 'none'; // Hide the selected option
        });
        dropdown.appendChild(buttonElement);
    });
}

document.getElementById('input_field').addEventListener('input', function() { //Constantly listen to input field
    const filter = this.value.toLowerCase();
    const dropdown = document.getElementById('dropdown');
    const options = dropdown.getElementsByTagName('button');

    if (filter === '') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        for (let i = 0; i < options.length; i++) { //Only shows button with filter condition true
            const option = options[i];
            const text = option.textContent.toLowerCase();
            option.style.display = text.startsWith(filter) ? '' : 'none'; // Filters the ingredients by the start of the words
        }
    }
});

document.addEventListener('click', function(event) {
    const inputField = document.getElementById('input_field');
    const dropdown = document.getElementById('dropdown');
    
    if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});
