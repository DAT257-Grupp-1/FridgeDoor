import json
import os

def main():
    normalize_ingredients()
    # get_ingredients()


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
        ingredients = ingredients[:5]

    # Initialize the normalized list and block list
    normalized = []
    block_list = []

    for ingredient in ingredients:
        # Check if the ingredient is already normalized
        if any(ingredient in sublist for sublist in normalized):
            continue

        # Print ingredient to terminal
        print(f"Ingredient: {ingredient}")
        
        # Ask user for normalized ingredients
        user_input = input("Enter normalized ingredient(s) (comma-separated) or 'block' to block: ").strip()

        if user_input.lower() == 'block':
            block_list.append(ingredient)
            print(f"Blocked ingredient: {ingredient}")
        elif user_input:
            normalized_ingredients = [item.strip() for item in user_input.split(',')]
            normalized.append([ingredient, normalized_ingredients])
            print(f"Normalized ingredient(s): {normalized_ingredients}")
        elif user_input == 'cancel':
            break
        else:
            normalized.append([ingredient, [ingredient]])
            print(f"Normalized ingredient(s): {ingredient}")

    # Save the normalized list and block list to JSON files
    normalized_file_path = os.path.join(os.path.dirname(__file__), 'normalized_ingredients.json')
    with open(normalized_file_path, 'w', encoding='utf-8') as file:
        json.dump(normalized, file, ensure_ascii=False, indent=4)

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
    raw_data_file_path = os.path.join(os.path.dirname(__file__), '..', 'web_scraper', 'data.json')
    with open(raw_data_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Extract ingredients from each recipe
    ingredients_list = []
    for recipe in data:
        for ingredient in recipe['ingredients']:
            ingredients_list.append(ingredient['name'])

    # Save the ingredients to a new JSON file
    ingredients_file_path = os.path.join(os.path.dirname(__file__), 'ingredients.json')
    with open(ingredients_file_path, 'w', encoding='utf-8') as file:
        json.dump(ingredients_list, file, ensure_ascii=False, indent=4)

main()