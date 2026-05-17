import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError, clearMessage, setOtpEmail } from '../store/slices/authSlice';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';

    if (!form.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (form.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    else if (!/\d/.test(form.password)) newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số';
    else if (!/[a-zA-Z]/.test(form.password)) newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ cái';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';

    if (!form.firstName) newErrors.firstName = 'Tên không được để trống';
    else if (form.firstName.length < 2) newErrors.firstName = 'Tên phải có ít nhất 2 ký tự';

    if (!form.lastName) newErrors.lastName = 'Họ không được để trống';
    else if (form.lastName.length < 2) newErrors.lastName = 'Họ phải có ít nhất 2 ký tự';

    if (form.phoneNumber) {
      const phoneRegex = /^(03|05|07|08|09|\+84)[0-9]{8}$/;
      if (!phoneRegex.test(form.phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;

    const payload = {
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
    };
    if (form.phoneNumber) payload.phoneNumber = form.phoneNumber;
    if (form.gender !== '') payload.gender = form.gender === 'true';

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      dispatch(setOtpEmail(form.email));
      navigate('/verify-otp');
    } else if (result.payload?.errors) {
      const serverErrors = {};
      result.payload.errors.forEach(err => {
        serverErrors[err.field] = err.message;
      });
      setErrors(serverErrors);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Điền thông tin để đăng ký tài khoản E-Learning"
      footerText="Đã có tài khoản?"
      footerLink="/login"
      footerLinkText="Đăng nhập ngay"
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
        {message && <Alert type="success" message={message} onClose={() => dispatch(clearMessage())} />}

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Họ"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Nguyễn"
            error={errors.lastName}
            icon="👤"
            required
          />
          <InputField
            label="Tên"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Văn A"
            error={errors.firstName}
            icon="👤"
            required
          />
        </div>

        <InputField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@example.com"
          error={errors.email}
          icon="📧"
          required
        />

        <InputField
          label="Mật khẩu"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Ít nhất 6 ký tự, gồm chữ và số"
          error={errors.password}
          icon="🔒"
          required
        />

        <InputField
          label="Xác nhận mật khẩu"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Nhập lại mật khẩu"
          error={errors.confirmPassword}
          icon="🔒"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Số điện thoại"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="0901234567"
            icon="📱"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới tính</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">-- Chọn --</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
          </div>
        </div>

        <Button type="submit" loading={loading} className="mt-2">
          Đăng ký
        </Button>
      </form>
    </AuthLayout>
  );
}
