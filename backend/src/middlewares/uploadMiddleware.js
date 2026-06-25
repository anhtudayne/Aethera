import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // Sử dụng config Cloudinary đã có sẵn từ backend

// 1. Dành cho Campaign Banners (ảnh định dạng jpg, png...)
const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aethera_marketing',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
export const uploadCloud = multer({ storage: bannerStorage });

// 2. Dành cho Video bài học (định dạng video mp4, webm...)
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'learnhub_videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov', 'avi']
  },
});
export const uploadVideo = multer({ storage: videoStorage });

// 3. Dành cho Avatar
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aethera_avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
export const uploadAvatar = multer({ storage: avatarStorage });

// 4. Dành cho Course Thumbnails
const thumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aethera_thumbnails',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
export const uploadThumbnail = multer({ storage: thumbnailStorage });
// 5. Dành cho Ticket Evidence (ảnh định dạng jpg, png...)
const ticketStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'aethera_tickets_evidence',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
export const uploadTicketEvidence = multer({ storage: ticketStorage });

// Export default cho banner hoặc tùy chọn import cụ thể
export default uploadCloud;
