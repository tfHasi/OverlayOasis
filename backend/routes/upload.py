from flask import Blueprint, request
from services.file_service import handle_video_upload, handle_csv_upload

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload/video", methods=["POST"])
def upload_video():
    """
    Handles video file uploads.
    """
    return handle_video_upload(request)

@upload_bp.route("/upload/csv", methods=["POST"])
def upload_csv():
    """
    Handles CSV file uploads.
    """
    return handle_csv_upload(request)