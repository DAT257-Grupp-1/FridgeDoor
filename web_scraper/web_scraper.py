from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

link = "https://www.ica.se/recept/ugnspannkaka-grundrecept-720978/"

#  Defining main function
def main():
    driver = webdriver.Chrome()
    print("hello")
    driver.get(link)


    driver.close() 

# Program
main()
