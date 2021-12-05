import socketio

sio = socketio.AsyncServer()
app = socketio.ASGIApp(sio)

static_files={
	'/': './Fast API/'
}

@sio.event
async def connect(sid, environ):
	print(sid, "connected.")

@sio.event
async def disconnect(sid):
	print(sid, 'disconnected')