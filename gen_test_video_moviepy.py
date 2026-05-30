import numpy as np
import scipy.io.wavfile as wavfile
from moviepy import VideoClip, AudioFileClip

duration = 4.0
fps = 30
sr = 22050
width, height = 640, 480

# 1. Generate Synthetic Audio
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
audio1 = np.sin(2 * np.pi * 440 * t)  # Base tone
audio2 = np.sin(2 * np.pi * 880 * t) * (np.sin(2 * np.pi * 5 * t) > 0)  # Robotic choppy tone
audio_combined = audio1 * 0.5 + audio2 * 0.5
audio_combined += np.random.normal(0, 0.05, len(t))  # Noise
audio_combined = np.int16(audio_combined * 32767)
wavfile.write('temp_audio.wav', sr, audio_combined)

# 2. Generate Video Frames
def make_frame(t):
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    i = int(t * fps)
    if i % 10 < 5:
        color = [0, 0, 255] # BGR format in cv2, but moviepy uses RGB. [0,0,255] = blue
    else:
        color = [0, 255, 0] # green
    
    x = 320 + int(100 * np.sin(i * 0.5))
    y = 240 + int(50 * np.cos(i * 0.5))
    
    # Draw simple square
    frame[y-50:y+50, x-50:x+50] = color
    
    # Noise
    noise = np.random.randint(0, 50, (height, width, 3), dtype=np.uint8)
    frame = np.clip(frame + noise, 0, 255)
    
    return frame

video = VideoClip(make_frame, duration=duration)

# 3. Combine Audio and Video
audio_clip = AudioFileClip('temp_audio.wav')
video = video.with_audio(audio_clip)

# 4. Write result
video.write_videofile("test_deepfake.mp4", fps=fps, codec="libx264", audio_codec="aac")

# Cleanup
import os
if os.path.exists('temp_audio.wav'): os.remove('temp_audio.wav')
