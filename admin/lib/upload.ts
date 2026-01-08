import { uploadConfig } from './config/upload';

export interface ImageUploadOptions {
  /** Custom upload URL (overrides config default) */
  uploadUrl?: string;
  /** Maximum file size in bytes (overrides config default) */
  maxFileSize?: number;
  /** Allowed MIME types (overrides config default) */
  allowedTypes?: string[];
  /** Additional form data fields to include */
  additionalData?: Record<string, string | number | boolean>;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  urls?: string[];
  error?: string;
}

/**
 * Validates an image file before upload
 */
export function validateImageFile(
  file: File,
  options?: Pick<ImageUploadOptions, 'maxFileSize' | 'allowedTypes'>
): { valid: boolean; error?: string } {
  const maxSize = options?.maxFileSize || uploadConfig.maxFileSize;
  const allowedTypes = options?.allowedTypes || uploadConfig.allowedTypes;

  // Check file type
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: `${file.name} is not an image file`,
    };
  }

  // Check if type is in allowed list
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name} has an unsupported format. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `${file.name} is too large. Maximum size is ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a single image file via backend API
 */
export async function uploadImage(
  file: File,
  options?: ImageUploadOptions
): Promise<ImageUploadResult> {
  // Validate file
  const validation = validateImageFile(file, options);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      };
    }

    const uploadUrl = options?.uploadUrl || uploadConfig.uploadUrl;
    const formData = new FormData();
    formData.append('file', file);

    // Add additional data if provided
    if (options?.additionalData) {
      Object.entries(options.additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.data?.url) {
      return {
        success: true,
        url: data.data.url,
      };
    } else {
      throw new Error(data.error || 'Upload failed: Invalid response from server');
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image. Please try again.',
    };
  }
}

/**
 * Uploads multiple image files via backend API
 */
export async function uploadImages(
  files: File[],
  options?: ImageUploadOptions
): Promise<ImageUploadResult> {
  if (files.length === 0) {
    return {
      success: false,
      error: 'No files provided',
    };
  }

  try {
    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      };
    }

    // Validate all files first
    for (const file of files) {
      const validation = validateImageFile(file, options);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }
    }

    const uploadUrl = options?.uploadUrl || uploadConfig.uploadMultipleUrl;
    const formData = new FormData();
    
    // Append all files with 'files' field name (matches backend expectation)
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Add additional data if provided
    if (options?.additionalData) {
      Object.entries(options.additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.data?.urls) {
      return {
        success: true,
        urls: data.data.urls,
      };
    } else {
      throw new Error(data.error || 'Upload failed: Invalid response from server');
    }
  } catch (error: any) {
    console.error('Error uploading images:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload images. Please try again.',
    };
  }
}

export default {
  uploadImage,
  uploadImages,
  validateImageFile,
};

