import React, { useState, useEffect } from "react";
import { uploadVideo, uploadCSV, getProcessedVideos, addTextOverlay } from "../api";

// Define expected API response types
interface VideoUploadResponse {
  file_path: string;
}

interface CSVUploadResponse {
  text_pairs: [string, string][];
}

interface ProcessedVideosResponse {
  videos: string[];
}

const Dashboard: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [videoPath, setVideoPath] = useState<string>("");
  const [textPairs, setTextPairs] = useState<[string, string][]>([]);
  const [processedVideos, setProcessedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProcessedVideos();
  }, []);

  // Fetch processed videos
  const fetchProcessedVideos = async () => {
    try {
      setLoading(true);
      const response = await getProcessedVideos();
      const data = response as ProcessedVideosResponse;
      setProcessedVideos(data.videos || []);
    } catch (err) {
      console.error("Failed to fetch processed videos:", err);
      setError("Failed to fetch processed videos.");
    } finally {
      setLoading(false);
    }
  };

  // Handle video file selection
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
      // Clear previous error/success messages
      setError(null);
      setSuccessMessage(null);
    }
  };

  // Handle CSV file selection
  const handleCSVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
      // Clear previous error/success messages
      setError(null);
      setSuccessMessage(null);
    }
  };

  // Upload video file
  const handleUploadVideo = async () => {
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadVideo(videoFile);
      const data = response as VideoUploadResponse;
      
      if (data && data.file_path) {
        setVideoPath(data.file_path);
        setSuccessMessage("Video uploaded successfully.");
        
        // Store in local storage as mentioned in your requirements
        localStorage.setItem("videoPath", data.file_path);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error uploading video:", err);
      setError("Error uploading video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Upload CSV file and parse text pairs
  const handleUploadCSV = async () => {
    if (!csvFile) {
      setError("Please select a CSV file.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadCSV(csvFile);
      const data = response as CSVUploadResponse;
      
      if (data && Array.isArray(data.text_pairs)) {
        setTextPairs(data.text_pairs);
        setSuccessMessage("CSV uploaded successfully.");
        
        // Store in local storage as mentioned in your requirements
        localStorage.setItem("textPairs", JSON.stringify(data.text_pairs));
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setError("Error uploading CSV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add subtitles to video
  const handleAddTextOverlay = async () => {
    // Check if we have the necessary data
    const storedVideoPath = videoPath || localStorage.getItem("videoPath");
    let storedTextPairs = textPairs;
    
    if (!storedTextPairs || storedTextPairs.length === 0) {
      const storedPairsString = localStorage.getItem("textPairs");
      if (storedPairsString) {
        try {
          storedTextPairs = JSON.parse(storedPairsString) as [string, string][];
        } catch (e) {
          console.error("Error parsing stored text pairs:", e);
        }
      }
    }
    
    if (!storedVideoPath) {
      setError("Please upload a video first.");
      return;
    }
    
    if (!storedTextPairs || storedTextPairs.length === 0) {
      setError("Please upload a CSV file with subtitle text pairs.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await addTextOverlay(storedVideoPath, storedTextPairs);
      const data = response as ProcessedVideosResponse;
      
      if (data && Array.isArray(data.videos)) {
        setProcessedVideos(data.videos);
        setSuccessMessage("Subtitles added successfully.");
        
        // Refresh the list of processed videos
        await fetchProcessedVideos();
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error adding subtitles:", err);
      setError("Error adding subtitles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Video Subtitle Dashboard</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>}

      {/* Video Upload */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Step 1: Upload Video</h3>
        <input 
          type="file" 
          accept="video/mp4" 
          onChange={handleVideoChange} 
          className="mb-2" 
          disabled={loading}
        />
        <button
          onClick={handleUploadVideo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading || !videoFile}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
        {videoPath && <p className="mt-2 text-green-600">Video ready at: {videoPath}</p>}
      </div>

      {/* CSV Upload */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Step 2: Upload Subtitles (CSV)</h3>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleCSVChange} 
          className="mb-2"
          disabled={loading}
        />
        <button
          onClick={handleUploadCSV}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading || !csvFile}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
        {textPairs.length > 0 && (
          <p className="mt-2 text-green-600">
            CSV loaded with {textPairs.length} subtitle entries
          </p>
        )}
      </div>

      {/* Process Video */}
      <div className="mb-6 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Step 3: Add Subtitles to Video</h3>
        <button
          onClick={handleAddTextOverlay}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Subtitles to Video"}
        </button>
      </div>

      {/* Display Processed Videos */}
      <div className="p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Processed Videos</h3>
        {loading && <p>Loading videos...</p>}
        {!loading && processedVideos.length === 0 && (
          <p>No processed videos available yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedVideos.map((videoUrl, index) => (
            <div key={index} className="border p-2 rounded">
              <p className="font-medium mb-1">Video {index + 1}</p>
              <video controls className="w-full">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;