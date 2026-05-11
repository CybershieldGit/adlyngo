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

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchData = async (targetPage = page) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiUrl}/categories?page=${targetPage}&limit=10`);
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
  }, [page]);

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

  const handleView = (cat) => {
    setViewingCategory(cat);
    setIsViewing(true);
  };

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setViewingCategory(null);
    setEditingId(null);
    setFormData({ name: '', slug: '', type: 'blog', description: '' });
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 mt-2 mt-lg-0">
        <h3 className="fw-700 text-dark-gray mb-0">Manage Categories</h3>
        <button
          className="btn btn-dark-gray btn-small btn-rounded px-4"
          onClick={() => {
            setIsCreating(!isCreating);
            setError('');
            setSuccess('');
          }}
          style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
        >
          {isCreating ? 'Cancel' : (
            <span className="d-flex align-items-center">
              <i className="bi bi-plus-lg me-2"></i> Add New Category
            </span>
          )}
        </button>
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
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create New Category"
        size="lg"
      >
        <form onSubmit={handleCreate}>
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
                  { value: 'project', label: 'Project (Case Study)' }
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
              <button type="button" className="btn btn-light btn-small btn-rounded me-2" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className=" text-muted fs-14 text-uppercase">
              <tr>
                <th className="ps-4 py-3 fw-600 border-0">Name</th>
                <th className="py-3 fw-600 border-0">Slug</th>
                <th className="py-3 fw-600 border-0">Type</th>
                <th className="pe-4 py-3 fw-600 border-0 text-center sticky-column-end actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(categories) || categories.length === 0) ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">No categories found.</td>
                </tr>
              ) : (
                categories?.map(cat => (
                  <tr key={cat._id}>
                    <td className="ps-4 py-3 fw-500">{cat.name}</td>
                    <td className="py-3 text-muted">{cat.slug}</td>
                    <td className="py-3">
                      <span className={`badge bg-opacity-10 px-2 py-1 ${cat.type === 'reel' ? 'bg-primary text-primary' :
                        cat.type === 'project' ? 'bg-success text-success' : 'bg-warning text-warning'
                        }`}>
                        {cat.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-center sticky-column-end actions-column">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(cat)}
                          title="View"
                        >
                          <i className="bi bi-eye-fill" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(cat._id)}
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
            <div className="mb-0">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Type</label>
              <span className="badge bg-admin-primary text-white px-3 py-2">
                {viewingCategory.type.toUpperCase()}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
