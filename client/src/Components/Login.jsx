import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';


const LoginPage = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setErrors({ submit: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">✿ Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your journey with GirlTalk!</p>
        </div>
        
        <div className="auth-form">
          <div className="form-group mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          {errors.submit && <div className="error-message text-center mb-3">{errors.submit}</div>}
          
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-auth">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Don't have an account? 
            <button onClick={onSwitchToRegister} className="btn-link">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;