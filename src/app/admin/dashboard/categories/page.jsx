'use client';

import { useState, useEffect } from 'react';
import CustomSelect from '@/components/admin/CustomSelect';
import Modal from '@/components/admin/Modal';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', type: 'blog', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchData = async (targetPage = page) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiUrl}/categories?page=${targetPage}&limit=10&search=${searchTerm}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories || []);
        setTotalPages(data.data.meta?.totalPages || 1);
        setTotalDocs(data.data.meta?.totalDocs || 0);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories([data.data.category, ...categories]);
        setSuccess('Category created successfully!');
        setIsCreating(false);
        setFormData({ name: '', slug: '', type: 'reel', description: '' });
      } else {
        setError(data.message || 'Failed to create category');
      }
    } catch (err) {
      setError('Network error while creating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This may affect items linked to this category.')) return;
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setCategories(categories.filter(c => c._id !== id));
        setSuccess('Category deleted.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Network error while deleting');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      description: cat.description || ''
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(categories.map(c => c._id === editingId ? data.data.category : c));
        setSuccess('Category updated successfully!');
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', slug: '', type: 'blog', description: '' });
      } else {
        setError(data.message || 'Failed to update category');
      }
    } catch (err) {
      setError('Network error while updating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (cat) => {
    setViewingCategory(cat);
    setIsViewing(true);
  };

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setIsBulkDeleting(false);
    setViewingCategory(null);
    setEditingId(null);
    setFormData({ name: '', slug: '', type: 'blog', description: '' });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
  };

  const confirmBulkDelete = async () => {
    setSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

      for (const id of selectedIds) {
        await fetch(`${apiUrl}/categories/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      await fetchData();
      setSelectedIds([]);

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
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map(c => c._id));
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5 mt-2 mt-lg-0">
        <h5 className="fw-700 text-dark-gray mb-0 text-nowrap">
          Manage Categories
        </h5>

        <div className="d-flex flex-row gap-2 w-100 w-md-auto align-items-center">
          <div className="position-relative flex-grow-1">
            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px', zIndex: 5 }}></i>
            <input
              type="text"
              className="form-control btn-rounded border-0 box-shadow-small"
              placeholder="Search categories..."
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
                setIsCreating(!isCreating);
                setError('');
                setSuccess('');
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              {isCreating ? 'Cancel' : (
                <>
                  <i className="bi bi-plus-lg me-1"></i> <span className="d-none d-sm-inline">Add New Category</span><span className="d-inline d-sm-none">Add</span>
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

      {success && (
        <div className="alert alert-success alert-dismissible fade show border-0 box-shadow-small mb-4" role="alert">
          <strong>Success!</strong> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <Modal
        isOpen={isCreating || isEditing}
        onClose={closeModals}
        title={isEditing ? "Edit Category" : "Create New Category"}
        size="lg"
      >
        <form onSubmit={isEditing ? handleUpdate : handleCreate}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fs-14 fw-500">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fs-14 fw-500">Slug</label>
              <input
                type="text"
                className="form-control"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Type"
                options={[
                  { value: 'reel', label: 'Reel (Video)' },
                  { value: 'blog', label: 'Blog (Article)' },
                  { value: 'project', label: 'Case Study' },
                  { value: 'gallery', label: 'Gallery (Creative)' }
                ]}
                value={formData.type}
                onChange={val => setFormData({ ...formData, type: val })}
              />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="col-12 mt-4 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded me-2" onClick={closeModals}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Save Category')}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="card admin-table-card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="admin-table-wrapper">
          <table className="table table-hover align-middle mb-0" style={{ minWidth: '900px' }}>
            <thead className=" text-muted fs-14 text-uppercase">
              <tr>
                <th className="py-3 border-0 sticky-column-header-start text-center" style={{ width: '70px' }}>
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <input
                      className="admin-checkbox"
                      type="checkbox"
                      checked={categories.length > 0 && selectedIds.length === categories.length}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="py-3 fw-600 border-0">Name</th>
                <th className="py-3 fw-600 border-0">Slug</th>
                <th className="py-3 fw-600 border-0">Type</th>
                <th className="py-3 fw-600 border-0">Description</th>
                <th className="py-3 fw-600 border-0 text-center sticky-column-end actions-column" style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(categories) || categories.length === 0) ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">No categories found.</td>
                </tr>
              ) : (
                categories?.map(cat => (
                  <tr key={cat._id} className={selectedIds.includes(cat._id) ? 'bg-light-gray' : ''}>
                    <td className="py-3 sticky-column-start text-center">
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <input
                          className="admin-checkbox"
                          type="checkbox"
                          checked={selectedIds.includes(cat._id)}
                          onChange={() => toggleSelect(cat._id)}
                        />
                      </div>
                    </td>
                    <td className="py-3 fw-500">{cat.name}</td>
                    <td className="py-3 text-muted">{cat.slug}</td>
                    <td className="py-3">
                      <span className={`badge bg-opacity-10 px-2 py-1 ${cat.type === 'reel' ? 'bg-primary text-primary' :
                        cat.type === 'project' ? 'bg-success text-success' :
                          cat.type === 'gallery' ? 'bg-purple text-purple' : 'bg-warning text-warning'
                        }`} style={cat.type === 'gallery' ? { color: '#6610f2', backgroundColor: 'rgba(102, 16, 242, 0.1)' } : {}}>
                        {cat.type === 'project' ? 'CASE STUDY' : cat.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-muted fs-13 text-truncate" style={{ maxWidth: '150px' }}>
                      {cat.description || '-'}
                    </td>
                    <td className="py-3 text-center sticky-column-end actions-column">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(cat)}
                          title="View"
                        >
                          <img src="/images/views.png" alt="View" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleEdit(cat)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(cat._id)}
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
              Showing <span className="text-dark-gray fw-700">{(page - 1) * 10 + 1}</span> to <span className="text-dark-gray fw-700">{Math.min(page * 10, totalDocs)}</span> of <span className="text-dark-gray fw-700">{totalDocs}</span> categories
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
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}
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
      {isViewing && viewingCategory && (
        <Modal
          isOpen={isViewing}
          onClose={closeModals}
          title="Category Details"
          size="md"
        >
          <div className="view-details">
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Category Name</label>
              <h5 className="fw-600 text-dark-gray">{viewingCategory.name}</h5>
            </div>
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Slug</label>
              <p className="fw-500 font-monospace">{viewingCategory.slug}</p>
            </div>
            <div className="mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Type</label>
              <span className="badge bg-admin-primary text-white px-3 py-2">
                {viewingCategory.type.toUpperCase()}
              </span>
            </div>
            {viewingCategory.description && (
              <div className="mb-0">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Description</label>
                <p className="fw-500">{viewingCategory.description}</p>
              </div>
            )}
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
              You are about to delete <span className="fw-700 text-dark">{selectedIds.length} categories</span>. This action cannot be undone and may affect linked items.
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
