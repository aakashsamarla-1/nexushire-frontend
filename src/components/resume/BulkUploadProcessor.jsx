import React, { useState } from 'react';
import { showToast } from '../common/ToastProvider';

export const BulkUploadProcessor = ({ files, onProcess }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processFiles = () => {
    if (files.length === 0) {
      showToast.error('No files to process');
      return;
    }
    setProcessing(true);
    setProgress(0);

    files.forEach((file, index) => {
      setTimeout(() => {
        const progressPercent = ((index + 1) / files.length) * 100;
        setProgress(progressPercent);
        showToast.info(`📄 Processing ${file.name}...`);
        
        if (index === files.length - 1) {
          setTimeout(() => {
            setProcessing(false);
            showToast.success(`✅ All ${files.length} files processed!`);
            if (onProcess) {
              onProcess(files);
            }
          }, 500);
        }
      }, (index + 1) * 2000);
    });
  };

  if (files.length === 0) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      <button 
        onClick={processFiles}
        disabled={processing}
        style={{
          width: '100%',
          padding: '12px',
          background: processing ? '#6b7280' : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: processing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s'
        }}
      >
        {processing ? `⏳ Processing... ${Math.round(progress)}%` : `🚀 Process ${files.length} Resumes`}
      </button>
      {processing && (
        <div style={{ marginTop: '8px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', transition: 'width 0.5s' }} />
        </div>
      )}
    </div>
  );
};
