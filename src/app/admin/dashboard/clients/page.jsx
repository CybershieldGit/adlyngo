'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/admin/Modal';
import FileUpload from '@/components/admin/FileUpload';

export default function ManageClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingClient, setViewingClient] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    logo: { url: '', publicId: '' }, 
    description: ''
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
      const res = await fetch(`${apiUrl}/clients?page=${targetPage}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setClients(data.data.clients || []);
        setTotalPages(data.data.meta?.totalPages || 1);
        setTotalDocs(data.data.meta?.totalDocs || 0);
      } else {
        throw new Error(data.message || 'Failed to fetch clients');
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
      const response = await fetch(`${apiUrl}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setClients([data.data.client, ...clients]);
        setSuccess('Client created successfully!');
        setIsCreating(false);
        resetForm();
      } else {
        setError(data.message || 'Failed to create client');
      }
    } catch (err) {
      setError('Network error while creating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/clients/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setClients(clients.filter(c => c._id !== id));
        setSuccess('Client deleted.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Network error while deleting');
    }
  };

  const handleEdit = (client) => {
    setEditingId(client._id);
    setFormData({
      name: client.name,
      slug: client.slug,
      logo: client.logo || { url: '', publicId: '' },
      description: client.description || '',
      website: client.website || ''
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
      const response = await fetch(`${apiUrl}/clients/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setClients(clients.map(c => c._id === editingId ? data.data.client : c));
        setSuccess('Client updated successfully!');
        setIsEditing(false);
        setEditingId(null);
        resetForm();
      } else {
        setError(data.message || 'Failed to update client');
      }
    } catch (err) {
      setError('Network error while updating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (client) => {
    setViewingClient(client);
    setIsViewing(true);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      slug: '', 
      logo: { url: '', publicId: '' }, 
      description: ''
    });
  };

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setViewingClient(null);
    setEditingId(null);
    resetForm();
  };

  if (loading) return <div>Loading clients...</div>;

  return (
    <div>
      <div className="d-flex flex-row justify-content-between align-items-center gap-2 mb-5 mt-2 mt-lg-0">
        <h5 className="fw-700 text-dark-gray mb-0 text-truncate" style={{ flex: 1, minWidth: 0 }}>
          Manage Clients
        </h5>
        <button
          className="btn btn-dark-gray btn-small btn-rounded px-3 flex-shrink-0"
          onClick={() => {
            setIsCreating(!isCreating);
            setError('');
            setSuccess('');
          }}
          style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
        >
          {isCreating ? 'Cancel' : (
            <span className="d-flex align-items-center">
              <i className="bi bi-plus-lg me-1"></i> Add New Client
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
        title={isEditing ? "Edit Client" : "Create New Client"}
        size="lg"
      >
        <form onSubmit={isEditing ? handleUpdate : handleCreate}>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label fs-14 fw-500">Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={e => setFormData({ 
                  ...formData, 
                  name: e.target.value, 
                  slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]/g, '-') 
                })}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fs-14 fw-500">Logo</label>
              <FileUpload
                type="image"
                onUploadSuccess={(result) => setFormData({ ...formData, logo: { url: result.url, publicId: result.publicId } })}
                onRemove={() => setFormData({ ...formData, logo: { url: '', publicId: '' } })}
                currentUrl={formData.logo?.url}
                folder="adlyngo/clients"
              />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="col-12 mt-4 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded me-2" onClick={closeModals}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditing ? 'Update Client' : 'Save Client')}
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
                <th className="ps-4 py-3 fw-600 border-0">Logo</th>
                <th className="py-3 fw-600 border-0">Name</th>
                <th className="py-3 fw-600 border-0">Description</th>
                <th className="pe-4 py-3 fw-600 border-0 text-center sticky-column-end actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(clients) || clients.length === 0) ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No clients found.</td>
                </tr>
              ) : (
                clients?.map(client => (
                  <tr key={client._id}>
                    <td className="ps-4 py-3">
                      {client.logo?.url ? (
                        <img src={client.logo.url} alt={client.name} style={{ height: '30px', maxWidth: '60px', objectFit: 'contain' }} />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center text-muted fs-10" style={{ width: '40px', height: '30px' }}>No Logo</div>
                      )}
                    </td>
                    <td className="py-3 fw-500">{client.name}</td>
                    <td className="py-3 text-muted fs-13 text-truncate" style={{ maxWidth: '200px' }}>
                      {client.description || '-'}
                    </td>
                    <td className="pe-4 py-3 text-center sticky-column-end actions-column">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(client)}
                          title="View"
                        >
                          <i className="bi bi-eye-fill" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleEdit(client)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" style={{ width: '14px' }} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(client._id)}
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
              Showing <span className="text-dark-gray fw-700">{(page - 1) * 10 + 1}</span> to <span className="text-dark-gray fw-700">{Math.min(page * 10, totalDocs)}</span> of <span className="text-dark-gray fw-700">{totalDocs}</span> clients
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
      {isViewing && viewingClient && (
        <Modal
          isOpen={isViewing}
          onClose={closeModals}
          title="Client Details"
          size="md"
        >
          <div className="view-details text-center">
            {viewingClient.logo?.url && (
              <div className="mb-4">
                <img src={viewingClient.logo.url} alt={viewingClient.name} style={{ maxHeight: '80px', maxWidth: '100%' }} />
              </div>
            )}
            <div className="text-start">
              <div className="mb-4">
                <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Client Name</label>
                <h5 className="fw-600 text-dark-gray">{viewingClient.name}</h5>
              </div>
              {viewingClient.description && (
                <div className="mb-0">
                  <label className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1 d-block">Description</label>
                  <p className="fw-500">{viewingClient.description}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
