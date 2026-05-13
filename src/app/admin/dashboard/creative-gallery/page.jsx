'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import Modal from '@/components/admin/Modal';
import CustomSelect from '@/components/admin/CustomSelect';

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    publicId: '',
    published: true,
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchData = async (targetPage = page) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      // Fetch Gallery Items and Categories in parallel
      const [galleryRes, categoriesRes] = await Promise.all([
        fetch(`${apiUrl}/gallery?page=${targetPage}&limit=10`),
        fetch(`${apiUrl}/categories?type=gallery&limit=100`)
      ]);
      
      const galleryData = await galleryRes.json();
      const categoriesData = await categoriesRes.json();
      
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
    setViewingItem(null);
    setEditingId(null);
    setFormData({
      title: '',
      imageUrl: '',
      publicId: '',
      published: true,
      category: ''
    });
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
      category: item.category?._id || item.category || ''
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setError('Please upload an image first');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const url = editingId ? `${apiUrl}/gallery/${editingId}` : `${apiUrl}/gallery`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? 'Gallery item updated!' : 'Gallery item created!');
        fetchData(); // Refresh list
        setTimeout(closeModals, 1500);
      } else {
        setError(data.message || 'Action failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/gallery/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Item deleted successfully');
        fetchData();
      } else {
        setError(data.message || 'Delete failed');
      }
    } catch (err) {
      setError('Network error while deleting');
    }
  };

  if (loading && page === 1) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5">
        <h3 className="fw-700 text-dark-gray mb-0">Creative Gallery</h3>
        <button
          className="btn btn-dark-gray btn-small btn-rounded px-4"
          onClick={() => setIsCreating(true)}
        >
          <span className="d-flex align-items-center">
            <i className="bi bi-plus-lg me-2"></i> Add New Image
          </span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger border-0 box-shadow-small mb-4" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success border-0 box-shadow-small mb-4" role="alert">
          <strong>Success!</strong> {success}
        </div>
      )}

      <div className="card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="text-muted fs-14 text-uppercase">
              <tr>
                <th className="ps-4 py-3 fw-600 border-0">Image</th>
                <th className="py-3 fw-600 border-0">Title</th>
                <th className="py-3 fw-600 border-0">Category</th>
                <th className="py-3 fw-600 border-0">Status</th>
                <th className="pe-4 py-3 fw-600 border-0 text-center sticky-column-end actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(items) || items.length === 0) ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No items found in gallery.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4 py-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="rounded-2 shadow-sm"
                        style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="py-3 fw-600 text-dark-gray">{item.title}</td>
                    <td className="py-3">
                      <span className="badge bg-purple bg-opacity-10 text-purple px-2 py-1" style={{ color: '#6610f2', backgroundColor: 'rgba(102, 16, 242, 0.1)' }}>
                        {item.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`badge bg-opacity-10 px-2 py-1 ${item.published ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-center sticky-column-end actions-column">
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
                          onClick={() => handleDelete(item._id)}
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
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center px-4 py-3 border-top bg-light bg-opacity-50 gap-3">
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
          title={isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          size="md"
        >
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-7">
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
              <div className="col-md-5">
                <CustomSelect
                  label="Category"
                  options={categories.map(c => ({ value: c._id, label: c.name }))}
                  value={formData.category}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                  placeholder="Select Category"
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

            <div className="mb-4 d-flex align-items-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="publishedSwitch"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label className="form-check-label fs-14 fw-500 text-dark-gray ms-2" htmlFor="publishedSwitch">
                  Publish publicly
                </label>
              </div>
            </div>

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
                className="btn btn-primary btn-rounded btn-small flex-grow-1"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  editingId ? 'Update Item' : 'Create Item'
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
            <div className="mb-0">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Status</label>
              <span className={`badge ${viewingItem.published ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${viewingItem.published ? 'success' : 'danger'} px-3 py-2`}>
                {viewingItem.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
