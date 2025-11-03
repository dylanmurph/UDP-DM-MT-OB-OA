# app.py
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from models import db, User
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

db.init_app(app)  # initialize the shared db with this app

with app.app_context():
    db.create_all()

from auth import *  # routes like /register, /login, /logout

@app.route("/api/hello")
def hello():
    return {"message": "Hello from the backend!"}
