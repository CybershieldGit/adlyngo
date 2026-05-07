'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/admin/FileUpload';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
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

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const [blogRes, catRes] = await Promise.all([
        fetch(`${apiUrl}/blogs`),
        fetch(`${apiUrl}/categories?type=blog`)
      ]);
      
      const blogData = await blogRes.json();
      const catData = await catRes.json();
      
      if (blogData.success) setBlogs(blogData.data.blogs);
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
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiUrl}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setBlogs([data.data.blog, ...blogs]);
        setSuccess('Blog post published!');
        setIsCreating(false);
        setFormData({ title: '', slug: '', excerpt: '', content: '', category: '', thumbnail: { url: '', publicId: '' }, published: true, featured: false });
      } else {
        setError(data.message || 'Failed to publish blog');
      }
    } catch (err) {
      setError('Error saving blog');
    } finally {
      setSubmitting(false);
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-700 text-dark-gray mb-0">Manage Blog Posts</h3>
        <button 
          className="btn btn-dark-gray btn-small btn-rounded" 
          onClick={() => {
            setIsCreating(!isCreating);
            setError('');
            setSuccess('');
          }}
        >
          {isCreating ? 'Cancel' : '+ New Post'}
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
          <h5 className="fw-600 mb-3">Create New Article</h5>
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fs-14 fw-500">Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fs-14 fw-500">Category</label>
                <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fs-14 fw-500">Excerpt</label>
                <input type="text" className="form-control" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Brief summary of the post" />
              </div>
              <div className="col-12">
                <label className="form-label fs-14 fw-500">Post Thumbnail (Drag & Drop)</label>
                <FileUpload 
                  type="image"
                  folder="adlyngo/blogs"
                  onUploadSuccess={(result) => setFormData({...formData, thumbnail: result})} 
                  currentUrl={formData.thumbnail.url}
                />
              </div>
              <div className="col-12">
                <label className="form-label fs-14 fw-500">Content (Markdown supported)</label>
                <textarea className="form-control" rows="8" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required></textarea>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch mt-2">
                  <input className="form-check-input" type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                  <label className="form-check-label fw-500">Feature this post</label>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary btn-small btn-rounded mt-3" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card border-0 box-shadow-small border-radius-10px bg-white overflow-hidden">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light text-muted fs-14 text-uppercase">
            <tr>
              <th className="ps-4 py-3 fw-600 border-0">Article Title</th>
              <th className="py-3 fw-600 border-0">Category</th>
              <th className="py-3 fw-600 border-0">Status</th>
              <th className="pe-4 py-3 fw-600 border-0 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-5">No articles yet. Start writing!</td></tr>
            ) : (
              blogs.map(b => (
                <tr key={b._id}>
                  <td className="ps-4 py-3 fw-500">{b.title}</td>
                  <td className="py-3 text-muted">{b.category?.name || 'Uncategorized'}</td>
                  <td className="py-3">
                    {b.featured && <span className="badge bg-warning bg-opacity-10 text-warning me-2">Featured</span>}
                    <span className={`badge ${b.published ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${b.published ? 'success' : 'secondary'}`}>
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="pe-4 py-3 text-end">
                    <button className="btn btn-link text-danger p-0" onClick={() => handleDelete(b._id)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
