import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowLeft, Fingerprint, Camera, Key } from 'lucide-react';
import ScanLineOverlay from '../components/ui/ScanLineOverlay';

const CommanderLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const [showMfa, setShowMfa] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(async () => {
      const r = await login(username, password, 'commander');
      if (r.success) {
        setShowMfa(true);
      } else {
        setError(r.message);
      }
      setLoading(false);
    }, 1500);
  };

  const handlePasscodeChange = (i, v) => {
    if (v.length > 1) return;
    const n = [...passcode];
    n[i] = v;
    setPasscode(n);
    if (v && i < 3) {
      document.getElementById(`passcode-${i + 1}`)?.focus();
    }
  };

  const verifyMfa = () => {
    if (passcode.join('').length === 4) {
      setLoading(true);
      setTimeout(() => {
        navigate('/commander/dashboard');
      }, 1000);
    } else {
      setError('Enter all 4 digits of the Security Key.');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex items-center justify-center relative overflow-hidden font-inter">
      <ScanLineOverlay />
      
      {/* Radial ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid bg-[length:35px_35px] opacity-15 pointer-events-none" />

      {/* Cyber Commander HUD targets */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-cyber-purple/40" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-cyber-purple/40" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-cyber-purple/40" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-cyber-purple/40" />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.7, type: 'spring' }} 
        className="relative z-10 w-full max-w-md px-4"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-cyber-gray hover:text-cyber-purple text-xs font-mono tracking-wider mb-6 transition-colors group uppercase">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Portal Matrix
        </Link>

        <div className="bg-cyber-navy/85 backdrop-blur-2xl border border-cyber-purple/35 rounded-2xl p-8 shadow-[0_0_35px_rgba(139,92,246,0.2)] relative overflow-hidden">
          {/* Internal corner marks */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyber-purple opacity-40 m-4" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyber-purple opacity-40 m-4" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-cyber-purple opacity-40 m-4" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyber-purple opacity-40 m-4" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} 
              className="w-16 h-16 mx-auto mb-4 relative"
            >
              <div className="absolute inset-0 border-2 border-dashed border-cyber-purple rounded-full" />
              <div className="absolute inset-2 border border-cyber-purple/30 rounded-full animate-pulse" />
              <ShieldCheck className="absolute inset-0 m-auto text-cyber-purple w-7 h-7" />
            </motion.div>
            <h1 className="text-xl font-orbitron font-bold text-cyber-purple tracking-widest uppercase">
              COMMANDER TERMINAL
            </h1>
            <p className="text-[9px] font-mono text-cyber-gray tracking-widest mt-1.5 uppercase">
              Tactical Operations // Security Clearance Level 3
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showMfa ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onSubmit={handleLogin} 
                className="space-y-4"
              >
                {/* Username */}
                <div>
                  <label className="block text-[10px] text-cyber-purple/90 font-mono mb-1 uppercase tracking-wider">Commander Account</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input 
                      type="text" 
                      required 
                      value={username} 
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-purple/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all font-mono text-xs"
                      placeholder="Enter clearance sequence" 
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] text-cyber-purple/90 font-mono mb-1 uppercase tracking-wider">Access Cryptocode</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input 
                      type={showPw ? 'text':'password'} 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-purple/30 rounded-lg py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all font-mono text-xs tracking-widest"
                      placeholder="••••••••" 
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-gray hover:text-cyber-purple transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>

                {/* Info badge */}
                <div className="bg-cyber-dark/50 border border-cyber-purple/20 rounded-lg p-3 flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-cyber-purple mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-mono text-cyber-gray leading-normal">
                      Security authorization requires biometric enrollment mapping and Multi-Factor Authentication.
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-cyber-red text-[10px] font-mono bg-cyber-red/10 border border-cyber-red/30 p-2.5 rounded"
                    >
                      [ ACCESS DEGRADED ] {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 bg-transparent border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white py-3 rounded-lg font-orbitron font-bold tracking-widest text-xs transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] relative overflow-hidden group disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'CRACKING CLEARANCE...' : 'VERIFY IDENTITY'}
                  </span>
                  <div className="absolute inset-0 bg-cyber-purple w-0 group-hover:w-full transition-all duration-300 ease-out z-0" />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="mfa-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="text-center"
              >
                <Key className="w-10 h-10 text-cyber-purple mx-auto mb-3 animate-bounce" />
                <h3 className="text-sm font-orbitron font-semibold mb-1 uppercase">Enter Tactical Passcode</h3>
                <p className="text-cyber-gray text-[10px] font-mono mb-6 uppercase tracking-wider">Security token key required</p>
                
                <div className="flex justify-center gap-3 mb-6">
                  {passcode.map((d, i) => (
                    <input 
                      key={i} 
                      id={`passcode-${i}`} 
                      type="text" 
                      maxLength={1} 
                      value={d} 
                      onChange={e => handlePasscodeChange(i, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-mono bg-cyber-dark border border-cyber-purple/40 rounded-lg text-white focus:outline-none focus:border-cyber-purple transition-all" 
                    />
                  ))}
                </div>
                
                <button 
                  onClick={verifyMfa} 
                  className="w-full py-3 bg-gradient-to-r from-cyber-purple to-indigo-600 text-white font-orbitron font-bold tracking-widest text-xs rounded-lg hover:shadow-lg transition-all"
                >
                  ESTABLISH UPLINK
                </button>
                <p className="text-cyber-gray text-[8px] mt-4 font-mono italic">Demo verification code: enter any 4 digits</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center border-t border-cyber-purple/20 pt-4">
            <p className="text-[9px] text-cyber-gray/40 font-mono tracking-wider">
              DEMO ACCESS: <span className="text-cyber-purple/70">commander</span> / <span className="text-cyber-purple/70">commander123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommanderLoginPage;
