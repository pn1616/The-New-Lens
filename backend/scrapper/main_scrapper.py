#from bbc_scrapper import BBCScrapper
from cnn_scrapper import CNNScrapper

scrapers = [CNNScrapper()]   

for scraper in scrapers:
    scraper.get_metadata()
    scraper.get_content()


