'use client';

import dynamic from 'next/dynamic';

// Import TiptapEditor dynamically to avoid SSR issues
const TiptapEditor = dynamic(() => import('./TiptapEditor'), {
  ssr: false,
  loading: () => <div className="p-5 text-center border rounded">Loading Editor...</div>,
});

export default function RichTextEditor({ value, onChange, label }) {
  return (
    <TiptapEditor 
      value={value} 
      onChange={onChange} 
      label={label} 
    />
  );
}

