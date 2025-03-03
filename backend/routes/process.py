from flask import Blueprint, request, jsonify
from services.overlay_service import add_text_overlay
import os

process_bp = Blueprint("process", __name__)

@process_bp.route("/process", methods=["POST"])
def process():
    """
    Handles video processing and text overlay generation.
    Creates separate videos for each language using environment variables for paths.
    """
    try:
        data = request.json
        relative_video_path = data.get("video_path")
        text_pairs = data.get("text_pairs")
        font_size = data.get("font_size", 24)
        font_color = data.get("font_color", "white")
        font_style = data.get("font_style", "Arial")
        position = data.get("position", "bottom-center")
        
        # Convert relative URL path to filesystem path
        if relative_video_path.startswith("/uploads/"):
            filename = os.path.basename(relative_video_path)
            upload_folder = os.environ.get('UPLOAD_FOLDER')
            video_path = os.path.join(upload_folder, filename)
        else:
            # Fallback if the path doesn't match expected format
            video_path = relative_video_path
            
        # Convert hex color to FFmpeg compatible format if it starts with '#'
        if font_color.startswith('#'):
            # Remove the '#' and convert to FFmpeg format
            font_color = font_color[1:]
            # FFmpeg expects either a color name or a hex value with alpha: 0xAARRGGBB
            # For simplicity, we'll use the format: white@1.0 or 0xFFFFFF@1.0
            font_color = f"0x{font_color}@1.0"

        output_paths = add_text_overlay(
            video_path, 
            text_pairs, 
            font_size, 
            font_color, 
            font_style, 
            position
        )
        
        # Convert output paths to relative URLs for frontend use
        relative_output_paths = []
        for path in output_paths:
            filename = os.path.basename(path)
            relative_path = f"/output/{filename}"
            relative_output_paths.append(relative_path)

        return jsonify({
            "message": "Videos processed successfully",
            "output_paths": relative_output_paths
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500