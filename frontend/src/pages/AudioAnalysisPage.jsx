import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, ShieldAlert, ShieldCheck, Download, Activity, Target, Waves } from 'lucide-react';
import api from '../api';
import NavBar from '../components/ui/NavBar';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';
import ParticleBackground from '../components/ui/ParticleBackground';
import LoadingScanner from '../components/ui/LoadingScanner';
import EngineCard from '../components/ui/EngineCard';
import RadialGauge from '../components/ui/RadialGauge';

// A simple CSS animated waveform visualizer component
const AudioWaveform = ({ isPlaying }) => {
  return (
    <div className="flex items-end justify-center gap-1 h-32 w-full max-w-md mx-auto">
      {[...Array(30)].map((_, i) => {
        const h = isPlaying ? 20 + Math.random() * 80 : 10;
        return (
          <motion.div
            key={i}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.2, repeat: isPlaying ? Infinity : 0, repeatType: "reverse" }}
            className="w-2 bg-cyber-orange rounded-t-sm shadow-[0_0_8px_rgba(255,102,0,0.5)]"
          />
        );
      })}
    </div>
  );
};

const AudioAnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
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
    
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/flac', 'video/mp4'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|m4a|flac|mp4)$/i)) {
      setError('INVALID FORMAT. ONLY MP3, WAV, M4A, FLAC, MP4 ACCEPTED.');
      return;
    }
    
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setAudioUrl(objectUrl);
    setResults(null);
  };

  const simulateProgress = () => {
    setProgress(0);
    setLogs(['INITIALIZING NEURAL AUDIO ENGINE...']);
    
    const steps = [
      { p: 15, msg: 'EXTRACTING SPEECH FEATURES...', delay: 1000 },
      { p: 30, msg: 'RUNNING VOICE SPECTRAL ANALYSIS...', delay: 2500 },
      { p: 45, msg: 'RUNNING MFCC VOICE ANALYSIS...', delay: 4000 },
      { p: 60, msg: 'ANALYZING PROSODY & RHYTHM...', delay: 5500 },
      { p: 75, msg: 'EVALUATING NOISE CONSISTENCY...', delay: 7000 },
      { p: 90, msg: 'VERIFYING VOICE BIOMETRICS...', delay: 8500 },
      { p: 98, msg: 'COMPILING INTELLIGENCE REPORT...', delay: 10000 },
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
        api.post('/api/analyze/audio', formData, {
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

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col relative overflow-x-hidden font-inter">
      <ParticleBackground />
      <ScanLineOverlay />
      <NavBar />
      <LoadingScanner active={isScanning} progress={progress} logs={logs} mtype="audio" />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-cyber-orange tracking-widest uppercase flex items-center gap-3">
              <Mic className="w-6 h-6" /> Audio Analysis Module
            </h1>
            <p className="text-cyber-gray font-mono text-xs tracking-wider mt-1">
              Voice Clone & Frequency Scrutiny
            </p>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red p-4 rounded-lg font-mono text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" /> {error}
          </motion.div>
        )}

        {!results && !isScanning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="g-card p-1 border-cyber-orange/30">
            <div className="p-4 border-b border-cyber-orange/20">
              <h2 className="sec-title mb-0 border-none !text-cyber-orange">01 // Audio Ingestion</h2>
            </div>
            
            <div className="p-8">
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  file ? 'border-cyber-orange bg-cyber-orange/5' : 'border-cyber-gray/30 hover:border-cyber-orange/50 hover:bg-cyber-navy/50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {!file ? (
                  <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-16 h-16 rounded-full bg-cyber-dark border border-cyber-gray/20 flex items-center justify-center">
                      <Mic className="w-8 h-8 text-cyber-gray" />
                    </div>
                    <div>
                      <p className="font-orbitron tracking-widest text-cyber-orange">DRAG & DROP AUDIO EVIDENCE</p>
                      <p className="font-mono text-xs text-cyber-gray mt-2">SUPPORTED FORMATS: MP3, WAV, M4A, FLAC, MP4 (AUDIO EXTRACTION)</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
                    <div className="w-full bg-cyber-dark/80 p-8 rounded-xl border border-cyber-orange/30 shadow-[0_0_20px_rgba(255,102,0,0.15)]">
                       <AudioWaveform isPlaying={true} />
                    </div>
                    {file.name.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                      <video src={audioUrl} controls className="w-full max-h-48 object-contain bg-black/80 rounded-lg border border-cyber-orange/30 shadow-[0_0_15px_rgba(255,102,0,0.1)]" />
                    ) : (
                      <audio src={audioUrl} controls className="w-full opacity-80 filter invert sepia hue-rotate-[180deg]" />
                    )}
                    <div className="flex items-center gap-3 bg-cyber-dark/80 px-4 py-2 rounded-full border border-cyber-orange/20">
                      <Mic className="w-4 h-4 text-cyber-orange" />
                      <span className="font-mono text-xs text-cyber-gray">{file.name}</span>
                      <button onClick={() => { setFile(null); setAudioUrl(''); }} className="ml-4 text-cyber-red/70 hover:text-cyber-red font-mono text-[10px] underline">REMOVE</button>
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="audio/*,video/mp4" className="hidden" />
              </div>

              {file && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={runAnalysis}
                    className="flex items-center gap-3 px-8 py-4 bg-cyber-orange/10 border border-cyber-orange text-cyber-orange hover:bg-cyber-orange hover:text-black rounded-lg font-orbitron font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,102,0,0.2)] hover:shadow-[0_0_30px_rgba(255,102,0,0.5)] group"
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

            {/* Engine Telemetry */}
            <div className="g-card p-6 border-cyber-orange/20">
              <h3 className="sec-title flex items-center gap-2 !text-cyber-orange border-b-cyber-orange/30"><Target className="w-5 h-5"/> 02 // Audio Engine Telemetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results.engine_results).map(([key, res]) => (
                  <EngineCard 
                    key={key}
                    title={key.replace('_', ' ').toUpperCase()} 
                    score={res.score} 
                    status={res.status} 
                    summary={res.summary}
                    color="cyber-orange"
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-6 mt-8 mb-12">
              <button 
                onClick={() => { setResults(null); setFile(null); setAudioUrl(''); }}
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
                className="flex items-center gap-2 px-6 py-3 bg-cyber-orange/20 border border-cyber-orange text-cyber-orange hover:bg-cyber-orange hover:text-black rounded font-orbitron tracking-widest transition-all shadow-[0_0_10px_rgba(255,102,0,0.2)] hover:shadow-[0_0_20px_rgba(255,102,0,0.5)] text-sm group"
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

export default AudioAnalysisPage;
