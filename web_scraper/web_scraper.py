from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

link = "https://www.ica.se/recept/ugnspannkaka-grundrecept-720978/"

#  Defining main function
def main(link):

    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)
    options.add_argument("--disable-search-engine-choice-screen")
    # options.add_argument("--headless=new")
    
    driver = webdriver.Chrome(options)
    web_page = link
    driver.get(web_page)

    # Gets the title of the recipe
    title = driver.find_element(By.CLASS_NAME, 'recipe-header__title')
    print(title.text)

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
    
    print(get_description(driver))
    
    

def print_html(elem):
    content = elem.get_attribute("innerHTML")
    soup = BeautifulSoup(content, 'html.parser')
    pretty_html = soup.prettify()
    print(pretty_html)

# Program
main(link)
