let ingredients_list = [];

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
            button.innerHTML = `${ingredient} <span class="remove-icon">✕</span>`;
            button.classList.add("custom_button");
            button.id = ingredient;
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

function amount_of_ingredients(){
    ingredients_list.c
}

document.getElementById("input_field").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        add_ingredient(); 
    }
});