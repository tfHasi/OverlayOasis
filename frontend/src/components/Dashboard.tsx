import React, { useState, useEffect } from "react";
import './Dashboard.css';

// Import components
import MessageDisplay from './dashboard/MessageDisplay';
import VideoUpload from './dashboard/VideoUpload';
import CSVUpload from './dashboard/CSVUpload';
import TextOverlaySettings from './dashboard/TextOverlaySettings';
import ProcessActions from './dashboard/ProcessActions';

const Dashboard: React.FC = () => {
  // State management
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [videoPath, setVideoPath] = useState<string>("");
  const [originalPath, setOriginalPath] = useState<string>("");
  const [textPairs, setTextPairs] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontColor, setFontColor] = useState<string>("white");
  const [fontStyle, setFontStyle] = useState<string>("Arial");
  const [textPosition, setTextPosition] = useState<string>("bottom-center");

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

      <MessageDisplay 
        error={error} 
        successMessage={successMessage} 
        setError={setError} 
        setSuccessMessage={setSuccessMessage} 
      />

      {/* Video Upload Component */}
      <VideoUpload
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        videoPath={videoPath}
        setVideoPath={setVideoPath}
        originalPath={originalPath}
        setOriginalPath={setOriginalPath}
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        setSuccessMessage={setSuccessMessage}
      />

      {/* CSV Upload Component */}
      <CSVUpload
        csvFile={csvFile}
        setCsvFile={setCsvFile}
        textPairs={textPairs}
        setTextPairs={setTextPairs}
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        setSuccessMessage={setSuccessMessage}
      />

      {/* Text Overlay Settings Component */}
      <TextOverlaySettings
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontColor={fontColor}
        setFontColor={setFontColor}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        textPosition={textPosition}
        setTextPosition={setTextPosition}
      />

      {/* Process Actions Component */}
      <ProcessActions
        originalPath={originalPath}
        textPairs={textPairs}
        fontSize={fontSize}
        fontColor={fontColor}
        fontStyle={fontStyle}
        textPosition={textPosition}
        loading={loading}
        setLoading={setLoading}
        setError={setError}
        setSuccessMessage={setSuccessMessage}
        handleReset={handleReset}
      />
    </div>
  );
};

export default Dashboard;