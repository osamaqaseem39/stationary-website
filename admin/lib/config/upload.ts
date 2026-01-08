const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const uploadConfig = {
  /** Default upload URL - uses backend API */
  uploadUrl: `${API_BASE_URL}/upload/single`,
  uploadMultipleUrl: `${API_BASE_URL}/upload/multiple`,
  /** Maximum file size in bytes (default: 5MB) */
  maxFileSize: 5 * 1024 * 1024, // 5MB
  /** Allowed MIME types for images */
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
};

