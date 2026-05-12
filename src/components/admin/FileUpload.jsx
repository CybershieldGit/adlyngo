'use client';

import { useState, useRef } from 'react';

export default function FileUpload({ onUploadSuccess, currentUrl = '', type = 'video', folder = 'adlyngo/others' }) {
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
    // Validate file type
    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please upload a valid video file (MP4, WebM, etc.)');
      return;
    }
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Limit check (50MB as requested)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size too large. Max 50MB allowed.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 1. Get Signature from our API
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder,
      };

      const signResponse = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
      });

      const signData = await signResponse.json();
      if (!signResponse.ok || !signData.success) {
        throw new Error(signData.message || 'Failed to get upload signature');
      }

      const { signature, apiKey, cloudName } = signData;

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const result = {
          url: data.secure_url,
          publicId: data.public_id,
        };
        setPreview(result.url);
        onUploadSuccess(result);
      } else {
        setError(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message || 'Network error during upload');
    } finally {
      setUploading(false);
    }
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
          accept={type === 'video' ? 'video/*' : 'image/*'} 
          onChange={handleFileChange} 
        />
        
        {uploading ? (
          <div className="py-3">
            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="mb-0 fs-13 fw-500 text-dark-gray">Uploading to Cloudinary...</p>
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
            <p className="mb-0 fs-12 text-muted">or click to browse</p>
          </div>
        )}
      </div>
      
      {error && <p className="text-danger fs-12 mt-2 mb-0 fw-500"><i className="bi bi-exclamation-triangle-fill me-1"></i>{error}</p>}
      
      <style jsx>{`
        .file-upload-dropzone:hover {
          border-color: var(--admin-primary) !important;
          background-color: rgba(255, 90, 53, 0.05);
        }
      `}</style>
    </div>
  );
}
