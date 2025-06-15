import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';
import api from '../api/axios';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ description: '', tags: '', location: '', postImage: null });
  const [editingPost, setEditingPost] = useState(null);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/v1/auth/post/recent-post', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.documents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      toast.error(err.response?.data?.message || 'Failed to fetch posts');
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('description', newPost.description);
    formData.append('tags', newPost.tags);
    formData.append('location', newPost.location);
    if (newPost.postImage) formData.append('postImage', newPost.postImage);

    try {
      await api.post('/api/v1/auth/post/create-post', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post created!');
      setNewPost({ description: '', tags: '', location: '', postImage: null });
      fetchPosts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (newPost.description) formData.append('description', newPost.description);
    if (newPost.tags) formData.append('tags', newPost.tags);
    if (newPost.location) formData.append('location', newPost.location);
    if (newPost.postImage) formData.append('postImage', newPost.postImage);

    try {
      await api.put(`/api/v1/auth/post/${editingPost._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post updated!');
      setEditingPost(null);
      setNewPost({ description: '', tags: '', location: '', postImage: null });
      fetchPosts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update post';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/api/v1/auth/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Post deleted!');
      fetchPosts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete post';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleLikePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/api/v1/auth/post/${postId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Post liked/unliked!');
      fetchPosts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to like/unlike post';
      setError(msg);
      toast.error(msg);
    }
  };


  return (
    <div className="home-container">
      {!user ? (
        <div className="login-prompt">
          <p>Please <Link to="/login">log in</Link> to see posts.</p>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="hero-section">
            <div className="sparkles">✨</div>
            <div className="sparkles sparkles-2">💕</div>
            <div className="sparkles sparkles-3">🌸</div>
            <h1 className="home-title">
              Welcome to Your Magical Space 💖
            </h1>
            <p className="home-subtitle">Share your beautiful moments with the world</p>
          </div>

          <div className="container">
            {error && (
              <div className="error-card">
                <span className="error-icon">😔</span>
                <p>{error}</p>
              </div>
            )}

            {user && (
              <div className="create-post-section">
                <div className="section-header">
                  <h2 className="section-title">
                    {editingPost ? '✏️ Edit Your Post' : '✨ Create New Post'}
                  </h2>
                  <div className="decorative-hearts">💕 💖 💕</div>
                </div>
                
                <form className="post-form" onSubmit={editingPost ? handleEditPost : handleCreatePost}>
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📝</span>
                      What's on your mind, beautiful?
                    </label>
                    <textarea
                      className="form-input textarea-girly"
                      value={newPost.description}
                      onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                      placeholder="Share your thoughts, dreams, or daily adventures..."
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">🏷️</span>
                        Tags
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        placeholder="#love, #life, #happy"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">📍</span>
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={newPost.location}
                        onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                        placeholder="Where are you?"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📸</span>
                      Add a beautiful photo
                    </label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        className="file-input"
                        accept="image/*"
                        onChange={(e) => setNewPost({ ...newPost, postImage: e.target.files[0] })}
                        id="postImage"
                      />
                      <label htmlFor="postImage" className="file-input-label">
                        <span className="file-icon">🌸</span>
                        Choose Photo
                      </label>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="btn-primary-girly">
                      {editingPost ? '💖 Update Post' : '✨ Share Post'}
                    </button>
                    {editingPost && (
                      <button 
                        type="button" 
                        className="btn-secondary-girly"
                        onClick={() => setEditingPost(null)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Posts Section */}
            <div className="posts-section">
              <div className="section-header">
                <h2 className="section-title">🌸 Latest Posts</h2>
                <div className="decorative-line"></div>
              </div>

              <div className="posts-grid">
                {posts.map((post) => (
                  <div key={post._id} className="post-card">
                    <div className="post-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          <Link to={`/user/${post.userId._id}`}>
                            {post.userId.profileImage?.secure_url ? (
                              <img
                                src={post.userId.profileImage.secure_url}
                                alt={`${post.userId.firstName}'s Profile`}
                                className="user-avatar"
                              />
                            ) : (
                              <div className="profile-avatar-placeholder">
                                {post.userId.firstName.charAt(0)}
                              </div>
                            )}
                          </Link>
                        </div>
                        <div className="user-details">
                          <h3 className="user-name">
                            {post.userId.firstName} {post.userId.lastName}
                          </h3>
                          <p className="post-location">
                            {post.location ? `📍 ${post.location}` : '🌎 Somewhere magical'}
                          </p>
                        </div>
                      </div>
                      {user?.id === post.userId._id.toString() && (
                        <div className="post-actions-menu">
                          <button
                            className="btn-edit"
                            onClick={() => {
                              setEditingPost(post);
                              setNewPost({
                                description: post.description,
                                tags: post.tags.join(','),
                                location: post.location,
                                postImage: null
                              });
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {post.image?.secure_url && (
                      <div className="post-image-container">
                        <img src={post.image.secure_url} alt="Post" className="post-image" />
                      </div>
                    )}

                    <div className="post-content">
                      <p className="post-description">{post.description}</p>
                      
                      {post.tags.length > 0 && (
                        <div className="post-tags">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="post-footer">
                      <button 
                        className={`like-button ${post.likes.includes(user?.id) ? 'liked' : ''}`}
                        onClick={() => handleLikePost(post._id)}
                      >
                        <span className="like-icon">
                          {post.likes.includes(user?.id) ? '💖' : '🤍'}
                        </span>
                        <span className="like-count">{post.likes.length}</span>
                      </button>
                      
                      <div className="post-stats">
                        <span className="stat-item">💕 {post.likes.length} loves</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating decorations */}
          <div className="floating-hearts">
            <div className="heart heart-1">💕</div>
            <div className="heart heart-2">💖</div>
            <div className="heart heart-3">🌸</div>
            <div className="heart heart-4">✨</div>
            <div className="heart heart-5">💗</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;