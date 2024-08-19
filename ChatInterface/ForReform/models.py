from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

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
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
