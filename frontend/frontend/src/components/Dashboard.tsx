import React, { useState, useEffect } from "react";
import { uploadVideo, uploadCSV, addTextOverlay } from "../api";
import './Dashboard.css';

// Define expected API response types
interface VideoUploadResponse {
  message: string;
  file_path: string;
}

interface CSVUploadResponse {
  text_pairs: [string, string][];
}

interface ProcessedVideosResponse {
  message: string;
  output_paths: string[];
}

const Dashboard: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [videoPath, setVideoPath] = useState<string>("");
  const [originalPath, setOriginalPath] = useState<string>("");
  const [textPairs, setTextPairs] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedVideoPath = localStorage.getItem("videoPath");
      const savedOriginalPath = localStorage.getItem("originalPath");
      const savedTextPairsString = localStorage.getItem("textPairs");

      if (savedVideoPath) setVideoPath(savedVideoPath);
      if (savedOriginalPath) setOriginalPath(savedOriginalPath);

      if (savedTextPairsString) {
        const parsedPairs = JSON.parse(savedTextPairsString) as [string, string][];
        setTextPairs(parsedPairs);
      }
    } catch (err) {
      console.error("Error loading saved data:", err);
    }
  }, []);

  // Handle video file selection
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  // Handle CSV file selection
  const handleCSVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  // Upload video file with correct form data
  const handleUploadVideo = async () => {
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!videoFile.name.endsWith('.mp4')) {
        throw new Error("Please select a valid MP4 file. Only .mp4 files are allowed.");
      }

      const formData = new FormData();
      formData.append("file", videoFile);

      const response = await uploadVideo(formData);

      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response from server");
      }

      const data = response as VideoUploadResponse;

      if (!data.file_path) {
        throw new Error("Missing required fields in server response");
      }

      setVideoPath(data.file_path);
      setOriginalPath(data.file_path);
      setSuccessMessage(data.message || "Video uploaded successfully.");

      localStorage.setItem("videoPath", data.file_path);
      localStorage.setItem("originalPath", data.file_path);
    } catch (err) {
      console.error("Error uploading video:", err);
      setError(err instanceof Error ? err.message : "Error uploading video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Upload CSV file with better validation
  const handleUploadCSV = async () => {
    if (!csvFile) {
      setError("Please select a CSV file.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!csvFile.name.endsWith('.csv')) {
        throw new Error("Please select a valid CSV file. Only .csv files are allowed.");
      }

      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await uploadCSV(formData);

      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response from server");
      }

      const data = response as CSVUploadResponse;

      if (!data.text_pairs || !Array.isArray(data.text_pairs)) {
        throw new Error("Missing or invalid text pairs in server response");
      }

      setTextPairs(data.text_pairs);
      setSuccessMessage("CSV uploaded successfully.");

      localStorage.setItem("textPairs", JSON.stringify(data.text_pairs));
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError(err instanceof Error ? err.message : "Error uploading CSV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add subtitles to video with correct parameters
  const handleAddTextOverlay = async () => {
    if (!originalPath) {
      setError("Please upload a video first.");
      return;
    }

    if (!textPairs || textPairs.length === 0) {
      setError("Please upload a CSV file with subtitle text pairs.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await addTextOverlay(originalPath, textPairs);

      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response from server");
      }

      const data = response as ProcessedVideosResponse;

      if (!data.output_paths || !Array.isArray(data.output_paths)) {
        throw new Error("Missing or invalid videos list in server response");
      }

      setSuccessMessage(`Overlay Text added successfully. Created ${data.output_paths.length} video(s).`);
    } catch (err) {
      console.error("Error adding Overlay Text:", err);
      setError(err instanceof Error ? err.message : "Error adding Overlay Text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear all data and start fresh
  const handleReset = () => {
    setVideoFile(null);
    setCsvFile(null);
    setVideoPath("");
    setOriginalPath("");
    setTextPairs([]);
    setError(null);
    setSuccessMessage(null);

    localStorage.removeItem("videoPath");
    localStorage.removeItem("originalPath");
    localStorage.removeItem("textPairs");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">PROCEDURE</h2>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-button">×</button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="close-button">×</button>
        </div>
      )}

      {/* Video Upload */}
      <div className="section-container">
        <h3 className="section-title">Upload Video</h3>
        <div className="file-input-container">
          <input
            type="file"
            accept=".mp4"
            onChange={handleVideoChange}
            className="file-input"
            disabled={loading}
          />
          <button
            onClick={handleUploadVideo}
            className="upload-button"
            disabled={loading || !videoFile}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
        {videoPath && <p className="success-text">Video ready at: {videoPath}</p>}
      </div>

      {/* CSV Upload */}
      <div className="section-container">
        <h3 className="section-title">Upload Text Pairs (CSV)</h3>
        <div className="file-input-container">
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVChange}
            className="file-input"
            disabled={loading}
          />
          <button
            onClick={handleUploadCSV}
            className="upload-button"
            disabled={loading || !csvFile}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
        {textPairs.length > 0 && (
          <div className="csv-preview">
            <p className="success-text">CSV loaded with {textPairs.length} Text entries</p>
            <div className="preview-container">
              <h4 className="preview-title">Preview:</h4>
              <ul className="preview-list">
                {textPairs.slice(0, 5).map((pair, index) => (
                  <li key={index} className="preview-item">
                    <span className="preview-key">{pair[0]}</span>: {pair[1]}
                  </li>
                ))}
                {textPairs.length > 5 && <li className="preview-more">... and {textPairs.length - 5} more</li>}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Process Video */}
      <div className="section-container">
        <h3 className="section-title">Add Text Overlay to Video</h3>
        <div className="button-container">
          <button
            onClick={handleAddTextOverlay}
            className="process-button"
            disabled={loading || (!originalPath || textPairs.length === 0)}
          >
            {loading ? "Processing..." : "Add Text to Video"}
          </button>
          <button
            onClick={handleReset}
            className="reset-button"
            disabled={loading}
          >
            Reset All
          </button>
        </div>

        {/* Status indicators */}
        <div className="status-container">
          <div className={`status-item ${originalPath ? 'status-success' : 'status-neutral'}`}>
            <svg className="status-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d={originalPath ?
                "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" :
                "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"} clipRule="evenodd" />
            </svg>
            Video
          </div>
          <div className={`status-item ${textPairs.length > 0 ? 'status-success' : 'status-neutral'}`}>
            <svg className="status-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d={textPairs.length > 0 ?
                "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" :
                "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"} clipRule="evenodd" />
            </svg>
            Subtitles
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;