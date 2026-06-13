import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.data?.success) {
          setUser(res.data.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth expiration events from API interceptor
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (res.data?.success) {
        const { accessToken, refreshToken, user: userData } = res.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setToken(accessToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.register(name, email, password);
      if (res.data?.success) {
        const { accessToken, refreshToken, user: userData } = res.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setToken(accessToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    try {
      const res = await authAPI.updateProfile({ name, email });
      if (res.data?.success) {
        setUser((prev) => ({
          ...prev,
          name: res.data.data.user.name,
          email: res.data.data.user.email,
        }));
        return { success: true };
      }
      return { success: false, message: 'Profile update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      return { success: res.data?.success };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Password change failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
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
