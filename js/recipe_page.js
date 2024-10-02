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
                const l = `"${data[i].link}"`;
                if (l === link) {
                    result = data[i];
                }
            }
            
            console.log(result.title);

            make_elem("p", result["title"], "title");
            make_description(result["description"], "description");
            make_elem("p", result["climateimpact"]["value"] + result["climateimpact"]["unit"], "climateimpact");
            make_elem("p", result["energy"], "energy");
            make_image(result);
            make_ingredients(result.ingredients);
            make_instructions(result.instructions);
        })
}

async function make_image(data) {
    let img = document.createElement("img");
    img.setAttribute("src", data.image);

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
        textfield.appendChild(document.createTextNode(i.name));
        textfield.setAttribute("class", "item_text");
        
        
        if (i.quantity.length !== 0) {
            let quantity = document.createElement("p");
            quantity.appendChild(document.createTextNode(i.quantity));
            quantity.setAttribute("class", "item_quantity");
            
            item.appendChild(quantity);
        } else {
            textfield.style['margin-left'] = "10px"
        }
        
        item.appendChild(textfield);
        document.getElementById("ingredients_container").appendChild(item);
    }
}

async function make_instructions(instructions) {
    console.log("instructions ", instructions);
    for (index in instructions) {
        let i = instructions[index];

        // create item (instruction) container
        let item = document.createElement("div");
        item.setAttribute("class", "item")

        // instruction text
        let textfield = document.createElement("p");
        textfield.appendChild(document.createTextNode(i));
        textfield.setAttribute("class", "instruction_text");

        console.log(i);

        item.appendChild(textfield);
        document.getElementById("instructions_container").appendChild(item);
    }
}

function make_description(text, id) {
    let maxLength = 50; 
    let descriptionContainer = document.getElementById(id);

    if (text.length <= maxLength) {
        descriptionContainer.textContent = text;
    } else {
        let visibleText = text.substring(0, maxLength);
        let hiddenText = text.substring(maxLength);

        descriptionContainer.innerHTML = `
            ${visibleText}<span id="dots">... </span><span id="more" style="display:none;">${hiddenText}</span>
            <button id="toggleBtn">Läs mer</button>
        `;

        document.getElementById('toggleBtn').addEventListener('click', function () {
            let dots = document.getElementById('dots');
            let moreText = document.getElementById('more');

            if (dots.style.display === 'none') {
                dots.style.display = 'inline';
                moreText.style.display = 'none';
                this.textContent = 'Läs mer';
            } else {
                dots.style.display = 'none';
                moreText.style.display = 'inline';
                this.textContent = 'Läs mindre';
            }
        });
    }
}


function create_popup_age_verification() {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'age_verify_container';

        const popup = document.createElement('div');
        popup.className = 'age_verify_popup';

        popup.innerHTML = `
            <h2>Bekräfta din ålder</h2>
            <p>För att se drinkförslag måste du ha fyllt 18 år.</p>
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
            display_cocktail(cocktail, 'Här är en god cocktail att avnjuta med maten!');
            
        })
        .catch(error => {
            console.error('Error fetching cocktail:', error);
            display_cocktail(null, 'Kunde inte hämta cocktail just nu. Försök igen senare.'); // Show a message if fetching fails
        });
}

 function get_mocktail() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic')
            .then(response => response.json())
            .then(data => {
                const mocktail = data.drinks[Math.floor(Math.random() * data.drinks.length)];
                return fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${mocktail.idDrink}`);
            })
            .then(response => response.json())
            .then(data => {
                display_cocktail(data.drinks[0], 'Här är en god mocktail att avnjuta med maten!');
            })
            .catch(error => {
                console.error('Error fetching mocktail:', error);
                display_cocktail(null, 'Kunde inte hämta mocktail just nu. Försök igen senare.');
            });
    }


function display_cocktail(cocktail,title_text) {
    // Get the cocktail section element and clear any existing content
    const cocktail_section = document.getElementById('cocktail');
    cocktail_section.innerHTML = ''; // Clear previous content

    // Create and append a title to the cocktail section
    const title = document.createElement('h3');
    title.textContent = title_text;
    cocktail_section.appendChild(title);

    if (cocktail) {
        // Display the cocktail name
        const name = document.createElement('h4');
        name.textContent = cocktail.strDrink;
        cocktail_section.appendChild(name);

        // Display the cocktail image
        const image = document.createElement('img');
        image.src = cocktail.strDrinkThumb;
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
    document.getElementById('hidden_div').style.display = 'block';
}

document.getElementById('close_cocktail').addEventListener('click', function() {
    document.getElementById('hidden_div').style.display = 'none';
});

/* Add an event listener to the button that triggers the age verification popup and 
   recommends alcoholic or non-alcoholic drinks based on user response
*/
const show_cocktail_btn = document.getElementById('show_cocktail_btn');
show_cocktail_btn.addEventListener('click', async function() {
    try {
        let ageStatus = sessionStorage.getItem('ageStatus');

        if (!ageStatus) {
            ageStatus = await create_popup_age_verification();
            sessionStorage.setItem('ageStatus', ageStatus);
        }

        show_div();

        if (ageStatus === 'over18') {
             // User is over 18, proceed to show cocktail
            get_random_cocktail();
        } else {
             // User is under 18
            get_mocktail();
        }
    } catch (error) {
        console.error('Ett fel uppstod vid åldersverifiering:', error);
    }
});


