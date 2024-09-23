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

    title = driver.find_element(By.CLASS_NAME, 'recipe-header__title').get_attribute("innerHTML")
    print(title)
    

def print_html(elem):
    content = elem.get_attribute("innerHTML")
    soup = BeautifulSoup(content, 'html.parser')
    pretty_html = soup.prettify()
    print(pretty_html)

# Program
main(link)
