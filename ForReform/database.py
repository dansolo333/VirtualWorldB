from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from databases import Database

DATABASE_URL = "postgresql://postgres:password@localhost/VirtualWorldB"

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# To create the database tables
# Base.metadata.create_all(bind=engine)
