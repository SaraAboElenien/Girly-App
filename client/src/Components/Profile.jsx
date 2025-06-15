import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { toast } from 'react-toastify';


const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', bio: '', profileImage: null });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();


  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/v1/auth/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
      setFormData({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        bio: response.data.user.bio || '',
        profileImage: null
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);



  // Handle profile update
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setError('');
  const data = new FormData();
  data.append('firstName', formData.firstName);
  data.append('lastName', formData.lastName);
  data.append('bio', formData.bio);
  if (formData.profileImage) data.append('profileImage', formData.profileImage);

  try {
    const token = localStorage.getItem('token');
    await api.patch('/api/v1/auth/user/updateProfile', data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    fetchProfile();
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to update profile';
    setError(message);
    toast.error(message);
  }
};


  // Handle logout
const handleLogout = async () => {
  try {
    await logout();
    toast.success('Logged out successfully!');
  } catch (err) {
    setError('Failed to log out');
    toast.error('Failed to log out');
  }
};

  if (!user) {
    return (
      <div className="profile-container">
        <div className="auth-required">
          <div className="auth-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please log in to view your beautiful profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="sparkles profile-sparkle-1">✨</div>
        <div className="sparkles profile-sparkle-2">💖</div>
        <div className="sparkles profile-sparkle-3">🌸</div>
        <h1 className="profile-title">Your Beautiful Profile 👑</h1>
        <p className="profile-subtitle">Shine bright like the star you are</p>
      </div>

      <div className="container">
        {error && (
          <div className="error-card">
            <span className="error-icon">😔</span>
            <p>{error}</p>
          </div>
        )}

        {profile && (
          <div className="profile-main">
            {/* Profile Display Card */}
            <div className="profile-display-card">
              <div className="profile-card-header">
                <div className="profile-decorations">
                  <span>💕</span>
                  <span>🌸</span>
                  <span>💖</span>
                </div>
                <h2 className="profile-card-title">✨ Your Amazing Profile</h2>
              </div>

              <div className="profile-info">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-wrapper">
                    {profile.profileImage?.secure_url ? (
                      <img 
                        src={profile.profileImage.secure_url} 
                        className="profile-avatar-image"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </div>
                    )}
                    <div className="avatar-glow"></div>
                  </div>
                  <div className="profile-crown">👑</div>
                </div>

                <div className="profile-details">
                  <h3 className="profile-name">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="profile-email">
                    <span className="email-icon">📧</span>
                    {profile.email}
                  </p>
                  <div className="profile-bio-section">
                    <label className="bio-label">
                      <span>💝</span> About Me
                    </label>
                    <p className="profile-bio">
                      {profile.bio || "✨ No bio yet - add something magical about yourself! ✨"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className="btn-edit-profile"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? '💖 Cancel Edit' : '✏️ Edit Profile'}
                </button>
                <button className="btn-logout" onClick={handleLogout}>
                  👋 Log Out
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
              <div className="edit-profile-section">
                <div className="edit-section-header">
                  <h2 className="edit-title">🌟 Update Your Profile</h2>
                  <div className="decorative-hearts">💕 💖 💕</div>
                </div>

                <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">👤</span>
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Your beautiful first name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">👤</span>
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Your lovely last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">💝</span>
                      Bio - Tell us about yourself
                    </label>
                    <textarea
                      className="form-input bio-textarea"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Share something magical about yourself... Your dreams, passions, or what makes you smile! ✨"
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📸</span>
                      Profile Picture
                    </label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        className="file-input"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                        id="profileImage"
                      />
                      <label htmlFor="profileImage" className="file-input-label">
                        <span className="file-icon">🌸</span>
                        Choose Beautiful Photo
                      </label>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="btn-save-profile">
                      💖 Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Profile Stats/Fun Section */}
            <div className="profile-fun-section">
              <div className="fun-card">
                <h3 className="fun-title">🌈 Your Journey</h3>
                <div className="fun-stats">
                  <div className="stat-item">
                    <span className="stat-icon">🎉</span>
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">Amazing Day One!</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💎</span>
                    <span className="stat-label">Status</span>
                    <span className="stat-value">Sparkling Star</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🌟</span>
                    <span className="stat-label">Vibe</span>
                    <span className="stat-value">Absolutely Radiant</span>
                  </div>
                </div>
              </div>

              <div className="inspirational-card">
                <h3 className="inspiration-title">💕 Daily Inspiration</h3>
                <p className="inspiration-quote">
                  "You are braver than you believe, stronger than you seem, 
                  and more loved than you imagine." ✨
                </p>
                <div className="inspiration-author">- Your Inner Sparkle</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating decorations */}
      <div className="floating-elements">
        <div className="float-element float-1">🦄</div>
        <div className="float-element float-2">🌸</div>
        <div className="float-element float-3">💖</div>
        <div className="float-element float-4">✨</div>
        <div className="float-element float-5">🌙</div>
        <div className="float-element float-6">⭐</div>
      </div>
    </div>
  );
};

export default Profile;