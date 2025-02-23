import os
import subprocess
from config import Config

def get_position_coordinates(position, video_width="w", video_height="h"):
    """
    Convert position keywords to FFmpeg coordinates.
    """
    position_map = {
        "top-left": (f"10", f"10+{video_height}/20"),
        "top-center": (f"({video_width}-text_w)/2", f"10+{video_height}/20"),
        "top-right": (f"{video_width}-text_w-10", f"10+{video_height}/20"),
        "middle-left": (f"10", f"({video_height}-text_h)/2"),
        "middle-center": (f"({video_width}-text_w)/2", f"({video_height}-text_h)/2"),
        "middle-right": (f"{video_width}-text_w-10", f"({video_height}-text_h)/2"),
        "bottom-left": (f"10", f"{video_height}-text_h-10"),
        "bottom-center": (f"({video_width}-text_w)/2", f"{video_height}-text_h-10"),
        "bottom-right": (f"{video_width}-text_w-10", f"{video_height}-text_h-10")
    }
    return position_map.get(position, ("(w-text_w)/2", "h-24"))

def add_text_overlay(video_path, text_pairs, font_size=24, font_color="white", font_style="Arial", position="bottom-center"):
    """
    Creates separate videos for each language with respective text overlays.
    Returns a list of output paths.
    """
    try:
        os.makedirs(Config.OUTPUT_FOLDER, exist_ok=True)
        output_paths = []
        x_pos, y_pos = get_position_coordinates(position)

        # Process each language pair separately
        for lang, trans in text_pairs:
            # Create language-specific output filename
            base_name = os.path.basename(video_path)
            name_without_ext = os.path.splitext(base_name)[0]
            output_path = os.path.join(
                Config.OUTPUT_FOLDER, 
                f"{name_without_ext}_{lang}.mp4"
            )

            # Escape special characters
            lang = lang.replace(":", "\\:").replace("\\", "\\\\").replace("'", "\\'")
            trans = trans.replace(":", "\\:").replace("\\", "\\\\").replace("'", "\\'")
            text = f"{trans}"

            filter_text = (
                f"drawtext=text='{text}'"
                f":fontsize={font_size}"
                f":fontcolor={font_color}"
                f":box=1:boxcolor=black@0.5"
                f":boxborderw=5"
                f":x={x_pos}"
                f":y={y_pos}"
            )

            command = [
                'ffmpeg',
                '-i', video_path,
                '-vf', filter_text,
                '-c:a', 'copy',
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '23',
                output_path,
                '-y'
            ]

            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True
            )

            output_paths.append(output_path)

        return output_paths

    except subprocess.CalledProcessError as e:
        raise Exception(f"FFmpeg error: {e.stderr}")
    except Exception as e:
        raise Exception(f"Failed to add text overlay: {str(e)}")