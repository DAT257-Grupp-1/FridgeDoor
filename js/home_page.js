let ingredient = []

function add_ingredient() {
    let text = document.getElementById("input_field").value;
    document.getElementById("input_field").value = "";
    ingredient.push(text);

}