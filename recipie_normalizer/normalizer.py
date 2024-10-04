import json
import os

def main():
    # get_ingredients()
    # normalize_ingredients()
    save_ingredient_keys()
    get_normalized_list()


def normalize_ingredients():
    # Load the ingredients from the JSON file
    # read first ingredient in the list
    # if aldreay normalized, skip
    # print ingredient to terminal
    # ask user for normalized ingredients
    # if no reply, add as is to normalized list
    # if reply, add input as "normalized ingredient" and ingredient as "ugly name" to normalized list
    # if reply is multiple words, add as multiple normalized ingredients
    # if reply is "block", add to block list
    # normalized[ugly_name, [normalized_ingredient1, normalized_ingredient2, ...]]

    # Load the ingredients from the JSON file
    ingredients_file_path = os.path.join(os.path.dirname(__file__), 'ingredients.json')
    with open(ingredients_file_path, 'r', encoding='utf-8') as file:
        ingredients = json.load(file)

    # Initialize the normalized list and block list
    normalized = []
    block_list = []

    # Get already normalized ingredients
    normalized_file_path = os.path.join(os.path.dirname(__file__), 'normalized_ingredients.json')
    if os.path.exists(normalized_file_path):
        with open(normalized_file_path, 'r', encoding='utf-8') as file:
            if os.stat(normalized_file_path).st_size == 0:
                normalized_dict = {}
            else:
                normalized_dict = json.load(file)
            normalized = [[key, value] for key, value in normalized_dict.items()]

    # Get already blocked ingredients
    block_list_file_path = os.path.join(os.path.dirname(__file__), 'block_list.json')
    if os.path.exists(block_list_file_path):
        with open(block_list_file_path, 'r', encoding='utf-8') as file:
            if os.stat(block_list_file_path).st_size == 0:
                block_list = []
            else:
                block_list = json.load(file)

    for ingredient in ingredients:
        # Check if the ingredient is already normalized
        if any(ingredient in sublist for sublist in normalized) or ingredient in block_list:
            continue

        # Print ingredient to terminal
        print(f"Ingredient: {ingredient}")
        
        # Ask user for normalized ingredients
        user_input = input("Enter normalized ingredient(s) (comma-separated) or 'block' to block: ").strip()

        if user_input.lower() == 'block':
            block_list.append(ingredient)
            print(f"Blocked ingredient: {ingredient}")
        elif user_input == 'cancel':
            break
        elif user_input:
            normalized_ingredients = [item.strip() for item in user_input.split(',')]
            normalized.append([ingredient, normalized_ingredients])
            print(f"Normalized ingredient(s): {normalized_ingredients}")
        else:
            normalized.append([ingredient, [ingredient]])
            print(f"Normalized ingredient(s): {ingredient}")

        percentage = ingredients.index(ingredient) / len(ingredients) * 100
        print(f"Progress: {percentage:.2f}%")

    # Convert the normalized list to a dictionary
    normalized_dict = {item[0]: item[1] for item in normalized}

    # Save the normalized dictionary and block list to JSON files
    normalized_file_path = os.path.join(os.path.dirname(__file__), 'normalized_ingredients.json')
    with open(normalized_file_path, 'w', encoding='utf-8') as file:
        json.dump(normalized_dict, file, ensure_ascii=False, indent=4)

    # # Save the normalized list and block list to JSON files
    # normalized_file_path = os.path.join(os.path.dirname(__file__), 'normalized_ingredients.json')
    # with open(normalized_file_path, 'w', encoding='utf-8') as file:
    #     json.dump(normalized, file, ensure_ascii=False, indent=4)

    block_list_file_path = os.path.join(os.path.dirname(__file__), 'block_list.json')
    with open(block_list_file_path, 'w', encoding='utf-8') as file:
        json.dump(block_list, file, ensure_ascii=False, indent=4)

    print("Normalized ingredients:")
    print(normalized)
    print("\nBlock list:")
    print(block_list)


# Get all the ingredients from the recipes in data.json and svaes them to ingredients.json
def get_ingredients():
    # Load the data from the JSON file
    data_file_path = os.path.join(os.path.dirname(__file__), 'data.json')
    with open(data_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Extract ingredients from each recipe
    ingredients_list = []
    for recipe in data:
        for ingredient in recipe['ingredients']:
            ingredients_list.append(ingredient['name'])

    ingredients_list = list(set(ingredients_list))

    # Save the ingredients to a new JSON file
    ingredients_file_path = os.path.join(os.path.dirname(__file__), 'ingredients.json')
    with open(ingredients_file_path, 'w', encoding='utf-8') as file:
        json.dump(ingredients_list, file, ensure_ascii=False, indent=4)

def save_ingredient_keys():
    # Load the JSON file
    # data_file_path = os.path.join(os.path.dirname(__file__), '..', 'web_scraper', 'data.json')
    data_file_path = os.path.join(os.path.dirname(__file__), 'data.json')
    ing_file_path = os.path.join(os.path.dirname(__file__), 'normalized_ingredients.json')

    with open(data_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    with open(ing_file_path, 'r', encoding='utf-8') as file:
        n_ingredients = json.load(file)
    

    # Iterate through each recipe and add the new key
    for recipe in data:
        recipe['ingredient_tags'] = []  # Add your desired values here
        for ingredient in recipe['ingredients']:
            # Find the normalized ingredient for the current ingredient
            # normalized_ingredient = next((item[1] for item in n_ingredients if item[0] == ingredient['name']), [])
            # print(normalized_ingredient)
            # Append the normalized ingredient(s) to the ingredient_tags list
            if ingredient['name'] in n_ingredients:
                recipe['ingredient_tags'].extend(n_ingredients[ingredient['name']])
        # print(recipe['ingredient_tags'])
    
    # print(data)
    # Save the updated JSON back to the file
    with open(data_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def get_normalized_list():
    normalized_list = []
    normalized_file_path = os.path.join(os.path.dirname(__file__), 'normalized_ingredients.json')
    with open(normalized_file_path, 'r', encoding='utf-8') as file:
        normalized_dict = json.load(file)
    
    # Get all normalized ingredients
    for ingredient in normalized_dict.values():
        normalized_list.extend(ingredient)

    # Remove all duplicates
    ingredient_tags = list(set(normalized_list))

    # Sort ingredient tags list
    ingredient_tags.sort()

    # Save ingredient_tags to a JSON file
    ingredient_tags_file_path = os.path.join(os.path.dirname(__file__), 'ingredient_tags.json')
    with open(ingredient_tags_file_path, 'w', encoding='utf-8') as file:
        json.dump(ingredient_tags, file, ensure_ascii=False, indent=4)

main()