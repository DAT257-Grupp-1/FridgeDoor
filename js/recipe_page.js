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
