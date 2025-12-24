import React from 'react';
import { theme } from '../../styles/theme';

/**
 * Card Component
 * 
 * A container that groups related content
 * Used throughout the app for consistent styling
 * 
 * @param {React.ReactNode} children - Content inside card
 * @param {string} title - Optional card title
 * @param {object} style - Additional custom styles
 */
const Card = ({ children, title, style = {} }) => {
  const cardStyle = {
    backgroundColor: theme.colors.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.sm,
    marginBottom: theme.spacing.lg,
    ...style,
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  };

  return (
    <div style={cardStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;