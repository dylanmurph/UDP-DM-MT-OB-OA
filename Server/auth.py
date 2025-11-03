from flask import request, jsonify
from app import app, db, bcrypt, login_manager
from flask_login import login_user, logout_user
from models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(force=True)
    user = User(username=data["username"], email=data.get("email"))
    user.set_password(data["password"], bcrypt)
    try:
        db.session.add(user)
        db.session.commit()
    except:
        db.session.rollback()
        return {"message": "Username already exists"}, 400
    login_user(user)
    return {"message": "User registered and logged in", "user_id": user.id}


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    user = User.query.filter_by(username=data["username"]).first()
    if user.check_password(data["password"], bcrypt):
        login_user(user)
        return jsonify({"message": "Logged in successfully", "user_id": user.id})

@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"})

from flask_login import current_user, login_required

from flask_login import current_user

@app.route("/api/me")
def me():
    if current_user.is_authenticated:
        return {"username": current_user.username, "user_id": current_user.id}
    return {"username": None, "user_id": None}

