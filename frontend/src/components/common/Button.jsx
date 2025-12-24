import React from 'react';
import { theme } from '../../styles/theme';

/**
 * Reusable Button Component
 * 
 * Concept: Component Composition
 * - Build complex UIs from simple, reusable pieces
 * - Like LEGO blocks - same piece, different uses
 * 
 * Props (properties passed to component):
 * @param {string} children - Button text
 * @param {function} onClick - What happens when clicked
 * @param {string} variant - 'primary' or 'secondary'
 * @param {boolean} disabled - Is button disabled?
 * @param {boolean} loading - Show loading state?
 * @param {string} type - 'button', 'submit', or 'reset'
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
}) => {
  const styles = {
    base: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      borderRadius: theme.radius.md,
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: theme.transitions.normal,
      fontFamily: theme.fonts.main,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.secondary,
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.md,
      },
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
    },
  };

  const buttonStyle = {
    ...styles.base,
    ...(variant === 'primary' ? styles.primary : styles.secondary),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = theme.shadows.md;
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;