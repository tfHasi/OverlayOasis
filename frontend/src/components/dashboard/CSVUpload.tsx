import React from 'react';
import { uploadCSV } from "../../api";
import { CSVUploadProps, CSVUploadResponse } from '../types';

const CSVUpload: React.FC<CSVUploadProps> = ({
  csvFile,
  setCsvFile,
  textPairs,
  setTextPairs,
  loading,
  setLoading,
  setError,
  setSuccessMessage
}) => {
  // Handle CSV file selection
  const handleCSVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
      setError(null);
      setSuccessMessage(null);
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

  return (
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
  );
};

export default CSVUpload;