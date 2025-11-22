from flask import Blueprint, request, jsonify
from .models import db, BnB, Fob, Booking, FobBooking, AccessLog, TamperAlert, User

hardware_bp = Blueprint("hardware", __name__)

@hardware_bp.route("/hardware/fob_tap", methods=["POST"])
def handle_fob_tap_event():
    """
    Handle a fob tap event sent from the Raspberry Pi (via PubNub or webhook).
    Expected payload:
    - bnb_unique_code
    - fob_uid
    - image_url
    - timestamp

    TODO:
    - Lookup BnB by unique_code.
    - Lookup Fob by UID (or treat as unknown).
    - Check active FobBooking and determine if fob is valid.
    - Immediately decide access_granted (True/False).
    - Download image from AWS, store permanently.
    - Optionally run face recognition for logging.
    - Insert AccessLog row with snapshot_path, match_result, etc.
    - Return JSON { \"access_granted\": bool } for Pi to act on.
    """
    return jsonify({"access_granted": False}), 200


@hardware_bp.route("/hardware/tamper", methods=["POST"])
def handle_tamper_event():
    """
    Handle a tamper-open event sent from the Raspberry Pi.
    Expected payload:
    - bnb_unique_code
    - timestamp

    TODO:
    - Lookup BnB by unique_code.
    - Insert TamperAlert row with bnb_id and triggered_at.
    """
    return jsonify({"status": "ok"}), 200
