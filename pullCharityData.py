import urllib2
import wikipedia
import json
from bs4 import BeautifulSoup

if __name__ == '__main__':
    wikipedia.set_rate_limiting(True)
    charity_list_url = 'List_of_charitable_foundations'
    wikipage_list = wikipedia.page(charity_list_url)
    charity_results = []
    for charity_name in wikipage_list.links:
        try:
            wikipage_charity = wikipedia.page(charity_name)
            name =  charity_name
            print 'Processing : %s'%name
            text =  wikipage_charity.summary
            image_url = None
            for image_url in wikipage_charity.images:
                if charity_name.lower() in image_url.lower():
                    image_url = image_url
            if name != None and text != None and image_url != None:
                charity_results.append({"name": name,
                    "photoUrl": image_url,
                    "website":"en.wikipedia.org/wiki/%s"%name,
                    "mission":text})
            print 'Status : %s'%('Added' if text != None and image_url != None else 'None')
        except:
            print "Raise error/exception"
    with open("charityData.json", "w") as outfile:
        json.dump(charity_results, outfile)
