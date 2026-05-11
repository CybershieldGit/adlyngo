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
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
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

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setViewingProject(null);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      clientName: '',
      liveUrl: '',
      coverImage: { url: '', publicId: '' },
      published: true,
      featured: false
    });
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category?._id || project.category || '',
      clientName: project.clientName || '',
      liveUrl: project.liveUrl || '',
      coverImage: project.coverImage || { url: '', publicId: '' },
      published: project.published ?? true,
      featured: project.featured ?? false
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleView = (project) => {
    setViewingProject(project);
    setIsViewing(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const url = isEditing ? `${apiUrl}/projects/${editingId}` : `${apiUrl}/projects`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        if (isEditing) {
          setProjects(projects.map(p => p._id === editingId ? data.data.project : p));
          setSuccess('Project updated successfully!');
        } else {
          setProjects([data.data.project, ...projects]);
          setSuccess('Project created successfully!');
        }
        closeModals();
      } else {
        setError(data.message || `Failed to ${isEditing ? 'update' : 'save'} project`);
      }
    } catch (err) {
      setError(`Error ${isEditing ? 'updating' : 'saving'} project`);
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
            closeModals();
            setIsCreating(true);
          }}
          style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
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
        isOpen={isCreating || isEditing}
        onClose={closeModals}
        title={isEditing ? "Edit Case Study" : "Add New Case Study"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Project Title</label>
              <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
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
              <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Client Name</label>
              <input type="text" className="form-control" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Live URL (Optional)</label>
              <input type="text" className="form-control" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Cover Image (Drag & Drop)</label>
              <FileUpload
                type="image"
                folder="adlyngo/projects"
                onUploadSuccess={(result) => setFormData({ ...formData, coverImage: result })}
                currentUrl={formData.coverImage.url}
              />
            </div>
            <div className="col-md-6">
              <div className="form-check form-switch mt-2">
                <input className="form-check-input" type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
                <label className="form-check-label fw-500">Featured on Home</label>
              </div>
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded mt-3 me-2" onClick={closeModals}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded mt-3" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Save Project')}
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
                <th className="ps-4 py-3 fw-600 border-0" style={{ width: '120px', whiteSpace: 'nowrap' }}>Image</th>
                <th className="py-3 fw-600 border-0 ps-3">Project</th>
                <th className="py-3 fw-600 border-0">Category</th>
                <th className="py-3 fw-600 border-0">Status</th>
                <th className="pe-4 py-3 fw-600 border-0 text-end sticky-column-end bg-light actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5">No projects yet.</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p._id}>
                    <td className="ps-4 py-3">
                      <div className="rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        {p.coverImage?.url ? (
                          <img src={p.coverImage.url} alt="" className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <i className="bi bi-image text-muted fs-18"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-3 fw-600 text-dark-gray ps-3">{p.title}</td>
                    <td className="py-3 text-dark-gray opacity-75">{p.category?.name || 'Uncategorized'}</td>
                    <td className="py-3">
                      {p.featured && <span className="badge bg-warning bg-opacity-10 text-warning me-2">Featured</span>}
                      <span className={`badge ${p.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${p.published ? 'success' : 'secondary'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-end sticky-column-end actions-column">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(p)}
                          title="View"
                        >
                          <i className="bi bi-eye-fill" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-icon btn-primary-light btn-sm"
                          onClick={() => handleEdit(p)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(p._id)}
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
      </div>
      {/* View Modal */}
      {isViewing && viewingProject && (
        <Modal
          isOpen={isViewing}
          onClose={closeModals}
          title="Project Details"
          size="lg"
        >
          <div className="view-details row">
            <div className="col-md-6 mb-4">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Cover Image</label>
              <div className="border-radius-10px overflow-hidden border">
                <img src={viewingProject.coverImage?.url} alt={viewingProject.title} className="img-fluid w-100" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Project Title</label>
                <h5 className="fw-600 text-dark-gray">{viewingProject.title}</h5>
              </div>
              <div className="mb-4">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Category</label>
                <span className="badge bg-light text-dark-gray px-3 py-2 border">
                  {viewingProject.category?.name || 'Uncategorized'}
                </span>
              </div>
              <div className="row">
                <div className="col-6 mb-4">
                  <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Status</label>
                  <span className={`badge ${viewingProject.published ? 'bg-success-light text-success' : 'bg-warning-light text-warning'} px-3 py-2`}>
                    {viewingProject.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="col-6 mb-4">
                  <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Featured</label>
                  <span className={`badge ${viewingProject.featured ? 'bg-primary-light text-primary' : 'bg-light text-muted'} px-3 py-2 border`}>
                    {viewingProject.featured ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Client Name</label>
                <p className="fw-500">{viewingProject.clientName || 'N/A'}</p>
              </div>
              <div className="mb-0">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Live URL</label>
                {viewingProject.liveUrl ? (
                  <a href={viewingProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-admin-primary fw-600">
                    {viewingProject.liveUrl} <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                ) : 'N/A'}
              </div>
            </div>
            <div className="col-12 mt-4 pt-4 border-top">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-2 d-block">Description</label>
              <div className="text-muted fs-15 lh-26" dangerouslySetInnerHTML={{ __html: viewingProject.description }}></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
