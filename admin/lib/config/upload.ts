export const uploadConfig = {
  /** Default upload URL */
  uploadUrl: process.env.NEXT_PUBLIC_PHP_UPLOAD_URL || 'https://gbs.osamaqaseem.online/upload.php',

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

