# 🔬 DeepFake Forensics Lab

A professional-grade deepfake detection forensics platform built with a high-performance React frontend and a FastAPI backend.
Uses **5 real image forensics techniques**, **video temporal consistency engines**, and **audio-visual cross-modal validation** to uncover generative AI manipulation.

---

## 🚀 Quick Start

### 1. Start Backend Server (FastAPI)
Install python dependencies and run the API:
```bash
pip install -r requirements.txt
python -m uvicorn api:app --reload --port 8000
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Start Frontend Server (React)
Navigate to the `frontend` folder, install dependencies, and run:
```bash
cd frontend
npm install
npm run dev
```
The client portal will be live at: [http://localhost:5173/](http://localhost:5173/)

---

## ⚙️ Forensic Detection Engines

### 🖼️ Image Forensics
- **Error Level Analysis (ELA)**: Evaluates JPEG re-compression discrepancies across regions.
- **FFT Spectrum**: Examines high-frequency periodic variance patterns indicating GAN signatures.
- **Landmark Geometry**: Verifies ratio constraints of 468-point facial mesh anchors.
- **Texture Entropy**: Uses LBP micro-texture entropy analysis to identify synthetic skin smoothing.
- **Color Boundary**: Analyzes delta statistics between face and background blocks for composite boundaries.

### 🎥 Video Forensics
- **Temporal Consistency**: Traces frame-to-frame stability and temporal compression drift.
- **Identity Persistence**: Cross-compares deep facial embedding vectors over the timeline.
- **GAN Fingerprint**: Scans for artificial periodic noise fields in spatial-temporal domains.

### 🔊 Audio Forensics
- **Voice Spectral & MFCC Analysis**: Visualizes frequency distribution and speech timbre signatures.
- **Deep Speech Artifact**: Scans vocoder characteristics to detect AI cloned speech.

---

## 📁 File Structure

```
deepfake detection/
├── frontend/             # React application (Vite, React Router, Recharts, Framer Motion)
├── api.py                # FastAPI backend serving all REST forensic endpoints
├── api_models.py         # Pydantic schemas for request/response serialization
├── detector.py           # OpenCV + MediaPipe face detection & landmarks mapping
├── forensics.py          # Spatial & geometric forensic analysis calculators
├── visualizer.py         # Image, spectral ELA, and FFT charting helpers
├── scorer.py             # Weighted score compilation and anomaly aggregators
├── utils.py              # File container and image validation utilities
├── requirements.txt      # Cleaned backend dependencies
└── README.md             # This file
```

---

## 🛡️ Disclaimer

This tool is for **educational, academic, and research purposes only**.
Results are based on forensic heuristics and should **not** be used as sole evidence of image or video manipulation.
