from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Load config
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    from .auth import auth_bp
    app.register_blueprint(auth_bp)

    return app