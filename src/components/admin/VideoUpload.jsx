'use client';

import { useState, useRef } from 'react';
import { UPLOAD_LIMITS } from '../../constants/index.js';

const VIDEO_MAX_MB = Math.round(UPLOAD_LIMITS.VIDEO_MAX_SIZE / (1024 * 1024));

export default function VideoUpload({ onUploadSuccess, currentUrl = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file (MP4, WebM)');
      return;
    }

    if (!UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setError('Unsupported video format. Use MP4 or WebM.');
      return;
    }

    if (file.size > UPLOAD_LIMITS.VIDEO_MAX_SIZE) {
      setError(`File size too large. Max ${VIDEO_MAX_MB}MB allowed.`);
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'video');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const url = data.data.url;
        setPreview(url);
        onUploadSuccess(url);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-upload-container">
      <div
        className={`video-upload-dropzone p-4 text-center border-2 border-dashed rounded-3 position-relative ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-light-gray bg-light'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{ cursor: 'pointer', minHeight: '180px', transition: 'all 0.3s ease' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="video/mp4,video/webm"
          onChange={handleFileChange}
        />

        {uploading ? (
          <div className="py-4">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="mb-0 fs-14 fw-500 text-dark-gray">Uploading video...</p>
          </div>
        ) : preview ? (
          <div className="py-2">
            <video
              src={preview}
              className="rounded-2 shadow-sm mb-3"
              style={{ maxHeight: '120px', width: 'auto' }}
              autoPlay
              muted
              loop
            />
            <p className="mb-0 fs-12 text-primary fw-600">Click or drag to replace video</p>
          </div>
        ) : (
          <div className="py-4">
            <i className="bi bi-cloud-arrow-up fs-1 mb-2 text-primary d-block"></i>
            <p className="mb-1 fs-16 fw-600 text-dark-gray">Drop your reel here</p>
            <p className="mb-0 fs-13 text-muted">or click to browse (max {VIDEO_MAX_MB}MB)</p>
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
        .video-upload-dropzone:hover {
          border-color: #556ee6 !important;
          background-color: rgba(85, 110, 230, 0.05);
        }
      `}</style>
    </div>
  );
}
