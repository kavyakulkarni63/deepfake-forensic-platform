import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Film, ShieldAlert, ShieldCheck, Download, Activity, Target } from 'lucide-react';
import api from '../api';
import NavBar from '../components/ui/NavBar';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';
import ParticleBackground from '../components/ui/ParticleBackground';
import LoadingScanner from '../components/ui/LoadingScanner';
import EngineCard from '../components/ui/EngineCard';
import RadialGauge from '../components/ui/RadialGauge';

// A simple area chart using standard Recharts 
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const VideoAnalysisPage = () => {
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
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;
    
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp4|mov|avi|mkv)$/i)) {
      setError('INVALID FORMAT. ONLY MP4, MOV, AVI, MKV ACCEPTED.');
      return;
    }
    
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setResults(null);
  };

  const simulateProgress = () => {
    setProgress(0);
    setLogs(['INITIALIZING NEURAL VIDEO ENGINE...']);
    
    const steps = [
      { p: 10, msg: 'INGESTING VIDEO FRAMES...', delay: 1000 },
      { p: 25, msg: 'RUNNING TEMPORAL CONSISTENCY ENGINE...', delay: 2500 },
      { p: 40, msg: 'ANALYZING IDENTITY PERSISTENCE...', delay: 4000 },
      { p: 55, msg: 'DETECTING GAN FINGERPRINTS...', delay: 5500 },
      { p: 70, msg: 'EVALUATING MICRO-EXPRESSIONS & BLINK EAR...', delay: 7000 },
      { p: 85, msg: 'EXTRACTING AUDIO FOR CROSS-MODAL SYNC...', delay: 8500 },
      { p: 95, msg: 'BUILDING RECONSTRUCTION TIMELINE...', delay: 10000 },
      { p: 100, msg: 'SCAN COMPLETE.', delay: 11000 }
    ];

    steps.forEach(({ p, msg, delay }) => {
      setTimeout(() => {
        setProgress(p);
        setLogs(prev => [...prev, `[✔] ${msg}`]);
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
      const [response] = await Promise.all([
        api.post('/api/analyze/video', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        new Promise(resolve => setTimeout(resolve, 11500))
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

  // Prepare chart data from timelines
  const getChartData = () => {
    if (!results?.timelines) return [];
    const tls = Object.values(results.timelines).filter(t => t && t.length > 0);
    if (tls.length === 0) return [];
    
    const minLen = Math.min(...tls.map(t => t.length));
    const data = [];
    for (let i = 0; i < minLen; i++) {
      let sum = 0;
      tls.forEach(t => { sum += t[i]; });
      data.push({ frame: i, score: sum / tls.length });
    }
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col relative overflow-x-hidden font-inter">
      <ParticleBackground />
      <ScanLineOverlay />
      <NavBar />
      <LoadingScanner active={isScanning} progress={progress} logs={logs} mtype="video" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-cyber-purple tracking-widest uppercase flex items-center gap-3">
              <Film className="w-6 h-6" /> Video Analysis Module
            </h1>
            <p className="text-cyber-gray font-mono text-xs tracking-wider mt-1">
              Temporal & Cross-Modal Detection
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
            <div className="p-4 border-b border-cyber-purple/20">
              <h2 className="sec-title mb-0 border-none !text-cyber-purple">01 // Video Ingestion</h2>
            </div>
            
            <div className="p-8">
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  file ? 'border-cyber-purple bg-cyber-purple/5' : 'border-cyber-gray/30 hover:border-cyber-purple/50 hover:bg-cyber-navy/50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-16 h-16 rounded-full bg-cyber-dark border border-cyber-gray/20 flex items-center justify-center">
                      <Film className="w-8 h-8 text-cyber-gray" />
                    </div>
                    <div>
                      <p className="font-orbitron tracking-widest text-cyber-purple">DRAG & DROP VIDEO EVIDENCE</p>
                      <p className="font-mono text-xs text-cyber-gray mt-2">SUPPORTED FORMATS: MP4, MOV, AVI, MKV</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-full max-w-lg aspect-video rounded-lg overflow-hidden border border-cyber-purple/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] bg-black">
                      <video src={preview} controls className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-3 bg-cyber-dark/80 px-4 py-2 rounded-full border border-cyber-purple/20">
                      <Film className="w-4 h-4 text-cyber-purple" />
                      <span className="font-mono text-xs text-cyber-gray">{file.name}</span>
                      <button onClick={() => { setFile(null); setPreview(null); }} className="ml-4 text-cyber-red/70 hover:text-cyber-red font-mono text-[10px] underline">REMOVE</button>
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="video/*" className="hidden" />
              </div>

              {file && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={runAnalysis}
                    className="flex items-center gap-3 px-8 py-4 bg-cyber-purple/10 border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white rounded-lg font-orbitron font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] group"
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
                  <div className="font-mono text-[10px] text-cyber-gray tracking-widest mb-1">THREAT LEVEL</div>
                  <div className={`font-orbitron text-xl font-bold ${results.is_fake ? 'text-cyber-red' : 'text-cyber-cyan'}`}>{results.threat_level}</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <RadialGauge score={results.composite_score} size={60} strokeWidth={4} color={results.is_fake ? '#ff3333' : '#00ff88'} />
              </div>
            </div>

            {/* Timeline Heatmap */}
            {chartData.length > 0 && (
              <div className="g-card p-6">
                <h3 className="sec-title flex items-center gap-2 !text-cyber-purple border-b-cyber-purple/30"><Activity className="w-5 h-5"/> 02 // Timeline Intelligence</h3>
                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="frame" stroke="#8bb4e7" tick={{fill: '#8bb4e7', fontSize: 12}} />
                      <YAxis stroke="#8bb4e7" tick={{fill: '#8bb4e7', fontSize: 12}} domain={[0, 100]} />
                      <Tooltip contentStyle={{backgroundColor: '#0a1628', border: '1px solid #7c3aed', color: '#fff'}} />
                      <Area type="monotone" dataKey="score" stroke="#7c3aed" fillOpacity={1} fill="url(#colorScore)" />
                      {/* Add reference line for threshold */}
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ff3333" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Engine Telemetry */}
            <div className="g-card p-6">
              <h3 className="sec-title flex items-center gap-2 !text-cyber-purple border-b-cyber-purple/30"><Target className="w-5 h-5"/> 03 // Video Engine Telemetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results.engine_results).map(([key, res]) => (
                  <EngineCard 
                    key={key}
                    title={key.replace('_', ' ').toUpperCase()} 
                    score={res.score} 
                    status={res.status} 
                    summary={res.summary}
                    color="cyber-purple"
                  />
                ))}
              </div>
            </div>

            {/* Suspicious Frames */}
            {results.sus_frames && results.sus_frames.length > 0 && (
              <div className="g-card p-6">
                <h3 className="sec-title flex items-center gap-2 !text-cyber-red border-b-cyber-red/30"><ShieldAlert className="w-5 h-5"/> 04 // Flagged Anomaly Frames</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {results.sus_frames.map((b64, idx) => (
                    <div key={idx} className="bg-cyber-dark/80 rounded border border-cyber-red/50 overflow-hidden relative group">
                      <img src={`data:image/jpeg;base64,${b64}`} alt={`Anomaly ${idx}`} className="w-full aspect-square object-cover" />
                      <div className="absolute inset-0 bg-cyber-red/20 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 bg-cyber-red/80 text-white text-[10px] font-bold text-center py-1 font-mono tracking-widest">
                        FLAGGED
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                className="flex items-center gap-2 px-6 py-3 bg-cyber-purple/20 border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white rounded font-orbitron tracking-widest transition-all shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] text-sm group"
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

export default VideoAnalysisPage;
