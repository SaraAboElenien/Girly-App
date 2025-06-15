import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Profile.css';
import { toast } from 'react-toastify';


const UserProfile = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');


 // Fetch user data by ID   
const fetchUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/v1/auth/user/userByID/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUserData(response.data);
    toast.success('User profile loaded successfully!');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to fetch user';
    setError(message);
    toast.error(message);
  }
};


 // Fetch user posts
const fetchUserPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/v1/auth/post/user-post/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(response.data.posts);
    toast.success('User posts loaded!');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to fetch user posts';
    setError(message);
    toast.error(message);
  }
};


// Handle like/unlike post
const handleLikePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    await api.put(`/api/v1/auth/post/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUserPosts();
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to like/unlike post';
    setError(message);
    toast.error(message);
  }
};
    
    useEffect(() => {
        fetchUser();
        fetchUserPosts();
    }, [userId]);




    if (error) {
        return (
            <div className="profile-container">
                <div className="error-card">
                    <span className="error-icon">😔</span>
                    <p>{error}</p>
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
                <h1 className="profile-title">User Profile 👑</h1>
                <p className="profile-subtitle">Discover their sparkling journey</p>
            </div>

            <div className="container">
                {userData && (
                    <div className="profile-main">
                        {/* Profile Display Card */}
                        <div className="profile-display-card">
                            <div className="profile-card-header">
                                <div className="profile-decorations">
                                    <span>💕</span>
                                    <span>🌸</span>
                                    <span>💖</span>
                                </div>
                                <h2 className="profile-card-title">✨ About {userData.firstName}</h2>
                            </div>

                            <div className="profile-info">
                                <div className="profile-avatar-section">
                                    <div className="profile-avatar-wrapper">
                                        {userData.profileImage?.secure_url ? (
                                            <img
                                                src={userData.profileImage.secure_url}
                                                alt="Profile"
                                                className="profile-avatar-image"
                                            />
                                        ) : (
                                            <div className="profile-avatar-placeholder">
                                                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                                            </div>
                                        )}
                                        <div className="avatar-glow"></div>
                                    </div>
                                    <div className="profile-crown">👑</div>
                                </div>

                                <div className="profile-details">
                                    <h3 className="profile-name">
                                        {userData.firstName} {userData.lastName}
                                    </h3>
                                    <p className="profile-email">
                                        <span className="email-icon">📧</span>
                                        {userData.email}
                                    </p>
                                    <div className="profile-bio-section">
                                        <label className="bio-label">
                                            <span>💝</span> About Me
                                        </label>
                                        <p className="profile-bio">
                                            {userData.bio || "✨ No bio yet - a mysterious soul! ✨"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Posts */}
                        <div className="profile-display-card">
                            <div className="profile-card-header">
                                <div className="profile-decorations">
                                    <span>📸</span>
                                    <span>✨</span>
                                    <span>💫</span>
                                </div>
                                <h2 className="profile-card-title">🌟 {userData.firstName}'s Posts</h2>
                            </div>
                            {posts.length === 0 ? (
                                <p>No posts found for this user.</p>
                            ) : (
                                posts.map((post) => (
                                    <div key={post._id} className="profile-post">
                                        <p>{post.description}</p>
                                        {post.image?.secure_url && (
                                            <img src={post.image.secure_url} alt="Post" className="profile-post-image" />
                                        )}
                                        {post.tags.length > 0 && (
                                            <div className="post-tags">
                                                {post.tags.map((tag, index) => (
                                                    <span key={index} className="tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="post-location">
                                            {post.location ? `📍 ${post.location}` : '🌎 Somewhere magical'}
                                        </p>
                                        {user && (
                                            <button
                                                className="btn-like-post"
                                                onClick={() => handleLikePost(post._id)}
                                            >
                                                {post.likes.includes(user?.id) ? 'Unlike 💔' : 'Like 💖'}
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}

                        </div>

                        {/* Profile Stats/Fun Section */}
                        <div className="profile-fun-section">
                            <div className="fun-card">
                                <h3 className="fun-title">🌈 Their Journey</h3>
                                <div className="fun-stats">
                                    <div className="stat-item">
                                        <span className="stat-icon">🎉</span>
                                        <span className="stat-label">Member Since</span>
                                        <span className="stat-value">
                                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Amazing Day One!'}
                                        </span>
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
                                <div className="inspiration-author">- Their Inner Sparkle</div>
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

export default UserProfile;