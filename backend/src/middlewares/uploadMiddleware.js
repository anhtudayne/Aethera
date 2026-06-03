import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'learnhub_videos',
    resource_type: 'video', // Important for video upload
    allowed_formats: ['mp4', 'webm', 'mov', 'avi']
  },
});

export const uploadVideo = multer({ storage: storage });
