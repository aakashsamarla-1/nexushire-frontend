import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

export const DragDropUpload = ({ onFileDrop, fileName, loading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileDrop(acceptedFiles[0]);
    }
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
  });

  return (
    <motion.div 
      {...getRootProps()} 
      className={`upload-box ${isDragActive ? 'drag-active' : ''}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{ cursor: 'pointer' }}
    >
      <input {...getInputProps()} />
      <div className="upload-icon">📄</div>
      {isDragActive ? (
        <p className="drag-text">📥 Drop your resume here...</p>
      ) : (
        <>
          <p className="drag-instruction">📤 Drag & drop your resume here, or click to select</p>
          <p className="drag-hint">Supports PDF, DOC, DOCX (Max 10MB)</p>
        </>
      )}
      {fileName && !loading && (
        <motion.div 
          className="file-name"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✅ {fileName}
        </motion.div>
      )}
      {loading && (
        <div className="uploading-indicator">
          <div className="spinner-small"></div>
          <span>Uploading...</span>
        </div>
      )}
    </motion.div>
  );
};
