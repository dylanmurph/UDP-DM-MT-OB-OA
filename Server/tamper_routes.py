from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, TamperAlert, BnB

tamper_bp = Blueprint("tamper", __name__)

@tamper_bp.route("/bnbs/<int:bnb_id>/tamper_alerts", methods=["GET"])
@jwt_required()
def get_tamper_alerts_for_bnb(bnb_id):
    """
    Return tamper alerts for a BnB.
    TODO:
    - Check permissions.
    - Return list of tamper events ordered by time.
    """
    return jsonify([]), 200
