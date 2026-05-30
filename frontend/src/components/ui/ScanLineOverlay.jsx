import React from 'react';

const ScanLineOverlay = () => {
  return (
    <>
      {/* Static grid overlay */}
      <div className="fixed inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-10 pointer-events-none z-0"></div>
      
      {/* Moving scan line */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-[15vh] bg-[linear-gradient(transparent_0%,rgba(0,255,136,0.05)_50%,rgba(0,170,255,0.1)_100%)] border-b border-cyber-cyan/20 animate-scan absolute top-[-15vh]"></div>
      </div>
      
      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(2,4,9,0.8)_100%)]"></div>
    </>
  );
};

export default ScanLineOverlay;
