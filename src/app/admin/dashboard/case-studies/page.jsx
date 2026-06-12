'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import CustomSelect from '@/components/admin/CustomSelect';
import Modal from '@/components/admin/Modal';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    clientName: '',
    client: '',
    liveUrl: '',
    coverImage: { url: '', publicId: '' },
    published: true,
    featured: false,
    socialLinks: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setIsBulkDeleting(false);
    setViewingProject(null);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      clientName: '',
      client: '',
      liveUrl: '',
      coverImage: { url: '', publicId: '' },
      published: true,
      featured: false,
      socialLinks: []
    });
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
        await fetch(`${apiUrl}/projects/${id}`, {
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
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(p => p._id));
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category?._id || project.category || '',
      clientName: project.clientName || '',
      client: project.client?._id || project.client || '',
      liveUrl: project.liveUrl || '',
      coverImage: project.coverImage || { url: '', publicId: '' },
      published: project.published ?? true,
      featured: project.featured ?? false,
      socialLinks: Array.isArray(project.socialLinks) ? project.socialLinks : []
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleView = (project) => {
    setViewingProject(project);
    setIsViewing(true);
  };

  const fetchData = async (targetPage = page) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const [projRes, catRes, clientRes] = await Promise.all([
        fetch(`${apiUrl}/projects?page=${targetPage}&limit=10&search=${searchTerm}`, { cache: 'no-store' }),
        fetch(`${apiUrl}/categories?type=project`, { cache: 'no-store' }),
        fetch(`${apiUrl}/clients`, { cache: 'no-store' })
      ]);

      const projData = await projRes.json();
      const catData = await catRes.json();
      const clientData = await clientRes.json();

      if (projData.success) {
        setProjects(projData.data.projects || []);
        setTotalPages(projData.data.meta.totalPages);
        setTotalDocs(projData.data.meta.totalDocs);
      }
      if (catData.success) {
        setCategories(catData.data.categories);
      }
      if (clientData.success) {
        setClients(clientData.data.clients || []);
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
        setSuccess(isEditing ? 'Project updated successfully!' : 'Project created successfully!');
        await fetchData(); // Re-fetch to ensure all data (like categories) is perfectly in sync
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5 mt-2 mt-lg-0">
        <h5 className="fw-700 text-dark-gray mb-0 text-nowrap">
          Manage Case Studies
        </h5>

        <div className="d-flex flex-row gap-2 w-100 w-md-auto align-items-center">
          <div className="position-relative flex-grow-1">
            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px', zIndex: 5 }}></i>
            <input
              type="text"
              className="form-control btn-rounded border-0 box-shadow-small"
              placeholder="Search case studies..."
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
                  <i className="bi bi-plus-lg me-1"></i> <span className="d-none d-sm-inline">Add Case Study</span><span className="d-inline d-sm-none">Add</span>
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
        title={isEditing ? "Edit Case Study" : "Add New Case Study"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Case Study Title</label>
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
              <CustomSelect
                label="Client (Optional)"
                options={clients.map(c => ({ value: c._id, label: c.name }))}
                value={formData.client}
                onChange={val => setFormData({ ...formData, client: val })}
                placeholder="Select Client"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">
                website URL (Optional)</label>
              <input type="text" className="form-control" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Cover Image (Drag & Drop)</label>
              <FileUpload
                type="image"
                onUploadSuccess={(result) => setFormData({ ...formData, coverImage: result })}
                currentUrl={formData.coverImage.url}
              />
            </div>
            <div className="col-md-6 mt-2">
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    id="projectFeaturedSwitch"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                  />
                </div>
                <label
                  className="fs-14 fw-500 text-dark-gray mb-0"
                  htmlFor="projectFeaturedSwitch"
                  style={{ cursor: 'pointer', userSelect: 'none', marginLeft: '5px' }}
                >
                  Featured on Home
                </label>
              </div>
            </div>

            {/* Social Media Links Section */}
            <div className="col-12 mt-4 pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fs-15 fw-700 text-dark-gray mb-0"><i className="bi bi-share me-2"></i>Social Media Links (Optional)</h6>
                <button
                  type="button"
                  className="btn btn-outline-dark-gray btn-sm btn-rounded py-1"
                  onClick={() => setFormData({ ...formData, socialLinks: [...formData.socialLinks, { platform: 'Facebook', url: '' }] })}
                >
                  <i className="bi bi-plus-lg me-1"></i> Add Link
                </button>
              </div>

              {formData.socialLinks.length === 0 ? (
                <div className="text-center py-3 border rounded-3 bg-light bg-opacity-50 text-muted fs-13">
                  No social links added yet.
                </div>
              ) : (
                <div className="row g-3">
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="col-12 p-3 border rounded-3 bg-light bg-opacity-10">
                      <div className="row g-2 align-items-center">
                        <div className="col-6 col-md-3">
                          <CustomSelect
                            options={[
                              { value: 'Facebook', label: 'Facebook' },
                              { value: 'Instagram', label: 'Instagram' },
                              { value: 'X (Twitter)', label: 'X (Twitter)' },
                              { value: 'LinkedIn', label: 'LinkedIn' },
                              { value: 'Reddit', label: 'Reddit' },
                              { value: 'YouTube', label: 'YouTube' },
                              { value: 'TikTok', label: 'TikTok' },
                              { value: 'Website', label: 'Website' },
                              { value: 'Other', label: 'Other' },
                            ]}
                            value={link.platform}
                            onChange={(val) => {
                              const newLinks = [...formData.socialLinks];
                              newLinks[index].platform = val;
                              setFormData({ ...formData, socialLinks: newLinks });
                            }}
                            placeholder="Platform"
                            className="mb-0"
                            direction="up"
                          />
                        </div>
                        <div className="col-12 col-md-8 order-3 order-md-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter URL (https://...)"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...formData.socialLinks];
                              newLinks[index].url = e.target.value;
                              setFormData({ ...formData, socialLinks: newLinks });
                            }}
                          />
                        </div>
                        <div className="col-6 col-md-1 order-2 order-md-3 text-end">
                          <button
                            type="button"
                            className="btn btn-danger-light btn-icon"
                            onClick={() => {
                              const newLinks = formData.socialLinks.filter((_, i) => i !== index);
                              setFormData({ ...formData, socialLinks: newLinks });
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded mt-3 me-2" onClick={closeModals}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded mt-3" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditing ? 'Update Case Study' : 'Save Case Study')}
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
                      checked={projects.length > 0 && selectedIds.length === projects.length}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="py-3 fw-600 border-0 ps-3" style={{ minWidth: '80px', whiteSpace: 'nowrap' }}>Image</th>
                <th className="py-3 fw-600 border-0 ps-3" style={{ minWidth: '150px', whiteSpace: 'nowrap' }}>Case Study</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Category</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Client</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>Status</th>
                <th className="py-3 fw-600 border-0 text-center sticky-column-end actions-column" style={{ minWidth: '180px', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(projects) || projects.length === 0) ? (
                <tr><td colSpan="7" className="text-center py-5">No case studies yet.</td></tr>
              ) : (
                projects?.map(p => (
                  <tr key={p._id} className={selectedIds.includes(p._id) ? 'bg-light-gray' : ''}>
                    <td className="py-3 sticky-column-start text-center">
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <input
                          className="admin-checkbox"
                          type="checkbox"
                          checked={selectedIds.includes(p._id)}
                          onChange={() => toggleSelect(p._id)}
                        />
                      </div>
                    </td>
                    <td className="ps-4 py-3" style={{ whiteSpace: 'nowrap' }}>
                      <div className="rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        {p.coverImage?.url ? (
                          <img src={p.coverImage.url} alt="" className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <i className="bi bi-image text-muted fs-18"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-3 fw-600 text-dark-gray ps-3" style={{ minWidth: '150px', whiteSpace: 'nowrap' }}>{p.title}</td>
                    <td className="py-3 text-dark-gray opacity-75" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>{p.category?.name || 'Uncategorized'}</td>
                    <td className="py-3 text-muted fs-13" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>{p.client?.name || p.clientName || '-'}</td>
                    <td className="py-3" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>
                      {p.featured && <span className="badge bg-warning bg-opacity-10 text-warning me-2">Featured</span>}
                      <span className={`badge ${p.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${p.published ? 'success' : 'secondary'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-center sticky-column-end actions-column">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(p)}
                          title="View"
                        >
                          <img src="/images/views.png" alt="View" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-primary-light btn-sm"
                          onClick={() => handleEdit(p)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(p._id)}
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
              Showing <span className="text-dark-gray fw-700">{(page - 1) * 10 + 1}</span> to <span className="text-dark-gray fw-700">{Math.min(page * 10, totalDocs)}</span> of <span className="text-dark-gray fw-700">{totalDocs}</span> case studies
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
      {isViewing && viewingProject && (
        <Modal
          isOpen={isViewing}
          onClose={closeModals}
          title="Case Study Details"
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
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Case Study Title</label>
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
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Client</label>
                <p className="fw-500">{viewingProject.client?.name || viewingProject.clientName || 'N/A'}</p>
              </div>
              <div className="mb-0">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Live URL</label>
                {viewingProject.liveUrl ? (
                  <a href={viewingProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-admin-primary fw-600">
                    {viewingProject.liveUrl} <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                ) : 'N/A'}
              </div>
              {Array.isArray(viewingProject.socialLinks) && viewingProject.socialLinks.length > 0 && (
                <div className="mt-4">
                  <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-2 d-block">Social Media</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {viewingProject.socialLinks.map((link, idx) => {
                      let iconClass = "bi-link-45deg";
                      let colorClass = "text-muted";
                      const p = link.platform.toLowerCase();

                      if (p.includes('facebook')) { iconClass = "bi-facebook"; colorClass = "text-primary"; }
                      else if (p.includes('instagram')) { iconClass = "bi-instagram"; colorClass = "text-danger"; }
                      else if (p.includes('twitter') || p === 'x') { iconClass = "bi-twitter-x"; colorClass = "text-dark"; }
                      else if (p.includes('linkedin')) { iconClass = "bi-linkedin"; colorClass = "text-primary"; }
                      else if (p.includes('reddit')) { iconClass = "bi-reddit"; colorClass = "text-orange"; }
                      else if (p.includes('youtube')) { iconClass = "bi-youtube"; colorClass = "text-danger"; }
                      else if (p.includes('tiktok')) { iconClass = "bi-tiktok"; colorClass = "text-dark"; }

                      return (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-light border btn-sm d-flex align-items-center gap-2 px-3"
                          style={{ borderRadius: '20px' }}
                        >
                          <i className={`bi ${iconClass} ${colorClass}`}></i>
                          <span className="fs-12 fw-600 text-dark-gray">{link.platform}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="col-12 mt-4 pt-4 border-top">
              <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-2 d-block">Description</label>
              <div className="text-muted fs-15 lh-26" dangerouslySetInnerHTML={{ __html: viewingProject.description }}></div>
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
              You are about to delete <span className="fw-700 text-dark">{selectedIds.length} case studies</span>. This action cannot be undone.
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
