"""
api_models.py — Pydantic response models for FastAPI endpoints
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str  # "user" or "admin"

class LoginResponse(BaseModel):
    success: bool
    token: str
    role: str
    username: str
    message: str

class EngineResult(BaseModel):
    score: float
    status: str
    summary: str

class ImageAnalysisResponse(BaseModel):
    scan_id: str
    timestamp: str
    is_fake: bool
    confidence: float
    fake_score: float
    risk_level: str
    verdict_title: str
    engines: Dict[str, Any]
    face_cmp: Optional[Dict[str, Any]] = None
    img_b64: Dict[str, str]
    html_report: str

class VideoAnalysisResponse(BaseModel):
    scan_id: str
    timestamp: str
    is_fake: bool
    confidence: float
    composite_score: float
    risk_level: str
    threat_level: str
    verdict_title: str
    engine_results: Dict[str, Any]
    cm_results: Optional[Dict[str, Any]] = None
    sus_frames: List[str]  # base64-encoded frame images
    html_report: str

class AudioAnalysisResponse(BaseModel):
    scan_id: str
    timestamp: str
    is_fake: bool
    confidence: float
    composite_score: float
    risk_level: str
    threat_level: str
    verdict_title: str
    engine_results: Dict[str, Any]
    html_report: str

class ScanHistoryItem(BaseModel):
    scan_id: str
    timestamp: str
    media_type: str
    filename: str
    verdict: str
    risk_level: str
    confidence: float

class AdminStats(BaseModel):
    total_scans: int
    fake_detections: int
    real_detections: int
    image_scans: int
    video_scans: int
    audio_scans: int
    uptime: str
    model_version: str
    engines_healthy: int
    engines_total: int
    threat_score_avg: float
