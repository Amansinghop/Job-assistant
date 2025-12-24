import React from 'react';
import { theme } from '../../styles/theme';

/**
 * Job Description Input Component
 * 
 * Large textarea for pasting job descriptions
 * 
 * @param {string} value - Current job description text
 * @param {function} onChange - Callback when text changes
 */
const JobDescriptionInput = ({ value, onChange }) => {
  const labelStyle = {
    display: 'block',
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '200px',
    padding: theme.spacing.md,
    fontSize: '16px',
    fontFamily: theme.fonts.main,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    resize: 'vertical', // User can resize vertically only
    outline: 'none',
    transition: theme.transitions.fast,
    lineHeight: '1.6',
  };

  const charCountStyle = {
    fontSize: '12px',
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
    textAlign: 'right',
  };

  return (
    <div>
      <label style={labelStyle}>
        Job Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here...

Example:
We are looking for a Senior Backend Developer with 5+ years of experience in Spring Boot, Python, and microservices architecture. Must have experience with PostgreSQL, Docker, and AWS..."
        style={textareaStyle}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.primary;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.colors.border;
        }}
      />
      <div style={charCountStyle}>
        {value.length} characters
        {value.length > 0 && ` • ${value.split(/\s+/).filter(Boolean).length} words`}
      </div>
    </div>
  );
};

export default JobDescriptionInput;