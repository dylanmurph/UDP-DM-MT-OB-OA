from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db, User
import os
from dotenv import load_dotenv
# Import auth routes (register/login/logout)
from .auth import *

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-change-me")

# Allow CORS for React frontend
CORS(app, origins=["http://localhost:3000"])

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Initialize JWT
jwt = JWTManager(app)

# Initialize database
db.init_app(app)
with app.app_context():
    db.create_all()

    # Add test user if not exists
    if not User.query.filter_by(email="test@example.com").first():
        u = User(name="Test", email="test@example.com")
        u.set_password("password123", bcrypt)
        db.session.add(u)
        db.session.commit()

@app.route("/api/hello")
def hello():
    return {"message": "Hello from the backend!"}
