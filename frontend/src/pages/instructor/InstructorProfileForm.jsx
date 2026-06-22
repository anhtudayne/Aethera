import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import useAuth from '../../hooks/useAuth';
import './InstructorProfileForm.css';

const InstructorProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        image: user.image || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await userApi.updateProfile(formData);
      if (response && response.data) {
        setMessage('Profile updated successfully!');
        // Tùy chọn: update context if necessary
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      setLoading(true);
      setMessage('Uploading image...');
      // Since we don't have an explicit uploadApi yet, we can use axiosClient or fetch
      // But it's better to add the uploadAvatar method to userApi or use fetch directly.
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setFormData(prev => ({ ...prev, image: data.imageUrl }));
        setMessage('Image uploaded successfully! Please save profile to apply changes.');
      } else {
        setMessage(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload error', err);
      setMessage('Error uploading image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instructor-profile-form-container">
      <h2>Edit Instructor Profile</h2>
      {message && (
        <div className={`instructor-profile-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="instructor-profile-form">
        <div className="instructor-form-row">
          <div className="instructor-form-group">
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="instructor-form-group">
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="instructor-form-group">
          <label htmlFor="image">Avatar URL</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              id="image" 
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              placeholder="https://example.com/avatar.jpg"
              style={{ flex: 1 }}
            />
            <label className="instructor-submit-btn" style={{ cursor: 'pointer', textAlign: 'center', margin: 0, padding: '12px 24px' }}>
              Upload Image
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
            </label>
          </div>
        </div>

        <div className="instructor-form-group">
          <label htmlFor="bio">Instructor Biography</label>
          <textarea 
            id="bio" 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            rows="6"
            placeholder="Tell your students about your experience..."
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="instructor-submit-btn">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default InstructorProfileForm;
