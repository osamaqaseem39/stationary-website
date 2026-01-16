export const uploadConfig = {
  /** PHP upload URL - only upload endpoint used */
  uploadUrl: process.env.NEXT_PUBLIC_PHP_UPLOAD_URL || 'https://gbs.osamaqaseem.online/upload.php',

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
};

