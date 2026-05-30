import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Activity, Cpu, ShieldAlert } from 'lucide-react';

const LoadingScanner = ({ active, progress, logs, mtype = 'image' }) => {
  if (!active) return null;

  const color = mtype === 'image' ? 'cyber-cyan' : mtype === 'video' ? 'cyber-purple' : 'cyber-orange';
  const colorHex = mtype === 'image' ? '#00ff88' : mtype === 'video' ? '#7c3aed' : '#ff6600';

  return (
    <div className="fixed inset-0 z-[100] bg-cyber-dark/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden font-inter">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20" />
      
      {/* Corner HUD Elements */}
      <div className={`absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-${color} opacity-70`} />
      <div className={`absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-${color} opacity-70`} />
      <div className={`absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-${color} opacity-70`} />
      <div className={`absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-${color} opacity-70`} />

      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
        
        {/* Title */}
        <h2 className={`text-2xl md:text-3xl font-orbitron font-bold tracking-[0.2em] uppercase text-${color} text-shadow mb-12 flex items-center gap-4`}>
          <ShieldAlert className="w-8 h-8" />
          {mtype} FORENSIC SCAN ACTIVE
        </h2>

        {/* Scanner Visual */}
        <div className="relative w-48 h-48 mb-12">
          {/* Rotating Hexagons */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Hexagon className={`w-full h-full text-${color} opacity-20`} strokeWidth={1} />
          </motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
            className="absolute inset-4 flex items-center justify-center"
          >
            <Hexagon className={`w-full h-full text-${color} opacity-40`} strokeWidth={1.5} />
          </motion.div>
          
          {/* Center Pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-${color}/20 shadow-[0_0_30px_${colorHex}80] animate-pulse-neon flex items-center justify-center`}>
              <Cpu className={`w-8 h-8 text-${color}`} />
            </div>
          </div>

          {/* Vertical Scan Line */}
          <motion.div
            animate={{ y: [0, 192, 0] }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            className={`absolute top-0 left-0 w-full h-1 bg-${color} shadow-[0_0_15px_${colorHex}]`}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-xs font-mono tracking-widest text-cyber-gray mb-2">
            <span>NEURAL ENGINES INITIALIZED</span>
            <span className={`text-${color}`}>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-cyber-navy rounded-full overflow-hidden border border-cyber-gray/20">
            <motion.div 
              className={`h-full bg-${color} shadow-[0_0_10px_${colorHex}]`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.2 }}
            />
          </div>
        </div>

        {/* Logs Terminal */}
        <div className="w-full h-40 bg-cyber-navy/50 border border-cyber-cyan/20 rounded-lg p-4 font-mono text-[10px] md:text-xs overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-cyber-dark/80 pointer-events-none z-10" />
          <div className="flex flex-col gap-1.5 justify-end h-full">
            {logs.slice(-5).map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${i === Math.min(logs.length-1, 4) ? `text-${color}` : 'text-cyber-gray/70'}`}
              >
                <span className="opacity-50">[{new Date().toISOString().split('T')[1].slice(0,-1)}]</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScanner;
