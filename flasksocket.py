from flask import Flask
from flask_socketio import SocketIO, send, disconnect
from flask_cors import CORS
import twitterapi

app = Flask(__name__)
app.config['SECRET_KEY'] = 'myownsecret'
CORS(app)
sio = SocketIO(app, cors_allowed_origins='*')

@sio.on('connect')
def connection():
    print('****************** Connected ************************')

@sio.on('disconnect')
def disconnect():
    print('Client disconnected')
    ts.close_conn = True

@sio.event()
def get_stream(data):
    keys = data['keys'].split(';')
    print("********** Keys: ", keys)
    SendStream(keys[0], keys[1])

@sio.on('message')
def handleMessage(msg):
    
    if '[200]' in msg:
        print('-------- Recieved Message: ', msg)
    elif '[201]' in msg:
        print('-------- Disconnect Request recieve ------------------')
        print(msg)
        disconnect()
    else:
        print("Unknown Message")
        
        

def SendStream(key1, key2):
    global ts
    ts = twitterapi.TwitterStream(key1, key2)
    print("************************ Sending Stream ***********************")
    for tweet in ts.get_stream():
        print(tweet)
        sio.emit('tweets', tweet)


if __name__ == '__main__':
    sio.run(app, debug=True)