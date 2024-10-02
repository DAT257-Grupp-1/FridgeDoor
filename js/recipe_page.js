var tmp = {
    "title": "Spaghetti Carbonara",
    "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper for a simple yet rich flavor.",
    "image": "https://example.com/images/spaghetti-carbonara.jpg",
    "link": "https://example.com/recipes/spaghetti-carbonara",
    "ingredients": [
        {
            "name": "Spaghetti",
            "quantity": "200g"
        }
    ],
    "portions": 4,
    "numingredients": 0,
    "cooktime": "Under 30 min",
    "rating": "Betyg 4.1 av 5.",
    "difficulty": "Medel",
    "instructions": [
        "Cook the spaghetti in a large pot of salted boiling water until al dente.",
        "While the pasta is cooking, fry the pancetta in a pan until crispy.",
        "In a bowl, whisk the eggs and grate in the Parmesan cheese. Season with black pepper.",
        "Drain the spaghetti, reserving a little pasta water.",
        "Quickly toss the hot pasta with the egg mixture, pancetta, and a splash of reserved pasta water to create a creamy sauce.",
        "Serve immediately with extra Parmesan and black pepper."
    ],
    "energy": "",
    "climateimpact": {
        "value": "0 - 0,5",
        "unit": "kg CO2e/portion"
    }
}

window.onload = function () {    
    fetch('../web_scraper/data.json')
        .then(response => response.json())
        .then(data => {
            var result = -1
            const link = sessionStorage.getItem('link');
            console.log("IN GET ", link);

            for (i in data) {
                const l = `"${data[i].link}"`
                if (l === link) {
                    result = data[i]
                }
            }
            
            console.log(result.title)

            make_elem("p", result["title"], "title")
            make_elem("p", result["description"], "description")
            make_elem("p", result["climateimpact"]["value"] + result["climateimpact"]["unit"], "climateimpact")
            make_elem("p", result["energy"], "energy")
            make_image(result)
            make_ingredients(result.ingredients)
        })
}

async function make_image(data) {
    let img = document.createElement("img")
    img.setAttribute("src", data.image)

    document.getElementById("image_container").appendChild(img);
}

async function make_elem(type, field, id) {
    let textfield = document.createElement(type);
    textfield.appendChild(document.createTextNode(field))

    document.getElementById(id).appendChild(textfield);
}

async function make_ingredients(ingredients) {
    console.log("Ingreds ", ingredients);
    for (index in ingredients) {
        let i = ingredients[index];

        // create item (ingredient) container
        let item = document.createElement("div");
        item.setAttribute("class", "item")
        
        // ingredient name
        let textfield = document.createElement("p");
        textfield.appendChild(document.createTextNode(i.name))
        textfield.setAttribute("class", "item_text")
        
        
        if (i.quantity != "") {
            let quantity = document.createElement("p");
            quantity.appendChild(document.createTextNode(i.quantity))
            quantity.setAttribute("class", "item_quantity")
            
            item.appendChild(quantity);
        } else {
            textfield.style['margin-left'] = "10px"
        }
        
        item.appendChild(textfield);
        document.getElementById("ingredients").appendChild(item);
    }
}

// async function detach_quantity(string) {
//     // split string into array
//     let words = string.trim().split(' ');
//     console.log("words ", words);
//     // remove quantity
//     let type = words.pop();
//     // re-assemble remaining array
//     let amount = words.join(' ');

//     console.log("IN DET Amount:", amount); // Check if this is correct
//     console.log("IN DET Type:", type);     // Check if type is as expected

//     return [amount, type];
// }

