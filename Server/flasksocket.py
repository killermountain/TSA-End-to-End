from flask import Flask
from flask_socketio import SocketIO, send, disconnect
from flask_cors import CORS
import twitterapi
from sentimentanalysis import GetSentiment
# import asyncio
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'myownsecret'
CORS(app)
sio = SocketIO(app, cors_allowed_origins='*')
client_ids = []
tasks = {}
ts = None

@sio.on('connect')
def connected():
    print("######################## Connected $$$$$$$$$$$$$$$$$$$$")
    id = random.randint(1000,10000)
    while id in client_ids:
        id = random.randint(1000,10000)
    
    client_ids.append(id)
    send(f'[300] Connected with client ID:{id}')
    
    print(f'****************** Connected with client id: {id}************************')

@sio.on('disconnect')
def disconnected():
    print('Client disconnected')
    
@sio.event()
def get_stream(data):
    keys = data['keys'].split(';')
    client_id = data['sid']
    SendStream(keys[0], keys[1])
    # stream_task = asyncio.ensure_future(SendStream(keys[0], keys[1]))
    # tasks[client_id] = stream_task
    print("End main func()")
    
@sio.on('message')
def handleMessage(msg):
    global ts
    if '[200]' in msg:
        print('-------- Recieved Message: ', msg)
    elif '[201]' in msg:
        print(msg)
        id = msg.split(';')[1]
        if ts: ts.close_conn = True
        if id in tasks: tasks[id].cancel()
        disconnect()
    else:
        print("Unknown Message")      

def SendStream(key1, key2):
    print("********** Key1: "+ key1 +" key2: " + key2)
    global ts
    ts = twitterapi.TwitterStream(key1, key2)
    print("************************ Sending Stream ***********************")
    count = 0
    for tweet in ts.get_stream():
        #print(tweet)
        sentiment= GetSentiment(tweet['text'])
        tweet["sentiment"] = sentiment
        print(sentiment)
        count += 1
        print(f"Tweet #: {count} -- Sentiment: {sentiment}")
        sio.emit('tweets', tweet)
        


if __name__ == '__main__':
    sio.run(app, debug=True)

