import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Image as ImageIcon, Film, Mic, Activity, Shield, Zap, Terminal, 
  ShieldAlert, Cpu, Heart, CheckCircle2, AlertTriangle, User, Globe, Radio,
  FileText, Search, ShieldCheck, Power, Check, Eye, Users, HardDrive, History, RefreshCw, Play, Clock, Filter
} from 'lucide-react';
import api from '../api';
import ParticleBackground from '../components/ui/ParticleBackground';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';
import NavBar from '../components/ui/NavBar';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Dashboard states
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState('ALL');
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch admin telemetry stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Telemetry link failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Live poll every 3s for fast UI updates
    return () => clearInterval(interval);
  }, []);

  const handleUnblockUser = async (username) => {
    try {
      const response = await api.post('/api/admin/unblock', { username });
      if (response.data.success) {
        setActionSuccess(`Successfully unblocked user ${username} and reset warnings.`);
        setTimeout(() => setActionSuccess(''), 5000);
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  const modules = [
    {
      id: 'image',
      title: 'IMAGE FORENSIC',
      desc: 'SPATIAL & SPECTRAL ANOMALY DECK',
      icon: ImageIcon,
      color: 'border-cyber-cyan/40 hover:border-cyber-cyan',
      glow: 'shadow-[0_0_25px_rgba(0,255,255,0.2)] hover:shadow-[0_0_35px_rgba(0,255,255,0.45)]',
      text: 'text-cyber-cyan',
      bg: 'bg-cyber-cyan/5',
      path: '/image',
      badge: 'SECURE ANOMALY'
    },
    {
      id: 'video',
      title: 'VIDEO FORENSIC',
      desc: 'TEMPORAL DRIFT & GAN DESTRUCT ENGINE',
      icon: Film,
      color: 'border-cyber-purple/40 hover:border-cyber-purple',
      glow: 'shadow-[0_0_25px_rgba(124,58,237,0.2)] hover:shadow-[0_0_35px_rgba(124,58,237,0.45)]',
      text: 'text-cyber-purple',
      bg: 'bg-cyber-purple/5',
      path: '/video',
      badge: 'TEMPORAL CORE'
    },
    {
      id: 'audio',
      title: 'AUDIO FORENSIC',
      desc: 'VOCAL CLONING & MFCC COGNITIVE SCAN',
      icon: Mic,
      color: 'border-cyber-orange/40 hover:border-cyber-orange',
      glow: 'shadow-[0_0_25px_rgba(255,102,0,0.2)] hover:shadow-[0_0_35px_rgba(255,102,0,0.45)]',
      text: 'text-cyber-orange',
      bg: 'bg-cyber-orange/5',
      path: '/audio',
      badge: 'VOCAL BIOMETRIC'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const displayTotalScans = stats?.total_scans ?? 0;
  const displayFakeDetections = stats?.fake_detections ?? 0;
  const displayRealDetections = stats?.real_detections ?? 0;
  const displayUptime = stats?.uptime ?? '00:00:00';
  const threatScoreAvg = stats?.threat_score_avg ?? 0.0;
  const auditLogs = stats?.audit_logs ?? [];
  const coreAlerts = stats?.core_alerts ?? [];
  const registeredUsers = stats?.users ?? [];
  const activeScans = stats?.active_scans ?? [];

  // Filter audit logs for Center Tab
  const filteredAuditLogs = auditLogs.filter(log => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filter
    if (logFilter === 'ALL') return true;
    if (logFilter === 'AUTH' && (log.action === 'LOGIN_SUCCESS' || log.action === 'LOGOUT' || log.action === 'USER_SIGNUP')) return true;
    if (logFilter === 'SCANS' && log.action === 'SCAN_COMPLETED') return true;
    if (logFilter === 'MISMATCHES' && log.action === 'IDENTITY_VALIDATION') return true;
    if (logFilter === 'BLOCKS' && log.action === 'ACCOUNT_BLOCKED') return true;
    if (logFilter === 'OPERATIVE' && log.action === 'USER_UNBLOCKED') return true;
    return false;
  });

  // Calculate live countdown for active scans
  const getRemainingTime = (scan) => {
    const elapsed = (Date.now() / 1000) - scan.start_time;
    const remaining = Math.max(0, Math.round(scan.total_time - elapsed));
    return remaining > 0 ? `${remaining}s` : 'Processing...';
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-inter flex flex-col relative overflow-x-hidden">
      <ParticleBackground />
      <ScanLineOverlay />
      <NavBar />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-start p-6 w-full max-w-7xl mx-auto gap-8 pt-28 pb-16">
        
        {/* ── TACTICAL HUD HEADER ── */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-cyber-cyan/20 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-24 h-px bg-cyber-cyan animate-pulse"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-center lg:text-left"
          >
            <div className="w-12 h-12 rounded-lg border border-cyber-cyan/30 flex items-center justify-center bg-cyber-cyan/5 relative group overflow-hidden">
              <div className="absolute inset-0 bg-cyber-cyan/10 animate-pulse"></div>
              <Radio className="w-6 h-6 text-cyber-cyan animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="font-mono text-[9px] text-cyber-cyan tracking-widest uppercase bg-cyber-cyan/10 px-2 py-0.5 rounded border border-cyber-cyan/25">UPLINK ACTIVE</span>
                <span className="font-mono text-[9px] text-cyber-gray tracking-widest uppercase">OPERATIVE PORTAL</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple tracking-widest uppercase mt-1">
                COMMAND CENTER // HUD
              </h1>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/5 px-6 py-3.5 rounded-xl shadow-2xl relative overflow-hidden group hover:border-cyber-cyan/30 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-cyan/40"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-cyan/40"></div>
            <div className="w-10 h-10 rounded-full border border-cyber-cyan/30 flex items-center justify-center bg-cyber-cyan/5 text-cyber-cyan">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-orbitron font-bold text-xs tracking-wider text-white">OPERATIVE: {user?.name || 'ANALYST_ALPHA'}</p>
              <p className="font-mono text-[9px] text-cyber-gray tracking-wider uppercase mt-0.5">Role: <span className="text-cyber-cyan">Forensic Specialist</span></p>
            </div>
          </motion.div>
        </div>

        {/* Action Success Alert banner */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan px-4 py-3 rounded font-mono text-xs uppercase tracking-wider flex items-center gap-3"
            >
              <ShieldCheck className="w-5 h-5 animate-pulse" />
              <span>{actionSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MODULES SELECTION DECKS (LAUNCH SCAN PILE) ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.id}
              variants={itemVariants}
              whileHover={{ scale: 1.025, y: -4 }}
              onClick={() => {
                const prefix = user?.role === 'operative' ? '/operative' : '';
                navigate(`${prefix}${mod.path}`);
              }}
              className={`bg-[#060b13]/80 backdrop-blur-md cursor-pointer group flex flex-col p-8 border rounded-xl ${mod.color} ${mod.glow} transition-all duration-300 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <div className={`absolute inset-0 ${mod.bg} opacity-5 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="flex justify-between items-center mb-6 z-10">
                <span className={`font-mono text-[9px] tracking-widest uppercase border-b border-white/10 pb-1 ${mod.text}`}>
                  {mod.badge}
                </span>
                <div className={`w-2 h-2 rounded-full ${mod.text} bg-current animate-ping`}></div>
              </div>

              <div className={`w-14 h-14 rounded-lg border ${mod.color} flex items-center justify-center mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300 bg-black/60`}>
                <mod.icon className={`w-7 h-7 ${mod.text}`} />
              </div>
              
              <h2 className="text-lg font-orbitron font-extrabold tracking-widest mb-2 text-white relative z-10">
                {mod.title}
              </h2>
              
              <p className="text-cyber-gray text-[10px] font-mono leading-relaxed relative z-10 uppercase">
                {mod.desc}
              </p>

              <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${mod.color} m-2 opacity-60 group-hover:opacity-100`}></div>
              <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${mod.color} m-2 opacity-60 group-hover:opacity-100`}></div>
              <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${mod.color} m-2 opacity-60 group-hover:opacity-100`}></div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${mod.color} m-2 opacity-60 group-hover:opacity-100`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FUTURISTIC HUD TELEMETRY METRICS ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
        >
          {/* Total Evidence */}
          <div className="bg-[#060b13]/90 backdrop-blur-xl border border-cyber-cyan/10 p-5 rounded-lg relative overflow-hidden shadow-2xl group hover:border-cyber-cyan/35 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-cyan/50"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-cyan/50"></div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-cyber-cyan/5 border border-cyber-cyan/25 text-cyber-cyan rounded">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-mono text-[9px] text-cyber-gray tracking-widest uppercase">EVIDENCE INGESTIONS</p>
                <h3 className="font-orbitron text-xl font-bold text-white mt-0.5">{displayTotalScans}</h3>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 mt-3 pt-2 font-mono text-[8px] text-cyber-gray">
              <span>GENUINE: <span className="text-cyber-cyan">{displayRealDetections}</span></span>
              <span>SYNTHETIC: <span className="text-cyber-orange">{displayFakeDetections}</span></span>
            </div>
          </div>

          {/* Average Threat Score */}
          <div className="bg-[#060b13]/90 backdrop-blur-xl border border-cyber-purple/10 p-5 rounded-lg relative overflow-hidden shadow-2xl group hover:border-cyber-purple/35 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-purple/50"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-purple/50"></div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-cyber-purple/5 border border-cyber-purple/25 text-cyber-purple rounded">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[9px] text-cyber-gray tracking-widest uppercase">AVG THREAT SCORE</p>
                <h3 className="font-orbitron text-xl font-bold text-white mt-0.5">{threatScoreAvg.toFixed(1)}%</h3>
              </div>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-cyber-purple h-full shadow-[0_0_10px_#7c3aed]" style={{ width: `${Math.min(100, threatScoreAvg)}%` }}></div>
            </div>
          </div>

          {/* Core Uptime */}
          <div className="bg-[#060b13]/90 backdrop-blur-xl border border-cyber-orange/10 p-5 rounded-lg relative overflow-hidden shadow-2xl group hover:border-cyber-orange/35 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-orange/50"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-orange/50"></div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-cyber-orange/5 border border-cyber-orange/25 text-cyber-orange rounded">
                <Heart className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-mono text-[9px] text-cyber-gray tracking-widest uppercase">UPLINK DURABILITY</p>
                <h3 className="font-orbitron text-xl font-bold text-white mt-0.5">{displayUptime}</h3>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 mt-3 pt-2 font-mono text-[8px] text-cyber-gray">
              <span>VERSION: <span className="text-white">v2.4.1</span></span>
              <span>PING: <span className="text-cyber-orange">8ms</span></span>
            </div>
          </div>

          {/* Engine Status */}
          <div className="bg-[#060b13]/90 backdrop-blur-xl border border-cyber-neon/10 p-5 rounded-lg relative overflow-hidden shadow-2xl group hover:border-cyber-neon/35 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-neon/50"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-neon/50"></div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-cyber-neon/5 border border-cyber-neon/25 text-cyber-neon rounded">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-[9px] text-cyber-gray tracking-widest uppercase">NEURAL PIPELINES</p>
                <h3 className="font-orbitron text-xl font-bold text-cyber-neon mt-0.5">19 / 19 HEALTHY</h3>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 mt-3 pt-2 font-mono text-[8px] text-cyber-gray">
              <span>STATUS: <span className="text-cyber-neon">OPTIMAL</span></span>
              <span>LOAD: <span className="text-white">28.5%</span></span>
            </div>
          </div>
        </motion.div>

        {/* ── FORENSIC HUB CONTROL CENTER (TABBED MODULE ENGINE) ── */}
        <div className="w-full flex flex-col bg-[#060b13]/95 border border-white/10 rounded-xl relative overflow-hidden shadow-2xl p-6 gap-6">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan m-2"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan m-2"></div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-4">
            <h2 className="font-orbitron font-extrabold text-sm tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
              INVESTIGATION COMMAND PORTAL // CORE DECK
            </h2>
            
            {/* Tab selection grid */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {[
                { id: 'live', name: 'LIVE MONITOR', icon: Radio, dot: true },
                { id: 'investigation', name: 'INVESTIGATION CENTER', icon: Shield },
                { id: 'users', name: 'USER ACTIVITY', icon: Users },
                { id: 'evidence', name: 'EVIDENCE REPOSITORY', icon: HardDrive },
                { id: 'reports', name: 'REPORT REPOSITORY', icon: FileText },
                { id: 'audit', name: 'AUDIT LOG CENTER', icon: Terminal }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-[9px] font-bold tracking-widest border transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan shadow-[0_0_15px_rgba(0,170,255,0.15)]'
                      : 'bg-black/40 text-cyber-gray border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                  <span>{tab.name}</span>
                  {tab.dot && activeScans.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-ping"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full min-h-[350px]">
            {/* Tab 1: Live Analysis Monitor */}
            {activeTab === 'live' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded font-mono text-xs">
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeScans.length > 0 ? 'bg-cyber-neon animate-pulse' : 'bg-cyber-gray'}`}></span>
                    ACTIVE ANALYSIS INGESTION PIPELINES: <span className="text-white font-bold">{activeScans.length} IN PROGRESS</span>
                  </span>
                  <span className="text-cyber-gray">REAL-TIME TELEMETRY STREAMING</span>
                </div>

                {activeScans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded gap-4">
                    <Radio className="w-10 h-10 text-cyber-gray/30 animate-pulse" />
                    <p className="font-mono text-xs text-cyber-gray tracking-widest uppercase">
                      SYS CORE: ZERO ACTIVE PUBLIC SCANS EN-ROUTE // STANDBY FOR BROADCAST
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeScans.map((scan, idx) => (
                      <div key={idx} className="bg-[#0b1424] border border-cyber-neon/20 rounded p-5 relative overflow-hidden flex flex-col gap-4">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-neon/5 rounded-full blur-xl pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-wider">{scan.name}</h4>
                            <p className="font-mono text-[9px] text-cyber-gray mt-0.5">{scan.email}</p>
                          </div>
                          <span className="font-mono text-[8px] bg-cyber-neon/10 text-cyber-neon px-2 py-0.5 rounded border border-cyber-neon/25 uppercase font-bold tracking-widest animate-pulse">
                            {scan.media_type} PIPELINE
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between font-mono text-[9px] text-cyber-gray uppercase">
                            <span>Ingested File: <span className="text-white font-semibold">{scan.filename}</span></span>
                            <span>Remaining: <span className="text-cyber-neon">{getRemainingTime(scan)}</span></span>
                          </div>
                          
                          {/* Animated progress bar */}
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                            <motion.div 
                              className="bg-gradient-to-r from-cyber-cyan to-cyber-neon h-full shadow-[0_0_10px_#00ff66]"
                              initial={{ width: 0 }}
                              animate={{ width: `${scan.progress}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          
                          <div className="flex justify-between font-mono text-[9px] text-cyber-gray uppercase mt-1">
                            <span>Stage: <span className="text-cyber-cyan font-bold">{scan.active_engine}</span></span>
                            <span>Progress: <span className="text-white">{scan.progress}%</span></span>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-3 mt-1 flex justify-between items-center font-mono text-[9px] text-cyber-gray uppercase">
                          <span>Live Engine Probability Score: <span className="text-cyber-orange font-bold">{scan.current_score.toFixed(1)}%</span></span>
                          <span className="flex items-center gap-1.5 text-cyber-neon">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            ANALYSIS LIVE
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Investigation Monitoring Center */}
            {activeTab === 'investigation' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/35 border border-white/5 p-4 rounded text-center">
                    <p className="font-mono text-[9px] text-cyber-gray tracking-wider uppercase">ALL REGISTERED PUBLIC USERS</p>
                    <h3 className="font-orbitron text-xl font-bold text-cyber-cyan mt-1">{registeredUsers.length}</h3>
                  </div>
                  <div className="bg-black/35 border border-white/5 p-4 rounded text-center">
                    <p className="font-mono text-[9px] text-cyber-gray tracking-wider uppercase">IDENTITY CHECKS COMPLETED</p>
                    <h3 className="font-orbitron text-xl font-bold text-white mt-1">
                      {auditLogs.filter(log => log.action === 'IDENTITY_VALIDATION').length}
                    </h3>
                  </div>
                  <div className="bg-black/35 border border-white/5 p-4 rounded text-center">
                    <p className="font-mono text-[9px] text-cyber-gray tracking-wider uppercase">BLOCKED IDENTITIES</p>
                    <h3 className="font-orbitron text-xl font-bold text-cyber-orange mt-1">
                      {registeredUsers.filter(u => u.is_blocked).length}
                    </h3>
                  </div>
                  <div className="bg-black/35 border border-white/5 p-4 rounded text-center">
                    <p className="font-mono text-[9px] text-cyber-gray tracking-wider uppercase">VERIFICATION MISMATCHES</p>
                    <h3 className="font-orbitron text-xl font-bold text-cyber-red mt-1">
                      {auditLogs.filter(log => log.action === 'IDENTITY_VALIDATION' && log.details.includes('Rejected')).length}
                    </h3>
                  </div>
                </div>

                <div className="border border-white/5 rounded overflow-hidden">
                  <div className="bg-black/40 px-4 py-3 font-mono text-xs border-b border-white/5 tracking-wider uppercase font-bold text-cyber-cyan">
                    IDENTITY MISMATCH & VALIDATION ATTEMPTS LOGS
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <table className="w-full font-mono text-[10px] text-left border-collapse">
                      <thead>
                        <tr className="bg-black/55 text-cyber-gray border-b border-white/5 uppercase">
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">Identity / Operator</th>
                          <th className="p-3">Validation Details</th>
                          <th className="p-3 text-right">Action Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.filter(l => l.action === 'IDENTITY_VALIDATION' || l.action === 'USER_UNBLOCKED').length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-8 text-center text-cyber-gray/40 uppercase tracking-widest">
                              No face verification attempts recorded.
                            </td>
                          </tr>
                        ) : (
                          auditLogs.filter(l => l.action === 'IDENTITY_VALIDATION' || l.action === 'USER_UNBLOCKED').map((log, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-3 text-cyber-gray">{log.timestamp}</td>
                              <td className="p-3 text-white font-bold">{log.operator}</td>
                              <td className="p-3 text-cyber-gray uppercase">{log.details}</td>
                              <td className="p-3 text-right">
                                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-extrabold border ${
                                  log.action === 'USER_UNBLOCKED' 
                                    ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan'
                                    : log.details.includes('Rejected')
                                      ? 'bg-cyber-red/10 border-cyber-red text-cyber-red'
                                      : 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon'
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: User Activity Center (Public User Profile View) */}
            {activeTab === 'users' && (
              <div className="flex flex-col gap-4">
                <div className="bg-black/40 px-4 py-3 font-mono text-xs border border-white/5 rounded tracking-wider uppercase font-bold text-cyber-cyan flex justify-between items-center">
                  <span>PUBLIC IDENTITY TELEMETRY REGISTER ({registeredUsers.length} MEMBERS)</span>
                  <span className="text-cyber-gray">Enforced strict identity gate similarity &ge; 85%</span>
                </div>

                {registeredUsers.length === 0 ? (
                  <div className="py-16 text-center text-cyber-gray/30 uppercase tracking-widest font-mono text-xs">
                    SYS: ZERO PUBLIC USER PROFILES REGISTERED
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registeredUsers.map((profile, index) => (
                      <div 
                        key={index}
                        className={`bg-[#060b13] border rounded p-5 relative overflow-hidden flex flex-col gap-4 transition-all duration-300 ${
                          profile.is_blocked 
                            ? 'border-cyber-red/30 shadow-[0_0_20px_rgba(255,51,51,0.1)]' 
                            : 'border-white/5 hover:border-cyber-cyan/35'
                        }`}
                      >
                        <div className="flex gap-4 items-start">
                          {/* Face Avatar Silhouette or real photo */}
                          <div className="w-16 h-16 rounded border border-white/10 bg-black/60 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                            {profile.user_photo ? (
                              <img 
                                src={`data:image/jpeg;base64,${profile.user_photo}`} 
                                alt="Face Biometric" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-cyber-gray/40 animate-pulse" />
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[6px] font-mono tracking-widest text-center py-0.5 text-cyber-cyan font-bold uppercase">
                              {profile.user_photo ? 'E-KYC REF' : 'NO BIOMETRICS'}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-orbitron font-extrabold text-xs text-white uppercase truncate">{profile.name}</h4>
                            <p className="font-mono text-[9px] text-cyber-cyan truncate mt-0.5">{profile.email}</p>
                            
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                                profile.is_blocked 
                                  ? 'bg-cyber-red/10 border-cyber-red text-cyber-red animate-pulse'
                                  : 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon'
                              }`}>
                                {profile.is_blocked ? 'RESTRICTED' : profile.verification_status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-3 font-mono text-[9px] text-cyber-gray uppercase">
                          <div>
                            <p>Scans Run: <span className="text-white font-bold">{profile.scans_count}</span></p>
                            <p className="mt-1">Reports: <span className="text-white font-bold">{profile.reports_count}</span></p>
                          </div>
                          <div>
                            <p>Enrolled: <span className="text-white">{profile.registration_date}</span></p>
                            <p className="mt-1">Last Log: <span className="text-white truncate block">{profile.last_login}</span></p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center font-mono text-[9px]">
                          <span className="uppercase text-cyber-gray flex items-center gap-1">
                            Biometric Warnings: 
                            <span className={`font-bold ${profile.warning_count >= 3 ? 'text-cyber-red' : profile.warning_count > 0 ? 'text-cyber-orange' : 'text-cyber-neon'}`}>
                              {profile.warning_count} / 3 Strikes
                            </span>
                          </span>

                          {(profile.warning_count > 0 || profile.is_blocked) && (
                            <button
                              onClick={() => handleUnblockUser(profile.username)}
                              className="px-2.5 py-1 bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan text-cyber-cyan rounded font-bold text-[8px] tracking-widest uppercase transition-all duration-300"
                            >
                              RESET & UNBLOCK
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Evidence Repository */}
            {activeTab === 'evidence' && (
              <div className="flex flex-col gap-4">
                <div className="bg-black/40 px-4 py-3 font-mono text-xs border border-white/5 rounded tracking-wider uppercase font-bold text-cyber-cyan flex justify-between items-center">
                  <span>DIGITAL EVIDENCE REPOSITORY ({displayTotalScans} FILES RECORDED)</span>
                  <span className="text-cyber-gray">Ingestion Hash-Verified Secure Storage</span>
                </div>

                <div className="border border-white/5 rounded overflow-hidden">
                  <table className="w-full font-mono text-[10px] text-left border-collapse">
                    <thead>
                      <tr className="bg-black/55 text-cyber-gray border-b border-white/5 uppercase">
                        <th className="p-3">Evidence ID</th>
                        <th className="p-3">Uploaded Filename</th>
                        <th className="p-3">Evidence Type</th>
                        <th className="p-3">Ingested By</th>
                        <th className="p-3">Analyzed Time</th>
                        <th className="p-3 text-center">Threat Level</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recent_activity.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-cyber-gray/40 uppercase tracking-widest">
                            No evidence files recorded.
                          </td>
                        </tr>
                      ) : (
                        stats?.recent_activity.map((scan, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-3 text-cyber-cyan font-bold">{scan.scan_id}</td>
                            <td className="p-3 text-white truncate max-w-[150px]" title={scan.filename}>{scan.filename}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[8px] bg-white/5 border border-white/10 uppercase">
                                {scan.media_type}
                              </span>
                            </td>
                            <td className="p-3 text-cyber-gray">{scan.username || 'ANONYMOUS'}</td>
                            <td className="p-3 text-cyber-gray">{scan.timestamp}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${
                                scan.verdict === 'FAKE'
                                  ? 'bg-cyber-red/10 border-cyber-red text-cyber-red'
                                  : 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon'
                              }`}>
                                {scan.verdict === 'FAKE' ? 'HIGH THREAT' : 'SECURE'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => window.open(`/api/report/${scan.scan_id}`, '_blank')}
                                className="flex items-center gap-1 bg-cyber-cyan/15 hover:bg-cyber-cyan/35 border border-cyber-cyan/35 text-cyber-cyan px-2.5 py-1 rounded text-[8px] font-bold tracking-widest uppercase ml-auto transition-all duration-300"
                              >
                                <Eye className="w-3 h-3" />
                                REVIEW DATA
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Report Repository */}
            {activeTab === 'reports' && (
              <div className="flex flex-col gap-4">
                <div className="bg-black/40 px-4 py-3 font-mono text-xs border border-white/5 rounded tracking-wider uppercase font-bold text-cyber-cyan flex justify-between items-center">
                  <span>FORENSIC REPORT VAULT ({displayTotalScans} REPORTS COMPILED)</span>
                  <span className="text-cyber-gray">PDF / HTML Interactive Auditing</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats?.recent_activity.length === 0 ? (
                    <div className="col-span-2 py-16 text-center text-cyber-gray/30 uppercase tracking-widest font-mono text-xs">
                      SYS: ZERO FORENSIC SCANS RECORDED // REPORT VAULT EMPTY
                    </div>
                  ) : (
                    stats?.recent_activity.map((scan, idx) => (
                      <div key={idx} className="bg-black/35 border border-white/5 rounded p-4 flex flex-col gap-3 hover:border-cyber-purple/40 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[8px] bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
                              {scan.media_type} ANALYSIS REPORT
                            </span>
                            <h4 className="font-orbitron font-extrabold text-xs text-white uppercase mt-2">{scan.filename}</h4>
                            <p className="font-mono text-[9px] text-cyber-gray mt-0.5">Signature: {scan.scan_id}</p>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                            scan.verdict === 'FAKE' 
                              ? 'bg-cyber-red/10 border-cyber-red text-cyber-red'
                              : 'bg-cyber-neon/10 border-cyber-neon text-cyber-neon'
                          }`}>
                            Verdict: {scan.verdict}
                          </span>
                        </div>

                        <div className="border-t border-white/5 pt-3 mt-1 flex justify-between items-center font-mono text-[9px] text-cyber-gray">
                          <span>Date Compiled: <span className="text-white">{scan.timestamp}</span></span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(`/api/report/${scan.scan_id}`, '_blank')}
                              className="px-2.5 py-1 bg-cyber-cyan/15 hover:bg-cyber-cyan/35 border border-cyber-cyan/35 text-cyber-cyan rounded font-bold text-[8px] tracking-widest uppercase transition-all duration-300"
                            >
                              OPEN HTML
                            </button>
                            <a
                              href={`/api/report/pdf/${scan.scan_id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-cyber-purple/15 hover:bg-cyber-purple/35 border border-cyber-purple/35 text-cyber-purple rounded font-bold text-[8px] tracking-widest uppercase transition-all duration-300"
                            >
                              DOWNLOAD PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 6: Permanent Audit Log Center */}
            {activeTab === 'audit' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-black/45 border border-white/5 p-4 rounded font-mono text-xs">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'ALL', name: 'ALL RECORDS' },
                      { id: 'AUTH', name: 'LOGINS / LOGOUTS' },
                      { id: 'SCANS', name: 'SCANS RUN' },
                      { id: 'MISMATCHES', name: 'MISMATCH DEVIATIONS' },
                      { id: 'BLOCKS', name: 'ACCOUNT RESTRICTIONS' },
                      { id: 'OPERATIVE', name: 'OPERATIVE DE-BLOCKS' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setLogFilter(f.id)}
                        className={`px-2.5 py-1 rounded text-[9px] font-bold border transition-colors ${
                          logFilter === f.id
                            ? 'bg-cyber-orange/15 border-cyber-orange text-cyber-orange'
                            : 'bg-black/35 border-white/5 text-cyber-gray hover:text-white'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-cyber-gray" />
                    <input
                      type="text"
                      placeholder="SEARCH TERMINAL LOGS..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-black/55 border border-white/10 rounded pl-8 pr-3 py-1 text-[10px] w-full font-mono text-cyber-cyan focus:outline-none focus:border-cyber-cyan placeholder-cyber-gray/40 uppercase"
                    />
                  </div>
                </div>

                <div className="bg-[#02060c] border border-cyber-cyan/15 rounded p-4 font-mono text-[10px] text-cyber-cyan/85 max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col gap-2">
                  {filteredAuditLogs.length === 0 ? (
                    <div className="text-center py-20 text-cyber-gray/30 uppercase tracking-widest">
                      SYS: ZERO COMPLIANCE LOG RECORDS FOUND UNDER SELECTION
                    </div>
                  ) : (
                    filteredAuditLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start leading-relaxed border-b border-white/5 pb-1.5 last:border-b-0">
                        <span className="text-cyber-gray font-semibold select-none flex-shrink-0">[{log.timestamp}]</span>
                        <span className="text-cyber-orange flex-shrink-0">SYS:{log.operator.toUpperCase()}</span>
                        <span className="text-white flex-shrink-0">({log.action})</span>
                        <span className="text-cyber-gray uppercase">{log.details}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
