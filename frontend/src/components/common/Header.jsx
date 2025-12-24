import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header
      style={{
        width: '100vw',
        backgroundColor: '#000',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#fff',
            fontSize: '22px',
            fontWeight: '800',
            textDecoration: 'none',
          }}
        >
          Resume Analyzer
        </Link>

        <nav style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/analyze" style={{ color: '#fff', textDecoration: 'none' }}>
            Analyze
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
