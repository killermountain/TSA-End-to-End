from fastapi import FastAPI,WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def getmain():
    return {"msg": "hell0"}

@app.websocket("/ws")
async def connection(websocket:WebSocket):
    print("Accepting connection")
    await websocket.accept()
    print("accepted!")
    
    while True:
        try:
            data = await websocket.receive_text()
            print("On server:", data)
        except:
            break

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True, access_log=False)