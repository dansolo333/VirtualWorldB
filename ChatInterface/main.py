from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from databases import Database
from datetime import datetime
from passlib.context import CryptContext
import secrets
from pydantic import BaseModel
from typing import Optional, List
import shutil
import os
from fastapi.staticfiles import StaticFiles


# Set up password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/static", StaticFiles(directory="static"), name="static")
# app.mount("/static", StaticFiles(directory="/home/osebi/VirtualWorldB/virtualworldb/src/components/media"), name="static")
# Get the directory of the current file
current_directory = os.path.dirname(os.path.abspath(__file__))

# Use a relative path to the media directory
static_directory = os.path.join(current_directory, "../virtualworldb/src/components/media")

app.mount("/static", StaticFiles(directory=static_directory), name="static")

# Database configuration
# DATABASE_URL = "postgresql://postgres:password@localhost/VirtualWorldB"
# DATABASE_URL = "postgresql://postgres:password@172.18.16.1/VirtualWorldB"
DATABASE_URL = DATABASE_URL = "postgresql://daniel:SfhqW1biAYfHP6WijBwAm8KNHqDWXwdk@dpg-cr3nth3qf0us73ebohk0-a.oregon-postgres.render.com/virtualworldb"

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
Base = declarative_base()

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    walletAddress = Column(String)
    profilePhoto = Column(String)
    balance = Column(Integer)  # Adjust if balance is a float

class Message(Base):
    __tablename__ = "Messages"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)
    recipient = Column(String, index=True)  # New column for recipient
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)


# Create the database tables
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

clients = []

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Define Pydantic models for request and response
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    walletAddress: str
    profilePhoto: Optional[str] = None
    balance: Optional[int] = None

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    profilePhoto: Optional[str] = None
    walletAddress: Optional[str] = None


class SendMoneyRequest(BaseModel):
    recipient: str
    amount: float

# Create a new user endpoint
@app.post("/signup", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = pwd_context.hash(user.password)
    wallet_address = secrets.token_hex(16)
    db_user = User(username=user.username, password=hashed_password, walletAddress=wallet_address)
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_user

# Login user endpoint
@app.post("/login")
async def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user and pwd_context.verify(user.password, db_user.password):
        return {"message": "Login successful", "walletAddress": db_user.walletAddress}
    raise HTTPException(status_code=400, detail="Invalid username or password")

# Fetch user details endpoint
@app.get("/user/{username}", response_model=UserResponse)
async def get_user(username: str, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.username == username).first()
        if db_user:
            return db_user
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        print(f"Error fetching user: {e}")  # Log the error to the console
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    # Handle initial message fetching if necessary
    query = """SELECT "user", "recipient", "content", "timestamp" FROM "Messages" ORDER BY id"""
    rows = await database.fetch_all(query=query)
    for row in rows:
        message = {
            "user": row["user"],
            "recipient": row["recipient"],
            "content": row["content"],
            "timestamp": row["timestamp"].isoformat()
        }
        await websocket.send_json(message)

    try:
        while True:
            data = await websocket.receive_json()
            print(f"Received message: {data}")  # Add this line to log received messages
            user = data['username']
            recipient = data['recipient']
            content = data['content']
            timestamp = datetime.utcnow()

            message = {
                "user": user,
                "recipient": recipient,
                "content": content,
                "timestamp": timestamp.isoformat()
            }

            query = """
            INSERT INTO "Messages" ("user", "recipient", "content", "timestamp")
            VALUES (:user, :recipient, :content, :timestamp)
            """
            values = {"user": user, "recipient": recipient, "content": content, "timestamp": timestamp}
            await database.execute(query=query, values=values)

            for client in clients:
                await client.send_json(message)
    except WebSocketDisconnect:
        print("WebSocket disconnected")  # Log disconnection
        clients.remove(websocket)




# Update User endpoint with wallet address
@app.put("/user/{username}/update")
async def update_user(username: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username:
        db_user.username = user_update.username
    if user_update.profilePhoto:
        db_user.profilePhoto = user_update.profilePhoto
    if user_update.walletAddress:
        db_user.walletAddress = user_update.walletAddress

    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))



# Search users endpoint
@app.get("/users", response_model=List[UserResponse])
async def search_users(search: str):
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.username.ilike(f"%{search}%")).all()
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
        return users
    finally:
        db.close()

# Send money endpoint
@app.post("/sendmoney")
async def send_money(request: SendMoneyRequest, db: Session = Depends(get_db)):
    sender_username = "current_user"  # Replace with actual current user's username
    recipient_user = db.query(User).filter(User.username == request.recipient).first()
    if not recipient_user:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Replace with actual smart contract interaction
    success = smart_contract_send_money(sender_username, request.recipient, request.amount)
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to send money")
    
    return {"detail": "Money sent successfully"}


# Replace with actual smart contract interaction function
def smart_contract_send_money(sender: str, recipient: str, amount: float) -> bool:
    # Example smart contract function call
    # This should be replaced with your actual implementation
    return True


# To run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
