import { format } from 'date-fns';

/**
 * Format a number as Vietnamese Dong (VND)
 * @param {number} amount 
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date string into human-readable format
 * @param {string|Date} dateStr 
 * @param {string} pattern 
 * @returns {string}
 */
export const formatDate = (dateStr, pattern = 'dd MMM yyyy') => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), pattern);
  } catch {
    return dateStr;
  }
};

/**
 * Get initials from full name for default avatar representation
 * @param {string} name 
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return (first + last).toUpperCase();
};

/**
 * Parse duration string (MM:SS or HH:MM:SS) to seconds
 * @param {string|number} duration 
 * @returns {number}
 */
export const parseDurationToSeconds = (duration) => {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'string') {
    if (!duration.includes(':')) {
       const val = parseInt(duration, 10);
       return isNaN(val) ? 0 : val;
    }
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
  }
  return 0;
};

/**
 * Format duration (seconds) into HH:MM:SS or MM:SS
 * @param {number|string} input 
 * @returns {string}
 */
export const formatDuration = (input) => {
  if (typeof input === 'string' && input.includes(':')) return input;
  const seconds = parseDurationToSeconds(input);
  if (!seconds || isNaN(seconds)) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parse a JSON array or newline-separated string into a clean JS array
 * @param {string|Array} input 
 * @returns {Array<string>}
 */
export const parseList = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore json parsing errors
  }
  if (typeof input === 'string') {
    return input.split('\n').map(i => i.trim()).filter(Boolean);
  }
  return [];
};

/**
 * Normalize course object fields to map database model keys to frontend component keys
 * @param {any} course 
 * @returns {any}
 */
export const normalizeCourse = (course) => {
  if (!course) return null;
  return {
    ...course,
    id: course.id,
    title: course.title || course.name || '',
    subtitle: course.subtitle || course.shortDescription || '',
    slug: course.slug || '',
    price: course.price ? Number(course.price) : 0,
    discountedPrice: course.discountedPrice !== undefined ? course.discountedPrice : (course.salePrice !== undefined ? Number(course.salePrice) : null),
    coverImageUrl: course.coverImageUrl || course.thumbnail || '',
    averageRating: course.averageRating !== undefined ? Number(course.averageRating) : (course.rating !== undefined ? Number(course.rating) : 0),
    reviewsCount: course.reviewsCount !== undefined ? Number(course.reviewsCount) : (course.ratingCount !== undefined ? Number(course.ratingCount) : 0),
    authorName: course.authorName || course.instructor || 'Aethera Instructor',
    level: course.level || 'All Levels',
    totalStudents: course.totalStudents !== undefined ? Number(course.totalStudents) : 0,
  };
};

/**
 * Extract array from various API response shapes and normalize courses if applicable
 * @param {any} res 
 * @returns {Array}
 */
export const extractArray = (res) => {
  if (!res) return [];
  let list;
  if (Array.isArray(res)) list = res;
  else if (Array.isArray(res.data)) list = res.data;
  else if (Array.isArray(res.courses)) list = res.courses;
  else if (Array.isArray(res.categories)) list = res.categories;
  else if (res.data && Array.isArray(res.data.courses)) list = res.data.courses;
  else if (res.data && Array.isArray(res.data.categories)) list = res.data.categories;
  else return [];

  return list.map(item => {
    // If it has category-like fields but is actually a course (has price or instructor or thumbnail)
    if (item && item.slug && (item.price !== undefined || item.instructor !== undefined || item.thumbnail !== undefined)) {
      return normalizeCourse(item);
    }
    return item;
  });
};
