import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Film, Mic, Sparkles } from 'lucide-react';
import ParticleBackground from '../components/ui/ParticleBackground';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';
import NavBar from '../components/ui/NavBar';

const UserDashboardPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'image',
      title: 'IMAGE FORENSIC',
      desc: 'Verify image authenticity via spatial, error level, and spectral analysis',
      icon: ImageIcon,
      color: 'border-blue-500/50 hover:border-blue-400',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      path: '/user/image'
    },
    {
      id: 'video',
      title: 'VIDEO FORENSIC',
      desc: 'Analyze video keyframes for temporal drift and GAN artificial fingerprints',
      icon: Film,
      color: 'border-cyan-500/50 hover:border-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      path: '/user/video'
    },
    {
      id: 'audio',
      title: 'AUDIO FORENSIC',
      desc: 'Detect vocal cloning patterns, mfcc features, and prosodic inconsistencies',
      icon: Mic,
      color: 'border-emerald-500/50 hover:border-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      path: '/user/audio'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter flex flex-col relative overflow-hidden">
      <ParticleBackground />
      <ScanLineOverlay />
      <NavBar />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-xs tracking-widest mb-6 uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Public Verification Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">VFI Portal</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Upload and analyze media using professional-grade deepfake forensic algorithms directly in your browser.
          </p>
        </motion.div>

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
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(mod.path)}
              className={`bg-slate-900/40 backdrop-blur-md cursor-pointer group flex flex-col items-center justify-center p-8 text-center border rounded-2xl ${mod.color} hover:${mod.glow} transition-all duration-300 relative overflow-hidden`}
            >
              {/* Dynamic hover overlay */}
              <div className={`absolute inset-0 ${mod.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className={`w-16 h-16 rounded-xl border border-slate-700/50 flex items-center justify-center mb-5 relative z-10 bg-slate-950 group-hover:scale-110 transition-transform duration-300`}>
                <mod.icon className={`w-8 h-8 ${mod.text}`} />
              </div>
              
              <h2 className="text-lg font-bold tracking-wide mb-2 text-white relative z-10">
                {mod.title}
              </h2>
              
              <p className="text-slate-400 text-xs leading-relaxed relative z-10">
                {mod.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboardPage;
