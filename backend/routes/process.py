from flask import Blueprint, request, jsonify
from services.overlay_service import add_text_overlay

process_bp = Blueprint("process", __name__)

@process_bp.route("/process", methods=["POST"])
def process():
    """
    Handles video processing and text overlay generation.
    """
    try:
        # Parse request data
        data = request.json
        video_path = data.get("video_path")
        text_pairs = data.get("text_pairs")
        font_size = data.get("font_size", 24)
        font_color = data.get("font_color", "white")
        font_style = data.get("font_style", "Arial")
        position = data.get("position", ("center", "bottom"))

        # Add text overlays to the video
        output_path = add_text_overlay(video_path, text_pairs, font_size, font_color, font_style, position)

        # Return the output video path
        return jsonify({"message": "Video processed successfully", "output_path": output_path}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500