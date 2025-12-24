import React from 'react';
import { theme } from '../../styles/theme';
import { Link } from 'react-router-dom';

/**
 * App Header/Navigation Bar
 * 
 * Concept: Layout Components
 * - Structural components that appear on every page
 * - Provide consistent navigation
 */
const Header = () => {
  const headerStyle = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    padding: `${theme.spacing.lg} 0`,
    borderBottom: `2px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.xxl,
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.lg}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle = {
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '-1px',
  };

  const navStyle = {
    display: 'flex',
    gap: theme.spacing.lg,
    alignItems: 'center',
  };

  const linkStyle = {
    color: theme.colors.secondary,
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: theme.transitions.fast,
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          Resume Analyzer
        </Link>
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/analyze" style={linkStyle}>
            Analyze
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;