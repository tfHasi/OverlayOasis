from flask import Blueprint, request, jsonify
from backend.services.file_service import handle_upload

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload():
    return handle_upload(request)