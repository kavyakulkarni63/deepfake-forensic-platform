import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MatrixRain from '../components/ui/MatrixRain';
import { Lock, Mail, Eye, EyeOff, Sparkles, User, Database, Award, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup States
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [idDocName, setIdDocName] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const { login, signupAndAutoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsAuthenticating(true);

    // Simulate system ingestion delay
    setTimeout(async () => {
      // Pass 'common' as role since backend automatically checks and corrects the role
      const result = await login(email, password, 'common');
      if (result.success) {
        // Clear any previous biometric session verification
        sessionStorage.removeItem('biometrics_verified');

        if (result.role === 'operative') {
          navigate('/operative/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        setError(result.message);
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsAuthenticating(true);

    if (signupPassword.length < 3) {
      setError('Password must be at least 3 characters.');
      setIsAuthenticating(false);
      return;
    }

    setTimeout(async () => {
      // Use signupAndAutoLogin so the user gets a session immediately
      const result = await signupAndAutoLogin(
        signupEmail.split('@')[0],
        signupEmail,
        signupPassword,
        signupName,
        'Public Forensic Labs',
        'common'
      );

      if (result.success) {
        if (result.autoLoginFailed) {
          // Registration worked but auto-login failed — show message
          setInfo('Identity registered. Please login to proceed to biometric enrollment.');
          setIsSignup(false);
          setEmail(signupEmail);
          setIsAuthenticating(false);
        } else {
          // Full success — go straight to enrollment screen
          navigate('/enroll', { state: { freshSignup: true } });
        }
      } else {
        setError(result.message);
        setIsAuthenticating(false);
      }
    }, 2000);
  };

  const handleGoogleLogin = () => {
    setError('');
    setInfo('[UPLINK VIA GOOGLE IDENTITY SERVICE] Authenticating Google Token...');
    setIsAuthenticating(true);
    setTimeout(() => {
      // Mock Google Login as prajwalsaski@gmail.com
      setEmail('prajwalsaski@gmail.com');
      setPassword('123');
      setIsAuthenticating(false);
      setInfo('[UPLINK ACTIVE] Click "INITIATE UPLINK" to proceed.');
    }, 1200);
  };

  const handleForgotPasscode = () => {
    setInfo('Security protocol engaged. System access recovery token transmitted to registered mail.');
  };

  const handleIdDocSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdDocName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-gray flex items-center justify-center relative overflow-hidden font-inter">
      <MatrixRain />

      {/* Scan line overlay */}
      <div className="absolute inset-0 bg-cyber-grid bg-[length:30px_30px] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(transparent_0%,rgba(0,170,255,0.1)_50%,transparent_100%)] before:h-[5px] before:w-full before:animate-scan"></div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="z-10 w-full max-w-lg px-4"
      >
        <div className="bg-cyber-navy/80 backdrop-blur-xl border border-cyber-cyan/30 rounded-2xl p-6 md:p-8 shadow-neon-blue relative overflow-hidden">

          {/* Cyber bracket decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan opacity-50 m-4"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan opacity-50 m-4"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan opacity-50 m-4"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan opacity-50 m-4"></div>

          {/* Core platform badge */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 relative"
            >
              <div className="absolute inset-0 border-2 border-dashed border-cyber-cyan rounded-full"></div>
              <div className="absolute inset-2 border border-cyber-purple rounded-full animate-pulse"></div>
              <Sparkles className="absolute inset-0 m-auto text-cyber-cyan w-6 h-6" />
            </motion.div>

            <h1 className="text-xl md:text-2xl font-orbitron font-bold text-cyber-cyan tracking-widest uppercase text-shadow">
              VFI // SECURITY PORTAL
            </h1>
            <p className="text-[10px] tracking-widest mt-1.5 uppercase font-mono text-cyber-gray">
              AI Cyber Forensic Intelligence Platform
            </p>
          </div>

          {/* Mode Selector Tabs (Login / Register) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-cyber-dark/60 rounded-lg border border-white/5 mb-6">
            <button
              onClick={() => { setIsSignup(false); setError(''); setInfo(''); }}
              className={`py-2 text-xs font-mono font-bold tracking-widest uppercase rounded transition-all ${!isSignup
                ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                : 'text-cyber-gray hover:text-white'
                }`}
            >
              Secure Login
            </button>
            <button
              onClick={() => { setIsSignup(true); setError(''); setInfo(''); }}
              className={`py-2 text-xs font-mono font-bold tracking-widest uppercase rounded transition-all ${isSignup
                ? 'bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30'
                : 'text-cyber-gray hover:text-white'
                }`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isSignup ? (
              // ──────────────────────────────────────────────────────────
              // LOGIN FORM
              // ──────────────────────────────────────────────────────────
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] text-cyber-cyan/85 font-mono mb-1 uppercase tracking-wider">
                    Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-cyan/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all font-mono text-xs"
                      placeholder="operator@vfi-portal.org"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-cyber-cyan/85 font-mono mb-1 uppercase tracking-wider">
                    Access Cryptokey Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-cyan/30 rounded-lg py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all font-mono text-xs tracking-widest"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-gray hover:text-cyber-cyan transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  {/* Standard Sign in */}
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black py-2.5 rounded-lg font-orbitron font-bold tracking-widest text-xs transition-all duration-300 hover:shadow-neon-cyan relative overflow-hidden group disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      {isAuthenticating ? 'ESTABLISHING SECURE UPLINK...' : 'INITIATE UPLINK'}
                    </span>
                    <div className="absolute inset-0 bg-cyber-cyan w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
                  </button>

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {/* Google Login button */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="bg-cyber-purple/10 border border-cyber-purple/40 text-cyber-purple hover:bg-cyber-purple hover:text-white py-2 rounded-lg font-orbitron font-bold tracking-widest text-[9px] transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.5 5.5 0 0 1 8.5 13a5.5 5.5 0 0 1 5.49-5.518c1.378 0 2.635.53 3.59 1.39l3.053-3.053C18.796 3.916 16.326 3 13.99 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.76 0 8.5-3.374 8.5-8.5 0-.585-.05-1.154-.15-1.715H12.24Z" />
                      </svg>
                      GOOGLE SIGN-IN
                    </button>

                    {/* Forgot password */}
                    <button
                      type="button"
                      onClick={handleForgotPasscode}
                      className="bg-transparent border border-white/5 hover:border-white/10 hover:bg-white/5 text-cyber-gray hover:text-white py-2 rounded-lg font-mono text-[9px] tracking-wider transition-all uppercase"
                    >
                      FORGOT PASSCODE?
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              // ──────────────────────────────────────────────────────────
              // SIGNUP FORM
              // ──────────────────────────────────────────────────────────
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] text-cyber-purple/90 font-mono mb-1 uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-purple/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_10px_rgba(124,58,237,0.2)] transition-all font-mono text-xs"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-cyber-purple/90 font-mono mb-1 uppercase tracking-wider">
                    Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-purple/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_10px_rgba(124,58,237,0.2)] transition-all font-mono text-xs"
                      placeholder="agent@vfi.gov"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-cyber-purple/90 font-mono mb-1 uppercase tracking-wider">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-gray" />
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-cyber-dark border border-cyber-purple/30 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_10px_rgba(124,58,237,0.2)] transition-all font-mono text-xs tracking-widest"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full mt-3 bg-transparent border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white py-2.5 rounded-lg font-orbitron font-bold tracking-widest text-xs transition-all duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] relative overflow-hidden group disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isAuthenticating ? 'INGESTING SECURE REGISTRATION...' : 'REGISTER PROFILE'}
                  </span>
                  <div className="absolute inset-0 bg-cyber-purple w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Dynamic feedback messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-cyber-red text-[10px] font-mono bg-cyber-red/10 border border-cyber-red/30 p-2 rounded"
              >
                [ ACCESS DENIED ] {error}
              </motion.div>
            )}
            {info && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-cyber-cyan text-[10px] font-mono bg-cyber-cyan/10 border border-cyber-cyan/30 p-2 rounded flex items-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{info}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* hint */}
          <div className="mt-6 text-center border-t border-cyber-cyan/15 pt-4">
            <p className="text-[9px] text-cyber-gray/40 font-mono tracking-wider">
              SYSTEM OPERATIONAL // AUTOMATIC IDENTITY ASSIGNMENT ACTIVE
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
