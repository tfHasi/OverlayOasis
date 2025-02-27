import React, { useRef, useEffect } from 'react';

interface VideoPreviewProps {
  videoPath: string;
  previewText: string;
  fontSize: number;
  fontColor: string;
  fontStyle: string;
  textPosition: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoPath,
  previewText,
  fontSize,
  fontColor,
  fontStyle,
  textPosition,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Position mapping
  const getTextPosition = (position: string, canvasWidth: number, canvasHeight: number, textWidth: number) => {
    const padding = 20;
    switch (position) {
      case 'top-left':
        return { x: padding, y: padding + fontSize };
      case 'top-center':
        return { x: (canvasWidth - textWidth) / 2, y: padding + fontSize };
      case 'top-right':
        return { x: canvasWidth - textWidth - padding, y: padding + fontSize };
      case 'center':
        return { x: (canvasWidth - textWidth) / 2, y: canvasHeight / 2 };
      case 'bottom-left':
        return { x: padding, y: canvasHeight - padding };
      case 'bottom-center':
        return { x: (canvasWidth - textWidth) / 2, y: canvasHeight - padding };
      case 'bottom-right':
        return { x: canvasWidth - textWidth - padding, y: canvasHeight - padding };
      default:
        return { x: (canvasWidth - textWidth) / 2, y: canvasHeight - padding };
    }
  };
  
  // Set up the canvas and draw text over video
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !videoPath) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up video event listeners
    const handleVideoPlay = () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video and text on canvas
      const drawFrame = () => {
        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Add text overlay
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillStyle = fontColor;

        // Measure text width for positioning
        const textMetrics = ctx.measureText(previewText);
        const textWidth = textMetrics.width;
        
        // Position text according to setting
        const position = getTextPosition(textPosition, canvas.width, canvas.height, textWidth);
        
        // Apply text with shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(previewText, position.x, position.y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        
        if (!video.paused && !video.ended) {
          requestAnimationFrame(drawFrame);
        }
      };
      
      drawFrame();
    };
    
    const handleVideoLoadedData = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Draw initial frame
      if (video.paused) {
        video.currentTime = 1; // Move to 1 second to show a representative frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Add text overlay (using same code as in drawFrame)
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillStyle = fontColor;
        
        const textMetrics = ctx.measureText(previewText);
        const textWidth = textMetrics.width;
        
        const position = getTextPosition(textPosition, canvas.width, canvas.height, textWidth);
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(previewText, position.x, position.y);
        
        ctx.shadowColor = 'transparent';
      }
    };
    
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('loadeddata', handleVideoLoadedData);
    video.addEventListener('seeked', handleVideoLoadedData);
    
    // If video already has data, draw the initial frame
    if (video.readyState >= 2) {
      handleVideoLoadedData();
    }
    
    return () => {
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('loadeddata', handleVideoLoadedData);
      video.removeEventListener('seeked', handleVideoLoadedData);
    };
  }, [videoPath, previewText, fontSize, fontColor, fontStyle, textPosition]);
  
  return (
    <div className="video-preview-container">
      <h4 className="preview-title">Preview</h4>
      <div className="preview-wrapper">
        {/* Hidden video element for loading the source */}
        <video 
          ref={videoRef} 
          src={videoPath}
          className="hidden-video" 
          controls={false}
          muted
          preload="auto"
          style={{ display: 'none' }}
        />
        
        {/* Canvas where we'll draw the video with text overlay */}
        <canvas 
          ref={canvasRef} 
          className="preview-canvas"
          onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
        />
        
        {!videoPath && (
          <div className="preview-placeholder">
            <p>Upload a video to see preview</p>
          </div>
        )}
      </div>
      <div className="preview-controls">
        <button 
          className="preview-button"
          onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
          disabled={!videoPath}
        >
          Play/Pause
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;