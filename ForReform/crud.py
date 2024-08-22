from sqlalchemy.orm import Session
from models import User
from utils.security import pwd_context
import secrets

def create_user(db: Session, username: str, password: str):
    hashed_password = pwd_context.hash(password)
    wallet_address = secrets.token_hex(16)
    db_user = User(username=username, password=hashed_password, walletAddress=wallet_address)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if user and pwd_context.verify(password, user.password):
        return user
    return None
