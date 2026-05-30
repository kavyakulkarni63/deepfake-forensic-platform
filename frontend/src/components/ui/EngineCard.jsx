import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const EngineCard = ({ title, score, status, summary, icon: Icon, color = 'cyber-cyan' }) => {
  const isDanger = score >= 50;
  const activeColor = isDanger ? 'cyber-red' : color;
  const bgClass = isDanger ? 'bg-cyber-red/5' : `bg-${color}/5`;
  const borderClass = isDanger ? 'border-cyber-red/30' : `border-${color}/30`;
  const textClass = isDanger ? 'text-cyber-red' : `text-${color}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border ${borderClass} ${bgClass} relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-5 h-5 ${textClass}`} />}
          <h3 className="font-orbitron font-bold text-sm tracking-wider text-white uppercase">{title}</h3>
        </div>
        <div className={`font-mono text-lg font-bold ${textClass}`}>
          {score.toFixed(1)}
        </div>
      </div>
      
      <div className="mb-3 relative z-10">
        <div className="w-full h-1.5 bg-cyber-dark rounded overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${isDanger ? 'bg-cyber-red' : `bg-${color}`}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono uppercase mb-2 relative z-10">
        {isDanger ? (
          <AlertCircle className="w-3.5 h-3.5 text-cyber-red" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 text-cyber-cyan" />
        )}
        <span className={isDanger ? 'text-cyber-red' : 'text-cyber-cyan'}>{status}</span>
      </div>

      <p className="text-[10px] text-cyber-gray font-mono leading-relaxed relative z-10">
        {summary}
      </p>

      {/* Hover effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${activeColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
    </motion.div>
  );
};

export default EngineCard;
