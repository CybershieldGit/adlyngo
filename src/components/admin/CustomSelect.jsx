'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * A custom styled select component matching the admin dashboard theme.
 * @param {Array} options - List of { value, label } objects.
 * @param {string} value - Current selected value.
 * @param {function} onChange - Callback when value changes.
 * @param {string} placeholder - Text to show when no value is selected.
 * @param {string} label - Optional label for the field.
 */
export default function CustomSelect({ options, value, onChange, placeholder = 'Select Option', label, direction = 'down' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={containerRef}>
      {label && <label className="form-label fs-14 fw-500">{label}</label>}
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        tabIndex="0"
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(!isOpen);
            }
        }}
      >
        <span className={!selectedOption ? 'text-muted' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <i className={`bi bi-chevron-down ms-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s ease' }}></i>
      </div>
      
      {isOpen && (
        <div className={`custom-select-options ${direction === 'up' ? 'up' : ''}`}>
          {options.length === 0 ? (
            <div className="custom-select-no-options">No options available</div>
          ) : (
            options.map(opt => (
              <div 
                key={opt.value} 
                className={`custom-select-option ${value === opt.value ? 'active' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
                {value === opt.value && <i className="bi bi-check2 ms-auto"></i>}
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
