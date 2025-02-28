import React from 'react';
import { uploadVideo } from "../../api";
import { VideoUploadProps, VideoUploadResponse } from '../types';

const VideoUpload: React.FC<VideoUploadProps> = ({
  videoFile,
  setVideoFile,
  videoPath,
  setVideoPath,
  setOriginalPath,
  loading,
  setLoading,
  setError,
  setSuccessMessage
}) => {
  // Handle video file selection
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
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

      // Ensure we're using a web-accessible URL, not a file system path
      const videoUrl = data.file_path.startsWith('/') 
        ? data.file_path  // Already a URL path
        : `/uploads/${data.file_path.split('/').pop()}`; // Convert to URL path
      
      setVideoPath(videoUrl);
      setOriginalPath(videoUrl);
      setSuccessMessage(data.message || "Video uploaded successfully.");

      localStorage.setItem("videoPath", videoUrl);
      localStorage.setItem("originalPath", videoUrl);
    } catch (err) {
      console.error("Error uploading video:", err);
      setError(err instanceof Error ? err.message : "Error uploading video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {videoPath && <p className="success-text">Video ready for processing</p>}
    </div>
  );
};

export default VideoUpload;