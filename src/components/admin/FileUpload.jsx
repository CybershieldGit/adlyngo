'use client';

import { useState, useRef } from 'react';

export default function FileUpload({ onUploadSuccess, onFileComplete, onFilesSelected, currentUrl = '', type = 'video', folder = 'adlyngo/others', multiple = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [preview, setPreview] = useState(currentUrl);
  const [previews, setPreviews] = useState([]);
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
        setUploadProgress(prev => ({ ...prev, current: count }));
        
        // Validate file type
        if (type === 'video' && !file.type.startsWith('video/')) {
          setError(`File ${file.name} is not a valid video.`);
          continue;
        }
        if (type === 'image' && !file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image.`);
          continue;
        }

        // Limit check
        if (file.size > 100 * 1024 * 1024) { // Increased to 100MB for videos
          setError(`File ${file.name} is too large. Max 100MB.`);
          continue;
        }

        const result = await performUpload(file);
        if (result) {
          const uploadedData = { ...result, originalName: file.name };
          results.push(uploadedData);
          newPreviews.push(result.url);
          
          // Call incremental callback if provided
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
    // 1. Get Signature from our API
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      folder,
    };

    const signResponse = await fetch('/api/upload/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      throw new Error(data.error?.message || 'Upload failed');
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
                : 'Uploading to Cloudinary...'}
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
