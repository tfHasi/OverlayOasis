import axios from "axios";

// Base URL (Update according to your backend)
const API_BASE_URL = "http://localhost:5000"; // Change this when deploying

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle Video Upload
export const uploadVideo = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Video upload failed:", error);
    throw new Error(error.response?.data?.error || "Failed to upload video");
  }
};

// Handle CSV Upload
export const uploadCSV = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("CSV upload failed:", error);
    throw new Error(error.response?.data?.error || "Failed to upload CSV");
  }
};

// Get Processed Videos
export const getProcessedVideos = async () => {
  try {
    const response = await api.get("/videos");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch processed videos:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch videos");
  }
};

// Add text overlay to video
export const addTextOverlay = async (videoPath: string, textPairs: [string, string][]) => {
  try {
    const response = await api.post("/process", {
      video_path: videoPath,
      text_pairs: textPairs
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error adding text overlay:", error);
    throw new Error(error.response?.data?.error || "Failed to process video");
  }
};

export default api;