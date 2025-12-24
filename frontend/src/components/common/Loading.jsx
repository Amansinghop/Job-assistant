import React from 'react';
import { theme } from '../../styles/theme';

/**
 * Loading Spinner Component
 * 
 * Shows when waiting for API responses
 * Improves user experience by indicating progress
 */
const Loading = ({ message = 'Loading...' }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const textStyle = {
    marginTop: theme.spacing.md,
    color: theme.colors.textLight,
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>{message}</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;