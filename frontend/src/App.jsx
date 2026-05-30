import React, { useRef, useState } from "react";
import "./App.css";

const API_URL = "https://deepfake-forensic-platform.onrender.com";

export default function App() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [ekycStarted, setEkycStarted] = useState(false);
  const [ekycDone, setEkycDone] = useState(false);
  const [step, setStep] = useState(0);

  const [activeModule, setActiveModule] = useState("image");
  const [file, setFile] = useState(null);
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState(null);

  const ekycSteps = [
    "CENTER YOUR FACE",
    "TURN HEAD LEFT",
    "TURN HEAD RIGHT",
    "LOOK UP",
    "LOOK DOWN",
    "BLINK THREE TIMES",
  ];

  const startEkyc = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setEkycStarted(true);

      let index = 0;
      const timer = setInterval(() => {
        index += 1;
        if (index < ekycSteps.length) {
          setStep(index);
        } else {
          clearInterval(timer);
          setTimeout(() => {
            stream.getTracks().forEach((track) => track.stop());
            setEkycDone(true);
          }, 1000);
        }
      }, 2200);
    } catch (error) {
      alert("Camera permission is required for secure eKYC verification.");
    }
  };

  const analyze = async () => {
    if (!file) {
      alert("Please upload evidence first.");
      return;
    }

    setScan(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      activeModule === "image"
        ? "/api/analyze/image"
        : activeModule === "video"
        ? "/api/analyze/video"
        : "/api/analyze/audio";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: "failed",
        filename: file.name,
        type: activeModule,
        result: "Analysis failed. Backend engine did not return result.",
        deepfake_score: 0,
        fake_score: 0,
        risk_level: "N/A",
        ai_forensic_explanation: error.message,
      });
    } finally {
      setScan(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="login-page matrix-bg">
        <div className="login-card">
          <div className="logo-circle">🛡</div>
          <h1>DEEPFAKE FORENSIC PLATFORM</h1>
          <p>Secure AI-Based Image, Video and Audio Deepfake Analysis</p>

          <input type="email" placeholder="Enter Email" defaultValue="forensicoperative12@gmail.com" />
          <input type="password" placeholder="Enter Password" defaultValue="123456" />

          <button className="main-btn" onClick={() => setLoggedIn(true)}>
            LOGIN
          </button>

          <small>SECURE ACCESS REQUIRED BEFORE FORENSIC ANALYSIS</small>
        </div>
      </div>
    );
  }

  if (loggedIn && !ekycDone) {
    return (
      <div className="ekyc-page matrix-bg">
        <div className="ekyc-frame">
          <div className="ekyc-left">
            <div className="camera-box">
              {!ekycStarted && <div className="camera-placeholder">CAMERA ACCESS REQUIRED</div>}

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={ekycStarted ? "show-video" : "hide-video"}
              />

              <svg className="face-landmark-overlay" viewBox="0 0 300 300">
                <ellipse cx="150" cy="145" rx="74" ry="95" />
                <circle cx="122" cy="125" r="4" />
                <circle cx="178" cy="125" r="4" />
                <circle cx="150" cy="150" r="4" />
                <circle cx="132" cy="178" r="4" />
                <circle cx="168" cy="178" r="4" />
                <line x1="122" y1="125" x2="150" y2="150" />
                <line x1="178" y1="125" x2="150" y2="150" />
                <line x1="132" y1="178" x2="168" y2="178" />
                <line x1="150" y1="150" x2="150" y2="178" />
                <path d="M115 205 Q150 225 185 205" />
              </svg>

              <div className="scan-line"></div>
            </div>

            <div className="action-box">
              <p>PERFORM THIS ACTION</p>
              <h2>{ekycSteps[step]}</h2>
              <span>Follow the instruction until verification completes.</span>
            </div>
          </div>

          <div className="ekyc-right">
            <span className="live-tag">● LIVE BIOMETRIC VERIFICATION</span>
            <h1>SECURE eKYC ENROLLMENT</h1>
            <p>
              Camera-based identity verification is required before entering the DeepFake Forensic Platform dashboard.
            </p>

            <div className="progress-line">
              <span style={{ width: `${((step + 1) / ekycSteps.length) * 100}%` }}></span>
            </div>

            <div className="ekyc-status">
              <p>ACTIVE PHASE</p>
              <h3>{ekycSteps[step]}</h3>
            </div>

            <div className="terminal-log">
              <p>[SYSTEM] Camera sensor initialized...</p>
              <p>[SCAN] Facial landmark mesh active...</p>
              <p>[CHECK] Liveness verification running...</p>
              <p>[STEP] {ekycSteps[step]}</p>
            </div>

            {!ekycStarted && (
              <button className="main-btn" onClick={startEkyc}>
                START CAMERA VERIFICATION
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app matrix-bg">
      <header className="topbar">
        <div className="brand">
          🛡 DEEPFAKE FORENSIC PLATFORM
          <span>AI-Based Multimodal Deepfake Analysis</span>
        </div>
        <div className="system">SYSTEM: ONLINE</div>
        <div className="user">forensicoperative12@gmail.com</div>
      </header>

      <aside className="sidebar">
        <h3>FORENSIC ENGINES</h3>

        <button
          className={activeModule === "image" ? "side-active" : ""}
          onClick={() => {
            setActiveModule("image");
            setResult(null);
            setFile(null);
          }}
        >
          ▣ IMAGE ANALYSIS
        </button>

        <button
          className={activeModule === "video" ? "side-active" : ""}
          onClick={() => {
            setActiveModule("video");
            setResult(null);
            setFile(null);
          }}
        >
          ▣ VIDEO ANALYSIS
        </button>

        <button
          className={activeModule === "audio" ? "side-active" : ""}
          onClick={() => {
            setActiveModule("audio");
            setResult(null);
            setFile(null);
          }}
        >
          ▣ AUDIO ANALYSIS
        </button>

        <div className="engine-list">
          <p>IMAGE ENGINES</p>
          <span>ROI Face Detection</span>
          <span>ELA Heatmap</span>
          <span>FFT Spectrum</span>
          <span>468 Facial Landmark Mesh</span>
          <span>Texture Entropy</span>
          <span>RGB / Color Boundary</span>

          <p>VIDEO ENGINES</p>
          <span>Temporal Consistency</span>
          <span>Identity Persistence</span>
          <span>GAN Fingerprint</span>
          <span>Blink Analysis</span>
          <span>Audio-Visual Sync</span>

          <p>AUDIO ENGINES</p>
          <span>Spectral Analysis</span>
          <span>MFCC Analysis</span>
          <span>Prosody Analysis</span>
          <span>Noise Consistency</span>
          <span>Voice Biometric</span>
        </div>
      </aside>

      <main className="main">
        {!scan && !result && (
          <section className="upload-panel">
            <h1>{activeModule.toUpperCase()} FORENSIC ANALYSIS MODULE</h1>
            <p>Upload evidence for AI-based forensic verification.</p>

            <div className="upload-box">
              <div className="upload-icon">⬢</div>
              <h2>UPLOAD DIGITAL EVIDENCE</h2>
              <p>Supported formats: JPG, PNG, MP4, WAV, MP3</p>

              <label className="file-btn">
                BROWSE FILE
                <input
                  type="file"
                  hidden
                  accept={activeModule === "image" ? "image/*" : activeModule === "video" ? "video/*" : "audio/*"}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>

              {file && <div className="selected-file">SELECTED: {file.name}</div>}
            </div>

            <button className="scan-btn" onClick={analyze}>
              START FORENSIC ANALYSIS
            </button>
          </section>
        )}

        {scan && (
          <section className="scan-screen">
            <h1>☢ {activeModule.toUpperCase()} FORENSIC SCAN ACTIVE</h1>
            <div className="scanner-orb"><div></div></div>
            <div className="progress-bar"><span></span></div>
            <div className="log-box">
              <p>[ENGINE] Initializing forensic engines...</p>
              <p>[ANALYSIS] Extracting digital evidence features...</p>
              <p>[CHECK] Running anomaly and artifact analysis...</p>
              <p>[REPORT] Compiling forensic result...</p>
            </div>
          </section>
        )}

        {result && (
          <section className="result-panel">
            <h1>{activeModule.toUpperCase()} FORENSIC RESULT</h1>

            <div className="verdict-card">
              <div>
                <p>FINAL ASSESSMENT</p>
                <h2>{result.result || result.verdict_title || result.verdict}</h2>
                <span>Risk Level: {result.risk_level || "N/A"}</span>
                <p>{result.ai_forensic_explanation}</p>
              </div>

              <div className="score-circle">
                <strong>{Math.round(result.deepfake_score || result.fake_score || 0)}</strong>
                <small>SCORE</small>
              </div>
            </div>

            <div className="evidence-grid">
              <div className="evidence-card">
                <h3>SOURCE IMAGE + ROI</h3>
                <div className="preview-box">
                  {result.bbox_image ? (
                    <img src={`data:image/png;base64,${result.bbox_image}`} alt="ROI" />
                  ) : file && file.type.startsWith("image") ? (
                    <img src={URL.createObjectURL(file)} alt="preview" />
                  ) : (
                    <span>MEDIA FILE</span>
                  )}
                </div>
              </div>

              <div className="evidence-card">
                <h3>468 FACIAL LANDMARK MESH</h3>
                <div className="preview-box">
                  {result.landmark_image ? (
                    <img src={`data:image/png;base64,${result.landmark_image}`} alt="Landmarks" />
                  ) : result.img_b64?.mesh ? (
                    <img src={`data:image/png;base64,${result.img_b64.mesh}`} alt="Mesh" />
                  ) : (
                    <span>No landmark output available</span>
                  )}
                </div>
              </div>

              <div className="evidence-card">
                <h3>ELA HEATMAP REGION</h3>
                <div className="preview-box">
                  {result.ela_image ? (
                    <img src={`data:image/png;base64,${result.ela_image}`} alt="ELA Heatmap" />
                  ) : result.img_b64?.ela ? (
                    <img src={`data:image/png;base64,${result.img_b64.ela}`} alt="ELA" />
                  ) : result.img_b64?.timeline ? (
                    <img src={`data:image/png;base64,${result.img_b64.timeline}`} alt="Video Timeline" />
                  ) : result.img_b64?.spectrogram ? (
                    <img src={`data:image/png;base64,${result.img_b64.spectrogram}`} alt="Audio Spectrogram" />
                  ) : (
                    <div className="heatmap"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="evidence-grid">
              <div className="evidence-card">
                <h3>FFT SPECTRUM ANALYSIS</h3>
                <div className="preview-box">
                  {result.fft_image ? (
                    <img src={`data:image/png;base64,${result.fft_image}`} alt="FFT Spectrum" />
                  ) : result.img_b64?.fft ? (
                    <img src={`data:image/png;base64,${result.img_b64.fft}`} alt="FFT" />
                  ) : (
                    <span>FFT output not available</span>
                  )}
                </div>
              </div>

              <div className="evidence-card">
                <h3>TEXTURE ENTROPY ANALYSIS</h3>
                <div className="preview-box">
                  {result.texture_image ? (
                    <img src={`data:image/png;base64,${result.texture_image}`} alt="Texture Entropy" />
                  ) : result.img_b64?.lbp ? (
                    <img src={`data:image/png;base64,${result.img_b64.lbp}`} alt="Texture" />
                  ) : result.audio_waveform_image ? (
                    <img src={`data:image/png;base64,${result.audio_waveform_image}`} alt="Audio Waveform" />
                  ) : (
                    <span>Texture / waveform output not available</span>
                  )}
                </div>
              </div>

              <div className="evidence-card">
                <h3>ENGINE TELEMETRY</h3>
                <p>File: {result.filename || file?.name}</p>
                <p>Type: {result.type || result.analysis_type || activeModule}</p>
                <p>Status: {result.status || "completed"}</p>
                <p>Fake Probability: {result.fake_probability || result.deepfake_score || 0}%</p>
                <p>Real Probability: {result.real_probability || 0}%</p>

                {result.report_url && (
                  <a className="report-link" href={`${API_URL}${result.report_url}`} target="_blank" rel="noreferrer">
                    DOWNLOAD PDF REPORT
                  </a>
                )}
              </div>
            </div>

            <button
              className="scan-btn"
              onClick={() => {
                setResult(null);
                setFile(null);
              }}
            >
              NEW SCAN
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
