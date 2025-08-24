// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/toast/customToast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/user-info', {
        withCredentials: true,
      });
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("FetchUser Error:", error); // Debug log
      setUser(null);
      // Only show toast for specific cases, avoid spamming on every refresh
      if (error.response?.status === 401 && error.response?.data?.message !== "No token provided") {
        showToast('error', error.response?.data?.message || 'Session expired');
      }
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);
  const login = async (credentials) => {
    const { email, phone, password } = credentials;
    const errors = {};

    if (!email && !phone) errors.identifier = 'Email or phone is required';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => showToast('error', msg));
      throw new Error('Validation failed');
    }

    try {
      const response = await axiosInstance.post(
        '/auth/login',
        { email, phone, password },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setUser(response.data.user);
        const role = response.data.user.role;
        showToast('success', `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`);
        navigate(`/${role}_dashboard`, { replace: true });
      } else {
        showToast('error', response.data?.message || 'Invalid credentials');
        throw new Error(response.data?.message || 'Invalid credentials');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message;
      if (error.response?.status === 401 && errMsg?.includes('verify your email')) {
        showToast('info', errMsg);
        navigate('/verify-email', { state: { email: error.response?.data?.email } });
      } else {
        showToast('error', errMsg || 'Login failed');
      }
      throw error;
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/auth/user-info', {
        withCredentials: true,
      });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      setUser(null);
      throw new Error(error.response?.data?.message || 'Failed to fetch user info');
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
      showToast('success', 'Logged out successfully');
      navigate('/');
    } catch (error) {
      showToast('error', 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, getUserInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};