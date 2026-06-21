import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';
import './ProfileSettingsPage.css';

const ProfileSettingsPage = () => {
  const { user, updateUser } = useContext(AuthContext);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
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
          setFullName(profile.fullName || profile.name || '');
          setPhone(profile.phone || '');
        }
      } catch {
        // Use local data
        setFullName(user?.fullName || user?.name || '');
        setPhone(user?.phone || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    if (!fullName.trim()) {
      setProfileError('Vui lòng nhập họ tên.');
      return;
    }
    try {
      setProfileLoading(true);
      await userApi.updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
      updateUser({ fullName: fullName.trim(), phone: phone.trim() });
      setProfileSuccess('Cập nhật hồ sơ thành công!');
    } catch (err) {
      setProfileError(err?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng điền đầy đủ các trường.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      setPasswordLoading(true);
      await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = () => {
    const name = fullName || user?.fullName || user?.name || '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="settings-page">
      <h2>Cài đặt hồ sơ ⚙️</h2>

      {/* Profile Section */}
      <div className="settings-section">
        <h3>Thông tin cá nhân</h3>

        <div className="profile-header">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" />
            ) : (
              getInitials()
            )}
          </div>
          <div className="profile-header-info">
            <h4>{fullName || 'Học viên'}</h4>
            <p>{user?.email || 'email@example.com'} (không thể thay đổi)</p>
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
            <label>Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <button type="submit" className="settings-save-btn" disabled={profileLoading}>
            {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="settings-section">
        <h3>Đổi mật khẩu</h3>

        {passwordSuccess && <div className="settings-success">{passwordSuccess}</div>}
        {passwordError && <div className="settings-error">{passwordError}</div>}

        <form className="settings-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <button type="submit" className="settings-save-btn" disabled={passwordLoading}>
            {passwordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
