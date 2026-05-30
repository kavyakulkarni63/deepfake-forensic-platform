"""
video_ingest.py — Video ingestion, validation, metadata extraction, and frame sampling.
Pure OpenCV + subprocess pipeline. Zero Streamlit imports.
"""

import os
import subprocess
import tempfile
import json
import cv2
import numpy as np
from pathlib import Path
from typing import Optional, Tuple, List, Dict

# ── Constants ─────────────────────────────────────────────────────────────────
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv"}
MAX_FILE_SIZE_MB = 500
MIN_FPS = 15
MIN_HEIGHT = 360

MAX_FRAMES_TO_SAMPLE = 120   # max frames extracted for analysis
KEYFRAME_INTERVAL = 1.0      # seconds between sampled frames


# ── Validation ────────────────────────────────────────────────────────────────

def validate_video(file_bytes: bytes, filename: str) -> Dict:
    """
    Validate uploaded video.
    Returns {"valid": bool, "error": str|None, "path": str|None}
    """
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return {"valid": False, "error": f"Unsupported format '{ext}'. Accepted: MP4, MOV, AVI, MKV.", "path": None}

    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        return {"valid": False, "error": f"File too large: {size_mb:.1f} MB (max {MAX_FILE_SIZE_MB} MB).", "path": None}

    # Write to temp file for OpenCV
    tmp = tempfile.NamedTemporaryFile(suffix=ext, delete=False)
    tmp.write(file_bytes)
    tmp.flush()
    tmp.close()
    path = tmp.name

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        cap.release()
        os.unlink(path)
        return {"valid": False, "error": "Cannot open video file — file may be corrupt.", "path": None}

    fps = cap.get(cv2.CAP_PROP_FPS)
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()

    if fps < MIN_FPS:
        os.unlink(path)
        return {"valid": False, "error": f"Frame rate too low: {fps:.1f} FPS (minimum {MIN_FPS} FPS required).", "path": None}

    if height < MIN_HEIGHT:
        os.unlink(path)
        return {"valid": False, "error": f"Resolution too low: {height}p (minimum {MIN_HEIGHT}p required).", "path": None}

    if total_frames < 10:
        os.unlink(path)
        return {"valid": False, "error": "Video too short — insufficient frames for forensic analysis.", "path": None}

    return {"valid": True, "error": None, "path": path}


# ── Metadata Extraction ───────────────────────────────────────────────────────

def extract_metadata(path: str, filename: str) -> Dict:
    """
    Extract comprehensive video metadata using OpenCV.
    Falls back gracefully if ffprobe is unavailable.
    """
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fourcc_code = int(cap.get(cv2.CAP_PROP_FOURCC))
    bitrate = cap.get(cv2.CAP_PROP_BITRATE)
    cap.release()

    # Decode FOURCC
    try:
        codec = "".join([chr((fourcc_code >> (8 * i)) & 0xFF) for i in range(4)]).strip()
    except Exception:
        codec = "UNKNOWN"

    duration_sec = total_frames / fps if fps > 0 else 0
    duration_str = f"{int(duration_sec // 60):02d}:{int(duration_sec % 60):02d}"

    file_size_mb = os.path.getsize(path) / (1024 * 1024)

    # Infer compression profile
    if fps >= 60:
        comp_profile = "HIGH-FPS / HFR"
    elif height >= 2160:
        comp_profile = "4K UHD"
    elif height >= 1080:
        comp_profile = "FULL HD 1080p"
    elif height >= 720:
        comp_profile = "HD 720p"
    else:
        comp_profile = "SD"

    # Audio presence: check with moviepy (optional)
    has_audio = _check_audio(path)

    # Bitrate estimation if not provided
    if bitrate <= 0 and duration_sec > 0:
        bitrate_kbps = (file_size_mb * 8 * 1024) / duration_sec
    else:
        bitrate_kbps = bitrate / 1000

    return {
        "filename": filename,
        "duration": duration_str,
        "duration_sec": round(duration_sec, 2),
        "fps": round(fps, 2),
        "resolution": f"{width}x{height}",
        "width": width,
        "height": height,
        "codec": codec if codec.isprintable() and len(codec) > 0 else "H264",
        "bitrate_kbps": round(bitrate_kbps, 1),
        "total_frames": total_frames,
        "has_audio": has_audio,
        "compression_profile": comp_profile,
        "file_size_mb": round(file_size_mb, 2),
        "sampled_frames": min(total_frames, MAX_FRAMES_TO_SAMPLE),
    }


def _check_audio(path: str) -> bool:
    """Check if the video file contains an audio stream using ffmpeg stream probe."""
    try:
        import subprocess
        import imageio_ffmpeg
        import os
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        cmd = [ffmpeg_exe, "-i", path]
        
        startupinfo = None
        if os.name == 'nt':
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            
        res = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            startupinfo=startupinfo
        )
        info = res.stderr.decode("utf-8", errors="ignore")
        return "Audio:" in info
    except Exception:
        return False

def extract_audio_bytes(path: str) -> bytes:
    """Extract audio from video as bytes using direct ffmpeg."""
    try:
        import subprocess
        import imageio_ffmpeg
        import tempfile
        import os
        
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        tmp.close()
        tmp_name = tmp.name
        
        cmd = [
            ffmpeg_exe,
            "-y",
            "-i", path,
            "-vn",
            "-acodec", "pcm_s16le",
            "-ar", "22050",
            "-ac", "1",
            tmp_name
        ]
        
        startupinfo = None
        if os.name == 'nt':
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            
        res = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            startupinfo=startupinfo
        )
        
        if res.returncode != 0:
            if os.path.exists(tmp_name):
                try:
                    os.unlink(tmp_name)
                except Exception:
                    pass
            return None
            
        with open(tmp_name, "rb") as f:
            audio_bytes = f.read()
            
        try:
            os.unlink(tmp_name)
        except Exception:
            pass
            
        return audio_bytes
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None


# ── Frame Sampling ────────────────────────────────────────────────────────────

def sample_frames(path: str, max_frames: int = MAX_FRAMES_TO_SAMPLE) -> List[np.ndarray]:
    """
    Uniformly sample up to max_frames RGB frames from the video.
    Returns list of HxWx3 numpy arrays (RGB).
    """
    cap = cv2.VideoCapture(path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames <= 0:
        cap.release()
        return []

    # Compute frame indices to sample
    if total_frames <= max_frames:
        indices = list(range(total_frames))
    else:
        indices = [int(i * total_frames / max_frames) for i in range(max_frames)]

    frames = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret and frame is not None:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(rgb)

    cap.release()
    return frames
