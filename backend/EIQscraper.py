from time import sleep
from scraper import scraper
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
import os
import smartquote

class EIQscraper(scraper):

    blog_name="EIQ"

    @staticmethod
    def scrape(articlesToScrape):
        print("Beginning Scraping of EclecticIQ CTI blogs.")
        filename = "./posts/"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument('window-size=1920,1080')
        driver = webdriver.Chrome(options=chrome_options)
        url = 'https://blog.eclecticiq.com/tag/threat-intelligence'
        driver.get(url)
        resultSet = driver.find_element(By.XPATH,"/html/body/main/section[1]/ul")
        list = resultSet.find_elements(By.TAG_NAME,'li')
        print("Beginning Collection")
        for i in range(0, articlesToScrape):
            print("Collecting article "+str(i))
            resultSet = driver.find_element(By.XPATH,"/html/body/main/section[1]/ul")
            list = driver.find_elements(By.TAG_NAME,'li')
            driver.execute_script("arguments[0].scrollIntoView(true);",list[i])
            link = driver.find_element(By.XPATH,'/html/body/main/section[1]/ul/li['+str(i+1)+']/a')
            driver.execute_script("arguments[0].click()",link)
            sleep(5) #arbitrary sleep to ensure loading - can be modified in future
            new_file_path = os.path.join(filename, EIQscraper.blog_name+"post"+str(i)+".txt")
            string = ""
            parent = WebDriverWait(driver,10).until(EC.element_to_be_clickable(driver.find_element(By.XPATH,"/html/body/main/section[1]/article")))
            elements = parent.find_elements(By.XPATH,'./child::*')
            for e in elements:
                try:
                    if e.tag_name == "h2" and not e.text=="":
                        pass
                    else:
                        string = string + (smartquote.substitute(e.text)+"\n")
                except:
                    pass #passes over encoding errors if present
            driver.back()
            sep = 'Structured Data'
            head,sep,tail = string.partition(sep)
            with open(new_file_path, 'w') as f:     
                f.write(head)
                f.close()
            print("Finished article "+str(i))
        print("Collection Complete")
