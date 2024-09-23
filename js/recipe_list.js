document.addEventListener('DOMContentLoaded', function() {
    // Användarens ingredienser som en sträng
    const user_ingredients_string = "mjölk, tomatpuré, soja"; 

    // Konvertera strängen till en array av ingredienser
    const user_ingredients = user_ingredients_string.split(',').map(ingredient => ingredient.trim().toLowerCase());

    // Lista över ingredienser som krävs för receptet
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

    // Funktion för att få matchande ingredienser
    function get_matching_ingredients(user_ingredients, recipe_ingredients) {
        let matching_ingredients = [];
        
        recipe_ingredients.forEach(ingredient => {
            const normalized_ingredient = ingredient.toLowerCase();

            user_ingredients.forEach(user_ingredient => {
                if (normalized_ingredient.includes(user_ingredient)) {
                    matching_ingredients.push(ingredient); 
                }
            });
        });
        
        return matching_ingredients;
    }

    // Hämta matchande ingredienser
    const matching_ingredients = get_matching_ingredients(user_ingredients, recipe_ingredients);

    // Visa antalet matchande ingredienser
    const match_count = matching_ingredients.length;
    document.getElementById('match_count').textContent = `Antal matchande ingredienser: ${match_count}`;

    // Visa listan över matchande ingredienser
    const matching_ingredients_list = document.getElementById('matching_ingredients');
    matching_ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient; 
        matching_ingredients_list.appendChild(li);
    });

    // Funktion för att hämta en slumpmässig cocktail
    function getRandomCocktail() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const cocktail = data.drinks[0];
                displayCocktail(cocktail);
            })
            .catch(error => {
                console.error('Error fetching cocktail:', error);
                displayCocktail(null); // Visa ett meddelande om det misslyckas
            });
    }

    // Funktion för att visa cocktail-informationen
    function displayCocktail(cocktail) {
        const cocktailSection = document.getElementById('cocktail');
        cocktailSection.innerHTML = ''; // Rensa tidigare innehåll

        const title = document.createElement('h3');
        title.textContent = 'Här är en god cocktail att avnjuta med maten!';
        cocktailSection.appendChild(title);

        if (cocktail) {
            const name = document.createElement('h4');
            name.textContent = cocktail.strDrink;
            cocktailSection.appendChild(name);

            const image = document.createElement('img');
            image.src = cocktail.strDrinkThumb;
            image.alt = cocktail.strDrink;
            cocktailSection.appendChild(image);

            const instructions = document.createElement('p');
            instructions.textContent = cocktail.strInstructions;
            cocktailSection.appendChild(instructions);
        } else {
            const message = document.createElement('p');
            message.textContent = 'Kunde inte hämta cocktail just nu. Försök igen senare.';
            cocktailSection.appendChild(message);
        }
    }

    // Lägg till en event listener för knappen
    const showCocktailBtn = document.getElementById('show_cocktail_btn');
    showCocktailBtn.addEventListener('click', function() {
        getRandomCocktail();
    });
});
