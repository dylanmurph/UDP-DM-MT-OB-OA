from flask import Blueprint, request, jsonify
from .models import db, User, BnB, Booking, Guest, GuestPhoto, Credential, AccessLog
from flask_jwt_extended import create_access_token
from datetime import datetime
import re
from . import bcrypt

# ============================================================
# CONFIG
# ============================================================

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"
CONTACT_REGEX = r"^\+?\d{7,15}$"

# Create Blueprint
auth_bp = Blueprint("auth", __name__)

# ============================================================
# UNIVERSAL REGISTER (USER OR HOST)
# ============================================================

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    name = data.get("name")
    email = data.get("email", "").lower()
    password = data.get("password")
    contact_number = data.get("contact_number")
    role = data.get("role", "user")

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"message": "Invalid email format"}), 400
    if contact_number and not re.match(CONTACT_REGEX, contact_number):
        return jsonify({"message": "Invalid contact number format"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    user = User(name=name, email=email, contact_number=contact_number, role=role)
    user.set_password(password, bcrypt)

    try:
        db.session.add(user)
        db.session.commit()
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify({
            "message": f"{role.capitalize()} registered successfully",
            "access_token": access_token,
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error registering user", "error": str(e)}), 500

# ============================================================
# LOGIN USER OR HOST
# ============================================================

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email = data.get("email", "").lower()
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    if not user.check_password(password, bcrypt):
        return jsonify({"message": "Invalid password"}), 401

    user.last_login_at = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }), 200