import os
import csv
from flask import jsonify
from werkzeug.utils import secure_filename
from config import Config

def handle_video_upload(request):
    """
    Handles video file uploads and saves to the configured upload directory.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.endswith(".mp4"):
        return jsonify({"error": "Invalid file type. Only .mp4 files are allowed"}), 400

    filename = secure_filename(file.filename)

    upload_folder = os.environ.get('UPLOAD_FOLDER')
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, filename)

    try:
        file.save(file_path)
        # Return a relative URL path, not the file system path
        relative_path = f"/uploads/{filename}"
        return jsonify({
            "message": "Video uploaded successfully",
            "file_path": relative_path
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

    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Invalid file type. Only .csv files are allowed"}), 400

    try:
        csv_data = file.read().decode("utf-8")
        csv_reader = csv.reader(csv_data.splitlines())
        next(csv_reader)
        text_pairs = [row for row in csv_reader]
        return jsonify({"message": "CSV uploaded successfully", "text_pairs": text_pairs}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to parse CSV: {str(e)}"}), 500