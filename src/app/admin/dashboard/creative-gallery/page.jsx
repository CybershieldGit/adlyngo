'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import Modal from '@/components/admin/Modal';
import CustomSelect from '@/components/admin/CustomSelect';

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    publicId: '',
    published: true,
    category: '',
    client: ''
  });
  const [multiFormData, setMultiFormData] = useState([]); // Array for multiple uploads
  const [isMultiple, setIsMultiple] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchData = async (targetPage = page) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      // Fetch Gallery Items, Categories and Clients in parallel
      const [galleryRes, categoriesRes, clientsRes] = await Promise.all([
        fetch(`${apiUrl}/gallery?page=${targetPage}&limit=10`),
        fetch(`${apiUrl}/categories?type=gallery&limit=100`),
        fetch(`${apiUrl}/clients`)
      ]);
      
      const galleryData = await galleryRes.json();
      const categoriesData = await categoriesRes.json();
      const clientsData = await clientsRes.json();
      
      if (galleryData.success) {
        setItems(galleryData.data.items || []);
        setTotalPages(galleryData.data.meta?.totalPages || 1);
        setTotalDocs(galleryData.data.meta?.total || 0);
      } else {
        throw new Error(galleryData.message || 'Failed to fetch gallery items');
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data.categories || []);
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
  }, [page]);

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setIsDeleting(false);
    setIsBulkDeleting(false);
    setViewingItem(null);
    setItemToDelete(null);
    setSelectedIds([]);
    setEditingId(null);
    setFormData({
      title: '',
      imageUrl: '',
      publicId: '',
      published: true,
      category: '',
      client: ''
    });
    setMultiFormData([]);
    setIsMultiple(false);
    setError('');
    setSuccess('');
  };

  const handleView = (item) => {
    setViewingItem(item);
    setIsViewing(true);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl,
      publicId: item.publicId,
      published: item.published,
      category: item.category?._id || item.category || '',
      client: item.client?._id || item.client || ''
    });
    setIsEditing(true);
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
        const updatedMultiData = multiFormData.map((item, index) => {
          const itemErrors = { title: '', category: '' };
          if (!item.category) {
            itemErrors.category = 'Required';
            hasErrors = true;
          }
          if (!item.title) {
            itemErrors.title = 'Required';
            hasErrors = true;
          }
          return { ...item, errors: itemErrors };
        });

        if (hasErrors) {
          setMultiFormData(updatedMultiData);
          setError('Please fix the errors in the items below.');
          setSubmitting(false);
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < multiFormData.length; i++) {
          const item = multiFormData[i];
          setSuccess(`Saving image ${i + 1} of ${multiFormData.length}...`);
          try {
            const response = await fetch(`${apiUrl}/gallery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify(item),
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
          setSuccess(`Successfully added ${successCount} gallery items!`);
        } else if (successCount > 0) {
          setSuccess(`Added ${successCount} items. Failed to add ${failCount} items.`);
        } else {
          setSuccess('');
          throw new Error(`Failed to add any items.`);
        }
      } else {
        // Handle Single Upload/Edit
        const url = editingId ? `${apiUrl}/gallery/${editingId}` : `${apiUrl}/gallery`;
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setSuccess(editingId ? 'Gallery item updated!' : 'Gallery item created!');
          await fetchData();
        } else {
          throw new Error(data.message || 'Action failed');
        }
      }

      setTimeout(() => {
        closeModals();
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
      setSubmitting(false);
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete._id;
    setSubmitting(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Item deleted successfully');
        await fetchData();
        setTimeout(() => {
          closeModals();
          setSubmitting(false);
        }, 1500);
      } else {
        setError(data.message || 'Delete failed');
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
        const response = await fetch(`${apiUrl}/gallery/${id}`, {
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
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item._id));
    }
  };

  if (loading && items.length === 0) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5">
        <h5 className="fw-700 text-dark-gray mb-0 text-truncate">
          Creative Gallery
        </h5>
        <div className="d-flex gap-2 w-100 w-md-auto justify-content-md-end">
          {selectedIds.length > 0 && (
            <button
              className="btn btn-danger btn-small btn-rounded px-3 flex-shrink-0"
              onClick={handleBulkDelete}
              style={{ whiteSpace: 'nowrap' }}
            >
              <i className="bi bi-trash3-fill me-1"></i> Delete ({selectedIds.length})
            </button>
          )}
          <button
            className="btn btn-dark-gray btn-small btn-rounded px-3 flex-shrink-0"
            onClick={() => setIsCreating(true)}
            style={{ whiteSpace: 'nowrap' }}
          >
            <i className="bi bi-plus-lg me-1"></i> Add New Image
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 box-shadow-small mb-4" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}


      <div className="card admin-table-card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="admin-table-wrapper">
          <table className="table table-hover align-middle mb-0" style={{ minWidth: '900px' }}>
            <thead className="text-muted fs-14 text-uppercase">
              <tr>
                <th className="py-3 border-0 sticky-column-header-start text-center" style={{ width: '70px' }}>
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <input 
                      className="admin-checkbox" 
                      type="checkbox" 
                      checked={items.length > 0 && selectedIds.length === items.length}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="py-3 fw-600 border-0" style={{ whiteSpace: 'nowrap' }}>Image</th>
                <th className="py-3 fw-600 border-0" style={{ whiteSpace: 'nowrap', minWidth: '150px' }}>Title</th>
                <th className="py-3 fw-600 border-0" style={{ whiteSpace: 'nowrap' }}>Category</th>
                <th className="py-3 fw-600 border-0" style={{ whiteSpace: 'nowrap' }}>Client</th>
                <th className="py-3 fw-600 border-0" style={{ whiteSpace: 'nowrap' }}>Status</th>
                <th className="pe-4 py-3 fw-600 border-0 text-center sticky-column-end actions-column" style={{ whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(items) || items.length === 0) ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">No items found in gallery.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className={selectedIds.includes(item._id) ? 'bg-light-gray' : ''}>
                    <td className="py-3 sticky-column-start text-center">
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <input 
                          className="admin-checkbox" 
                          type="checkbox" 
                          checked={selectedIds.includes(item._id)}
                          onChange={() => toggleSelect(item._id)}
                        />
                      </div>
                    </td>
                    <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="rounded-2 shadow-sm"
                        style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="py-3 fw-600 text-dark-gray" style={{ whiteSpace: 'nowrap' }}>{item.title}</td>
                    <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
                      <span className="badge bg-purple bg-opacity-10 text-purple px-2 py-1" style={{ color: '#6610f2', backgroundColor: 'rgba(102, 16, 242, 0.1)' }}>
                        {item.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3 text-muted fs-13" style={{ whiteSpace: 'nowrap' }}>
                      {item.client?.name || '-'}
                    </td>
                    <td className="py-3" style={{ whiteSpace: 'nowrap' }}>
                      <span className={`badge bg-opacity-10 px-2 py-1 ${item.published ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-center sticky-column-end actions-column" style={{ whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(item)}
                          title="View"
                        >
                          <i className="bi bi-eye-fill" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" style={{ width: '14px' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(item)}
                          title="Delete"
                        >
                          <img src="/images/trash.png" alt="Delete" />
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
              Showing <span className="text-dark-gray fw-700">{(page - 1) * 10 + 1}</span> to <span className="text-dark-gray fw-700">{Math.min(page * 10, totalDocs)}</span> of <span className="text-dark-gray fw-700">{totalDocs}</span> items
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
                    <button className="page-link" onClick={() => setPage(i + 1)}>
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

      {/* Create/Edit Modal */}
      {(isCreating || isEditing) && (
        <Modal
          isOpen={true}
          onClose={closeModals}
          title={isEditing ? 'Edit Gallery Item' : (isMultiple ? 'Bulk Upload Gallery' : 'Add New Gallery Item')}
          size={isMultiple ? "lg" : "md"}
        >
          <form onSubmit={handleSubmit}>
            {!isEditing && (
              <div className="col-12 mb-4">
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
                        setFormData({ title: '', imageUrl: '', publicId: '', category: '', client: '', published: true });
                      }}
                      style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                    />
                  </div>
                  <label 
                    className="fs-13 fw-600 text-dark-gray mb-0" 
                    htmlFor="multipleUploadSwitch" 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Multiple Image Upload
                  </label>
                </div>
              </div>
            )}

            {!isMultiple ? (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fs-14 fw-600 text-dark-gray">Item Title</label>
                    <input
                      type="text"
                      className="form-control btn-rounded fs-14 px-3"
                      placeholder="Enter creative title..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <CustomSelect
                      label="Category"
                      options={categories.map(c => ({ value: c._id, label: c.name }))}
                      value={formData.category}
                      onChange={(val) => setFormData({ ...formData, category: val })}
                      placeholder="Select Category"
                    />
                  </div>
                  <div className="col-md-4">
                    <CustomSelect
                      label="Client (Optional)"
                      options={clients.map(c => ({ value: c._id, label: c.name }))}
                      value={formData.client}
                      onChange={(val) => setFormData({ ...formData, client: val })}
                      placeholder="Select Client"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fs-14 fw-600 text-dark-gray">Gallery Image</label>
                  <FileUpload
                    type="image"
                    folder="adlyngo/gallery"
                    currentUrl={formData.imageUrl}
                    onUploadSuccess={(res) => setFormData({ ...formData, imageUrl: res.url, publicId: res.publicId })}
                  />
                </div>

                <div className="mb-4 d-flex align-items-center gap-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input mt-0"
                      type="checkbox"
                      id="publishedSwitch"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                    />
                  </div>
                  <label 
                    className="fs-14 fw-500 text-dark-gray mb-0" 
                    htmlFor="publishedSwitch" 
                    style={{ cursor: 'pointer', userSelect: 'none', marginLeft: '5px' }}
                  >
                    Published
                  </label>
                </div>
              </>
            ) : (
              <div className="col-12">
                <div className="mb-4">
                  <label className="form-label fs-14 fw-600 text-dark-gray">Upload Multiple Images</label>
                  <FileUpload
                    type="image"
                    folder="adlyngo/gallery"
                    multiple={true}
                    onFilesSelected={(files) => {
                      const placeholders = files.map(file => ({
                        title: file.name?.replace(/\.[^/.]+$/, "") || 'Untitled Image',
                        imageUrl: '', 
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
                          ? { ...item, imageUrl: res.url, publicId: res.publicId, isUploading: false }
                          : item
                      ));
                    }}
                  />
                </div>

                {multiFormData.length > 0 && (
                  <div className="multi-image-list mt-4">
                    <h6 className="fs-14 fw-700 mb-3 border-bottom pb-2">Image Details ({multiFormData.length})</h6>
                      <div className="overflow-auto no-scrollbar" style={{ maxHeight: '400px', paddingRight: '5px', paddingBottom: '100px' }}>
                        {multiFormData.map((item, index) => (
                          <div key={index} className={`card border p-2 mb-2 ${item.isUploading ? 'bg-white border-dashed' : 'bg-white shadow-sm'}`}>
                            <div className="row g-2">
                            <div className="col-md-3">
                              <div className="position-relative rounded overflow-hidden" style={{ aspectRatio: '1/1', maxHeight: '100px' }}>
                                <img 
                                  src={item.imageUrl || item.previewUrl} 
                                  className="w-100 h-100 object-fit-cover"
                                  alt="Preview"
                                />
                                {item.isUploading && (
                                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black bg-opacity-30">
                                    <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="row g-2">
                                <div className="col-12">
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="d-flex align-items-center gap-2">
                                      <span className="badge bg-primary rounded-circle" style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{index + 1}</span>
                                      <span className="fs-12 fw-600 text-truncate" style={{ maxWidth: '180px' }}>{item.fileName}</span>
                                    </div>
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
                                <div className="col-md-12">
                                  <label className="form-label fs-11 fw-700 text-uppercase mb-1">Title</label>
                                  <input
                                    type="text"
                                    className={`form-control form-control-sm ${item.errors?.title ? 'is-invalid' : ''}`}
                                    value={item.title}
                                    onChange={e => {
                                      const updated = [...multiFormData];
                                      updated[index].title = e.target.value;
                                      if (updated[index].errors) updated[index].errors.title = '';
                                      setMultiFormData(updated);
                                    }}
                                    required
                                    disabled={item.isUploading}
                                  />
                                  {item.errors?.title && <div className="invalid-feedback fs-10">{item.errors.title}</div>}
                                </div>
                                <div className="col-md-6">
                                  <CustomSelect
                                    label="Category"
                                    options={categories.map(c => ({ value: c._id, label: c.name }))}
                                    value={item.category}
                                    onChange={val => {
                                      const updated = [...multiFormData];
                                      updated[index].category = val;
                                      if (updated[index].errors) updated[index].errors.category = '';
                                      setMultiFormData(updated);
                                    }}
                                    placeholder="Select Category"
                                    size="sm"
                                    disabled={item.isUploading}
                                    error={item.errors?.category}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <CustomSelect
                                    label="Client (Optional)"
                                    options={clients.map(c => ({ value: c._id, label: c.name }))}
                                    value={item.client}
                                    onChange={val => {
                                      const updated = [...multiFormData];
                                      updated[index].client = val;
                                      setMultiFormData(updated);
                                    }}
                                    placeholder="Select Client"
                                    size="sm"
                                    disabled={item.isUploading}
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

            <div className="d-flex gap-2 mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-light btn-rounded btn-small flex-grow-1"
                onClick={closeModals}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-rounded btn-small flex-grow-1 position-relative"
                disabled={submitting || (isMultiple && multiFormData.some(i => i.isUploading))}
                style={{ minWidth: '140px', transition: 'all 0.3s ease' }}
              >
                <span className={submitting ? 'invisible' : ''}>
                  {editingId ? 'Update Item' : 'Create Item'}
                </span>
                {submitting && (
                  <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center w-100">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span className="fs-13 fw-600">Saving...</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {/* View Modal */}
      {isViewing && viewingItem && (
        <Modal
          isOpen={isViewing}
          onClose={closeModals}
          title="Creative Details"
          size="md"
        >
          <div className="view-details">
            <div className="mb-4 text-center">
              <div className="border-radius-10px overflow-hidden border bg-light d-inline-block">
                <img src={viewingItem.imageUrl} alt={viewingItem.title} className="img-fluid" style={{ maxHeight: '300px' }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Title</label>
              <h5 className="fw-600 text-dark-gray">{viewingItem.title}</h5>
            </div>
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Category</label>
              <span className="badge bg-purple bg-opacity-10 text-purple px-3 py-2">
                {viewingItem.category?.name || 'Uncategorized'}
              </span>
            </div>
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Client</label>
              <span className="badge bg-light text-dark-gray px-3 py-2 border">
                {viewingItem.client?.name || '-'}
              </span>
            </div>
            <div className="mb-0">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Status</label>
              <span className={`badge ${viewingItem.published ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${viewingItem.published ? 'success' : 'danger'} px-3 py-2`}>
                {viewingItem.published ? 'Published' : 'Draft'}
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
              You are about to delete <span className="fw-700 text-dark">{selectedIds.length} items</span>. This action cannot be undone.
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
