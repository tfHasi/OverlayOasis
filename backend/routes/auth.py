from flask import Blueprint, jsonify, session, request
from backend.services.auth_service import handle_login, handle_callback, handle_logout, get_profile

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["GET"])
def login():
    return handle_login()

@auth_bp.route("/callback", methods=["GET"])
def callback():
    return handle_callback()

@auth_bp.route("/profile", methods=["GET"])
def profile():
    return get_profile()

@auth_bp.route("/logout", methods=["GET"])
def logout():
    return handle_logout()