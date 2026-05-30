import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Database, Activity, Server, Clock, AlertTriangle } from 'lucide-react';
import api from '../api';
import NavBar from '../components/ui/NavBar';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';
import ParticleBackground from '../components/ui/ParticleBackground';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      setError('Failed to fetch system telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-cyber-dark text-cyber-cyan flex items-center justify-center font-orbitron text-xl">CONNECTING TO ADMIN CONSOLE...</div>;
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col relative overflow-x-hidden font-inter">
      <ParticleBackground />
      <ScanLineOverlay />
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-cyber-purple tracking-widest uppercase flex items-center gap-3">
              <Server className="w-6 h-6" /> Commander Console
            </h1>
            <p className="text-cyber-gray font-mono text-xs tracking-wider mt-1">
              System Telemetry & Threat Monitoring
            </p>
          </div>
          <div className="flex items-center gap-2 bg-cyber-dark/80 px-4 py-2 rounded-full border border-cyber-cyan/30">
            <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase">System Online</span>
          </div>
        </div>

        {error && (
          <div className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red p-4 rounded-lg font-mono text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" /> {error}
          </div>
        )}

        {stats && (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="g-card p-5 border-cyber-cyan/30 flex flex-col items-center justify-center text-center">
                <Database className="w-6 h-6 text-cyber-cyan mb-2" />
                <div className="text-3xl font-orbitron font-bold text-white mb-1">{stats.total_scans}</div>
                <div className="font-mono text-[10px] text-cyber-gray tracking-widest uppercase">Total Scans</div>
              </div>
              <div className="g-card p-5 border-cyber-red/30 bg-cyber-red/5 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-6 h-6 text-cyber-red mb-2" />
                <div className="text-3xl font-orbitron font-bold text-cyber-red mb-1">{stats.fake_detections}</div>
                <div className="font-mono text-[10px] text-cyber-gray tracking-widest uppercase">Threats Detected</div>
              </div>
              <div className="g-card p-5 border-cyber-purple/30 flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-cyber-purple mb-2" />
                <div className="text-3xl font-orbitron font-bold text-white mb-1">2</div>
                <div className="font-mono text-[10px] text-cyber-gray tracking-widest uppercase">Active Operatives</div>
              </div>
              <div className="g-card p-5 border-cyber-orange/30 flex flex-col items-center justify-center text-center">
                <Clock className="w-6 h-6 text-cyber-orange mb-2" />
                <div className="text-xl font-orbitron font-bold text-white mb-1">{stats.uptime}</div>
                <div className="font-mono text-[10px] text-cyber-gray tracking-widest uppercase">System Uptime</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Scan Distribution */}
              <div className="g-card p-6 lg:col-span-1">
                <h3 className="sec-title !text-sm">Scan Modality Distribution</h3>
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-cyber-gray">
                      <span>IMAGE SCANS</span>
                      <span>{stats.image_scans}</span>
                    </div>
                    <div className="w-full h-2 bg-cyber-dark rounded overflow-hidden"><div className="h-full bg-cyber-cyan" style={{width: `${(stats.image_scans/Math.max(1,stats.total_scans))*100}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-cyber-gray">
                      <span>VIDEO SCANS</span>
                      <span>{stats.video_scans}</span>
                    </div>
                    <div className="w-full h-2 bg-cyber-dark rounded overflow-hidden"><div className="h-full bg-cyber-purple" style={{width: `${(stats.video_scans/Math.max(1,stats.total_scans))*100}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-cyber-gray">
                      <span>AUDIO SCANS</span>
                      <span>{stats.audio_scans}</span>
                    </div>
                    <div className="w-full h-2 bg-cyber-dark rounded overflow-hidden"><div className="h-full bg-cyber-orange" style={{width: `${(stats.audio_scans/Math.max(1,stats.total_scans))*100}%`}}></div></div>
                  </div>
                </div>
              </div>

              {/* Recent Threat Activity */}
              <div className="g-card p-6 lg:col-span-2 flex flex-col">
                <h3 className="sec-title !text-sm flex items-center justify-between">
                  Recent Threat Activity Feed
                  <span className="text-[10px] bg-cyber-dark px-2 py-1 rounded text-cyber-gray">LIVE STREAM</span>
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 mt-2 space-y-3 max-h-80">
                  {stats.recent_activity?.length === 0 ? (
                    <div className="text-center text-cyber-gray/50 font-mono text-sm py-10">NO RECENT ACTIVITY LOGGED</div>
                  ) : (
                    stats.recent_activity?.map((act, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center justify-between p-3 rounded border ${act.verdict === 'FAKE' ? 'bg-cyber-red/10 border-cyber-red/30' : 'bg-cyber-dark/80 border-white/5'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${act.verdict === 'FAKE' ? 'bg-cyber-red shadow-[0_0_8px_#ff3333]' : 'bg-cyber-cyan shadow-[0_0_8px_#00ff88]'}`}></div>
                          <div>
                            <div className="font-mono text-xs text-white">{act.scan_id} <span className="text-cyber-gray">| {act.filename}</span></div>
                            <div className="font-mono text-[10px] text-cyber-gray mt-1">{act.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-orbitron text-xs font-bold ${act.verdict === 'FAKE' ? 'text-cyber-red' : 'text-cyber-cyan'}`}>{act.verdict} ({act.confidence.toFixed(1)}%)</div>
                          <div className="font-mono text-[9px] text-cyber-gray mt-1 uppercase">{act.media_type}</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
