const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const uploadConfig = {
  /** PHP upload URL (fallback/alternative) */
  phpUploadUrl: process.env.NEXT_PUBLIC_PHP_UPLOAD_URL || 'https://gbs.osamaqaseem.online/upload.php',
  
  /** Backend API upload URLs */
  uploadUrl: `${API_BASE_URL}/upload/single`,
  uploadMultipleUrl: `${API_BASE_URL}/upload/multiple`,
  
  /** Maximum file size in bytes (default: 10MB to match PHP config) */
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  /** Allowed MIME types for images */
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  
  /** Maximum number of images */
  maxImages: 10,
  
  /** Upload method preference: 'api' (backend API) or 'php' */
  uploadMethod: (process.env.NEXT_PUBLIC_UPLOAD_METHOD || 'api') as 'api' | 'php',
};

