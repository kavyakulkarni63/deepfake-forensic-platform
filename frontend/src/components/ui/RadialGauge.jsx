import React from 'react';
import { motion } from 'framer-motion';

const RadialGauge = ({ score, label, color = '#00ff88', size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-orbitron font-bold text-white" style={{ textShadow: `0 0 10px ${color}80` }}>
            {score.toFixed(0)}
          </span>
          <span className="text-[9px] font-mono tracking-widest uppercase text-cyber-gray mt-1">SCORE</span>
        </div>
      </div>
      
      {label && (
        <div className="mt-3 text-xs font-mono tracking-widest uppercase text-cyber-cyan text-center">
          {label}
        </div>
      )}
    </div>
  );
};

export default RadialGauge;
