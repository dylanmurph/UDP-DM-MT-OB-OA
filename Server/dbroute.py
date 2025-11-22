from flask import Blueprint, jsonify
from .models import (
    User,
    BnB,
    Booking,
    UserBooking,
    Fob,
    FobBooking,
    AccessLog,
    TamperAlert,
    UserRole,
)


db_bp = Blueprint("dbroute", __name__)

@db_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name} for u in users])