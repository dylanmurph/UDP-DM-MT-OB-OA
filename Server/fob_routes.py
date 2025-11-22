from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import db, Fob, FobBooking, BnB, Booking

fob_bp = Blueprint("fob", __name__)

@fob_bp.route("/bnbs/<int:bnb_id>/fobs", methods=["GET"])
@jwt_required()
def list_fobs_for_bnb(bnb_id):
    """
    List all fobs registered for a BnB.
    TODO:
    - Confirm caller can manage this BnB.
    - Return list of fobs and their status.
    """
    return jsonify([]), 200


@fob_bp.route("/fobs", methods=["POST"])
@jwt_required()
def register_fob():
    """
    Register a new physical fob (by UID).
    TODO:
    - Accept UID and optional label + BnB mapping.
    - Ensure UID is unique.
    - Insert Fob row.
    """
    return jsonify({}), 201


@fob_bp.route("/fobs/<int:fob_id>/assign", methods=["POST"])
@jwt_required()
def assign_fob_to_booking(fob_id):
    """
    Manually assign a fob to a booking.
    TODO:
    - Accept booking_id and window if overriding.
    - Create FobBooking linking this fob to a booking.
    """
    return jsonify({}), 200


@fob_bp.route("/fobs/<int:fob_id>/unassign", methods=["POST"])
@jwt_required()
def unassign_fob(fob_id):
    """
    Unassign or deactivate a fob from its current booking.
    TODO:
    - Find active FobBooking and set is_active = False.
    """
    return jsonify({}), 200
