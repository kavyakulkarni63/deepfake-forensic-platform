import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MatrixRain from '../components/ui/MatrixRain';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft, Fingerprint, Camera, IdCard } from 'lucide-react';

const OperativeLoginPage = () => {
  const [name, setName] = useState('');
  const [opId, setOpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    // Use opId as username for auth
    setTimeout(async () => {
      const r = await login(opId, password, 'operative');
      if (r.success) navigate('/operative/dashboard');
      else setError(r.message);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex items-center justify-center relative overflow-hidden font-inter">
      <MatrixRain />
      <div className="absolute inset-0 bg-cyber-grid bg-[length:35px_35px] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.06)_0%,transparent_65%)] pointer-events-none" />

      {/* Corner HUD brackets */}
      <div className="absolute top-6 left-6 w-14 h-14 border-t-2 border-l-2 border-cyber-cyan/50" />
      <div className="absolute top-6 right-6 w-14 h-14 border-t-2 border-r-2 border-cyber-cyan/50" />
      <div className="absolute bottom-6 left-6 w-14 h-14 border-b-2 border-l-2 border-cyber-cyan/50" />
      <div className="absolute bottom-6 right-6 w-14 h-14 border-b-2 border-r-2 border-cyber-cyan/50" />

      <motion.div initial={{ opacity:0, y:40, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.6, type:'spring' }} className="relative z-10 w-full max-w-md px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-cyber-gray hover:text-cyber-cyan text-xs font-mono tracking-wider mb-6 transition-colors group uppercase">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Portal
        </Link>

        <div className="bg-cyber-navy/80 backdrop-blur-xl border border-cyber-cyan/30 rounded-2xl p-7 shadow-neon-blue relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-cyber-cyan opacity-50 m-3" />
          <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-cyber-cyan opacity-50 m-3" />
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-cyber-cyan opacity-50 m-3" />
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-cyber-cyan opacity-50 m-3" />

          {/* Header */}
          <div className="text-center mb-7">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease:'linear' }} className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-2 border-dashed border-cyber-cyan rounded-full" />
              <div className="absolute inset-2 border border-cyber-cyan/40 rounded-full animate-pulse" />
              <Shield className="absolute inset-0 m-auto text-cyber-cyan w-7 h-7" />
            </motion.div>
            <h1 className="text-xl font-orbitron font-bold text-cyber-cyan tracking-widest uppercase">
              OPERATIVE ACCESS
            </h1>
            <p className="text-[10px] font-mono text-cyber-gray tracking-widest mt-1 uppercase">
              Restricted Forensic Workstation // Level 2 Clearance
            </p>
          </div>

          {/* Security level badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyber-cyan/30 bg-cyber-cyan/5">
              <Fingerprint className="w-3.5 h-3.5 text-cyber-cyan" />
              <span className="text-[9px] font-mono tracking-widest text-cyber-cyan uppercase">eKYC Biometric Required After Login</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Operative Name */}
            <div>
              <label className="block text-[10px] text-cyber-cyan/80 font-mono mb-1 uppercase tracking-wider">Operative Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-cyan/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all font-mono text-xs"
                  placeholder="Full Legal Name" />
              </div>
            </div>

            {/* Operative ID */}
            <div>
              <label className="block text-[10px] text-cyber-cyan/80 font-mono mb-1 uppercase tracking-wider">Operative ID</label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                <input type="text" required value={opId} onChange={e => setOpId(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-cyan/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all font-mono text-xs tracking-widest"
                  placeholder="e.g. operative" />
              </div>
            </div>

            {/* Secure Access Code */}
            <div>
              <label className="block text-[10px] text-cyber-cyan/80 font-mono mb-1 uppercase tracking-wider">Secure Access Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                <input type={showPw ? 'text':'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-cyan/30 rounded-lg py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all font-mono text-xs tracking-widest"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-gray hover:text-cyber-cyan transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-cyber-dark/60 border border-cyber-cyan/15 rounded-lg p-3 flex items-start gap-3">
              <Camera className="w-5 h-5 text-cyber-cyan mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-mono text-cyber-gray leading-relaxed">
                  After credential verification, you will be redirected to a <span className="text-cyber-cyan">live webcam biometric scan</span> requiring facial alignment, blink detection, head rotation, and smile verification.
                </p>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                  className="text-cyber-red text-[10px] font-mono bg-cyber-red/10 border border-cyber-red/30 p-2 rounded">
                  [ ACCESS DENIED ] {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading}
              className="w-full mt-4 bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black py-3 rounded-lg font-orbitron font-bold tracking-widest text-xs transition-all duration-300 hover:shadow-neon-cyan relative overflow-hidden group disabled:opacity-50">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (<><Lock className="w-4 h-4 animate-pulse" /> VERIFYING CREDENTIALS...</>) : 'AUTHENTICATE & PROCEED TO eKYC'}
              </span>
              <div className="absolute inset-0 bg-cyber-cyan w-0 group-hover:w-full transition-all duration-300 ease-out z-0" />
            </button>
          </form>

          <div className="mt-5 text-center border-t border-cyber-cyan/15 pt-4">
            <p className="text-[9px] text-cyber-gray/40 font-mono tracking-wider">
              DEMO: <span className="text-cyber-cyan/60">operative</span> / <span className="text-cyber-cyan/60">operative123</span> or <span className="text-cyber-cyan/60">analyst</span> / <span className="text-cyber-cyan/60">analyst123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OperativeLoginPage;
