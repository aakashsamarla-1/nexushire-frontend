import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '../common/ToastProvider';

export const CandidateNotes = ({ analysisId }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`notes_${analysisId}`);
    return saved || '';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes);

  const handleSave = () => {
    localStorage.setItem(`notes_${analysisId}`, tempNotes);
    setNotes(tempNotes);
    setIsEditing(false);
    showToast.success('📝 Notes saved successfully!');
  };

  const handleCancel = () => {
    setTempNotes(notes);
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="candidate-notes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="notes-header">
        <h4>📝 Recruiter Notes</h4>
        {!isEditing && (
          <button className="edit-notes-btn" onClick={() => { setIsEditing(true); setTempNotes(notes); }}>
            ✏️ Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="notes-editor">
          <textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            placeholder="Add your notes about this candidate..."
            rows="4"
          />
          <div className="notes-actions">
            <button className="save-notes-btn" onClick={handleSave}>💾 Save Notes</button>
            <button className="cancel-notes-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="notes-display" onClick={() => { setIsEditing(true); setTempNotes(notes); }}>
          {notes ? (
            <p>{notes}</p>
          ) : (
            <p className="notes-placeholder">📝 Click to add notes about this candidate...</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
