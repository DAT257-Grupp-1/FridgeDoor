import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import re
import json
import os
from xml.etree import ElementTree as ET

#link = "https://www.ica.se/recept/ugnspannkaka-grundrecept-720978/"
#link2 = "https://www.ica.se/recept/gul-habanerosoppa-med-vitlokskrutonger-3/"

total = 0
fail = 0
success = 0

#  Defining main function
def main():
    global total
    global fail
    global success

    working = "https://www.ica.se/recept/ugnspannkaka-grundrecept-720978/"
    links = extract_links(10000)
    links.reverse()
    links = links[:100]

    string_array_to_json(links, "links_file.json")

    # for link in links:
    #     total += 1
    #     try:
    #         scrape_page(link)
    #         success += 1
    #         print(f"success {success} of {total}")
    #     except:
    #         fail += 1
    #         print(f"fail {fail} of {total}")
    # print(f"\nTotal: {total} | Success: {success} | Fail: {fail}")

    while (count_items_in_json("links_file.json") > 0):
        link = pop_first_item_from_json("links_file.json")
        print("link " + link)
        total += 1
        try:
            scrape_page(link)
            success += 1
            print(f"success {success} of {total}")
        except:
            fail += 1
            print(f"fail {fail} of {total}")

    print(f"\nTotal: {total} | Success: {success} | Fail: {fail}")


def extract_links(max):
    # Let's write the Python code to extract all the URLs from the XML file.

    # Load the XML file
    tree = ET.parse('www.ica2.se.xml')
    root = tree.getroot()

    # Define the namespace used in the XML file
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

    # Extract all URLs from the XML
    urls = []
    c = 0
    for url in root.findall('ns:url/ns:loc', namespace):
        c += 1
        urls.append(url.text)
        if c == max: break

    return urls

    
def scrape_page(link):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-search-engine-choice-screen")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.page_load_strategy = 'eager'

    driver = webdriver.Chrome(options=options)
    driver.get(link)

    recipe = {
    "title": str(get_title(driver)),
    "description": get_description(driver),
    "image": get_image(driver),
    "link": get_link(driver),
    "ingredients": get_ingredients_list(driver),
    "portions": get_portions(driver),
    "numingredients": get_number_ingredients(driver),    
    "cooktime": get_time(driver),
    "rating": get_rating(driver),
    "difficulty": get_difficulty(driver),
    "instructions": get_cooking_steps(driver),
    "energy": get_energy(driver),
    "climateimpact": get_climateimpact(driver)
    }
    
    save_data(recipe, "data.json")

# gen ai, idk thanks ---------------------------------------------------------
def count_items_in_json(filename):
    # Load the JSON file
    with open(filename, 'r') as json_file:
        string_array = json.load(json_file)
    
    # Return the length of the array
    return len(string_array)

def pop_first_item_from_json(filename):
    # Load the JSON file
    with open(filename, 'r') as json_file:
        string_array = json.load(json_file)
    
    # Check if the list is non-empty
    if string_array:
        # Store the first item in a constant
        FIRST_ITEM = string_array[0]
        
        # Remove the first item from the list
        string_array = string_array[1:]
        
        # Save the updated list back to the JSON file
        with open(filename, 'w') as json_file:
            json.dump(string_array, json_file, indent=4)
        
        return FIRST_ITEM
    else:
        raise ValueError("The JSON file contains an empty array")

def string_array_to_json(string_array, filename):
    # Ensure the input is a list of strings
    if not isinstance(string_array, list) or not all(isinstance(item, str) for item in string_array):
        raise ValueError("Input should be a list of strings")
    
    # Create the JSON file and write the data
    with open(filename, 'w') as json_file:
        json.dump(string_array, json_file, indent=4)

