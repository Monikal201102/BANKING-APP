import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    if (token) {
      axios
        .get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken('');
          localStorage.removeItem('authToken');
        });
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const token = res.data.token;
      setToken(token);
      localStorage.setItem('authToken', token);

      const userInfo = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userInfo.data);
    } catch (err) {
      throw err; // ✅ Allow Register/Login page to catch and handle it
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password, confirmPassword });
      const token = res.data.token;
      setToken(token);
      localStorage.setItem('authToken', token);

      const userInfo = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userInfo.data);
    } catch (err) {
      throw err; // ✅ Prevent redirect to dashboard on failure
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('authToken');
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout, register, token }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
