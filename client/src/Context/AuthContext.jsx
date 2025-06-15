import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();



  //handle Login 
const login = async (email, password) => {
  try {
    const response = await api.post('/api/v1/auth/user/signin', { email, password });
    const { token, user: userData } = response.data;

    if (!token || !userData) {
      toast.error('Invalid response from server.');
      return { success: false, error: 'Invalid response from server.' };
    }

    const storedUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      firstName: userData.name.split(' ')[0],
      lastName: userData.name.split(' ').slice(1).join(' ')
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(storedUser));
    setUser(storedUser);

    toast.success('Logged in successfully!');
    navigate('/profile');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('AuthContext: Login error:', message);
    toast.error(message);
    return { success: false, error: message };
  }
};


  // habdle registeration
const register = async (firstName, lastName, email, password) => {
  try {
    const response = await api.post('/api/v1/auth/user/signup', {
      firstName,
      lastName,
      email,
      password
    });

    const { token, user: userData } = response.data;

    if (!token || !userData) {
      toast.error('Invalid registration response.');
      return { success: false, error: 'Invalid registration response.' };
    }

    const storedUser = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      name: `${userData.firstName} ${userData.lastName}`
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(storedUser));
    setUser(storedUser);

    toast.success('Registration successful! Welcome to GirlTalk!');
    navigate('/profile');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    console.error('AuthContext: Registration error:', message);
    toast.error(message);
    return { success: false, error: message };
  }
};



  //logout handling
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/v1/auth/user/signout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);