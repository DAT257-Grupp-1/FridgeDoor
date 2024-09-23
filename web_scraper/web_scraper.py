from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import re

link = "https://www.ica.se/recept/ugnspannkaka-grundrecept-720978/"

#  Defining main function
def main(link):

    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)
    options.add_argument("--disable-search-engine-choice-screen")
    options.add_argument("--headless=new")
    
    driver = webdriver.Chrome(options)
    web_page = link
    driver.get(web_page)

# Gets the image of the dish
def get_image(driver):
    image = driver.find_element(By.CLASS_NAME, "recipe-header__desktop-image-wrapper__inner").find_element(By.TAG_NAME, "img").get_attribute("src")
    print(image)
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
    climateimpact = driver.find_element(By.CLASS_NAME, 'carbon-dioxide-wrapper')
    return climateimpact.text

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
main(link)
