from pydantic import BaseModel
from typing import Optional

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
