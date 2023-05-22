import requests
import secrets
import bs4 
import threading
import random
import time

headers = {'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chromium/80.0.3987.160 Chrome/80.0.3987.163 Safari/537.36'
 }

proxies = open("proxies.txt").read().split()

client = requests.Session()

class Account():
    def __init__(self) -> None:
        self.client = requests.Session()
        self.api_url = "https://dmxo.dev/register/"
        self.proxy = {"https" : "http://%s" % (random.choice(proxies))}

    def get_csrf_token(self) -> str:
        try:
            r = self.client.get(self.api_url, headers=headers, proxies=self.proxy)
            soup = bs4.BeautifulSoup(r.text, 'lxml')
            csrfToken = soup.find('input', attrs={"name" : "csrf_token"})["value"]
            return csrfToken
        except:pass

    def create_account(self):
        try:
            csrf_token = self.get_csrf_token()
            email = "%s@proton.me" % (secrets.token_urlsafe(6))
            password = secrets.token_urlsafe(8)
            r = self.client.post(url=self.api_url, 
                            data={
                                "csrf_token" : csrf_token,
                                "email" : email,
                                "password" : password
                            },headers=headers,
                            proxies=self.proxy
            )
            log = "[SUCCESS] (%s:%s)" % (email,password) if "A confirmation email has been sent." in r.text else "[FAILED] (%s:%s)" % (email,password)
            print(log)
        except:pass




def main():
    while threading.active_count() < 200:
        _a = Account()
        _ = threading.Thread(target=Account().create_account, args=(), daemon=True)
        _.start()
    
    while True:
        time.sleep(1)


main()