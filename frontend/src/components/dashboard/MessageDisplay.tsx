import React from 'react';
import { MessageProps } from '../types';

const MessageDisplay: React.FC<MessageProps> = ({ 
  error, 
  successMessage, 
  setError, 
  setSuccessMessage 
}) => {
  return (
    <>
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
    </>
  );
};

export default MessageDisplay;