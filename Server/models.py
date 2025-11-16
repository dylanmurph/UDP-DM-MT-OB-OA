from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from . import db, bcrypt

# Enum for User roles
class UserRole(str, Enum):
    ADMIN = "admin"
    HOST = "host"
    GUEST = "guest"

ROLE_PERMISSIONS = {
    UserRole.ADMIN: {"manage_users", "manage_all_bnbs", "view_all_logs", "device_register", "view_self"},
    UserRole.HOST: {"manage_own_bnbs", "view_own_logs", "manage_credentials_own", "device_register", "view_self"},
    UserRole.GUEST: {"view_self"},
}

# User Model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    contact_number = db.Column(db.String(32))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.GUEST, index=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    last_login_at = db.Column(db.DateTime)

    bnbs = db.relationship("BnB", back_populates="host", lazy="dynamic")

    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    @property
    def permissions(self) -> set:
        return ROLE_PERMISSIONS.get(self.role, set())

    def has_permission(self, permission_name: str) -> bool:
        return permission_name in self.permissions

    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    def is_host(self) -> bool:
        return self.role == UserRole.HOST

    def is_guest(self) -> bool:
        return self.role == UserRole.GUEST


# BnB Model
class BnB(db.Model):
    __tablename__ = "bnbs"
    id = db.Column("bnb_id", db.Integer, primary_key=True)
    unique_code = db.Column("bnb_unique_code", db.String(64), unique=True, nullable=False)
    name = db.Column("bnb_name", db.String(255), nullable=False)
    timezone = db.Column("timezone", db.String(64))
    host_name = db.Column("host_name", db.String(255))
    host_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    host = db.relationship("User", back_populates="bnbs")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    bookings = db.relationship("Booking", back_populates="bnb", lazy="dynamic")
    access_logs = db.relationship("AccessLog", back_populates="bnb", lazy="dynamic")

    def __repr__(self):
        return f"<BnB {self.name} ({self.unique_code})>"


# Booking Model
class BookingStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Booking(db.Model):
    __tablename__ = "bookings"
    id = db.Column("booking_id", db.Integer, primary_key=True)
    bnb_id = db.Column("bnb_id", db.Integer, db.ForeignKey("bnbs.bnb_id"), nullable=False, index=True)
    bnb = db.relationship("BnB", back_populates="bookings")
    booking_code = db.Column("booking_code", db.String(64), unique=True, nullable=False)
    check_in_time = db.Column("check_in_time", db.DateTime, nullable=False)
    check_out_time = db.Column("check_out_time", db.DateTime, nullable=False)
    status = db.Column("status", db.Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    guests = db.relationship("Guest", back_populates="booking", lazy="dynamic")

    def __repr__(self):
        return f"<Booking {self.booking_code} ({self.status})>"


# Guest Model
class Guest(db.Model):
    __tablename__ = "guests"
    id = db.Column("guest_id", db.Integer, primary_key=True)
    booking_id = db.Column("booking_id", db.Integer, db.ForeignKey("bookings.booking_id"), nullable=False, index=True)
    booking = db.relationship("Booking", back_populates="guests")
    name = db.Column("name", db.String(255), nullable=False)
    phone_no = db.Column("phone_no", db.String(32))
    is_primary = db.Column("is_primary", db.Boolean, nullable=False, default=False)
    credentials = db.relationship("Credential", back_populates="guest", lazy="dynamic")
    photos = db.relationship("GuestPhoto", back_populates="guest", lazy="dynamic")
    access_logs = db.relationship("AccessLog", back_populates="guest", lazy="dynamic")

    def __repr__(self):
        return f"<Guest {self.name}>"


# GuestPhoto Model
class GuestPhoto(db.Model):
    __tablename__ = "guest_photos"
    id = db.Column("photo_id", db.Integer, primary_key=True)
    guest_id = db.Column("guest_id", db.Integer, db.ForeignKey("guests.guest_id"), nullable=False, index=True)
    guest = db.relationship("Guest", back_populates="photos")
    path = db.Column("path", db.String(500), nullable=False)
    date_added = db.Column("date_added", db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<GuestPhoto {self.id}>"


# Credential Model
class CredentialType(str, Enum):
    NFC = "nfc"
    FACE = "face"
    PIN = "pin"

class Credential(db.Model):
    __tablename__ = "credentials"
    id = db.Column("credential_id", db.Integer, primary_key=True)
    guest_id = db.Column("guest_id", db.Integer, db.ForeignKey("guests.guest_id"), nullable=False, index=True)
    guest = db.relationship("Guest", back_populates="credentials")
    type = db.Column("type", db.Enum(CredentialType), nullable=False)
    is_active = db.Column("is_active", db.Boolean, nullable=False, default=True)
    issued_at = db.Column("issued_at", db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    revoked_at = db.Column("revoked_at", db.DateTime)

    def __repr__(self):
        return f"<Credential {self.type} ({'Active' if self.is_active else 'Inactive'})>"


# AccessLog Model
class AuthMethod(str, Enum):
    NFC = "nfc"
    FACE = "face"
    PIN = "pin"
    OTHER = "other"

class AccessResult(str, Enum):
    SUCCESS = "success"
    FAILURE = "failure"

class AccessLog(db.Model):
    __tablename__ = "access_logs"
    id = db.Column("log_id", db.Integer, primary_key=True)
    guest_id = db.Column("guest_id", db.Integer, db.ForeignKey("guests.guest_id"), nullable=True, index=True)
    guest = db.relationship("Guest", back_populates="access_logs")
    bnb_id = db.Column("bnb_id", db.Integer, db.ForeignKey("bnbs.bnb_id"), nullable=False, index=True)
    bnb = db.relationship("BnB", back_populates="access_logs")
    time_logged = db.Column("time_logged", db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), index=True)
    auth_method = db.Column("auth_method", db.Enum(AuthMethod), nullable=False)
    result = db.Column("result", db.Enum(AccessResult), nullable=False)
    reason = db.Column("reason", db.String(255))
    snapshot = db.Column("snapshot", db.String(500))

    def __repr__(self):
        return f"<AccessLog {self.id} - {self.result}>"
