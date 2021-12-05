import requests
import json
# import time

import variables as vares
import flasksocket as fs

sentiments={}
keyword1_senti={}
keyword2_senti={}
iters = 0

# Input Variables 

# BEARER TOKEN from your twitter developer account
bearer_token = vares.BEARER_TOKEN
# INPUT KEYWORDS
# keyword1 = "python"
# keyword2 = "java"

class TwitterStream:

  def __init__(self, key1, key2):
      self.upadate_rules(key1, key2)
      self.close_conn = False
  
  def __bearer_oauth(self,r):
    """
    Method required by bearer token authentication.
    """

    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2FilteredStreamPython"
    return r

  def __get_rules(self):
    response = requests.get(
        "https://api.twitter.com/2/tweets/search/stream/rules", auth=self.__bearer_oauth
    )
    if response.status_code != 200:
        raise Exception(
            "Cannot get rules (HTTP {}): {}".format(response.status_code, response.text)
        )
    # print(json.dumps(response.json()))
    return response.json()

  def __delete_all_rules(self,rules):
    if rules is None or "data" not in rules:
        return None

    ids = list(map(lambda rule: rule["id"], rules["data"]))
    payload = {"delete": {"ids": ids}}
    response = requests.post(
        "https://api.twitter.com/2/tweets/search/stream/rules",
        auth=self.__bearer_oauth,
        json=payload
    )
    if response.status_code != 200:
        raise Exception(
            "Cannot delete rules (HTTP {}): {}".format(
                response.status_code, response.text
            )
        )
    # print(json.dumps(response.json()))

  def __set_rules(self, keyword1, keyword2):
    # You can adjust the rules if needed
    sample_rules = [
        {"value": keyword1 + " lang:en", "tag": keyword1+"-En"},
        {"value": keyword2 + " lang:en", "tag": keyword2+"-En"},
    ]
    payload = {"add": sample_rules}
    response = requests.post(
        "https://api.twitter.com/2/tweets/search/stream/rules",
        auth=self.__bearer_oauth,
        json=payload,
    )
    if response.status_code != 201:
        raise Exception(
            "Cannot add rules (HTTP {}): {}".format(response.status_code, response.text)
        )
    # print(json.dumps(response.json()))

  def upadate_rules(self, key1, key2):
      rules = self.__get_rules()
      self.__delete_all_rules(rules)
      set_ = self.__set_rules( key1, key2)

  def get_stream(self):
    result = {}
    response = requests.get(
        "https://api.twitter.com/2/tweets/search/stream", auth=self.__bearer_oauth, stream=True,
    )
    print("Status code: ", response.status_code)
    if response.status_code != 200:
        raise Exception(
            "Cannot get stream (HTTP {}): {}".format(
                response.status_code, response.text
            )
        )
    for response_line in response.iter_lines():
        if response_line:
            json_response = json.loads(response_line)
            #print(json_response)
            #print("********************* RESPONSE FROM TWITTER API **************************")
            tweet = {}
            tweet['id'] = json_response['data']['id']
            tweet['text'] =  json_response['data']['text']
            tweet['tags'] = ''
            for rule in json_response['matching_rules']:
              tweet['tags'] += rule['tag'] + ', '
            tweet['tags'] = tweet['tags'][:-2]
            yield tweet
            print(self.close_conn)
            if self.close_conn: break
            # break
            #   result = pipeline.annotate(tweet['text'])
            #   sentiments = process_result(tweet, result, keyword1, keyword2)
          
            # print("going to sleep for 10 seconds...\n")
            # time.sleep(10)
      
  def main(self, keyword1, keyword2):
    rules = self.get_rules()
    # print(rules)
    self.delete_all_rules(rules)
    set_ = self.__set_rules( keyword1, keyword2)
    for value in self.get_stream(set_, keyword1, keyword2):
        print(value)

# main(keyword1, keyword2)
