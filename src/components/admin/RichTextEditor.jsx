'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="p-5 text-center border rounded">Loading Editor...</div>,
});

export default function RichTextEditor({ value, onChange, label }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list',
    'link', 'code-block',
  ];

  return (
    <div className="rich-text-editor mb-4">
      {label && <label className="form-label fs-14 fw-500 mb-2">{label}</label>}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Start writing..."
      />
    </div>
  );
}
