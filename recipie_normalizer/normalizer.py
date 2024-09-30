import json
import os

def main():
    get_ingredients()

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