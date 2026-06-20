import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import { instructorApi } from '../../api/instructorApi';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorCourseCreatePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    shortDescription: ''
  });

  useEffect(() => {
    categoryApi.getAll().then(res => {
      if (res.data && res.data.data) {
        setCategories(res.data.data);
      } else if (res.data) {
        setCategories(res.data);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validate
      if (!formData.name || !formData.categoryId || !formData.price) {
        throw new Error('Please fill all required fields');
      }

      const res = await instructorApi.createCourse({
        name: formData.name,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        shortDescription: formData.shortDescription
      });

      // Navigate to the edit page for this new course
      if (res.data && res.data.slug) {
        navigate(`/instructor/course/${res.data.slug}/manage`);
      } else if (res.data && res.data.data && res.data.data.slug) {
        navigate(`/instructor/course/${res.data.data.slug}/manage`);
      } else {
        navigate(ROUTES.INSTRUCTOR_DASHBOARD);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create course');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to={ROUTES.INSTRUCTOR_DASHBOARD} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#5624d0', textDecoration: 'none', fontWeight: 700 }}>
          <ArrowLeft size={16} /> Back to courses
        </Link>
      </div>
      
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Create a New Course</h1>
      <p style={{ color: '#6a6f73', marginBottom: '32px' }}>Fill in the basic information to get started. You can edit this later.</p>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fcebea', color: '#b30820', marginBottom: '24px', border: '1px solid #b30820' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Course Title *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Complete React Bootcamp 2026"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px' }}
            required
            maxLength={60}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Category *</label>
          <select 
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', backgroundColor: '#fff' }}
            required
          >
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Price (VND) *</label>
          <input 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 599000"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px' }}
            required
            min="0"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Short Description</label>
          <textarea 
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="A brief summary of your course"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', minHeight: '100px', resize: 'vertical' }}
            maxLength={120}
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <Button type="submit" variant="primary" disabled={loading} style={{ padding: '12px 24px', fontSize: '16px' }}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InstructorCourseCreatePage;
