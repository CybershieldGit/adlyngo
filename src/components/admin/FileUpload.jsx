'use client';

import { useState, useRef } from 'react';
import { UPLOAD_LIMITS } from '../../constants/index.js';

const IMAGE_MAX_MB = Math.round(UPLOAD_LIMITS.IMAGE_MAX_SIZE / (1024 * 1024));
const VIDEO_MAX_MB = Math.round(UPLOAD_LIMITS.VIDEO_MAX_SIZE / (1024 * 1024));

export default function FileUpload({
  onUploadSuccess,
  onFileComplete,
  onFilesSelected,
  currentUrl = '',
  type = 'video',
  multiple = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [preview, setPreview] = useState(currentUrl);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const maxSize = type === 'video' ? UPLOAD_LIMITS.VIDEO_MAX_SIZE : UPLOAD_LIMITS.IMAGE_MAX_SIZE;
  const maxSizeMb = type === 'video' ? VIDEO_MAX_MB : IMAGE_MAX_MB;
  const allowedTypes =
    type === 'video' ? UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES : UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple) {
        if (onFilesSelected) onFilesSelected(files);
        uploadFiles(files);
      } else {
        uploadFile(files[0]);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (multiple) {
        if (onFilesSelected) onFilesSelected(files);
        uploadFiles(files);
      } else {
        uploadFile(files[0]);
      }
    }
  };

  const validateFile = (file) => {
    if (type === 'video' && !file.type.startsWith('video/')) {
      return `File ${file.name} is not a valid video.`;
    }
    if (type === 'image' && !file.type.startsWith('image/')) {
      return `File ${file.name} is not a valid image.`;
    }
    if (!allowedTypes.includes(file.type)) {
      return `File ${file.name} has an unsupported format.`;
    }
    if (file.size > maxSize) {
      return `File ${file.name} is too large. Max ${maxSizeMb}MB.`;
    }
    return null;
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setError('');
    setUploadProgress({ current: 0, total: files.length });
    const results = [];
    const newPreviews = [];

    try {
      let count = 0;
      for (const file of files) {
        count++;
        setUploadProgress((prev) => ({ ...prev, current: count }));

        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        const result = await performUpload(file);
        if (result) {
          const uploadedData = { ...result, originalName: file.name };
          results.push(uploadedData);
          newPreviews.push(result.url);

          if (onFileComplete) {
            onFileComplete(uploadedData);
          }
        }
      }

      if (results.length > 0) {
        setPreviews(newPreviews);
        if (onUploadSuccess) onUploadSuccess(results);
      }
    } catch (err) {
      setError(err.message || 'Error uploading files');
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const uploadFile = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await performUpload(file);
      if (result) {
        setPreview(result.url);
        onUploadSuccess(result);
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const performUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return data.data;
    }

    throw new Error(data.message || 'Upload failed');
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone p-4 text-center border-2 border-dashed rounded-3 position-relative ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-light-gray bg-light'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{ cursor: 'pointer', minHeight: '150px', transition: 'all 0.3s ease' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept={type === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/svg+xml'}
          onChange={handleFileChange}
          multiple={multiple}
        />

        {uploading ? (
          <div className="py-3">
            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="mb-0 fs-13 fw-500 text-dark-gray">
              {uploadProgress.total > 1
                ? `Uploading file ${uploadProgress.current} of ${uploadProgress.total}...`
                : 'Uploading...'}
            </p>
          </div>
        ) : preview ? (
          <div className="py-2">
            {type === 'video' ? (
              <video
                src={preview}
                className="rounded-2 shadow-sm mb-2"
                style={{ maxHeight: '100px', width: 'auto' }}
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="rounded-2 shadow-sm mb-2"
                style={{ maxHeight: '100px', width: 'auto', objectFit: 'contain' }}
              />
            )}
            <p className="mb-0 fs-12 text-primary fw-600">Click or drag to replace</p>
          </div>
        ) : (
          <div className="py-3">
            <i className={`bi ${type === 'video' ? 'bi-camera-video' : 'bi-image'} fs-1 mb-2 text-primary d-block`}></i>
            <p className="mb-1 fs-14 fw-600 text-dark-gray">Drop your {type} here</p>
            <p className="mb-0 fs-12 text-muted">
              or click to browse (max {maxSizeMb}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-danger fs-12 mt-2 mb-0 fw-500">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          {error}
        </p>
      )}

      <style jsx>{`
        .file-upload-dropzone:hover {
          border-color: var(--admin-primary) !important;
          background-color: rgba(255, 90, 53, 0.05);
        }
      `}</style>
    </div>
  );
}
