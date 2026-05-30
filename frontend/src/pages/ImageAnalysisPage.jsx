import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileImage, ShieldCheck, ShieldAlert, Download, Target, Activity, Zap } from 'lucide-react';
import api from '../api';
import NavBar from '../components/ui/NavBar';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';
import ParticleBackground from '../components/ui/ParticleBackground';
import LoadingScanner from '../components/ui/LoadingScanner';
import EngineCard from '../components/ui/EngineCard';
import RadialGauge from '../components/ui/RadialGauge';

const ImageAnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('INVALID FORMAT. ONLY JPG, PNG, WEBP ACCEPTED.');
      return;
    }
    
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setResults(null); // Reset previous results if any
  };

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const simulateProgress = () => {
    setProgress(0);
    setLogs(['INITIALIZING NEURAL IMAGE ENGINE...']);
    
    const steps = [
      { p: 15, msg: 'EXTRACTING GEOMETRIC MESH (468-PT)...', delay: 800 },
      { p: 30, msg: 'RUNNING ERROR LEVEL ANALYSIS (ELA)...', delay: 1500 },
      { p: 45, msg: 'RUNNING FFT SPECTRAL ANALYSIS...', delay: 2200 },
      { p: 60, msg: 'ANALYZING GEOMETRIC CONSISTENCY...', delay: 3000 },
      { p: 75, msg: 'EVALUATING LBP TEXTURE ENTROPY...', delay: 3800 },
      { p: 90, msg: 'DETECTING COLOR BOUNDARY ANOMALIES...', delay: 4500 },
      { p: 98, msg: 'COMPILING INTELLIGENCE REPORT...', delay: 5200 },
      { p: 100, msg: 'SCAN COMPLETE.', delay: 5800 }
    ];

    steps.forEach(({ p, msg, delay }) => {
      setTimeout(() => {
        setProgress(p);
        addLog(`[✔] ${msg}`);
      }, delay);
    });
  };

  const runAnalysis = async () => {
    if (!file) return;
    setIsScanning(true);
    simulateProgress();

    const formData = new FormData();
    formData.append('file', file);

    try {
      // The actual API call might return faster than our cinematic delay, 
      // but we wait for at least 6 seconds for the cool animations.
      const [response] = await Promise.all([
        api.post('/api/analyze/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        new Promise(resolve => setTimeout(resolve, 6000))
      ]);

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'SCAN FAILED: CONNECTION LOST OR ENGINE ERROR.');
      setLogs(prev => [...prev, '[✖] CRITICAL ERROR IN NEURAL PIPELINE.']);
    } finally {
      setTimeout(() => setIsScanning(false), 500);
    }
  };

  const handleDownloadReport = async () => {
    if (!results?.scan_id) return;
    try {
      const response = await api.get(`/api/report/pdf/${results.scan_id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FORENSIC_REPORT_${results.scan_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF", error);
      setError("FAILED TO DOWNLOAD PDF REPORT");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col relative overflow-x-hidden font-inter">
      <ParticleBackground />
      <ScanLineOverlay />
      <NavBar />
      <LoadingScanner active={isScanning} progress={progress} logs={logs} mtype="image" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-cyber-cyan tracking-widest uppercase flex items-center gap-3">
              <Target className="w-6 h-6" /> Image Analysis Module
            </h1>
            <p className="text-cyber-gray font-mono text-xs tracking-wider mt-1">
              Spatial & Spectral Deepfake Detection
            </p>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red p-4 rounded-lg font-mono text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" /> {error}
          </motion.div>
        )}

        {!results && !isScanning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="g-card p-1">
            <div className="p-4 border-b border-cyber-cyan/20">
              <h2 className="sec-title mb-0 border-none">01 // Evidence Ingestion</h2>
            </div>
            
            <div className="p-8">
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  file ? 'border-cyber-cyan bg-cyber-cyan/5' : 'border-cyber-gray/30 hover:border-cyber-cyan/50 hover:bg-cyber-navy/50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-16 h-16 rounded-full bg-cyber-dark border border-cyber-gray/20 flex items-center justify-center">
                      <UploadCloud className="w-8 h-8 text-cyber-gray" />
                    </div>
                    <div>
                      <p className="font-orbitron tracking-widest text-cyber-cyan">DRAG & DROP EVIDENCE</p>
                      <p className="font-mono text-xs text-cyber-gray mt-2">SUPPORTED FORMATS: JPG, PNG, WEBP</p>
                    </div>
                    <button className="mt-4 px-6 py-2 border border-cyber-gray/30 rounded font-mono text-xs text-cyber-gray hover:text-white hover:border-cyber-cyan transition-colors">
                      BROWSE FILES
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-64 h-64 rounded-lg overflow-hidden border border-cyber-cyan/50 shadow-neon-cyan">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,136,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan pointer-events-none"></div>
                    </div>
                    <div className="flex items-center gap-3 bg-cyber-dark/80 px-4 py-2 rounded-full border border-cyber-cyan/20">
                      <FileImage className="w-4 h-4 text-cyber-cyan" />
                      <span className="font-mono text-xs text-cyber-gray">{file.name}</span>
                      <button 
                        onClick={() => { setFile(null); setPreview(null); }}
                        className="ml-4 text-cyber-red/70 hover:text-cyber-red font-mono text-[10px] underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept=".jpg,.jpeg,.png,.webp" 
                  className="hidden" 
                />
              </div>

              {file && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={runAnalysis}
                    className="flex items-center gap-3 px-8 py-4 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black rounded-lg font-orbitron font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-neon-cyan group"
                  >
                    <Activity className="w-5 h-5 group-hover:animate-pulse" />
                    INITIATE FORENSIC SCAN
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Verdict Banner */}
            <div className={`g-card border-l-8 ${results.is_fake ? 'border-l-cyber-red border-cyber-red/30' : 'border-l-cyber-cyan border-cyber-cyan/30'} flex flex-col md:flex-row items-center justify-between p-6 md:p-8`}>
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className={`p-4 rounded-full ${results.is_fake ? 'bg-cyber-red/10 text-cyber-red' : 'bg-cyber-cyan/10 text-cyber-cyan'}`}>
                  {results.is_fake ? <ShieldAlert className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                </div>
                <div>
                  <div className="font-mono text-xs tracking-widest text-cyber-gray mb-1">FINAL ASSESSMENT</div>
                  <h2 className={`text-2xl md:text-3xl font-orbitron font-bold tracking-widest uppercase ${results.is_fake ? 'text-cyber-red' : 'text-cyber-cyan'} drop-shadow-lg`}>
                    {results.verdict_title}
                  </h2>
                  <div className="flex gap-4 mt-2 font-mono text-xs">
                    <span className="text-cyber-gray">SCAN ID: <span className="text-white">{results.scan_id}</span></span>
                    <span className="text-cyber-gray">TIME: <span className="text-white">{results.timestamp}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 bg-cyber-dark/50 p-4 rounded-xl border border-white/5">
                <div className="text-center">
                  <div className="font-mono text-[10px] text-cyber-gray tracking-widest mb-1">CONFIDENCE</div>
                  <div className="font-orbitron text-xl font-bold text-white">{results.confidence.toFixed(1)}%</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <div className="font-mono text-[10px] text-cyber-gray tracking-widest mb-1">RISK LEVEL</div>
                  <div className={`font-orbitron text-xl font-bold ${results.is_fake ? 'text-cyber-red' : 'text-cyber-cyan'}`}>{results.risk_level}</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <RadialGauge 
                  score={results.fake_score} 
                  size={60} 
                  strokeWidth={4} 
                  color={results.is_fake ? '#ff3333' : '#00ff88'} 
                />
              </div>
            </div>

            {/* Visual Evidence Grid */}
            <div className="g-card p-6">
              <h3 className="sec-title flex items-center gap-2"><Zap className="w-5 h-5"/> 02 // Spatial Evidence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "SOURCE + BBOX", key: "bbox" },
                  { label: "GEOMETRIC MESH", key: "mesh" },
                  { label: "ELA HEATMAP", key: "ela" }
                ].map((item) => (
                  results.img_b64[item.key] ? (
                    <div key={item.key} className="bg-cyber-dark/80 rounded-lg p-3 border border-cyber-cyan/20">
                      <img 
                        src={`data:image/png;base64,${results.img_b64[item.key]}`} 
                        alt={item.label} 
                        className="w-full h-48 object-cover rounded border border-cyber-cyan/30"
                      />
                      <div className="text-center mt-3 font-mono text-xs text-cyber-cyan font-bold tracking-widest">{item.label}</div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>

            {/* Engine Telemetry */}
            <div className="g-card p-6">
              <h3 className="sec-title flex items-center gap-2"><Activity className="w-5 h-5"/> 03 // Engine Telemetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <EngineCard 
                  title="Error Level Analysis" 
                  score={results.engines.ela.score} 
                  status={results.engines.ela.status} 
                  summary={results.engines.ela.summary}
                  color="cyber-cyan"
                />
                <EngineCard 
                  title="FFT Spectrum" 
                  score={results.engines.fft.score} 
                  status={results.engines.fft.status} 
                  summary={results.engines.fft.summary}
                  color="cyber-purple"
                />
                <EngineCard 
                  title="Geometric Ratios" 
                  score={results.engines.geo.score} 
                  status={results.engines.geo.status} 
                  summary={results.engines.geo.summary}
                  color="cyber-orange"
                />
                <EngineCard 
                  title="LBP Texture Entropy" 
                  score={results.engines.tex.score} 
                  status={results.engines.tex.status} 
                  summary={results.engines.tex.summary}
                  color="cyber-neon"
                />
                <EngineCard 
                  title="Color Boundary" 
                  score={results.engines.col.score} 
                  status={results.engines.col.status} 
                  summary={results.engines.col.summary}
                  color="cyber-cyan"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-6 mt-8 mb-12">
              <button 
                onClick={() => { setResults(null); setFile(null); setPreview(null); }}
                className="px-6 py-3 border border-cyber-gray/30 text-cyber-gray hover:text-white hover:border-white rounded font-orbitron tracking-widest transition-all text-sm"
              >
                NEW SCAN
              </button>
              <button 
                onClick={() => window.open(`http://localhost:8000/api/report/${results.scan_id}`, '_blank')}
                className="flex items-center gap-2 px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black rounded font-orbitron tracking-widest transition-all shadow-[0_0_10px_rgba(0,255,255,0.15)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] text-sm group"
              >
                <Activity className="w-4 h-4" /> VIEW REPORT
              </button>
              <button 
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-6 py-3 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black rounded font-orbitron tracking-widest transition-all shadow-[0_0_10px_rgba(0,255,136,0.2)] hover:shadow-neon-cyan text-sm group"
              >
                <Download className="w-4 h-4" /> DOWNLOAD PDF REPORT
              </button>
            </div>

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ImageAnalysisPage;
