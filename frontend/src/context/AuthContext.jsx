import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const username = sessionStorage.getItem('username');
    const name = sessionStorage.getItem('name');
    const enrolled = sessionStorage.getItem('biometrics_enrolled') === 'true';

    if (token && role && username) {
      setUser({ token, role, username, name: name || username, biometrics_enrolled: enrolled });
    }
    setLoading(false);
  }, []);

  const getUserStatus = async (username) => {
    try {
      const response = await api.get(`/api/auth/status/${username}`);
      return response.data;
    } catch {
      return { exists: false, enrolled: false };
    }
  };

  // Standard password login — works for all 3 tiers
  const login = async (username, password, role) => {
    try {
      const response = await api.post('/api/auth/login', { username, password, role });
      if (response.data.success) {
        const { token, role: userRole, username: uname } = response.data;
        const status = await getUserStatus(uname);

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', userRole);
        sessionStorage.setItem('username', uname);
        sessionStorage.setItem('name', status.name || uname);
        sessionStorage.setItem('biometrics_enrolled', status.enrolled ? 'true' : 'false');

        const u = { token, role: userRole, username: uname, name: status.name || uname, biometrics_enrolled: status.enrolled };
        setUser(u);
        return { success: true, enrolled: status.enrolled, role: userRole };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Authentication failed' };
    }
  };

  // Common-user signup (email/password)
  const signup = async (username, email, password, name, organization, role) => {
    try {
      const response = await api.post('/api/auth/signup', { username, email, password, name, organization, role });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Registration failed' };
    }
  };

  // Signup then immediately log in — used so /enroll page has a valid session
  const signupAndAutoLogin = async (username, email, password, name, organization, role) => {
    try {
      // Step 1: Register
      const regResp = await api.post('/api/auth/signup', { username, email, password, name, organization, role });
      if (!regResp.data.success) {
        return { success: false, message: regResp.data.message || 'Registration failed' };
      }

      // Step 2: Auto-login using the same email/password
      const loginResp = await api.post('/api/auth/login', { username: email, password, role: 'common' });
      if (loginResp.data.success) {
        const { token, role: userRole, username: uname } = loginResp.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', userRole);
        sessionStorage.setItem('username', uname);
        sessionStorage.setItem('name', name || uname);
        sessionStorage.setItem('biometrics_enrolled', 'false'); // always false on first signup
        const u = { token, role: userRole, username: uname, name: name || uname, biometrics_enrolled: false };
        setUser(u);
        return { success: true, role: userRole, enrolled: false };
      }
      // Fallback: registration worked, login by username
      const loginResp2 = await api.post('/api/auth/login', { username, password, role: 'common' });
      if (loginResp2.data.success) {
        const { token, role: userRole, username: uname } = loginResp2.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', userRole);
        sessionStorage.setItem('username', uname);
        sessionStorage.setItem('name', name || uname);
        sessionStorage.setItem('biometrics_enrolled', 'false');
        const u = { token, role: userRole, username: uname, name: name || uname, biometrics_enrolled: false };
        setUser(u);
        return { success: true, role: userRole, enrolled: false };
      }
      // Reg succeeded but auto-login failed — tell caller to manually log in
      return { success: true, enrolled: false, autoLoginFailed: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Registration failed' };
    }
  };

  // Biometric enrollment
  const enrollBiometrics = async (username, facialData, livenessScore) => {
    try {
      const response = await api.post('/api/auth/enroll-biometrics', {
        username, facial_data: facialData, liveness_score: livenessScore
      });
      if (response.data.success) {
        sessionStorage.setItem('biometrics_enrolled', 'true');
        setUser(prev => prev ? { ...prev, biometrics_enrolled: true } : null);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Biometric enrollment failed' };
    }
  };

  // Biometric login
  const biometricLogin = async (username) => {
    try {
      const response = await api.post('/api/auth/biometric-login', { username });
      if (response.data.success) {
        const { token, role: userRole, username: uname } = response.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', userRole);
        sessionStorage.setItem('username', uname);
        sessionStorage.setItem('biometrics_enrolled', 'true');
        setUser({ token, role: userRole, username: uname, name: uname, biometrics_enrolled: true });
        return { success: true, role: userRole };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Biometric authentication rejected' };
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  // Role-based home path helper
  const getHomePath = (role) => {
    if (role === 'commander') return '/commander/dashboard';
    if (role === 'operative') return '/operative/dashboard';
    return '/user/dashboard';
  };

  return (
    <AuthContext.Provider value={{
      user, login, signup, signupAndAutoLogin, enrollBiometrics, biometricLogin, getUserStatus, logout, loading, getHomePath
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
