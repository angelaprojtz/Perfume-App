from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS # Cross origin request

import os
from dotenv import load_dotenv


load_dotenv()  # reads backend/.env and loads FRAGELLA_API_KEY into the environment

app = Flask(__name__) #initialize flask application
CORS(app) # we can send CORS to app

#initialize db things
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app) #db instance creating, gives us access to it