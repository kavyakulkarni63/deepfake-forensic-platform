import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Shield, Activity, Menu, X, ArrowLeft } from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/admin';

  return (
    <nav className="relative z-50 border-b border-cyber-cyan/20 bg-cyber-navy/80 backdrop-blur-md px-6 py-3 shadow-glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left side: Logo & Back */}
        <div className="flex items-center gap-6">
          {!isDashboard && (
            <button 
              onClick={() => navigate(-1)}
              className="text-cyber-gray hover:text-cyber-cyan transition-colors flex items-center gap-2 font-mono text-xs tracking-widest border border-cyber-gray/30 hover:border-cyber-cyan/50 px-3 py-1.5 rounded bg-cyber-dark/50"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>
          )}
          
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 border border-cyber-cyan rounded bg-cyber-dark overflow-hidden group-hover:border-cyber-neon transition-colors">
              <div className="absolute inset-0 bg-cyber-cyan/10 group-hover:bg-cyber-cyan/20 transition-colors"></div>
              <Shield className="w-5 h-5 text-cyber-cyan z-10" />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-cyber-cyan text-xl tracking-widest leading-none group-hover:text-shadow-neon-cyan transition-all">VFI</h1>
              <span className="font-mono text-[10px] text-cyber-gray tracking-widest uppercase">Intelligence Net</span>
            </div>
          </div>
        </div>

        {/* Center: HUD Info */}
        <div className="hidden md:flex flex-col items-center justify-center border-x border-cyber-cyan/20 px-8">
           <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-cyber-cyan/80">
             <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" /> SYSTEM: ONLINE</span>
             <span>|</span>
             <span>{time} UTC</span>
           </div>
           <div className="w-full h-1 mt-1 bg-cyber-dark rounded overflow-hidden">
             <div className="h-full bg-[linear-gradient(90deg,transparent,#00ff88,transparent)] w-[50%] animate-scan origin-left" style={{ animationDirection: 'alternate' }}></div>
           </div>
        </div>

        {/* Right side: User & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-sm text-white tracking-wider">{user?.username || 'GUEST'}</div>
            <div className={`font-mono text-[10px] tracking-widest uppercase ${user?.role === 'admin' ? 'text-cyber-purple' : 'text-cyber-cyan'}`}>
              CLEARANCE: {user?.role || 'LEVEL 0'}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 border border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10 rounded transition-colors group relative overflow-hidden"
            title="Terminate Session"
          >
            <LogOut className="w-5 h-5 relative z-10" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
