import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Cpu, ChevronRight, Fingerprint, Lock, Sparkles } from 'lucide-react';
import MatrixRain from '../components/ui/MatrixRain';

const PortalSelectPage = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'common',
      title: 'Public Access',
      subtitle: 'AI Deepfake Scanner',
      desc: 'Upload media, scan for deepfakes, and download forensic reports. Open to all users.',
      icon: User,
      path: '/login/user',
      color: 'from-blue-500 to-cyan-400',
      border: 'border-blue-400/40',
      hoverBorder: 'hover:border-blue-400',
      glow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]',
      textColor: 'text-blue-400',
      bgAccent: 'bg-blue-500/10',
      security: 'Level 1 — Standard',
      features: ['Media Upload', 'AI Scan', 'Report Download', 'Scan History'],
    },
    {
      id: 'operative',
      title: 'Forensic Operative',
      subtitle: 'Investigation Workstation',
      desc: 'Advanced forensic analysis with full engine telemetry, evidence management, and investigation tools.',
      icon: Shield,
      path: '/login/operative',
      color: 'from-cyber-cyan to-emerald-400',
      border: 'border-cyber-cyan/40',
      hoverBorder: 'hover:border-cyber-cyan',
      glow: 'hover:shadow-[0_0_40px_rgba(0,255,136,0.25)]',
      textColor: 'text-cyber-cyan',
      bgAccent: 'bg-cyber-cyan/10',
      security: 'Level 2 — Restricted',
      features: ['Forensic Engines', 'Evidence Archive', 'eKYC Biometrics', 'Deep Telemetry'],
    },
    {
      id: 'commander',
      title: 'Cyber Commander',
      subtitle: 'SOC Command Center',
      desc: 'Military-grade intelligence oversight with global threat monitoring, audit logs, and neural core access.',
      icon: Cpu,
      path: '/login/commander',
      color: 'from-cyber-purple to-violet-400',
      border: 'border-cyber-purple/40',
      hoverBorder: 'hover:border-cyber-purple',
      glow: 'hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]',
      textColor: 'text-cyber-purple',
      bgAccent: 'bg-cyber-purple/10',
      security: 'Level 3 — Classified',
      features: ['Threat Telemetry', 'Audit Logs', 'Operator Monitor', 'AI Core Status'],
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col items-center justify-center relative overflow-hidden font-inter">
      <MatrixRain />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,170,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-cyber-cyan/30" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-cyber-cyan/30" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-cyber-cyan/30" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-cyber-cyan/30" />

      <div className="relative z-10 w-full max-w-6xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan font-mono text-[10px] tracking-[0.25em] mb-5 uppercase">
            <Fingerprint className="w-3.5 h-3.5" /> Select Access Portal
          </div>

          <h1 className="text-4xl md:text-5xl font-orbitron font-black tracking-[0.15em] uppercase mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-purple">
              VFI INTELLIGENCE
            </span>
          </h1>
          <p className="text-cyber-gray font-mono text-xs tracking-widest max-w-xl mx-auto leading-relaxed">
            AI-Powered Cyber Forensic Intelligence Platform — Choose your security clearance level to proceed.
          </p>
        </motion.div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              onClick={() => navigate(portal.path)}
              className={`group cursor-pointer relative rounded-2xl border ${portal.border} ${portal.hoverBorder} ${portal.glow} bg-cyber-navy/60 backdrop-blur-md p-6 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Top glow bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${portal.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${portal.bgAccent} border ${portal.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <portal.icon className={`w-7 h-7 ${portal.textColor}`} />
              </div>

              {/* Title */}
              <h2 className={`font-orbitron font-bold text-lg tracking-widest uppercase mb-1 ${portal.textColor}`}>
                {portal.title}
              </h2>
              <p className="text-[10px] font-mono text-cyber-gray/70 tracking-widest uppercase mb-4">
                {portal.subtitle}
              </p>

              {/* Description */}
              <p className="text-cyber-gray text-xs leading-relaxed mb-5">
                {portal.desc}
              </p>

              {/* Security badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${portal.border} ${portal.bgAccent} mb-5`}>
                <Lock className={`w-3 h-3 ${portal.textColor}`} />
                <span className={`text-[9px] font-mono tracking-widest uppercase ${portal.textColor}`}>
                  {portal.security}
                </span>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {portal.features.map((f) => (
                  <span key={f} className="text-[8px] font-mono tracking-wider text-cyber-gray/60 bg-cyber-dark/60 border border-white/5 px-2 py-0.5 rounded uppercase">
                    {f}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className={`flex items-center justify-between pt-4 border-t ${portal.border}`}>
                <span className={`text-xs font-orbitron font-bold tracking-widest ${portal.textColor} uppercase`}>
                  Enter Portal
                </span>
                <ChevronRight className={`w-5 h-5 ${portal.textColor} group-hover:translate-x-1 transition-transform`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <p className="text-[9px] font-mono text-cyber-gray/30 tracking-widest uppercase">
            VFI Intelligence Platform v3.0 — Secure Multi-Tier Authentication
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalSelectPage;
