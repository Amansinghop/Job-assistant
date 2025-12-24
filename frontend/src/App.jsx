import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './pages/Home';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

/**
 * Main App Component
 * 
 * Concept: Single Page Application (SPA)
 * - No page reloads
 * - React Router handles navigation
 * - Fast, smooth user experience
 * 
 * Concept: Component Hierarchy
 * - App is the root
 * - All other components are children
 * - Data flows down, events flow up
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* Header appears on all pages */}
        <Header />
        
        {/* Routes - which component to show for each URL */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/results" element={<ResultsPage />} />
          
          {/* 404 - Page not found */}
          <Route path="*" element={
            <div style={{ 
              textAlign: 'center', 
              padding: '100px 20px',
              fontSize: '24px',
              color: '#666',
            }}>
              <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
              <p>Page not found</p>
              <a href="/" style={{ 
                color: '#000', 
                textDecoration: 'underline',
                marginTop: '20px',
                display: 'inline-block',
              }}>
                Go back home
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;