import React, { useState, useEffect } from 'react';
import { showToast } from './ToastProvider';
import jsPDF from 'jspdf';

export const ExportButton = ({ analyses, currentAnalysis }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [exportMode, setExportMode] = useState('current');

  // Debug: Log what we have
  useEffect(() => {
    console.log('ExportButton - analyses:', analyses);
    console.log('ExportButton - currentAnalysis:', currentAnalysis);
  }, [analyses, currentAnalysis]);

  const generatePDF = (selectedAnalyses, mode) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper functions
    const addText = (text, size = 12, style = 'normal', color = '#000000', align = 'left') => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(size);
      pdf.setTextColor(color);
      pdf.setFont('helvetica', style);
      pdf.text(text, align === 'center' ? pageWidth / 2 : 20, yPosition, { align });
      yPosition += size * 0.5 + 4;
    };

    const addHeader = (text, icon = '') => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(16);
      pdf.setTextColor('#1e40af');
      pdf.setFont('helvetica', 'bold');
      pdf.text(icon + ' ' + text, 20, yPosition);
      yPosition += 10;
      pdf.setDrawColor(30, 64, 175);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 6;
      pdf.setFont('helvetica', 'normal');
    };

    const addCard = (title, items, type = '') => {
      if (!items || items.length === 0) return;
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }
      
      addHeader(title);
      
      if (type === 'tags') {
        let currentLine = 20;
        let currentY = yPosition;
        pdf.setFontSize(11);
        pdf.setTextColor('#000000');
        items.forEach((item, index) => {
          const text = '• ' + item;
          const textWidth = pdf.getStringUnitWidth(text) * 11 / pdf.internal.scaleFactor;
          const xPos = currentLine;
          if (xPos + textWidth + 20 > pageWidth - 20) {
            currentLine = 20;
            currentY += 8;
          }
          pdf.text(text, currentLine, currentY);
          currentLine += textWidth + 8;
        });
        yPosition = currentY + 12;
      } else {
        pdf.setFontSize(11);
        pdf.setTextColor('#000000');
        items.forEach((item, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text((index + 1) + '. ' + item, 25, yPosition);
          yPosition += 7;
        });
      }
      yPosition += 4;
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setTextColor('#1e40af');
    pdf.setFont('helvetica', 'bold');
    pdf.text('NexusHire AI', pageWidth / 2, 60, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.setTextColor('#1f2937');
    pdf.text('Resume Analysis Report', pageWidth / 2, 80, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setTextColor('#6b7280');
    pdf.setFont('helvetica', 'normal');
    pdf.text('Generated on: ' + new Date().toLocaleString(), pageWidth / 2, 100, { align: 'center' });
    
    const count = selectedAnalyses.length;
    pdf.setFontSize(14);
    pdf.setTextColor('#374151');
    pdf.text('Export Mode: ' + (mode === 'current' ? 'Current Resume' : mode === 'all' ? 'All Resumes' : 'Selected Resumes'), pageWidth / 2, 130, { align: 'center' });
    pdf.text('Total Resumes: ' + count, pageWidth / 2, 142, { align: 'center' });
    
    if (count > 0) {
      const avgScore = Math.round(selectedAnalyses.reduce((sum, a) => sum + a.score, 0) / count);
      const maxScore = Math.max(...selectedAnalyses.map(a => a.score));
      const minScore = Math.min(...selectedAnalyses.map(a => a.score));
      pdf.text('Average Score: ' + avgScore + '%', pageWidth / 2, 162, { align: 'center' });
      pdf.text('Highest Score: ' + maxScore + '%', pageWidth / 2, 172, { align: 'center' });
      pdf.text('Lowest Score: ' + minScore + '%', pageWidth / 2, 182, { align: 'center' });
    }
    
    pdf.addPage();
    yPosition = 20;

    // Content pages
    selectedAnalyses.forEach((analysis, index) => {
      if (index > 0) {
        pdf.addPage();
        yPosition = 20;
      }

      // Resume name header
      pdf.setFontSize(16);
      pdf.setTextColor('#1e40af');
      pdf.setFont('helvetica', 'bold');
      const name = analysis.resumeName || 'Resume ' + (index + 1);
      pdf.text('Resume: ' + name, 20, yPosition);
      yPosition += 12;
      pdf.setFont('helvetica', 'normal');

      // Score cards
      const scores = [
        { label: 'Overall', value: analysis.score + '%' },
        { label: 'ATS', value: (analysis.atsScore || analysis.score - 5) + '%' },
        { label: 'Keywords', value: (analysis.keywordMatch || analysis.score - 8) + '%' }
      ];
      
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      scores.forEach((score, i) => {
        const xPos = 20 + (i * 62);
        pdf.setFillColor(102, 126, 234);
        pdf.roundedRect(xPos, yPosition - 3, 54, 28, 5, 5, 'F');
        pdf.setTextColor('#ffffff');
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(score.value, xPos + 27, yPosition + 8, { align: 'center' });
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(score.label, xPos + 27, yPosition + 21, { align: 'center' });
      });
      yPosition += 32;

      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Summary
      addHeader('Summary');
      pdf.setFontSize(11);
      pdf.setTextColor('#374151');
      const summaryLines = pdf.splitTextToSize(analysis.summary || 'No summary available', pageWidth - 40);
      summaryLines.forEach(line => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 4;

      // Sections
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      addCard('Strengths', analysis.strengths, 'tags');

      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      addCard('Missing Skills', analysis.missingSkills, 'tags');

      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Use recommendations (or improvements as fallback)
      const recommendations = analysis.recommendations || analysis.improvements;
      addCard('Recommendations', recommendations);

      yPosition += 8;
    });

    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor('#9ca3af');
      pdf.text('Generated by NexusHire AI', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page ' + i + ' of ' + totalPages, pageWidth - 20, pageHeight - 10, { align: 'right' });
    }

    return pdf;
  };

  const handleExport = () => {
    if (!analyses || analyses.length === 0) {
      showToast.error('No data to export');
      return;
    }

    let selectedAnalyses = [];

    if (exportMode === 'current') {
      // Use the currentAnalysis if provided, otherwise use the latest
      if (currentAnalysis) {
        selectedAnalyses = [currentAnalysis];
      } else {
        // Fallback: find the analysis with the latest timestamp
        const sorted = [...analyses].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        selectedAnalyses = [sorted[0]];
      }
    } else if (exportMode === 'all') {
      selectedAnalyses = analyses;
    } else if (exportMode === 'selected' && selectedIndex !== null) {
      selectedAnalyses = [analyses[selectedIndex]];
    } else {
      showToast.error('Please select an analysis to export');
      return;
    }

    if (!selectedAnalyses || selectedAnalyses.length === 0) {
      showToast.error('No analysis found to export');
      return;
    }

    try {
      showToast.loading('Generating PDF...');
      const pdf = generatePDF(selectedAnalyses, exportMode);
      pdf.save(`resume-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`);
      showToast.dismiss();
      showToast.success('PDF exported successfully!');
      setShowModal(false);
    } catch (e) {
      console.error('PDF Export error:', e);
      showToast.dismiss();
      showToast.error('Failed to export PDF: ' + e.message);
    }
  };

  // Export Modal
  const ExportModal = () => (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
        <h2>Export PDF</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>Select which resume analysis to export</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            <input 
              type="radio" 
              name="exportMode" 
              value="current" 
              checked={exportMode === 'current'} 
              onChange={() => setExportMode('current')}
              style={{ marginRight: '8px' }}
            />
            Current Resume (The one you're viewing now)
          </label>
          
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            <input 
              type="radio" 
              name="exportMode" 
              value="all" 
              checked={exportMode === 'all'} 
              onChange={() => setExportMode('all')}
              style={{ marginRight: '8px' }}
            />
            All Resumes ({analyses.length} analyses)
          </label>
          
          {analyses.length > 1 && (
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              <input 
                type="radio" 
                name="exportMode" 
                value="selected" 
                checked={exportMode === 'selected'} 
                onChange={() => setExportMode('selected')}
                style={{ marginRight: '8px' }}
              />
              Select Specific Resume:
            </label>
          )}
          
          {exportMode === 'selected' && (
            <select 
              value={selectedIndex !== null ? selectedIndex : ''} 
              onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginTop: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select a resume...</option>
              {analyses.map((a, i) => (
                <option key={i} value={i}>
                  {a.resumeName || 'Resume ' + (i + 1)} - {a.score}% ({new Date(a.timestamp).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            onClick={handleExport}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Export PDF
          </button>
          <button 
            onClick={() => setShowModal(false)}
            style={{
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (!analyses || analyses.length === 0) {
    return null;
  }

  return (
    <>
      <button 
        className="export-btn pdf-btn" 
        onClick={() => setShowModal(true)}
        style={{
          padding: '10px 24px',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
          marginTop: '8px'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        📄 Export PDF
      </button>
      {showModal && <ExportModal />}
    </>
  );
};
