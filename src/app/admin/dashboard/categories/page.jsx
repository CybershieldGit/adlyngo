'use client';

import { useState, useEffect } from 'react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', type: 'reel', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/categories`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories);
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
    fetchCategories();
  }, []);

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

  if (loading) return <div>Loading categories...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-700 text-dark-gray mb-0">Manage Categories</h3>
        <button 
          className="btn btn-dark-gray btn-small btn-rounded"
          onClick={() => {
            setIsCreating(!isCreating);
            setError('');
            setSuccess('');
          }}
        >
          {isCreating ? 'Cancel' : '+ Add New Category'}
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

      {isCreating && (
        <div className="card border-0 box-shadow-small border-radius-10px p-4 bg-white mb-4">
          <h5 className="fw-600 mb-3">Create New Category</h5>
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fs-14 fw-500">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                  required 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fs-14 fw-500">Slug</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fs-14 fw-500">Type</label>
                <select 
                  className="form-select" 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="reel">Reel (Video)</option>
                  <option value="blog">Blog (Article)</option>
                  <option value="project">Project (Case Study)</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fs-14 fw-500">Description</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="col-12 mt-4">
                <button type="submit" className="btn btn-primary btn-small btn-rounded" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted fs-14 text-uppercase">
              <tr>
                <th className="ps-4 py-3 fw-600 border-0">Name</th>
                <th className="py-3 fw-600 border-0">Slug</th>
                <th className="py-3 fw-600 border-0">Type</th>
                <th className="pe-4 py-3 fw-600 border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">No categories found.</td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat._id}>
                    <td className="ps-4 py-3 fw-500">{cat.name}</td>
                    <td className="py-3 text-muted">{cat.slug}</td>
                    <td className="py-3">
                      <span className={`badge bg-opacity-10 px-2 py-1 ${
                        cat.type === 'reel' ? 'bg-primary text-primary' : 
                        cat.type === 'project' ? 'bg-success text-success' : 'bg-warning text-warning'
                      }`}>
                        {cat.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <button className="btn btn-link text-danger p-0 text-decoration-none" onClick={() => handleDelete(cat._id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
