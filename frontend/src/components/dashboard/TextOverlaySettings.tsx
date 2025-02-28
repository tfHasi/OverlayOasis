import React, { useEffect } from 'react';
import { TextOverlaySettingsProps } from '../types';
import VideoPreview from './VideoPreview';

interface ExtendedTextOverlaySettingsProps extends TextOverlaySettingsProps {
  videoPath: string;
  textPairs: [string, string][];
}

// Function to convert color names to hex values
const colorNameToHex = (colorName: string): string => {
  // Basic color mapping
  const colorMap: Record<string, string> = {
    'white': '#FFFFFF',
    'black': '#000000',
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00'
  };
  
  // Return the hex value if the color name exists in the map
  // Otherwise, return the original value (assuming it's already a valid hex)
  return colorMap[colorName.toLowerCase()] || colorName;
};

const TextOverlaySettings: React.FC<ExtendedTextOverlaySettingsProps> = ({
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  fontStyle,
  setFontStyle,
  textPosition,
  setTextPosition,
  videoPath,
  textPairs
}) => {
  // Get sample text from textPairs for preview
  const sampleText = textPairs.length > 0 ? textPairs[0][1] : "Sample Text";
  
  // Convert fontColor to hex for the color input
  const colorHex = fontColor.startsWith('#') ? fontColor : colorNameToHex(fontColor);
  
  // When the component mounts, ensure font color is in hex format
  useEffect(() => {
    if (!fontColor.startsWith('#')) {
      setFontColor(colorNameToHex(fontColor));
    }
  }, []);
  
  return (
    <div className="section-container">
      <h3 className="section-title">Text Overlay Settings</h3>
      
      <div className="settings-preview-container">
        {/* Settings panel */}
        <div className="settings-container">
          {/* Font Size */}
          <div className="input-group">
            <label htmlFor="fontSize">Font Size:</label>
            <input
              type="number"
              id="fontSize"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="10"
              max="72"
              className="input-field"
            />
          </div>

          {/* Font Color */}
          <div className="input-group">
            <label htmlFor="fontColor">Font Color:</label>
            <input
              type="color"
              id="fontColor"
              value={colorHex}
              onChange={(e) => setFontColor(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Font Style */}
          <div className="input-group">
            <label htmlFor="fontStyle">Font Style:</label>
            <select
              id="fontStyle"
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              className="input-field"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          {/* Text Position */}
          <div className="input-group">
            <label htmlFor="textPosition">Text Position:</label>
            <select
              id="textPosition"
              value={textPosition}
              onChange={(e) => setTextPosition(e.target.value)}
              className="input-field"
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="middle-left">Middle Left</option>
              <option value="middle-center">Middle Center</option>
              <option value="middle-right">Middle Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>
        </div>
        
        {/* Preview panel */}
        <div className="preview-panel">
          <VideoPreview
            videoPath={videoPath}
            previewText={sampleText}
            fontSize={fontSize}
            fontColor={fontColor}
            fontStyle={fontStyle}
            textPosition={textPosition}
          />
        </div>
      </div>
    </div>
  );
};

export default TextOverlaySettings;