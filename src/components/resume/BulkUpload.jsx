import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { showToast } from '../common/ToastProvider';

export const BulkUpload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      showToast.success("✅ " + acceptedFiles.length + " files added");
      if (onUpload) {
        onUpload([...files, ...acceptedFiles]);
      }
    }
  }, [files, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 20,
    multiple: true,
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onUpload) {
      onUpload(newFiles);
    }
    showToast.info('File removed');
  };

  return (
    <div className="bulk-upload">
      <div {...getRootProps()} className={`bulk-upload-area ${isDragActive ? 'drag-active' : ''}`}>
        <input {...getInputProps()} multiple />
        <div className="bulk-icon">📁</div>
        <p>{isDragActive ? '📥 Drop files here...' : '📤 Drag & drop multiple resumes here'}</p>
        <p className="bulk-hint">Supports PDF, DOC, DOCX (Up to 20 files)</p>
        <p className="bulk-hint">Click or drag to select multiple files</p>
      </div>
      
      {files.length > 0 && (
        <div className="bulk-file-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>📎 Selected Files: {files.length}</h4>
            <button 
              className="clear-files-btn" 
              onClick={() => { 
                setFiles([]); 
                if (onUpload) onUpload([]);
                showToast.info('All files cleared'); 
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Clear All
            </button>
          </div>
          <ul style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {files.map((file, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span>📄 {file.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    marginLeft: '8px',
                    fontSize: '14px'
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
