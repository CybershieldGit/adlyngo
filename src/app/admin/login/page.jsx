'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const loginEmail = formData.get('email');
    const loginPassword = formData.get('password');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Backend sets HTTP-only cookie, so we just redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-very-light-gray">
      <div className="card border-0 box-shadow-extra-large border-radius-10px p-5" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <Image src="/images/logo.svg" alt="Adlyngo Admin" width={150} height={40} className="mb-4" />
          <h4 className="text-dark-gray fw-600 mb-0">Admin Access</h4>
          <p className="text-muted fs-14">Sign in to manage your content</p>
        </div>

        {error && (
          <div className="alert alert-danger fs-14 py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-dark-gray fw-500 fs-14">Email address</label>
            <input 
              name="email"
              type="email" 
              className="form-control" 
              required 
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-dark-gray fw-500 fs-14">Password</label>
            <input 
              name="password"
              type="password" 
              className="form-control" 
              required 
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-dark-gray btn-medium w-100 btn-rounded" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
