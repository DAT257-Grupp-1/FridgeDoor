let json_data = null;
let ingredients_list = []

/* loads saved_items when the home_page window is loaded. */
window.onload = function(){
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
    ingredients_list.push(text);
    save_to_session_storage('saved_items', ingredients_list);
    display_ingredients();  
}

/* Creates a div container and buttons for each ingredient within the div. */
function display_ingredients() {
    delete_ingredients();                                       
    const container = document.getElementById("ingredients_buttons");   
    ingredients_list.forEach(ingredient => {                    
            const button = document.createElement("button");
            button.textContent = ingredient;
            /*button.innerHTML = `${ingredient} <span class="remove-icon">✕</span>`;
            button.classList.add("custom_button");*/
            button.id = "ingredient";
            button.addEventListener('click', clicked_button => {
                const clickedIngredient = clicked_button.target.innerText;
                splice_ingredient(clickedIngredient);
                save_to_session_storage('saved_items', ingredients_list);
                display_ingredients();
        });
        container.appendChild(button);
    });
}

/* Deletes all elements within div container.  */
function delete_ingredients(){
    document.getElementById("ingredients_buttons").innerHTML = "";
}
function clear_ingredients(){
    ingredients_list = [];
    delete_ingredients();
    save_to_session_storage('saved_items', ingredients_list);
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

document.getElementById("input_field").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        add_ingredient(); 
    }
});

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
function fetch_inggredient_keys(){
    fetch('ingredient_tags.json')
        .then(response => response.json())
        .then(data => {
            const datalist = document.getElementById('ingredient_tags');
            data.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient;
                datalist.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching ingredient tags:', error));
    return option;
}

function populateDropdown(options) {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = ''; // Clear existing options

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        dropdown.appendChild(optionElement);
    });
}