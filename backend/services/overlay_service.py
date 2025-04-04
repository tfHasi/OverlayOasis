import os
import subprocess
from concurrent.futures import ThreadPoolExecutor

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

def get_font_file(font_style):
    """
    Map font style names to actual font files available on the system.
    """
    font_map = {
        "Arial": "Arial",
        "Times New Roman": "Times New Roman",
        "Courier New": "Courier New",
        "Verdana": "Verdana"
    }
    # Return just the font name - FFmpeg will try to find it in the system fonts
    return font_map.get(font_style, "Arial")

def process_single_video(video_path, output_path, text, font_size, font_color, font_style, x_pos, y_pos):
    """
    Process a single video with the given text overlay.
    """
    try:
        # Get the font file name
        font = get_font_file(font_style)
        
        # Build the drawtext filter
        filter_text = (
            f"drawtext=text='{text}'"
            f":fontsize={font_size}"
            f":fontcolor={font_color}"
            f":fontfile={font}" if os.name == 'nt' else f":font={font}"  # Windows vs Linux/Mac
            f":box=1:boxcolor=black@0.5"
            f":boxborderw=5"
            f":x={x_pos}"
            f":y={y_pos}"
        )

        # FFmpeg command
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

        # Run the FFmpeg command
        subprocess.run(command, check=True)
        return output_path
    except subprocess.CalledProcessError as e:
        raise Exception(f"FFmpeg error: {e.stderr if hasattr(e, 'stderr') else str(e)}")

def add_text_overlay(video_path, text_pairs, font_size=24, font_color="white", font_style="Arial", position="bottom-center"):
    """
    Adds text overlays to a video with advanced styling options.
    Processes videos in parallel.
    """
    try:
        # Use the configured output folder from environment variables instead of creating one in the video directory
        output_dir = os.environ.get('OUTPUT_FOLDER')
        
        # Ensure the output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        output_paths = []
        x_pos, y_pos = get_position_coordinates(position)

        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor() as executor:
            futures = []
            for lang, trans in text_pairs:
                # Create language-specific output filename
                base_name = os.path.basename(video_path)
                name_without_ext = os.path.splitext(base_name)[0]
                output_path = os.path.join(
                    output_dir, 
                    f"{name_without_ext}_{lang}.mp4"
                )

                # Escape special characters
                lang = lang.replace(":", "\\:").replace("\\", "\\\\").replace("'", "\\'")
                trans = trans.replace(":", "\\:").replace("\\", "\\\\").replace("'", "\\'")
                text = f"{trans}"

                # Submit the task to the thread pool
                future = executor.submit(
                    process_single_video,
                    video_path,
                    output_path,
                    text,
                    font_size,
                    font_color,
                    font_style,
                    x_pos,
                    y_pos
                )
                futures.append(future)

            # Wait for all tasks to complete and collect results
            for future in futures:
                output_paths.append(future.result())

        return output_paths

    except Exception as e:
        raise Exception(f"Failed to add text overlay: {str(e)}")