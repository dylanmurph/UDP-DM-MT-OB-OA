from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Initialize extensions
db = SQLAlchemy()  # This is for the database
bcrypt = Bcrypt()  # For password hashing
jwt = JWTManager()  # For managing JSON Web Tokens (JWT)


def create_app():
    app = Flask(__name__)

    # Get database and JWT secret from the environment variables
    database_url = os.getenv("DATABASE_URL")
    jwt_secret_key = os.getenv("JWT_SECRET_KEY")

    # Set up Flask app configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url  # Database connection string
    app.config["JWT_SECRET_KEY"] = jwt_secret_key  # Secret key for JWT
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = (
        False  # Disable modification tracking for memory efficiency
    )

    # Enable CORS for both production and local environments
    CORS(
        app,
        origins=["https://www.hostlocksd3b.online", "http://localhost:3000"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Initialize the extensions with the app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import models after initializing the database
    from .models import User, BnB, Booking, Guest, GuestPhoto, Credential, AccessLog

    # Create all tables in the database if they don't already exist
    with app.app_context():
        print("Creating database tables (if not already created)...")
        try:
            db.create_all()  # This creates the tables for all the models in the database
            print("Tables created successfully!")

            # Test if the models are registered correctly by querying the User model
            first_user = (
                User.query.first()
            )  # Try to get the first user from the User table
            print(f"First User: {first_user}")

        except Exception as e:
            print(
                f"Error creating tables: {e}"
            )  # Print any error if table creation fails

    # Register the authentication blueprint (for login, registration, etc.)
    from .auth import auth_bp

    app.register_blueprint(auth_bp)

    return app  # Return the app instance
