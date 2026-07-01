import React, { useState, useEffect, useRef } from 'react';
import { userApi } from '../../api/userApi';
import axiosClient from '../../api/axiosClient';

const InstructorRegistrationPage = () => {
  const [status, setStatus] = useState(null); // 'PENDING', 'APPROVED', 'REJECTED', or null
  const [reason, setReason] = useState('');
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [certificateImage, setCertificateImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      const res = await userApi.getInstructorApplicationStatus();
      if (res.data) {
        setStatus(res.data.status);
        setReason(res.data.reason || '');
      }
    } catch (err) {
      console.error('Failed to fetch status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('thumbnail', file); // using existing thumbnail upload endpoint
    
    setUploading(true);
    setError('');
    
    try {
      const res = await axiosClient.post('/upload/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.imageUrl) {
        setCertificateImage(res.imageUrl);
      }
    } catch (err) {
      setError('Error uploading image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expertise.trim() || !experience.trim()) {
      setError('Please fill in complete professional and experience information.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    try {
      const payload = { expertise, experience };
      if (certificateImage) payload.certificateImage = certificateImage;
      
      const res = await userApi.applyInstructor(payload);
      setStatus('PENDING'); // Update local state immediately
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (status === 'APPROVED') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fi fi-rr-check-circle"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your application has been approved!</h2>
        <p className="text-gray-600 mb-6">Congratulations on becoming an instructor on the platform. You can now start creating your course.</p>
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fi fi-rr-time-fast"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration application is pending approval</h2>
        <p className="text-gray-600 mb-6">The administrator is reviewing your application. Please come back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Lecturer</h2>
      <p className="text-gray-600 mb-8">Share your knowledge with thousands of students by registering as an instructor.</p>

      {status === 'REJECTED' && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
          <i className="fi fi-rr-exclamation text-lg mt-0.5"></i>
          <div>
            <h4 className="font-semibold mb-1">The previous application was rejected</h4>
            <p className="text-sm">{reason}</p>
            <p className="text-sm mt-2 font-medium">You can reapply below.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teaching expertise <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="For example: Web Programming, UI/UX Design, Marketing..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your experience <span className="text-red-500">*</span></label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors h-32 resize-none"
            placeholder="Please describe your work and teaching experience in detail..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image of Degree/Certificate (Optional)</label>
          <div className="mt-1 flex items-center gap-4">
            {certificateImage && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={certificateImage} alt="Certificate" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCertificateImage('')}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fi fi-rr-trash"></i>
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <i className="fi fi-rr-upload"></i>
              )}
              {certificateImage ? 'Upload another image' : 'Upload an image'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG format. Relevant qualifications help increase the likelihood of application approval.</p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Sending...</>
            ) : (
              'Send Registration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorRegistrationPage;
