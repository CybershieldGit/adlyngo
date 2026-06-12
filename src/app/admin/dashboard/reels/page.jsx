'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import CustomSelect from '@/components/admin/CustomSelect';
import Modal from '@/components/admin/Modal';

export default function ManageReels() {
  const [reels, setReels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingReel, setViewingReel] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({ title: '', reelUrl: '', category: '', client: '', published: true });
  const [multiFormData, setMultiFormData] = useState([]); // Array for multiple uploads
  const [isMultiple, setIsMultiple] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchData = async (targetPage = page) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const [reelsRes, catsRes, clientsRes] = await Promise.all([
        fetch(`${apiUrl}/reels?page=${targetPage}&limit=10&search=${searchTerm}`, { cache: 'no-store' }),
        fetch(`${apiUrl}/categories?type=reel`, { cache: 'no-store' }),
        fetch(`${apiUrl}/clients`, { cache: 'no-store' })
      ]);

      const reelsData = await reelsRes.json();
      const catsData = await catsRes.json();
      const clientsData = await clientsRes.json();

      if (reelsData.success) {
        setReels(reelsData.data.reels || []);
        setTotalPages(reelsData.data.meta.totalPages);
        setTotalDocs(reelsData.data.meta.totalDocs);
      }
      if (catsData.success) {
        setCategories(catsData.data.categories);
      }
      if (clientsData.success) {
        setClients(clientsData.data.clients || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = (reel) => {
    setItemToDelete(reel);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete._id;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/reels/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSuccess('Reel deleted successfully');
        setReels(reels.filter(r => r._id !== id));
        setTimeout(() => {
          closeModals();
          setSubmitting(false);
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Network error while deleting');
      setSubmitting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
  };

  const confirmBulkDelete = async () => {
    setSubmitting(true);
    setError('');

    let successCount = 0;
    let failCount = 0;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

      for (const id of selectedIds) {
        const response = await fetch(`${apiUrl}/reels/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      }

      await fetchData();

      setTimeout(() => {
        closeModals();
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      setError('Network error while performing bulk delete');
      setSubmitting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === reels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reels.map(reel => reel._id));
    }
  };

  const handleEdit = (reel) => {
    setEditingId(reel._id);
    setFormData({
      title: reel.title || '',
      reelUrl: reel.reelUrl || '',
      category: reel.category?._id || reel.category || '',
      client: reel.client?._id || reel.client || '',
      published: reel.published ?? true
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleView = (reel) => {
    setViewingReel(reel);
    setIsViewing(true);
  };

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setIsDeleting(false);
    setIsBulkDeleting(false);
    setViewingReel(null);
    setItemToDelete(null);
    setSelectedIds([]);
    setEditingId(null);
    setFormData({ title: '', reelUrl: '', category: '', client: '', published: true });
    setMultiFormData([]);
    setIsMultiple(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

      if (isMultiple && !isEditing) {
        // Handle Multiple Uploads
        // Validation first - per item errors
        let hasErrors = false;
        const updatedMultiData = multiFormData.map((reel, index) => {
          const reelErrors = { title: '', category: '' };
          if (!reel.category) {
            reelErrors.category = 'Required';
            hasErrors = true;
          }
          if (!reel.title) {
            reelErrors.title = 'Required';
            hasErrors = true;
          }
          return { ...reel, errors: reelErrors };
        });

        if (hasErrors) {
          setMultiFormData(updatedMultiData);
          setError('Please fix the errors in the reels below.');
          setSubmitting(false);

          // Scroll first invalid item into view
          const firstErrorIndex = updatedMultiData.findIndex(item => item.errors.title || item.errors.category);
          if (firstErrorIndex !== -1) {
            setTimeout(() => {
              const element = document.getElementById(`bulk-reel-${firstErrorIndex}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus the first invalid field
                const reelData = updatedMultiData[firstErrorIndex];
                if (reelData.errors.title) {
                  const input = element.querySelector('input.is-invalid');
                  if (input) input.focus();
                } else if (reelData.errors.category) {
                  const selectTrigger = element.querySelector('.custom-select-trigger');
                  if (selectTrigger) selectTrigger.click(); // Open dropdown for category selection
                }
              }
            }, 100);
          }
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < multiFormData.length; i++) {
          const reel = multiFormData[i];
          setSuccess(`Saving reel ${i + 1} of ${multiFormData.length}...`);
          try {
            const response = await fetch(`${apiUrl}/reels`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(reel),
            });

            if (response.ok) {
              successCount++;
            } else {
              failCount++;
            }
          } catch (err) {
            failCount++;
          }
        }

        await fetchData();

        if (failCount === 0) {
          setSuccess(`Successfully added ${successCount} reels!`);
        } else if (successCount > 0) {
          setSuccess(`Added ${successCount} reels. Failed to add ${failCount} reels.`);
        } else {
          setSuccess('');
          throw new Error(`Failed to add any reels.`);
        }
      } else {
        // Handle Single Upload/Edit
        const url = isEditing ? `${apiUrl}/reels/${editingId}` : `${apiUrl}/reels`;
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccess(isEditing ? 'Reel updated successfully!' : 'New reel added!');
        } else {
          throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} reel`);
        }
      }

      await fetchData();
      setTimeout(() => {
        closeModals();
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      setError(err.message || `Network error while ${isEditing ? 'updating' : 'creating'}`);
      setSubmitting(false);
    }
  };

  const handleMultiFieldChange = (index, field, value) => {
    const updated = [...multiFormData];
    const itemErrors = updated[index].errors ? { ...updated[index].errors, [field]: '' } : { title: '', category: '' };
    updated[index] = { ...updated[index], [field]: value, errors: itemErrors };
    setMultiFormData(updated);
  };

  if (loading && reels.length === 0) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5 mt-2 mt-lg-0">
        <h5 className="fw-700 text-dark-gray mb-0 text-nowrap">
          Manage Reels
        </h5>

        <div className="d-flex flex-row gap-2 w-100 w-md-auto align-items-center">
          <div className="position-relative flex-grow-1">
            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px', zIndex: 5 }}></i>
            <input
              type="text"
              className="form-control btn-rounded border-0 box-shadow-small"
              placeholder="Search reels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: '40px', paddingLeft: '45px' }}
            />
          </div>

          <div className="d-flex gap-2 justify-content-md-end flex-shrink-0">
            {selectedIds.length > 0 && (
              <button
                className="btn btn-danger btn-small btn-rounded px-3 flex-shrink-0"
                onClick={handleBulkDelete}
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className="bi bi-trash3-fill me-1"></i> <span className="d-none d-sm-inline">Delete ({selectedIds.length})</span><span className="d-inline d-sm-none">({selectedIds.length})</span>
              </button>
            )}
            <button
              className="btn btn-dark-gray btn-small btn-rounded px-3 flex-shrink-0"
              onClick={() => {
                closeModals();
                setIsCreating(true);
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              {isCreating ? 'Cancel' : (
                <>
                  <i className="bi bi-plus-lg me-1"></i> <span className="d-none d-sm-inline">Add New Reel</span><span className="d-inline d-sm-none">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show border-0 box-shadow-small mb-4" role="alert">
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}


      <Modal
        isOpen={isCreating || isEditing}
        onClose={closeModals}
        title={isEditing ? "Edit Reel" : "Create New Reel"}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {!isEditing && (
              <div className="col-12 mb-2">
                <div className="d-flex align-items-center gap-2 bg-light p-2 rounded border">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input mt-0"
                      type="checkbox"
                      id="multipleUploadSwitch"
                      checked={isMultiple}
                      onChange={e => {
                        setIsMultiple(e.target.checked);
                        setMultiFormData([]);
                        setFormData({ title: '', reelUrl: '', category: '', client: '', published: true });
                      }}
                      style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                    />
                  </div>
                  <label
                    className="fs-13 fw-600 text-dark-gray mb-0"
                    htmlFor="multipleUploadSwitch"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Multiple Video Upload
                  </label>
                </div>
              </div>
            )}

            {!isMultiple ? (
              // Single Upload Form
              <>
                <div className="col-md-12">
                  <label className="form-label fs-14 fw-500">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fs-14 fw-500">Reel Video (Drag & Drop)</label>
                  <FileUpload
                    type="video"
                    onUploadSuccess={(result) => setFormData({ ...formData, reelUrl: result.url })}
                    currentUrl={formData.reelUrl}
                  />
                </div>
                <div className="col-md-6">
                  <CustomSelect
                    label="Category"
                    options={Array.isArray(categories) ? categories.map(c => ({ value: c._id || c.id, label: c.name })) : []}
                    value={formData.category}
                    onChange={val => setFormData({ ...formData, category: val })}
                    placeholder="Select Category"
                  />
                </div>
                <div className="col-md-6">
                  <CustomSelect
                    label="Client (Optional)"
                    options={Array.isArray(clients) ? clients.map(c => ({ value: c._id || c.id, label: c.name })) : []}
                    value={formData.client}
                    onChange={val => setFormData({ ...formData, client: val })}
                    placeholder="Select Client"
                  />
                </div>
                <div className="col-md-12 mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input mt-0"
                        type="checkbox"
                        id="reelPublishedSwitch"
                        checked={formData.published}
                        onChange={e => setFormData({ ...formData, published: e.target.checked })}
                        style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                      />
                    </div>
                    <label
                      className="fs-14 fw-500 text-dark-gray mb-0"
                      htmlFor="reelPublishedSwitch"
                      style={{ cursor: 'pointer', userSelect: 'none', marginLeft: '5px' }}
                    >
                      Published
                    </label>
                  </div>
                </div>
              </>
            ) : (
              // Multiple Upload Form
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label fs-14 fw-500">Upload Multiple Videos</label>
                  <FileUpload
                    type="video"
                    multiple={true}
                    onFilesSelected={(files) => {
                      const placeholders = files.map(file => ({
                        title: file.name?.replace(/\.[^/.]+$/, "") || 'Untitled Reel',
                        reelUrl: '',
                        previewUrl: URL.createObjectURL(file),
                        fileName: file.name,
                        category: '',
                        client: '',
                        published: true,
                        isUploading: true,
                        errors: { title: '', category: '' }
                      }));
                      setMultiFormData(prev => [...prev, ...placeholders]);
                    }}
                    onFileComplete={(res) => {
                      setMultiFormData(prev => prev.map(item =>
                        item.fileName === res.originalName && item.isUploading
                          ? { ...item, reelUrl: res.url, isUploading: false }
                          : item
                      ));
                    }}
                    onUploadSuccess={(results) => {
                      console.log("All uploads complete", results);
                    }}
                  />
                </div>

                {multiFormData.length > 0 && (
                  <div className="multi-video-list mt-4">
                    <h6 className="fs-14 fw-700 mb-3 border-bottom pb-2">Video Details ({multiFormData.length})</h6>
                    <div className="overflow-auto no-scrollbar" style={{ maxHeight: '400px', paddingRight: '5px', paddingBottom: '100px' }}>
                      {multiFormData.map((reel, index) => (
                        <div key={index} id={`bulk-reel-${index}`} className={`card border p-2 mb-2 ${reel.isUploading ? 'bg-white border-dashed' : 'bg-white shadow-sm'}`}>
                          <div className="row g-2">
                            <div className="col-md-3">
                              {/* Video Preview */}
                              <div className="position-relative rounded overflow-hidden bg-black" style={{ aspectRatio: '9/16', maxHeight: '140px' }}>
                                <video
                                  src={reel.reelUrl || reel.previewUrl}
                                  className="w-100 h-100 object-fit-cover"
                                  muted
                                  onMouseOver={e => e.target.play()}
                                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                />
                                {reel.isUploading && (
                                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-50">
                                    <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                                  </div>
                                )}
                                <div className="position-absolute bottom-0 start-0 w-100 p-1 bg-dark bg-opacity-50 text-white text-center fs-10 fw-600">
                                  Preview
                                </div>
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="row g-2">
                                <div className="col-12">
                                  <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <span className="badge bg-primary rounded-circle" style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{index + 1}</span>
                                      <span className="fs-12 fw-600 text-truncate" style={{ maxWidth: '150px' }}>{reel.fileName || reel.reelUrl.split('/').pop()}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                      {reel.isUploading && (
                                        <div className="d-flex align-items-center gap-2">
                                          <div className="spinner-border spinner-border-sm text-primary" style={{ width: '12px', height: '12px' }} role="status"></div>
                                          <span className="fs-11 fw-600 text-primary">Uploading...</span>
                                        </div>
                                      )}
                                      <button
                                        type="button"
                                        className="btn btn-link text-danger p-0 border-0"
                                        onClick={() => {
                                          const updated = multiFormData.filter((_, i) => i !== index);
                                          setMultiFormData(updated);
                                        }}
                                        title="Remove"
                                      >
                                        <i className="bi bi-trash fs-14"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <label className="form-label fs-12 fw-600 mb-1">Title</label>
                                  <input
                                    type="text"
                                    className={`form-control form-control-sm ${reel.errors?.title ? 'is-invalid' : ''}`}
                                    value={reel.title}
                                    onChange={e => handleMultiFieldChange(index, 'title', e.target.value)}
                                    required
                                    disabled={reel.isUploading}
                                  />
                                  {reel.errors?.title && <div className="invalid-feedback fs-10">{reel.errors.title}</div>}
                                </div>
                                <div className="col-md-6">
                                  <CustomSelect
                                    label="Category"
                                    options={Array.isArray(categories) ? categories.map(c => ({ value: c._id || c.id, label: c.name })) : []}
                                    value={reel.category}
                                    onChange={val => handleMultiFieldChange(index, 'category', val)}
                                    placeholder="Select Category"
                                    size="sm"
                                    disabled={reel.isUploading}
                                    error={reel.errors?.category}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <CustomSelect
                                    label="Client (Optional)"
                                    options={Array.isArray(clients) ? clients.map(c => ({ value: c._id || c.id, label: c.name })) : []}
                                    value={reel.client}
                                    onChange={val => handleMultiFieldChange(index, 'client', val)}
                                    placeholder="Select Client"
                                    size="sm"
                                    disabled={reel.isUploading}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="col-12 mt-4 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded me-2" onClick={closeModals}>Cancel</button>
              <button
                type="submit"
                className="btn btn-primary btn-small btn-rounded position-relative"
                disabled={submitting || (isMultiple && multiFormData.some(r => r.isUploading))}
                style={{ minWidth: '140px', transition: 'all 0.3s ease' }}
              >
                <span className={submitting ? 'invisible' : ''}>
                  {isEditing ? 'Update Reel' : 'Save Reel'}
                </span>
                {submitting && (
                  <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center w-100">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span className="fs-13 fw-600">Saving...</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="card admin-table-card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="admin-table-wrapper">
          <table className="table table-hover align-middle mb-0" style={{ minWidth: '1000px' }}>
            <thead className="text-muted fs-14 text-uppercase">
              <tr>
                <th className="py-3 border-0 sticky-column-header-start text-center" style={{ width: '70px' }}>
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <input
                      className="admin-checkbox"
                      type="checkbox"
                      checked={reels.length > 0 && selectedIds.length === reels.length}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Title</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>Category</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>Client</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>Status</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>Date</th>
                <th className="py-3 fw-600 border-0 text-center sticky-column-end actions-column" style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(reels) || reels.length === 0) ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">No reels found. Create one above!</td>
                </tr>
              ) : (
                reels?.map(reel => (
                  <tr key={reel._id} className={selectedIds.includes(reel._id) ? 'bg-light-gray' : ''}>
                    <td className="py-3 sticky-column-start text-center">
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <input
                          className="admin-checkbox"
                          type="checkbox"
                          checked={selectedIds.includes(reel._id)}
                          onChange={() => toggleSelect(reel._id)}
                        />
                      </div>
                    </td>
                    <td className="py-3 fw-500" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>{reel.title}</td>
                    <td className="py-3" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>{reel.category?.name || 'Unknown'}</td>
                    <td className="py-3 text-muted fs-13" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>{reel.client?.name || '-'}</td>
                    <td className="py-3" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>
                      <span className={`badge ${reel.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${reel.published ? 'success' : 'secondary'} px-2 py-1`}>
                        {reel.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 fs-14 text-muted" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>
                      {new Date(reel.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-center sticky-column-end actions-column" style={{ whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(reel)}
                          title="View"
                        >
                          <img src="/images/views.png" alt="View" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-primary-light btn-sm"
                          onClick={() => handleEdit(reel)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(reel)}
                          title="Delete"
                        >
                          <img src="/images/trash.png" alt="Delete" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="admin-table-pagination d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <div className="text-muted fs-13 fw-500">
              Showing <span className="text-dark-gray fw-700">{(page - 1) * 10 + 1}</span> to <span className="text-dark-gray fw-700">{Math.min(page * 10, totalDocs)}</span> of <span className="text-dark-gray fw-700">{totalDocs}</span> reels
            </div>
            <nav className="admin-pagination">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link" onClick={() => setPage(i + 1)} >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
      {/* View Modal */}
      {isViewing && viewingReel && (
        <Modal
          isOpen={isViewing}
          onClose={closeModals}
          title="Reel Details"
          size="md"
        >
          <div className="view-details">
            <div className="mb-4 text-center">
              <div className="rounded overflow-hidden bg-black shadow-sm" style={{ aspectRatio: '9/16', maxHeight: '400px', margin: '0 auto' }}>
                <video
                  src={viewingReel.reelUrl}
                  className="w-100 h-100 object-fit-contain"
                  controls
                  autoPlay
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Title</label>
              <h5 className="fw-600 text-dark-gray">{viewingReel.title}</h5>
            </div>
            <div className="row">
              <div className="col-6 mb-4">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Category</label>
                <span className="badge bg-light text-dark-gray px-3 py-2 border">
                  {viewingReel.category?.name || 'Uncategorized'}
                </span>
              </div>
              <div className="col-6 mb-4">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Client</label>
                <span className="badge bg-light text-dark-gray px-3 py-2 border">
                  {viewingReel.client?.name || '-'}
                </span>
              </div>
            </div>
            <div className="mb-0">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Status</label>
              <span className={`badge ${viewingReel.published ? 'bg-success-light text-success' : 'bg-warning-light text-warning'} px-3 py-2`}>
                {viewingReel.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </Modal>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <Modal
          isOpen={isDeleting}
          onClose={closeModals}
          title="Confirm Delete"
          size="sm"
        >
          <div className="text-center py-3">
            <div className="mb-4 text-danger">
              <i className="bi bi-exclamation-octagon fs-1"></i>
            </div>
            <h5 className="fw-700 mb-2">Are you sure?</h5>
            <p className="text-muted fs-14 mb-4">
              You are about to delete <span className="fw-700 text-dark">"{itemToDelete?.title}"</span>. This action cannot be undone.
            </p>

            {error && (
              <div className="alert alert-danger py-2 fs-12 mb-4">
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </div>
            )}


            <div className="d-flex gap-3 mt-2">
              <button
                className="btn btn-light btn-rounded flex-grow-1"
                onClick={closeModals}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-rounded flex-grow-1 position-relative"
                onClick={confirmDelete}
                disabled={submitting}
                style={{ minWidth: '120px' }}
              >
                <span className={submitting ? 'invisible' : ''}>Delete</span>
                {submitting && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleting && (
        <Modal
          isOpen={isBulkDeleting}
          onClose={closeModals}
          title="Confirm Bulk Delete"
          size="sm"
        >
          <div className="text-center py-3">
            <div className="mb-4 text-danger">
              <i className="bi bi-exclamation-octagon fs-1"></i>
            </div>
            <h5 className="fw-700 mb-2">Bulk Delete?</h5>
            <p className="text-muted fs-14 mb-4">
              You are about to delete <span className="fw-700 text-dark">{selectedIds.length} reels</span>. This action cannot be undone.
            </p>

            {error && (
              <div className="alert alert-danger py-2 fs-12 mb-4">
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </div>
            )}

            <div className="d-flex gap-3 mt-2">
              <button
                className="btn btn-light btn-rounded flex-grow-1"
                onClick={closeModals}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-rounded flex-grow-1 position-relative"
                onClick={confirmBulkDelete}
                disabled={submitting}
                style={{ minWidth: '120px' }}
              >
                <span className={submitting ? 'invisible' : ''}>Delete All</span>
                {submitting && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
