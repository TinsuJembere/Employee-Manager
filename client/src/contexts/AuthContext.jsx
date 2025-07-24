import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Use relative path for API requests (handled by Vite proxy in development)
  const API_BASE_URL = '/api';

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`https://employee-manager-dtxf.onrender.com/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // No automatic redirection - let the routes handle protection

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`https://employee-manager-dtxf.onrender.com/api/auth/login`, { email, password }, {
        withCredentials: true // Important for sending/receiving cookies
      });

      const { user: userData, token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      
      setUser(userData);
      toast.success('Login successful!');
      
      // Navigate to the dashboard or the originally requested page
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`https://employee-manager-dtxf.onrender.com/api/auth/register`, userData, {
        withCredentials: true // Important for sending/receiving cookies
      });
      
      const { user: newUser, token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      
      setUser(newUser);
      toast.success('Registration successful! Welcome to Employee Manager.');
      
      // Redirect to home page after successful registration
      navigate('/', { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Optional: await axios.post(`https://employee-manager-dtxf.onrender.com/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login', { replace: true });
      toast.info('You have been logged out.');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
