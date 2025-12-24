import React, { useState, useRef } from 'react';
import { theme } from '../../styles/theme';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import Button from '../common/Button';

/**
 * Resume Upload Component with Drag & Drop
 * 
 * Concept: Controlled Components
 * - React controls the component state
 * - Parent component knows what file is selected
 * 
 * Concept: Drag & Drop API
 * - Browser feature for dragging files
 * - Events: dragOver, dragLeave, drop
 * 
 * @param {function} onFileSelect - Callback when file is selected
 * @param {File} selectedFile - Currently selected file
 */
const ResumeUpload = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection from input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  // Validate file type and size
  const validateAndSelectFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    onFileSelect(file);
  };

  // Remove selected file
  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const containerStyle = {
    border: `2px dashed ${isDragging ? theme.colors.primary : theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xxl,
    textAlign: 'center',
    backgroundColor: isDragging ? theme.colors.hover : theme.colors.secondary,
    transition: theme.transitions.normal,
    cursor: 'pointer',
  };

  const iconStyle = {
    fontSize: '48px',
    color: isDragging ? theme.colors.primary : theme.colors.textLight,
    marginBottom: theme.spacing.md,
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  };

  const fileInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
  };

  const fileDetailsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const removeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: theme.colors.error,
    fontSize: '20px',
    padding: theme.spacing.sm,
  };

  return (
    <div>
      {!selectedFile ? (
        <div
          style={containerStyle}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <FiUpload style={iconStyle} />
          <h3 style={titleStyle}>
            {isDragging ? 'Drop your resume here' : 'Upload Your Resume'}
          </h3>
          <p style={subtitleStyle}>
            Drag and drop or click to browse
          </p>
          <p style={{ fontSize: '12px', color: theme.colors.textLight }}>
            Supported formats: PDF, DOCX (Max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div style={fileInfoStyle}>
          <div style={fileDetailsStyle}>
            <FiFile style={{ fontSize: '24px', color: theme.colors.primary }} />
            <div>
              <p style={{ fontWeight: '600', color: theme.colors.text }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: '12px', color: theme.colors.textLight }}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            style={removeButtonStyle}
            title="Remove file"
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;