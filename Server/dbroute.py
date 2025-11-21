from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from .models import User, BnB, Booking, Guest, AccessLog

db_bp = Blueprint("dbroute", __name__)

# ------------------- USERS -------------------
@db_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name} for u in users])


# ------------------- HOST ROUTES -------------------
# Host's BnBs
@db_bp.route("/host/bnbs", methods=["GET"])
@jwt_required()
def get_host_bnbs():
    identity = get_jwt_identity()
    user_id = identity["id"]

    bnbs = BnB.query.filter_by(host_id=user_id).all()
    return jsonify([{"id": b.id, "name": b.name, "unique_code": b.unique_code} for b in bnbs])


# Host's Guests
@db_bp.route("/host/guests", methods=["GET"])
@jwt_required()
def get_host_guests():
    identity = get_jwt_identity()
    user_id = identity["id"]

    bookings = Booking.query.join(BnB).filter(BnB.host_id == user_id).all()
    guests_list = []
    for booking in bookings:
        for guest in booking.guests:
            guests_list.append({
                "id": guest.id,
                "name": guest.name,
                "booking_code": booking.booking_code,
                "status": "Active" if booking.status.value == "ACTIVE" else booking.status.value
            })

    return jsonify(guests_list)


# Host's Access Logs
@db_bp.route("/host/logs", methods=["GET"])
@jwt_required()
def get_host_access_logs():
    identity = get_jwt_identity()
    user_id = identity["id"]

    logs = AccessLog.query.join(BnB).filter(BnB.host_id == user_id).all()
    logs_list = []
    for log in logs:
        logs_list.append({
            "id": log.id,
            "guestName": log.guest.name if log.guest else "Unknown",
            "property": log.bnb.name,
            "method": log.auth_method.value,
            "status": log.result.value.capitalize(),
            "time": log.time_logged.isoformat()
        })

    return jsonify(logs_list)


# Host Alerts
@db_bp.route("/host/alerts", methods=["GET"])
@jwt_required()
def get_host_alerts():
    identity = get_jwt_identity()
    user_id = identity["id"]

    logs = AccessLog.query.join(BnB).filter(BnB.host_id == user_id).all()
    alerts_list = []
    for log in logs:
        if log.result.value.lower() == "failure":
            alerts_list.append({
                "id": log.id,
                "type": "failed_access",
                "message": f"Failed access attempt by {log.guest.name if log.guest else 'Unknown'} at {log.bnb.name}",
                "status": "Pending",
                "time": log.time_logged.isoformat()
            })

    return jsonify(alerts_list)


# ------------------- GUEST ROUTES -------------------
# Guest Current Booking
@db_bp.route("/guest/current-booking", methods=["GET"])
@jwt_required()
def get_guest_current_booking():
    identity = get_jwt_identity()
    user_id = identity["id"]

    guest = Guest.query.filter_by(id=user_id).first()
    if not guest or not guest.booking:
        return jsonify({"message": "Booking not found"}), 404

    booking = guest.booking
    bnb = booking.bnb

    return jsonify({
        "name": guest.name,
        "propertyName": bnb.name,
        "propertyAddress": bnb.host_name,  # replace with actual address if available
        "bookingCode": booking.booking_code,
        "checkIn": booking.check_in_time.strftime("%Y-%m-%d"),
        "checkInTime": booking.check_in_time.strftime("%H:%M"),
        "checkOut": booking.check_out_time.strftime("%Y-%m-%d"),
        "checkOutTime": booking.check_out_time.strftime("%H:%M"),
    })


# Guest Alerts
@db_bp.route("/guest/alerts", methods=["GET"])
@jwt_required()
def get_guest_alerts():
    identity = get_jwt_identity()
    user_id = identity["id"]

    guest = Guest.query.filter_by(id=user_id).first()
    if not guest:
        return jsonify([])

    logs = guest.access_logs.order_by(AccessLog.time_logged.desc()).limit(10).all()
    alerts = []
    for log in logs:
        alerts.append({
            "id": log.id,
            "type": log.auth_method.value,
            "message": f"{log.result.value.capitalize()} access at {log.bnb.name}",
            "status": "Pending" if log.result.value.lower() == "failure" else "Resolved",
            "time": log.time_logged.isoformat(),
        })

    return jsonify(alerts)


# Guest All Bookings
@db_bp.route("/guest/bookings", methods=["GET"])
@jwt_required()
def get_guest_bookings():
    identity = get_jwt_identity()
    user_id = identity["id"]

    guest = Guest.query.filter_by(id=user_id).first()
    if not guest:
        return jsonify([])

    bookings = [guest.booking]  # or guest.bookings if multiple
    data = []
    for b in bookings:
        data.append({
            "bookingCode": b.booking_code,
            "propertyName": b.bnb.name,
            "checkIn": b.check_in_time.strftime("%Y-%m-%d"),
            "checkInTime": b.check_in_time.strftime("%H:%M"),
            "checkOut": b.check_out_time.strftime("%Y-%m-%d"),
            "checkOutTime": b.check_out_time.strftime("%H:%M"),
            "status": b.status.value,
        })

    return jsonify(data)

# Guest Add Booking (for testing)
@db_bp.route("/guest/add-booking", methods=["POST"])
@jwt_required()
def add_guest_booking():
    from flask import request
    identity = get_jwt_identity()
    user_id = identity["id"]

    data = request.json
    bnb_id = data.get("bnb_id")
    check_in = data.get("check_in")
    check_out = data.get("check_out")
    booking_code = data.get("booking_code")

    guest = Guest.query.filter_by(id=user_id).first()
    if not guest:
        return jsonify({"message": "Guest not found"}), 404

    bnb = BnB.query.filter_by(id=bnb_id).first()
    if not bnb:
        return jsonify({"message": "BnB not found"}), 404

    # Create new booking
    new_booking = Booking(
        booking_code=booking_code,
        guest_id=guest.id,
        bnb_id=bnb.id,
        check_in_time=check_in,
        check_out_time=check_out,
        status="ACTIVE"
    )
    db.session.add(new_booking)
    db.session.commit()

    # Associate booking with guest
    guest.booking_id = new_booking.id
    db.session.commit()

    return jsonify({"message": "Booking added successfully"}), 201
