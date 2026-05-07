'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Typically, you would send this to your backend API or a service like Formspree
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      // await fetch(`${apiUrl}/contact`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulating a network request for now until a contact endpoint is built on the backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStatus('success');
      setFormData({ name: '', email: '', comment: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting form", error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form-style-07">
      {status === 'success' && (
        <div className="alert alert-success border-radius-5px mb-4" role="alert">
          Thank you for reaching out! We'll get back to you shortly.
        </div>
      )}
      
      {status === 'error' && (
        <div className="alert alert-danger border-radius-5px mb-4" role="alert">
          Something went wrong. Please try again later or email us directly.
        </div>
      )}

      <div className="position-relative form-group mb-30px d-flex flex-md-row flex-column">
        <label className="form-label alt-font fs-26 md-fs-22 text-dark-gray mb-0 me-30px">My name is</label>
        <div className="position-relative col">
          <span className="form-icon"><i className="bi bi-person icon-small"></i></span>
          <input 
            className="ps-0 border-radius-0px border-color-transparent-dark-very-light bg-transparent form-control required" 
            type="text" 
            name="name" 
            placeholder="Enter your name here*" 
            value={formData.name}
            onChange={handleChange}
            required 
            disabled={status === 'loading'}
          />
        </div>
      </div>
      
      <div className="position-relative form-group mb-30px d-flex flex-md-row flex-column">
        <label className="form-label alt-font fs-26 md-fs-22 text-dark-gray mb-0 me-30px">Here is my email</label>
        <div className="position-relative col">
          <span className="form-icon"><i className="bi bi-envelope icon-small"></i></span>
          <input 
            className="ps-0 border-radius-0px border-color-transparent-dark-very-light bg-transparent form-control required" 
            type="email" 
            name="email" 
            placeholder="Enter your email here*" 
            value={formData.email}
            onChange={handleChange}
            required 
            disabled={status === 'loading'}
          />
        </div>
      </div>
      
      <div className="position-relative form-group form-textarea d-flex flex-md-row flex-column"> 
        <label className="form-label alt-font fs-26 md-fs-22 text-dark-gray mb-0 me-30px">I need a</label>
        <div className="position-relative col">
          <textarea 
            className="ps-0 border-radius-0px border-color-transparent-dark-very-light bg-transparent form-control" 
            name="comment" 
            placeholder="Enter your project details here" 
            rows="3"
            value={formData.comment}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
          ></textarea>
          <span className="form-icon"><i className="bi bi-chat-square-dots icon-small"></i></span>
        </div>
      </div>
      
      <div className="row mt-40px align-items-center">
        <div className="col-md-7 col-sm-7 lg-mb-30px md-mb-0">
          <p className="fs-14 lh-22 text-center text-sm-start mb-0 ">We are committed to protecting your privacy. We will never collect information about you without your explicit consent.</p>
        </div>
        <div className="col-md-5 col-sm-5 text-center text-sm-end xs-mt-25px">
          <button 
            className={`btn btn-dark-gray btn-medium btn-rounded btn-box-shadow d-inline-flex align-items-center submit ${status === 'loading' ? 'disabled' : ''}`} 
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...</>
            ) : (
              'Send message'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
