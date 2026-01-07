import api from '../store/api';
import axios from 'axios';

const uploadService = {
  /**
   * Generates a presigned URL for uploading a file to S3.
   * @param {string} fileName - The name of the file to upload.
   * @param {string} fileType - The MIME type of the file.
   * @returns {Promise<{url: string, key: string}>} - The presigned URL and the S3 key.
   */
  generatePresignedUrl: async (fileName, fileType) => {
    const response = await api.post('/auth/presigned-url', {
      fileName,
      fileType,
    });
    return response.data;
  },

  /**
   * Uploads a file to S3 using a presigned URL.
   * @param {string} presignedUrl - The presigned URL for the upload.
   * @param {File} file - The file to upload.
   * @returns {Promise<void>}
   */
  uploadFileToS3: async (presignedUrl, file) => {
    // We use a clean axios instance to avoid sending our API auth headers to S3
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },
};

export default uploadService;
