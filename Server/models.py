from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    contact_number = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="guest")
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    last_login_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def set_password(self, password, bcrypt):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password, bcrypt):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.name} ({self.role})>"


class BnB(db.Model):
    __tablename__ = "bnbs"

    bnb_id = db.Column(db.Integer, primary_key=True)
    bnb_unique_code = db.Column(db.String(50), unique=True, nullable=False)
    bnb_name = db.Column(db.String(120), nullable=False)
    host_name = db.Column(db.String(120), nullable=False)
    time_zone = db.Column(db.String(50), nullable=True)

    bookings = db.relationship("Booking", backref="bnb", lazy=True)
    access_logs = db.relationship("AccessLog", backref="bnb", lazy=True)

    def __repr__(self):
        return f"<BnB {self.bnb_name} ({self.bnb_unique_code})>"


class Booking(db.Model):
    __tablename__ = "bookings"

    booking_id = db.Column(db.Integer, primary_key=True)
    bnb_id = db.Column(db.Integer, db.ForeignKey("bnbs.bnb_id"), nullable=False)
    booking_code = db.Column(db.String(50), unique=True, nullable=False)
    check_in_time = db.Column(db.DateTime, nullable=False)
    check_out_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(
        db.Enum(
            "Pending",
            "Confirmed",
            "CheckedIn",
            "CheckedOut",
            "Cancelled",
            name="booking_status",
        ),
        nullable=False,
        default="Pending",
    )

    guests = db.relationship("Guest", backref="booking", lazy=True)

    def __repr__(self):
        return f"<Booking {self.booking_code} ({self.status})>"


class Guest(db.Model):
    __tablename__ = "guests"

    guest_id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(
        db.Integer, db.ForeignKey("bookings.booking_id"), nullable=False
    )
    name = db.Column(db.String(120), nullable=False)
    contact_number = db.Column(db.String(20), nullable=True)
    is_primary = db.Column(db.Boolean, default=False, nullable=False)

    credentials = db.relationship("Credential", backref="guest", lazy=True)
    photos = db.relationship("GuestPhoto", backref="guest", lazy=True)
    access_logs = db.relationship("AccessLog", backref="guest", lazy=True)

    def __repr__(self):
        return f"<Guest {self.name}>"


class GuestPhoto(db.Model):
    __tablename__ = "guest_photos"

    photo_id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey("guests.guest_id"), nullable=False)
    path = db.Column(db.String(255), nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<GuestPhoto {self.photo_id}>"


class Credential(db.Model):
    __tablename__ = "credentials"

    credential_id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey("guests.guest_id"), nullable=False)
    type = db.Column(
        db.Enum("NFCPhone", "NFCCard", "MobileApp", name="credential_type"),
        nullable=False,
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    issued_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    revoked_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return (
            f"<Credential {self.type} ({'Active' if self.is_active else 'Inactive'})>"
        )


class AccessLog(db.Model):
    __tablename__ = "access_logs"

    log_id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey("guests.guest_id"), nullable=False)
    bnb_id = db.Column(db.Integer, db.ForeignKey("bnbs.bnb_id"), nullable=False)
    time_logged = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    auth_method = db.Column(
        db.Enum("NFCPhone", "NFCCard", "MobileApp", name="auth_method"), nullable=False
    )
    result = db.Column(
        db.Enum("Granted", "Denied", "Error", name="access_result"), nullable=False
    )
    reason = db.Column(db.String(255), nullable=True)
    snapshot = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<AccessLog {self.log_id} - {self.result}>"
