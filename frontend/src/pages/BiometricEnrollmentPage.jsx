import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BiometricEnrollment from '../components/BiometricEnrollment';

/**
 * BiometricEnrollmentPage
 * ────────────────────────
 * Displayed immediately after first-time signup (and for returning
 * users whose biometrics_enrolled flag is still false).
 *
 * After the BiometricEnrollment component calls onComplete():
 *   • public  users → /user/dashboard
 *   • operative users → /operative/dashboard  (they'll hit the session-eKYC gate there)
 *
 * The page itself carries no styling of its own — BiometricEnrollment
 * already occupies 100% of the viewport with the full cinematic UI.
 */
const BiometricEnrollmentPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFreshSignup = location.state?.freshSignup === true;

  // Safety: if somehow an already-enrolled user lands here, redirect away
  useEffect(() => {
    if (user && user.biometrics_enrolled) {
      const dest = user.role === 'operative' ? '/operative/dashboard' : '/user/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  const handleEnrollmentComplete = () => {
    if (!user) {
      navigate('/', { replace: true });
      return;
    }
    const dest = user.role === 'operative' ? '/operative/dashboard' : '/user/dashboard';
    navigate(dest, { replace: true });
  };

  if (!user) {
    // Not logged in — redirect to login
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyber-cyan font-mono text-xs tracking-widest uppercase animate-pulse">
            REDIRECTING TO SECURITY PORTAL...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <BiometricEnrollment
      username={user.username}
      onComplete={handleEnrollmentComplete}
      isFreshEnrollment={true}
    />
  );
};

export default BiometricEnrollmentPage;
