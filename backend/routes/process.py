from flask import Blueprint, jsonify, request
from backend.services.overlay_service import process_video

process_bp = Blueprint("process", __name__)

@process_bp.route("/process", methods=["POST"])
def process():
    return process_video(request)