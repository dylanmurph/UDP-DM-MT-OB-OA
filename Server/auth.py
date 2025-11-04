from flask import request, jsonify
from app import app, db, bcrypt, login_manager
from flask_login import login_user, logout_user, current_user, login_required
from models import Guest

import re

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"
CONTACT_REGEX = r"^\+?\d{7,15}$"

# ============================================================
# USER LOADER (Flask-Login)
# ============================================================

@login_manager.user_loader
def load_user(guest_id):
    """Load a guest by their ID for Flask-Login sessions."""
    return Guest.query.get(int(guest_id))

# ============================================================
# REGISTER GUEST
# ============================================================

from flask import request, jsonify
from app import app, db, bcrypt
from models import Guest
from flask_login import login_user

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    contact_number = data.get("contact_number")

    # Check required fields
    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400

    # Email validation
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"message": "Invalid email format"}), 400

    # Contact number validation (optional field)
    if contact_number and not re.match(CONTACT_REGEX, contact_number):
        return jsonify({"message": "Invalid contact number format"}), 400

    # Check if email already exists
    if Guest.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    # Create guest
    guest = Guest(
        name=name,
        email=email,
        contact_number=contact_number
    )
    guest.set_password(password, bcrypt)

    try:
        db.session.add(guest)
        db.session.commit()
        login_user(guest)  # log in after registration
        return jsonify({
            "message": "Guest registered and logged in",
            "guest_id": guest.guest_id,
            "name": guest.name,
            "email": guest.email
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error registering guest", "error": str(e)}), 500

# ============================================================
# LOGIN GUEST
# ============================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(force=True)

    # Find guest by email
    guest = Guest.query.filter_by(email=data.get("email").lower()).first()
    if not guest:
        return jsonify({"message": "Guest not found"}), 404

    # Check password
    if not guest.check_password(data.get("password"), bcrypt):
        return jsonify({"message": "Invalid password"}), 401

    # Login successful
    login_user(guest)
    guest.last_login_at = db.func.now()
    db.session.commit()

    return jsonify({
        "message": "Logged in successfully",
        "guest_id": guest.guest_id,
        "name": guest.name
    })

# ============================================================
# LOGOUT
# ============================================================

@app.route("/api/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"})

# ============================================================
# CURRENT LOGGED-IN GUEST INFO
# ============================================================

@app.route("/api/me", methods=["GET"])
def me():
    if current_user.is_authenticated:
        return jsonify({
            "guest_id": current_user.guest_id,
            "name": current_user.name,
            "email": current_user.email
        })
    return jsonify({
        "guest_id": None,
        "name": None,
        "email": None
    })
