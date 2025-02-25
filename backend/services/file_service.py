import os
import csv
from flask import jsonify
from werkzeug.utils import secure_filename
from config import Config

def handle_video_upload(request):
    """
    Handles video file uploads and saves the video in the same directory as the original video.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Validate file type (only allow .mp4)
    if not file.filename.endswith(".mp4"):
        return jsonify({"error": "Invalid file type. Only .mp4 files are allowed"}), 400

    # Secure the filename
    filename = secure_filename(file.filename)

    # Get the original path from the request
    original_path = request.form.get("original_path")
    if not original_path:
        return jsonify({"error": "Original path not provided"}), 400

    # Determine the directory of the original video
    original_dir = os.path.dirname(original_path)

    # Save the file in the same directory as the original video
    file_path = os.path.join(original_dir, filename)

    try:
        file.save(file_path)
        return jsonify({
            "message": "Video uploaded successfully",
            "file_path": file_path,
            "original_path": original_path  # Return the original path
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to save video: {str(e)}"}), 500
    
def handle_csv_upload(request):
    """
    Handles CSV file uploads.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Validate file type (only allow .csv)
    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Invalid file type. Only .csv files are allowed"}), 400

    try:
        # Parse the CSV file
        csv_data = file.read().decode("utf-8")
        csv_reader = csv.reader(csv_data.splitlines())
        
        # Skip the header row
        next(csv_reader)
        
        # Get the remaining rows as text pairs
        text_pairs = [row for row in csv_reader]

        return jsonify({"message": "CSV uploaded successfully", "text_pairs": text_pairs}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to parse CSV: {str(e)}"}), 500