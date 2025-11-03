from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from models import db, Guest  # updated to Guest
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Allow CORS for React frontend
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Initialize Flask-Login
login_manager = LoginManager(app)
login_manager.login_view = "login"  # optional: default login route

# Initialize database
db.init_app(app)
with app.app_context():
    db.create_all()

# Import routes after app & db are initialized
from auth import *  # your /register, /login, /logout routes

# Test route
@app.route("/api/hello")
def hello():
    return {"message": "Hello from the backend!"}