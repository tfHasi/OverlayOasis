import React from 'react';
import { addTextOverlay } from "../../api";
import { ProcessActionsProps, ProcessedVideosResponse } from '../types';

const ProcessActions: React.FC<ProcessActionsProps> = ({
  originalPath,
  textPairs,
  fontSize,
  fontColor,
  fontStyle,
  textPosition,
  loading,
  setLoading,
  setError,
  setSuccessMessage,
  handleReset
}) => {
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
  
      const response = await addTextOverlay(
        originalPath,
        textPairs,
        fontSize,
        fontColor,
        fontStyle,
        textPosition
      );
  
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

  return (
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
  );
};

export default ProcessActions;