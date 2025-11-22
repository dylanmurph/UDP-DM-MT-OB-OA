from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, AccessLog, BnB

access_bp = Blueprint("access", __name__)

@access_bp.route("/bnbs/<int:bnb_id>/access_logs", methods=["GET"])
@jwt_required()
def get_access_logs_for_bnb(bnb_id):
    """
    Return access logs for a BnB.
    TODO:
    - Check permissions (host/admin).
    - Filter access logs by BnB, date range, etc (query params).
    """
    return jsonify([]), 200
