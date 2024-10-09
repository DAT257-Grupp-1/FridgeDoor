import requests, uuid, json
import config

# Add your key and endpoint
key = config.config["subscriptionKey"]
endpoint = config.config["endpoint"]

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
location = config.config["region"]
path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': ['sv']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
     # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'Hello, friend! What did you do today?'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()



def main():
    print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))
    print(str(response))

# Entry point of the script
if __name__ == '__main__':
    main()
