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
        output_folder = data.get("output_folder")  # Get the custom output folder from the request

        # If no custom output folder is provided, create one in the same directory as the video
        if output_folder is None:
            video_dir = os.path.dirname(video_path)
            output_folder = os.path.join(video_dir, "output")

        output_paths = add_text_overlay(
            video_path, 
            text_pairs, 
            font_size, 
            font_color, 
            font_style, 
            position,
            output_folder  # Pass the custom output folder
        )

        return jsonify({
            "message": "Videos processed successfully",
            "output_paths": output_paths
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500