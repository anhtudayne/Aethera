import { useState, useEffect, useContext, useRef } from 'react';
import { Camera } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';
import './ProfileSettingsPage.css';

const ProfileSettingsPage = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        const profile = res.user || res.data;
        if (profile) {
          setFullName(profile.fullName || profile.name || `${profile.lastName || ''} ${profile.firstName || ''}`.trim());
          setPhone(profile.phone || profile.phoneNumber || '');
        }
      } catch {
        // Use local data
        setFullName(user?.fullName || user?.name || `${user?.lastName || ''} ${user?.firstName || ''}`.trim() || '');
        setPhone(user?.phone || user?.phoneNumber || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    if (!fullName.trim()) {
      setProfileError('Please enter your full name.');
      return;
    }
    try {
      setProfileLoading(true);
      let imageUrl = user.image || user.avatarUrl || user.avatar;
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const uploadRes = await userApi.uploadAvatar(formData);
        imageUrl = uploadRes.imageUrl;
      }

      // Split fullName into lastName and firstName
      const nameParts = fullName.trim().split(' ');
      let firstName = nameParts.pop() || '';
      let lastName = nameParts.join(' ') || '';

      await userApi.updateProfile({ 
        firstName, 
        lastName, 
        phoneNumber: phone.trim(), 
        image: imageUrl 
      });
      updateUser({ 
        firstName, 
        lastName,
        fullName: fullName.trim(), 
        phone: phone.trim(), 
        phoneNumber: phone.trim(),
        image: imageUrl 
      });
      setProfileSuccess('Profile updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      setProfileError(err?.message || 'Update failed. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all fields completely.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('The new password must have at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Confirmation password does not match.');
      return;
    }
    try {
      setPasswordLoading(true);
      await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err?.message || 'Password change failed. Please check your current password again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = () => {
    const name = fullName || user?.fullName || user?.name || '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayAvatar = user?.image || user?.avatarUrl || user?.avatar;

  return (
    <div className="settings-page">
      <h2>Profile Settings ⚙️</h2>

      {/* Profile Section */}
      <div className="settings-section">
        <h3>Personal Information</h3>

        <div className="profile-header">
          <div className="profile-avatar" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative' }}>
            {avatarPreview || displayAvatar ? (
              <img src={avatarPreview || displayAvatar} alt="Avatar" />
            ) : (
              getInitials()
            )}
            <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
              <Camera size={24} color="white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
          </div>
          <div className="profile-header-info">
            <h4>{fullName || 'Student'}</h4>
            <p>{user?.email || 'email@example.com'} (cannot be changed)</p>
          </div>
        </div>

        {profileSuccess && <div className="settings-success">{profileSuccess}</div>}
        {profileError && <div className="settings-error">{profileError}</div>}

        <form className="settings-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <button type="submit" className="settings-save-btn" disabled={profileLoading}>
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="settings-section">
        <h3>Change Password</h3>

        {passwordSuccess && <div className="settings-success">{passwordSuccess}</div>}
        {passwordError && <div className="settings-error">{passwordError}</div>}

        <form className="settings-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (at least 6 characters)"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" className="settings-save-btn" disabled={passwordLoading}>
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
