import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    setMessage('');
    
    
    try {
      const result = await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      
      
      if (result.success) {
        setMessage(result.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">✿ Join GirlTalk</h2>
          <p className="auth-subtitle">Create your account and connect with amazing friends!</p>
        </div>
        
        <div className="auth-form">
          <div className="row mb-3">
            <div className="col-6 pe-2">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
            </div>
            <div className="col-6 ps-2">
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>
          </div>
          
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
          
          <div className="form-group mb-3">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`form-control  ${errors.confirmPassword ? 'is-invalid' : ''}`}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          {errors.submit && <div className="error-message text-center mb-3">{errors.submit}</div>}
          {message && <div className="success-message text-center mb-3">{message}</div>}
          
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-auth">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Already have an account? 
            <button onClick={onSwitchToLogin} className="btn-link ">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;