from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from database import database

router = APIRouter()
clients = []

@router.websocket("")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    query = """SELECT "user", "content", "timestamp" FROM "Messages" ORDER BY id"""
    rows = await database.fetch_all(query=query)
    for row in rows:
        message = {
            "user": row["user"],
            "content": row["content"],
            "timestamp": row["timestamp"].isoformat()
        }
        await websocket.send_json(message)

    try:
        while True:
            data = await websocket.receive_json()
            user = data['username']
            content = data['newMessage']
            timestamp = datetime.utcnow()

            message = {
                "user": user,
                "content": content,
                "timestamp": timestamp.isoformat()
            }

            query = """
            INSERT INTO "Messages" ("user", "content", "timestamp")
            VALUES (:user, :content, :timestamp)
            """
            values = {"user": user, "content": content, "timestamp": timestamp}
            await database.execute(query=query, values=values)

            for client in clients:
                await client.send_json(message)
    except WebSocketDisconnect:
        clients.remove(websocket)
