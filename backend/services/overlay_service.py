import os
import subprocess
from config import Config

def add_text_overlay(video_path, text_pairs, font_size=24, font_color="white", font_style="Arial", position=("center", "bottom")):
    """
    Adds text overlays to a video using FFmpeg's drawtext filter.

    Args:
        video_path (str): Path to the input video file.
        text_pairs (list): List of text pairs (language and translation).
        font_size (int): Font size for the text.
        font_color (str): Font color for the text.
        font_style (str): Font style for the text.
        position (tuple): Position of the text overlay (e.g., ("center", "bottom")).

    Returns:
        str: Path to the output video file.
    """
    try:
        # Output video path
        output_path = os.path.join(Config.OUTPUT_FOLDER, "output.mp4")

        # Generate the drawtext filter string for each text pair
        filter_strings = []
        for idx, pair in enumerate(text_pairs):
            language, translation = pair
            text = f"{language}: {translation}"
            x, y = position

            # Calculate position based on the index to avoid overlapping
            y_offset = idx * (font_size + 10)  # Add some spacing between lines
            y_position = f"h-{y_offset}" if y == "bottom" else f"{y_offset}"

            # Add the drawtext filter
            filter_strings.append(
                f"drawtext=text='{text}':fontcolor={font_color}:fontsize={font_size}:fontfile={font_style}:x=(w-text_w)/2:y={y_position}"
            )

        # Combine all filters into a single filter chain
        filter_complex = ",".join(filter_strings)

        # FFmpeg command
        ffmpeg_command = [
            "ffmpeg",
            "-i", video_path,
            "-vf", filter_complex,
            "-codec:a", "copy",  # Copy the audio stream without re-encoding
            output_path
        ]

        # Run the FFmpeg command
        subprocess.run(ffmpeg_command, check=True)

        return output_path
    except subprocess.CalledProcessError as e:
        raise Exception(f"Failed to add text overlay: {str(e)}")