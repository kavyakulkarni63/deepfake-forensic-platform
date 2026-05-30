import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

const CommonLoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sConfirm, setSConfirm] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['','','','','','']);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    setTimeout(async () => {
      const r = await login(email, password, 'common');
      if (r.success) navigate('/user/dashboard');
      else setError(r.message);
      setLoading(false);
    }, 1200);
  };

  const handleSignup = async (e) => {
    e.preventDefault(); setError('');
    if (sPassword !== sConfirm) { setError('Passwords do not match.'); return; }
    if (sPassword.length < 6) { setError('Min 6 characters.'); return; }
    setLoading(true);
    setTimeout(async () => {
      const r = await signup(sEmail.split('@')[0], sEmail, sPassword, sName, '', 'common');
      if (r.success) { setShowOtp(true); setInfo('Account created! Enter verification code.'); }
      else setError(r.message);
      setLoading(false);
    }, 1500);
  };

  const handleOtpChange = (i, v) => {
    if (v.length > 1) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
  };

  const verifyOtp = () => {
    if (otp.join('').length === 6) {
      setInfo('Email verified! Sign in now.');
      setTimeout(() => { setShowOtp(false); setIsSignup(false); setEmail(sEmail); }, 1500);
    } else setError('Enter all 6 digits.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center relative overflow-hidden font-inter">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'30px 30px' }} />

      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="relative z-10 w-full max-w-md px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Portal
        </Link>

        <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">VFI</span></h1>
            <p className="text-slate-400 text-sm">AI-Powered Deepfake Detection</p>
          </div>

          {!showOtp && (
            <div className="flex bg-slate-800/60 rounded-xl p-1 mb-6 border border-slate-700/30">
              <button onClick={() => { setIsSignup(false); setError(''); setInfo(''); }} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!isSignup ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Sign In</button>
              <button onClick={() => { setIsSignup(true); setError(''); setInfo(''); }} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${isSignup ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>Create Account</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {showOtp ? (
              <motion.div key="otp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center">
                <Mail className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Verify Email</h3>
                <p className="text-slate-400 text-xs mb-5">Code sent to <span className="text-blue-400">{sEmail}</span></p>
                <div className="flex justify-center gap-2.5 mb-5">
                  {otp.map((d,i) => (
                    <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-mono bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-all" />
                  ))}
                </div>
                <button onClick={verifyOtp} className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Verify</button>
                <p className="text-slate-600 text-[9px] mt-3 italic">Demo: enter any 6 digits</p>
              </motion.div>
            ) : !isSignup ? (
              <motion.form key="login" initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} exit={{opacity:0,x:15}} onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email or Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-400 transition-all placeholder-slate-500" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type={showPw?'text':'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-blue-400 transition-all placeholder-slate-500" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer"><input type="checkbox" className="rounded border-slate-600 bg-slate-800" /> Remember me</label>
                  <button type="button" className="text-blue-400 hover:underline">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="relative my-3"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50" /></div><div className="relative flex justify-center text-xs"><span className="bg-slate-900/70 px-3 text-slate-500">or</span></div></div>
                <button type="button" className="w-full py-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-sm text-slate-300 hover:bg-slate-700/40 transition-all flex items-center justify-center gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Sign in with Google
                </button>
              </motion.form>
            ) : (
              <motion.form key="signup" initial={{opacity:0,x:15}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-15}} onSubmit={handleSignup} className="space-y-3.5">
                <div><label className="block text-xs text-slate-400 mb-1.5">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" required value={sName} onChange={e=>setSName(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-400 transition-all placeholder-slate-500" placeholder="John Doe" /></div></div>
                <div><label className="block text-xs text-slate-400 mb-1.5">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="email" required value={sEmail} onChange={e=>setSEmail(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-400 transition-all placeholder-slate-500" placeholder="you@example.com" /></div></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-slate-400 mb-1.5">Password</label><input type="password" required value={sPassword} onChange={e=>setSPassword(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-blue-400 transition-all placeholder-slate-500" placeholder="Min 6 chars" /></div>
                  <div><label className="block text-xs text-slate-400 mb-1.5">Confirm</label><input type="password" required value={sConfirm} onChange={e=>setSConfirm(e.target.value)} className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-blue-400 transition-all placeholder-slate-500" placeholder="Confirm" /></div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 mt-1">{loading ? 'Creating...' : 'Create Account'}</button>
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="mt-4 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</motion.div>}
            {info && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="mt-4 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" />{info}</motion.div>}
          </AnimatePresence>

          <div className="mt-5 text-center border-t border-slate-700/30 pt-4">
            <p className="text-[10px] text-slate-500">Demo: <span className="text-blue-400">demo</span> / <span className="text-blue-400">demo123</span> or <span className="text-blue-400">user</span> / <span className="text-blue-400">user123</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommonLoginPage;
