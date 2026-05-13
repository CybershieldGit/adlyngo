'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';
import CustomSelect from '@/components/admin/CustomSelect';
import Modal from '@/components/admin/Modal';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    thumbnail: { url: '', publicId: '' },
    published: true,
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (targetPage = page) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const [blogRes, catRes] = await Promise.all([
        fetch(`${apiUrl}/blogs?page=${targetPage}&limit=10`, { cache: 'no-store' }),
        fetch(`${apiUrl}/categories?type=blog`, { cache: 'no-store' })
      ]);

      const blogData = await blogRes.json();
      const catData = await catRes.json();

      if (blogData.success) {
        setBlogs(blogData.data.blogs || []);
        setTotalPages(blogData.data.meta.totalPages);
        setTotalDocs(blogData.data.meta.totalDocs);
      }
      if (catData.success) {
        console.log(`Loaded ${catData.data.categories.length} blog categories`);
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
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const url = isEditing ? `${apiUrl}/blogs/${editingId}` : `${apiUrl}/blogs`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(isEditing ? 'Blog post updated!' : 'Blog post published!');
        await fetchData(); // Re-fetch to ensure all data (like categories, dates) is perfectly in sync
        closeModals();
      } else {
        setError(data.message || `Failed to ${isEditing ? 'update' : 'publish'} blog`);
      }
    } catch (err) {
      setError(`Error ${isEditing ? 'updating' : 'saving'} blog`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category?._id || blog.category || '',
      thumbnail: blog.thumbnail || { url: '', publicId: '' },
      published: blog.published ?? true,
      featured: blog.featured ?? false
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleView = (blog) => {
    setViewingBlog(blog);
    setIsViewing(true);
  };

  const closeModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setIsViewing(false);
    setViewingBlog(null);
    setEditingId(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', thumbnail: { url: '', publicId: '' }, published: true, featured: false });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setBlogs(blogs.filter(b => b._id !== id));
        setSuccess('Article deleted.');
      } else {
        setError('Failed to delete article');
      }
    } catch (err) {
      setError('Error deleting');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex flex-row justify-content-between align-items-center gap-2 mb-5 mt-2 mt-lg-0">
        <h5 className="fw-700 text-dark-gray mb-0 text-truncate" style={{ flex: 1, minWidth: 0 }}>
          Manage Blog Posts
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
              <i className="bi bi-plus-lg me-1"></i> New Post
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
        title={isEditing ? "Edit Article" : "Create New Article"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fs-14 fw-500">Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                required
              />
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
              <label className="form-label fs-14 fw-500">Excerpt</label>
              <input type="text" className="form-control" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Brief summary of the post" />
            </div>
            <div className="col-12">
              <label className="form-label fs-14 fw-500">Post Thumbnail (Drag & Drop)</label>
              <FileUpload
                type="image"
                folder="adlyngo/blogs"
                onUploadSuccess={(result) => setFormData({ ...formData, thumbnail: result })}
                currentUrl={formData.thumbnail.url}
              />
            </div>
            <div className="col-12">
              <RichTextEditor
                label="Content"
                value={formData.content}
                onChange={val => setFormData({ ...formData, content: val })}
              />
            </div>
            <div className="col-md-6 mt-3">
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    id="blogFeaturedSwitch"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ cursor: 'pointer', width: '36px', height: '18px' }}
                  />
                </div>
                <label 
                  className="fs-14 fw-500 text-dark-gray mb-0" 
                  htmlFor="blogFeaturedSwitch" 
                  style={{ cursor: 'pointer', userSelect: 'none', marginLeft: '5px' }}
                >
                  Featured on Home
                </label>
              </div>
            </div>
            <div className="col-12 text-end">
              <button type="button" className="btn btn-light btn-small btn-rounded mt-3 me-2" onClick={closeModals}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-small btn-rounded mt-3" disabled={submitting}>
                {submitting ? 'Saving...' : (isEditing ? 'Update Blog' : 'Publish Blog')}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewing}
        onClose={closeModals}
        title="View Article"
        size="lg"
      >
        {viewingBlog && (
          <div className="view-blog-details">
            <div className="row g-4">
              {viewingBlog.thumbnail?.url && (
                <div className="col-12">
                  <img
                    src={viewingBlog.thumbnail.url}
                    alt={viewingBlog.title}
                    className="img-fluid rounded-4 mb-3 border"
                    style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="col-12">
                <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">
                  {viewingBlog.category?.name || 'Uncategorized'}
                </span>
                <h2 className="fw-700 text-dark-gray mb-3">{viewingBlog.title}</h2>
                <div className="d-flex align-items-center gap-3 text-muted fs-14 mb-4">
                  <span><i className="bi bi-calendar-event me-1"></i> {new Date(viewingBlog.createdAt).toLocaleDateString()}</span>
                  <span><i className="bi bi-eye me-1"></i> {viewingBlog.views || 0} views</span>
                  {viewingBlog.featured && <span className="text-warning"><i className="bi bi-star-fill me-1"></i> Featured</span>}
                </div>
                <div className="excerpt-box p-3 bg-light rounded-3 mb-4">
                  <h6 className="fw-600 mb-1 fs-14 text-uppercase text-muted">Excerpt</h6>
                  <p className="mb-0 text-dark-gray">{viewingBlog.excerpt || 'No excerpt provided.'}</p>
                </div>
                <div className="content-preview">
                  <h6 className="fw-600 mb-3 fs-14 text-uppercase text-muted border-bottom pb-2">Content Preview</h6>
                  <div
                    className="tiptap-content p-0"
                    dangerouslySetInnerHTML={{ __html: viewingBlog.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div className="card admin-table-card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <div className="admin-table-wrapper">
          <table className="table table-hover align-middle mb-0">
            <thead className=" text-muted fs-14 text-uppercase">
              <tr>
                <th className="py-3 fw-600 border-0 ps-3" style={{ minWidth: '80px', whiteSpace: 'nowrap' }}>Image</th>
                <th className="py-3 fw-600 border-0 ps-3" style={{ minWidth: '150px', whiteSpace: 'nowrap' }}>Article Title</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>Category</th>
                <th className="py-3 fw-600 border-0" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>Status</th>
                <th className="pe-4 py-3 fw-600 border-0 text-center sticky-column-end actions-column" style={{ whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(blogs) || blogs.length === 0) ? (
                <tr><td colSpan="5" className="text-center py-5">No articles yet. Start writing!</td></tr>
              ) : (
                blogs?.map(b => (
                  <tr key={b._id}>
                    <td className="ps-4 py-3" style={{ whiteSpace: 'nowrap' }}>
                      <div className="rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        {b.thumbnail?.url ? (
                          <img src={b.thumbnail.url} alt="" className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <i className="bi bi-image text-muted fs-18"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-3 fw-600 text-dark-gray ps-3" style={{ minWidth: '150px', whiteSpace: 'nowrap' }}>{b.title}</td>
                    <td className="py-3 text-dark-gray opacity-75" style={{ minWidth: '120px', whiteSpace: 'nowrap' }}>{b.category?.name || 'Uncategorized'}</td>
                    <td className="py-3" style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>
                      {b.featured && <span className="badge bg-warning bg-opacity-10 text-warning me-2">Featured</span>}
                      <span className={`badge ${b.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${b.published ? 'success' : 'secondary'}`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-center sticky-column-end actions-column">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-icon btn-light-gray btn-sm"
                          onClick={() => handleView(b)}
                          title="View"
                        >
                          <i className="bi bi-eye-fill" style={{ fontSize: '14px' }}></i>
                        </button>
                        <button
                          className="btn btn-icon btn-primary-light btn-sm"
                          onClick={() => handleEdit(b)}
                          title="Edit"
                        >
                          <img src="/images/edit.png" alt="Edit" />
                        </button>
                        <button
                          className="btn btn-icon btn-danger-light btn-sm"
                          onClick={() => handleDelete(b._id)}
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
              Showing <span className="text-dark-gray fw-700">{(page - 1) * 10 + 1}</span> to <span className="text-dark-gray fw-700">{Math.min(page * 10, totalDocs)}</span> of <span className="text-dark-gray fw-700">{totalDocs}</span> articles
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
    </div>
  );
}
