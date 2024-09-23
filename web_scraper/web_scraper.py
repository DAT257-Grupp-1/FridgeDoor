from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

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

def get_cooking_steps(driver):
    steps = driver.find_elements(By.CLASS_NAME, "cooking-steps-main__text")
    steps_in_text = []
    for i in steps:
        steps_in_text.append(i.text)
    return steps_in_text

def print_html(elem):
    content = elem.get_attribute("innerHTML")
    soup = BeautifulSoup(content, 'html.parser')
    pretty_html = soup.prettify()
    print(pretty_html)

# Program
main(link)
