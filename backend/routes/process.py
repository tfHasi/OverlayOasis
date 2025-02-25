from flask import Blueprint, request, jsonify
from services.overlay_service import add_text_overlay
import os

process_bp = Blueprint("process", __name__)

@process_bp.route("/process", methods=["POST"])
def process():
    """
    Handles video processing and text overlay generation.
    Creates separate videos for each language.
    """
    try:
        data = request.json
        video_path = data.get("video_path")
        text_pairs = data.get("text_pairs")
        font_size = data.get("font_size", 24)
        font_color = data.get("font_color", "white")
        font_style = data.get("font_style", "Arial")
        position = data.get("position", "bottom-center")

        # Define output folder in the same directory as the video
        video_dir = os.path.dirname(video_path)
        output_folder = os.path.join(video_dir, "output")
        os.makedirs(output_folder, exist_ok=True)  # Ensure the folder exists

        output_paths = add_text_overlay(
            video_path, 
            text_pairs, 
            font_size, 
            font_color, 
            font_style, 
            position
        )

        return jsonify({
            "message": "Videos processed successfully",
            "output_paths": output_paths
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500