def save_data(json_object, file_name):
    # Check if the file exists
    if os.path.exists(file_name):
        # Load existing data
        with open(file_name, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError:
                # Handle the case where the file is empty or corrupted
                data = []
    else:
        # If the file doesn't exist, start with an empty list
        data = []

    # Ensure data is a list
    if not isinstance(data, list):
        raise ValueError("The JSON file must contain a list at the root.")

    # Append the new JSON object to the list
    data.append(json_object)

    # Write the updated list back to the file
    with open(file_name, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

def save_json(json_object, file_name):
    try:
        with open(file_name, 'w', encoding='utf-8') as file:
            json.dump(json_object, file, indent=4, ensure_ascii=False)  # ensure_ascii=False decodes Unicode characters
        print(f"JSON data has been successfully written to {file_name}")
    except Exception as e:
        print(f"An error occurred: {e}")

# ----------------------------------------------------------------------------

# Gets the image of the dish
def get_image(driver):
    image = driver.find_element(By.CLASS_NAME, "recipe-header__desktop-image-wrapper__inner").find_element(By.TAG_NAME, "img").get_attribute("src")
    return image

# Gets the link to the recipe
def get_link(driver):
    link = driver.current_url
    return link

# Gets the cooking steps of the recipe
def get_cooking_steps(driver):
    steps = driver.find_elements(By.CLASS_NAME, "cooking-steps-main__text")
    steps_in_text = []
    for i in steps:
        steps_in_text.append(i.text)
    return steps_in_text

# Gets the description of the recipe
def get_description(driver):
    description = driver.find_element(By.CLASS_NAME, 'recipe-header__preamble')
    return description.text

# Gets the approx. time and difficulty to make the recipe
def get_time(driver):
    time = driver.find_elements(By.CLASS_NAME, 'items')
    return time[0].text

# Gets the number of ingredients of the recipe
def get_number_ingredients(driver):
    number = driver.find_elements(By.CLASS_NAME, 'items')
    return number[1].text  

# Gets the difficulty of the recipe
def get_difficulty(driver):
    difficulty = driver.find_elements(By.CLASS_NAME, 'items')
    return difficulty[2].text    

# Gets the rating of the recipe
def get_rating(driver):
    rating = driver.find_element(By.CLASS_NAME, 'ids-ratings__stars-wrapper')
    return rating.text

# Gets the energy of the recipe
def get_energy(driver):
    energy = driver.find_element(By.CLASS_NAME, 'health-section__data')
    return energy.text

# Gets amount of portions for the recipe
def get_portions(driver):
    portions = str(driver.find_element(By.CLASS_NAME, "ingredients-change-portions").find_element(By.TAG_NAME, "div").text)
    r = int(re.search(r'\d+', portions).group())
    return r

# Gets the climate impact of the recipe
def get_climateimpact(driver):
    climatewunit = driver.find_element(By.CLASS_NAME, 'carbon-dioxide-wrapper').text
    unit = driver.find_element(By.CLASS_NAME, 'carbon-unit').text
    climate = climatewunit[:len(climatewunit)-len(unit)]
    object = {
        "value": climate,
        "unit": unit
    }
    return object

# Gets each ingredient, name & quantity for the recipe
def get_ingredients_list(driver):
    ingredients_list = []
    div_elements = driver.find_elements(By.CLASS_NAME, 'ingredients-list-group__card')
    for element in div_elements:
        ingredients_list.append(get_ingredient(element))
    
    return ingredients_list
    
def get_ingredient(element):
    inner_elements = element.find_elements(By.TAG_NAME, "span")
        
    name = ""
    quantity = ""
    if (len(inner_elements) > 1):
        name = inner_elements[1].text
        quantity = inner_elements[0].text
    else:
        name = inner_elements[0].text
    
    ingredient = {
        "name": name,
        "quantity": quantity
    }
    return ingredient

# Gets the recipe title
def get_title(driver):
    title = driver.find_element(By.CLASS_NAME, 'recipe-header__title').get_attribute("innerHTML")
    return title

def print_html(elem):
    content = elem.get_attribute("innerHTML")
    soup = BeautifulSoup(content, 'html.parser')
    pretty_html = soup.prettify()
    print(pretty_html)

# Program
main()
