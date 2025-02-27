import React from 'react';
import { TextOverlaySettingsProps } from '../types';

const TextOverlaySettings: React.FC<TextOverlaySettingsProps> = ({
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  fontStyle,
  setFontStyle,
  textPosition,
  setTextPosition
}) => {
  return (
    <div className="section-container">
      <h3 className="section-title">Text Overlay Settings</h3>
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
            value={fontColor}
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
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="center">Center</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextOverlaySettings;