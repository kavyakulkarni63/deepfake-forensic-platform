import numpy as np
import cv2
import scipy.io.wavfile as wavfile
import subprocess
import os
import imageio_ffmpeg

duration = 4.0
fps = 30
sr = 22050
width, height = 640, 480

# 1. Generate Video Frames
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('temp_video.mp4', fourcc, fps, (width, height))

for i in range(int(fps * duration)):
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    if i % 10 < 5:
        color = (0, 0, 255)
    else:
        color = (0, 255, 0)
    
    x = 320 + int(100 * np.sin(i * 0.5))
    y = 240 + int(50 * np.cos(i * 0.5))
    cv2.rectangle(frame, (x-50, y-50), (x+50, y+50), color, -1)
    
    noise = np.random.randint(0, 50, (height, width, 3), dtype=np.uint8)
    frame = cv2.add(frame, noise)
    out.write(frame)

out.release()

# 2. Generate Synthetic Audio
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
audio1 = np.sin(2 * np.pi * 440 * t) 
audio2 = np.sin(2 * np.pi * 880 * t) * (np.sin(2 * np.pi * 5 * t) > 0)
audio_combined = audio1 * 0.5 + audio2 * 0.5
audio_combined += np.random.normal(0, 0.05, len(t))
audio_combined = np.int16(audio_combined * 32767)
wavfile.write('temp_audio.wav', sr, audio_combined)

# 3. Combine with ffmpeg
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
cmd = [
    ffmpeg_exe, '-y', 
    '-i', 'temp_video.mp4', 
    '-i', 'temp_audio.wav', 
    '-c:v', 'libx264', 
    '-c:a', 'aac', 
    '-strict', 'experimental', 
    'test_deepfake.mp4'
]

subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Cleanup
if os.path.exists('temp_video.mp4'): os.remove('temp_video.mp4')
if os.path.exists('temp_audio.wav'): os.remove('temp_audio.wav')
print("Successfully generated test_deepfake.mp4")
