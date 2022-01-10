# End-to-End Twitter Sentiment Analysis
a simple End-to-End Twitter Sentiment Analysis app.

It gets the Live tweets from Twitter which matches the keywords entered by the user from a website with their respective sentiment (positive, negative or neutral). 

 

Server Side:

- Flask App (Python based web framework for REST API Server)
- Flask-SocketIO (WebSockets for live data stream)
- Developer account from Twitter (for live twitter stream)
- Hugging Face's BERT based pretrained model for Sentiment Analysis
    > cardiffnlp/twitter-xlm-roberta-base-sentiment


Client Side:

- HTML
- Javascript 
- jQuery
- Websockets (SocketIO) using JavaScript


Only thing left was Containerizing the app into Docker Image and deploying it on the internet server. Will do it as I update my windows to Windows11 

#Python #Flask #SocketIO #TwitterAPI #HuggingFace 

Suggested Upgrades:
- Use FAST-API library instead Flask for REST API development.
- Containerize the app into a Docker Image.
- Deploy it! :)

Learning:
Websockets
Flask apps
REST API


Design Flow
1. Enter keywords into the webpage to get tweets.
2. Request is sent to the server with the keywords
3. Request is recieved at the server.
4. New request is sent to twitter through twitter API with the user keywords to get the requested  tweets.
5. Twitter replies with tweets to the server.
6. Sentiment analysis is done on the tweets to get the sentiment of each tweet.
7. Tweets are sent to the Client(website) with the respective sentiment.