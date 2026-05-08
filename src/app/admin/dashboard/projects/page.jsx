'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import CustomSelect from '@/components/admin/CustomSelect';
import Modal from '@/components/admin/Modal';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    clientName: '', 
    liveUrl: '', 
    coverImage: { url: '', publicId: '' },
    published: true,
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const [projRes, catRes] = await Promise.all([
        fetch(`${apiUrl}/projects`),
        fetch(`${apiUrl}/categories?type=project`)
      ]);
      
      const projData = await projRes.json();
      const catData = await catRes.json();
      
      if (projData.success) setProjects(projData.data.projects);
      if (catData.success) {
        console.log(`Loaded ${catData.data.categories.length} project categories`);
        setCategories(catData.data.categories);
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setProjects([data.data.project, ...projects]);
        setSuccess('Project saved successfully!');
        setIsCreating(false);
        setFormData({ title: '', description: '', category: '', clientName: '', liveUrl: '', coverImage: { url: '', publicId: '' }, published: true, featured: false });
      } else {
        setError(data.message || 'Failed to save project');
      }
    } catch (err) {
      setError('Error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/projects/${id}`, { 
        method: 'DELETE',
        credentials: 'include' 
      });
      if (response.ok) {
        setProjects(projects.filter(p => p._id !== id));
        setSuccess('Project deleted.');
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 mt-2 mt-lg-0">
        <h3 className="fw-700 text-dark-gray mb-0">Manage Projects</h3>
        <button 
          className="btn btn-dark-gray btn-small btn-rounded px-4" 
          onClick={() => {
            setIsCreating(!isCreating);
            setError('');
            setSuccess('');
          }}
          style={{ width: 'fit-content' }}
        >
          {isCreating ? 'Cancel' : (
            <span className="d-flex align-items-center">
              <i className="bi bi-plus-lg me-2"></i> Add Project
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
        title="Add New Case Study"
        size="lg"
      >
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Project Title</label>
              <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
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
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Short Description</label>
              <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Client Name</label>
              <input type="text" className="form-control" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Live URL (Optional)</label>
              <input type="text" className="form-control" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Cover Image (Drag & Drop)</label>
              <FileUpload 
                type="image"
                folder="adlyngo/projects"
                onUploadSuccess={(result) => setFormData({...formData, coverImage: result})} 
                currentUrl={formData.coverImage.url}
              />
            </div>
            <div className="col-md-6">
              <div className="form-check form-switch mt-2">
                <input className="form-check-input" type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                <label className="form-check-label fw-500">Featured on Home</label>
              </div>
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded mt-3 me-2" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded mt-3" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Project'}
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
                <th className="ps-4 py-3 fw-600 border-0">Project</th>
                <th className="py-3 fw-600 border-0">Category</th>
                <th className="py-3 fw-600 border-0">Status</th>
                <th className="pe-4 py-3 fw-600 border-0 text-end sticky-column-end bg-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-5">No projects yet.</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p._id}>
                    <td className="ps-4 py-3 fw-500">{p.title}</td>
                    <td className="py-3 text-muted">{p.category?.name || 'Uncategorized'}</td>
                    <td className="py-3">
                      {p.featured && <span className="badge bg-warning bg-opacity-10 text-warning me-2">Featured</span>}
                      <span className={`badge ${p.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${p.published ? 'success' : 'secondary'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-end sticky-column-end">
                      <button className="btn btn-link text-danger p-0" onClick={() => handleDelete(p._id)}><i className="bi bi-trash"></i></button>
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
