import os
import subprocess
from config import Config

def add_text_overlay(video_path, text_pairs, font_size=24, font_color="white", font_style="Arial", position=("center", "bottom")):
    """
    Adds text overlays to a video using FFmpeg.
    """
    try:
        # Ensure output directory exists
        os.makedirs(Config.OUTPUT_FOLDER, exist_ok=True)
        output_path = os.path.join(Config.OUTPUT_FOLDER, f"overlay_{os.path.basename(video_path)}")

        # Create drawtext filters for each text pair
        drawtext_filters = []
        y_offset = font_size

        for lang, trans in text_pairs:
            # Properly escape special characters
            lang = lang.replace(":", "\\:").replace("\\", "\\\\").replace("'", "\\'")
            trans = trans.replace(":", "\\:").replace("\\", "\\\\").replace("'", "\\'")
            
            # Format the text with escaped characters
            text = f"{lang}\\: {trans}"  # Escape the colon between language and translation
            
            filter_text = (
                f"drawtext=text='{text}'"
                f":fontsize={font_size}"
                f":fontcolor={font_color}"
                f":box=1:boxcolor=black@0.5"
                f":boxborderw=5"
                f":x=(w-text_w)/2"
                f":y=h-{y_offset}"
            )
            drawtext_filters.append(filter_text)
            y_offset += font_size + 10

        # Join filters with comma
        filter_complex = ','.join(drawtext_filters)

        # Build FFmpeg command
        command = [
            'ffmpeg',
            '-i', video_path,
            '-vf', filter_complex,
            '-c:a', 'copy',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '23',
            output_path,
            '-y'
        ]

        # Print command for debugging
        print(" ".join(command))

        # Execute FFmpeg command
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )

        return output_path

    except subprocess.CalledProcessError as e:
        raise Exception(f"FFmpeg error: {e.stderr}")
    except Exception as e:
        raise Exception(f"Failed to add text overlay: {str(e)}")