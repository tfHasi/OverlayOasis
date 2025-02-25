const BASE_URL = 'http://127.0.0.1:5000';

export const uploadVideo = async (formData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/upload/video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadVideo:', error);
    throw error;
  }
};

export const uploadCSV = async (formData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/upload/csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadCSV:', error);
    throw error;
  }
};

export const addTextOverlay = async (
  videoPath: string,
  textPairs: [string, string][],
  fontSize: number = 24,
  fontColor: string = "white",
  fontStyle: string = "Arial",
  position: string = "bottom-center"
) => {
  try {
    const response = await fetch(`${BASE_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_path: videoPath,
        text_pairs: textPairs,
        font_size: fontSize,
        font_color: fontColor,
        font_style: fontStyle,
        position: position,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in addTextOverlay:', error);
    throw error;
  }
};