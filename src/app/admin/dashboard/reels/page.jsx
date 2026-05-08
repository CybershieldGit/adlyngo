'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import CustomSelect from '@/components/admin/CustomSelect';
import Modal from '@/components/admin/Modal';

export default function ManageReels() {
  const [reels, setReels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', reelUrl: '', category: '', published: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const [reelsRes, catsRes] = await Promise.all([
        fetch(`${apiUrl}/reels`),
        fetch(`${apiUrl}/categories?type=reel`)
      ]);
      
      const reelsData = await reelsRes.json();
      const catsData = await catsRes.json();
      
      if (reelsData.success) setReels(reelsData.data.reels);
      if (catsData.success) {
        console.log(`Loaded ${catsData.data.categories.length} reel categories`);
        setCategories(catsData.data.categories);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this reel?')) return;
    setError('');
    setSuccess('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/reels/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setReels(reels.filter(r => r._id !== id));
        setSuccess('Reel deleted successfully.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Network error while deleting');
    }
  };

  const handleEdit = (reel) => {
    setEditingId(reel._id);
    setFormData({
      title: reel.title || '',
      reelUrl: reel.reelUrl || '',
      category: reel.category?._id || reel.category || '',
      published: reel.published ?? true
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', reelUrl: '', category: '', published: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
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
        if (isEditing) {
          setReels(reels.map(r => r._id === editingId ? data.data.reel : r));
          setSuccess('Reel updated successfully!');
        } else {
          setReels([data.data.reel, ...reels]);
          setSuccess('New reel added!');
        }
        closeModals();
      } else {
        setError(data.message || `Failed to ${isEditing ? 'update' : 'create'} reel`);
      }
    } catch (err) {
      setError(`Network error while ${isEditing ? 'updating' : 'creating'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading reels...</div>;

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 mt-2 mt-lg-0">
        <h3 className="fw-700 text-dark-gray mb-0">Manage Reels</h3>
        <button 
          className="btn btn-dark-gray btn-small btn-rounded px-4"
          onClick={() => {
            closeModals();
            setIsCreating(true);
          }}
          style={{ width: 'fit-content' }}
        >
          {isCreating ? 'Cancel' : (
            <span className="d-flex align-items-center">
              <i className="bi bi-plus-lg me-2"></i> Add New Reel
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
        isOpen={isCreating || isEditing}
        onClose={closeModals}
        title={isEditing ? "Edit Reel" : "Create New Reel"}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label fs-14 fw-500">Title</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required 
              />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Reel Video (Drag & Drop)</label>
              <FileUpload 
                type="video"
                folder="adlyngo/reels"
                onUploadSuccess={(result) => setFormData({...formData, reelUrl: result.url})} 
                currentUrl={formData.reelUrl}
              />
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Category"
                options={Array.isArray(categories) ? categories.map(c => ({ value: c._id || c.id, label: c.name })) : []}
                value={formData.category}
                onChange={val => setFormData({ ...formData, category: val })}
                placeholder="Select Category"
              />
            </div>
            <div className="col-md-12">
              <div className="form-check form-switch fs-14 mt-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={formData.published}
                  onChange={e => setFormData({...formData, published: e.target.checked})}
                />
                <label className="form-check-label fw-500">Published</label>
              </div>
            </div>
            <div className="col-12 mt-4 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded me-2" onClick={closeModals}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditing ? 'Update Reel' : 'Save Reel')}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted fs-14 text-uppercase">
              <tr>
                <th className="ps-4 py-3 fw-600 border-0">Title</th>
                <th className="py-3 fw-600 border-0">Category</th>
                <th className="py-3 fw-600 border-0">Status</th>
                <th className="py-3 fw-600 border-0">Date</th>
                <th className="pe-4 py-3 fw-600 border-0 text-end sticky-column-end bg-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No reels found. Create one above!</td>
                </tr>
              ) : (
                reels.map(reel => (
                  <tr key={reel._id}>
                    <td className="ps-4 py-3 fw-500">{reel.title}</td>
                    <td className="py-3">{reel.category?.name || 'Unknown'}</td>
                    <td className="py-3">
                      <span className={`badge ${reel.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${reel.published ? 'success' : 'secondary'} px-2 py-1`}>
                        {reel.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 fs-14 text-muted">
                      {new Date(reel.createdAt).toLocaleDateString()}
                    </td>
                    <td className="pe-4 py-3 text-end sticky-column-end">
                      <button 
                        className="btn btn-link text-primary p-0 me-3 text-decoration-none"
                        onClick={() => handleEdit(reel)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-link text-danger p-0 text-decoration-none" onClick={() => handleDelete(reel._id)}><i className="bi bi-trash"></i></button>
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
