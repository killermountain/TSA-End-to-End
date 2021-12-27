# End-to-End Twitter Sentiment Analysis

Server Side:
- Flask App (API Web Server)
- Socket Programming (Flask-SocketIO)
- Hugging Face's BERT based pretrained model for Sentiment Analysis
    > cardiffnlp/twitter-xlm-roberta-base-sentiment

Client Side:
- HTML
- Javascript 
- jQuery
- Websockets (SocketIO) using JavaScript

Design Flow
1. Enter keywords into the webpage to get tweets.
2. Request is sent to the server with the keywords
3. Request is recieved at the server.
4. New request is sent to twitter through twitter API with the user keywords to get the requested  tweets.
5. Twitter replies with tweets to the server.
6. Sentiment analysis is done on the tweets to get the sentiment of each tweet.
7. Tweets are sent to the Client(website) with the respective sentiment.