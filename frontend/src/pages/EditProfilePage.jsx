import React, { useState, useEffect, useRef } from 'react';
import ManagementLayout from '../components/layout/ManagementLayout';
import Toast from '../components/ui/Toast';
import { getProfileByRole, updateProfileByRole, uploadAvatar } from '../services/userService';

const EditProfilePage = () => {
    // Basic state setup
    const fileInputRef = useRef(null);
    const [userRole, setUserRole] = useState('user');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        gender: 'male',
        avatarUrl: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        // Assume user info is stored in localStorage after login
        const storedUserStr = localStorage.getItem('user');
        let role = 'user';
        if (storedUserStr) {
            try {
                const storedUser = JSON.parse(storedUserStr);
                role = storedUser.role || 'user';
                setUserRole(role);
            } catch (e) {
                console.error("Error parsing user from localStorage");
            }
        }

        fetchUserProfile(role);
    }, []);

    const fetchUserProfile = async (role) => {
        setIsFetching(true);
        try {
            const response = await getProfileByRole(role);
            const userData = response.data.user || response.data;

            // Map API response to form data
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phoneNumber || userData.phone || '',
                address: userData.address || '',
                gender: userData.gender === true || userData.gender === 1 ? 'male' : 'female',
                avatarUrl: userData.image || userData.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKpzZNaITytRFyq1U1RoCLoxYekbNpl3Vsk7g9Z2sRFOFcJ98xaaDBTB64JW4mAs0RLLfEQc68WhjYbpjT0ZtVYq75aQ9_dOGqwsIt_BqUXw9lOOUVokgvVJ-eWJutsrjfjhjOOGox4qTbYbHjJyTZEIZ00HIxJ_21wHhLlRyfbmWZctVz_fL_JXUxhX_THS74cjDy9CefBz3GgpAyx3EyXaduBci-8a7HnNKQhH5OKxRKEpWOAf2nk5GC_3OEhDHwtTAdiiEFTA'
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            showToast('error', 'Lỗi', 'Không thể tải thông tin người dùng.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            showToast('error', 'Lỗi', 'Dung lượng file không được vượt quá 2MB');
            return;
        }

        const formDataFile = new FormData();
        formDataFile.append('avatar', file);

        setIsLoading(true);
        try {
            const res = await uploadAvatar(formDataFile);
            const imageUrl = res.data.imageUrl;
            setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
            
            // Cập nhật localStorage ngay lập tức để đồng bộ Sidebar/Header
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                localStorage.setItem('user', JSON.stringify({ ...storedUser, image: imageUrl }));
                window.dispatchEvent(new Event('storage'));
            }

            showToast('success', 'Thành công', 'Tải ảnh lên thành công!');
        } catch (error) {
            console.error("Upload error", error);
            showToast('error', 'Lỗi', error.response?.data?.message || 'Không thể tải ảnh lên');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (type, title, message) => {
        setToast({ show: true, type, title, message });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Vui lòng nhập họ';
        if (!formData.lastName.trim()) newErrors.lastName = 'Vui lòng nhập tên';

        // Basic phone validation for Vietnam format
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Lọc ra các data cần update
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phone,
                address: formData.address,
                gender: formData.gender === 'male' ? true : false,
                image: formData.avatarUrl
            };

            await updateProfileByRole(userRole, updateData);

            showToast('success', 'Thành công', 'Cập nhật hồ sơ thành công!');

            // Optionally update localStorage if needed
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updateData }));
                window.dispatchEvent(new Event('storage'));
            }

        } catch (error) {
            console.error("Update failed", error);
            const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.';
            showToast('error', 'Lỗi cập nhật', msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <ManagementLayout role={userRole}>
                <div className="flex justify-center items-center h-64">
                    <div className="spinner !border-t-primary !border-primary/30 w-8 h-8"></div>
                </div>
            </ManagementLayout>
        );
    }

    return (
        <ManagementLayout role={userRole}>
            <div className="mb-8">
                <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Edit Profile</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Manage your personal information and contact details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Avatar Section */}
                <div className="lg:col-span-4 flex flex-col items-center p-8 bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(15,23,42,0.05)] border border-outline-variant h-fit">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/jpeg, image/png, image/gif" 
                        onChange={handleImageChange} 
                    />
                    <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container bg-surface-container-low">
                            <img alt="Current Avatar" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" src={formData.avatarUrl} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/30 rounded-full">
                            <span className="material-symbols-outlined text-on-primary">photo_camera</span>
                        </div>
                    </div>
                    <button 
                        className="px-4 py-2 border border-outline-variant rounded-lg font-label-caps text-label-caps text-primary hover:bg-surface-container-low transition-colors w-full flex justify-center items-center gap-1" 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        Thay đổi ảnh
                    </button>
                    <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant text-center text-xs">
                        Định dạng: JPG, PNG hoặc GIF.<br />Dung lượng tối đa 2MB.
                    </p>
                </div>

                {/* Right Column: Form Section */}
                <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-[0px_2px_4px_rgba(15,23,42,0.05)] border border-outline-variant p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Row 1: First Name & Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-label-caps text-label-caps text-on-surface" htmlFor="firstName">Họ</label>
                                <input
                                    className={`w-full px-4 py-2 bg-surface-container-lowest border ${errors.firstName ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 transition-shadow placeholder:text-outline-variant`}
                                    id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                                />
                                {errors.firstName && (
                                    <div className="flex items-center gap-1 mt-1 text-error">
                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                        <span className="font-body-sm text-body-sm text-[12px]">{errors.firstName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-caps text-label-caps text-on-surface" htmlFor="lastName">Tên</label>
                                <input
                                    className={`w-full px-4 py-2 bg-surface-container-lowest border ${errors.lastName ? 'border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 transition-shadow placeholder:text-outline-variant`}
                                    id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                                />
                                {errors.lastName && (
                                    <div className="flex items-center gap-1 mt-1 text-error">
                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                        <span className="font-body-sm text-body-sm text-[12px]">{errors.lastName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Email (Read-only) */}
                        <div className="flex flex-col gap-1">
                            <label className="font-label-caps text-label-caps text-on-surface" htmlFor="email">Email</label>
                            <input
                                className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface-variant cursor-not-allowed"
                                disabled id="email" name="email" readOnly type="email" value={formData.email}
                            />
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-1">Email được liên kết với tài khoản hệ thống và không thể thay đổi.</p>
                        </div>

                        {/* Row 3: Phone & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-label-caps text-label-caps text-on-surface" htmlFor="phone">Số điện thoại</label>
                                <input
                                    className={`w-full px-4 py-2 bg-surface-container-lowest border ${errors.phone ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 transition-shadow`}
                                    id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                />
                                {errors.phone && (
                                    <div className="flex items-center gap-1 mt-1 text-error">
                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                        <span className="font-body-sm text-body-sm text-[12px]">{errors.phone}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-caps text-label-caps text-on-surface" htmlFor="address">Địa chỉ</label>
                                <input
                                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-outline-variant"
                                    id="address" name="address" placeholder="Nhập địa chỉ của bạn" type="text" value={formData.address} onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 4: Gender (Radio Buttons) */}
                        <div className="flex flex-col gap-2">
                            <label className="font-label-caps text-label-caps text-on-surface">Giới tính</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-2"
                                        name="gender" type="radio" value="male" checked={formData.gender === 'male'} onChange={handleChange}
                                    />
                                    <span className="font-body-md text-body-md text-on-surface">Nam</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-2"
                                        name="gender" type="radio" value="female" checked={formData.gender === 'female'} onChange={handleChange}
                                    />
                                    <span className="font-body-md text-body-md text-on-surface">Nữ</span>
                                </label>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-outline-variant my-2" />

                        {/* Action Buttons */}
                        <div className="flex justify-end items-center gap-4 pt-2">
                            <button
                                className="px-8 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-surface-container-low transition-colors"
                                type="button"
                                onClick={() => fetchUserProfile(userRole)} // Reset form to server state
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                className={`px-8 py-2 bg-black text-white font-label-caps text-label-caps rounded-lg flex items-center justify-center gap-2 transition-opacity w-[140px] ${isLoading ? 'opacity-90 cursor-wait' : 'hover:opacity-80'}`}
                                disabled={isLoading}
                                type="submit"
                            >
                                {isLoading && <div className="spinner"></div>}
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {toast.show && (
                <Toast
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </ManagementLayout>
    );
};

export default EditProfilePage;
