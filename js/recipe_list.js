
const userIngredientsString = "mjölk, tomatpuré, soja"; 
const userIngredients = userIngredientsString.split(',').map(ingredient => ingredient.trim().toLowerCase());

const recipeIngredients = [
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

function getMatchingIngredients(userIngredients, recipeIngredients) {
    let matchingIngredients = [];
    
    recipeIngredients.forEach(ingredient => {
        const normalizedIngredient = ingredient.toLowerCase();

        userIngredients.forEach(userIngredient => {
            if (normalizedIngredient.includes(userIngredient)) {
                matchingIngredients.push(ingredient); 
            }
        });
    });
    
    return matchingIngredients;
}

const matchingIngredients = getMatchingIngredients(userIngredients, recipeIngredients);

const matchCount = matchingIngredients.length;
document.getElementById('match-count').textContent = `Antal matchande ingredienser: ${matchCount}`;

const matchingIngredientsList = document.getElementById('matching-ingredients');
matchingIngredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient; 
    matchingIngredientsList.appendChild(li);
});