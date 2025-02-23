from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip

def add_text_overlay(video_path, text, position, font_size, font_color, font_style):
    video = VideoFileClip(video_path)
    text_clip = TextClip(text, fontsize=font_size, color=font_color, font=font_style)
    text_clip = text_clip.set_position(position).set_duration(video.duration)
    final_clip = CompositeVideoClip([video, text_clip])
    final_clip.write_videofile("output.mp4")