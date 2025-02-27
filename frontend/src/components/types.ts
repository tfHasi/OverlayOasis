// Define expected API response types
export interface VideoUploadResponse {
    message: string;
    file_path: string;
  }
  
  export interface CSVUploadResponse {
    text_pairs: [string, string][];
  }
  
  export interface ProcessedVideosResponse {
    message: string;
    output_paths: string[];
  }
  
  // Component Props
  export interface MessageProps {
    error: string | null;
    successMessage: string | null;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
  }
  
  export interface VideoUploadProps {
    videoFile: File | null;
    setVideoFile: (file: File | null) => void;
    videoPath: string;
    setVideoPath: (path: string) => void;
    originalPath: string;
    setOriginalPath: (path: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
  }
  
  export interface CSVUploadProps {
    csvFile: File | null;
    setCsvFile: (file: File | null) => void;
    textPairs: [string, string][];
    setTextPairs: (pairs: [string, string][]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
  }
  
  export interface TextOverlaySettingsProps {
    fontSize: number;
    setFontSize: (size: number) => void;
    fontColor: string;
    setFontColor: (color: string) => void;
    fontStyle: string;
    setFontStyle: (style: string) => void;
    textPosition: string;
    setTextPosition: (position: string) => void;
  }
  
  export interface ProcessActionsProps {
    originalPath: string;
    textPairs: [string, string][];
    fontSize: number;
    fontColor: string;
    fontStyle: string;
    textPosition: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
    handleReset: () => void;
  }