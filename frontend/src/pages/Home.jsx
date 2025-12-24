import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import Button from '../components/common/Button';
import { FiUpload, FiTarget, FiCheckCircle } from 'react-icons/fi';

/**
 * Landing Page
 * 
 * First page users see
 * Explains what the app does and encourages action
 */
const Home = () => {
  const navigate = useNavigate();

  const heroStyle = {
    textAlign: 'center',
    padding: `${theme.spacing.xxl} 0`,
    maxWidth: '800px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '56px',
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: '1.2',
  };

  const subtitleStyle = {
    fontSize: '20px',
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xxl,
    lineHeight: '1.6',
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xxl,
  };

  const featureCardStyle = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.secondary,
    transition: theme.transitions.normal,
  };

  const featureIconStyle = {
    fontSize: '48px',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  };

  const featureTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  };

  const featureDescStyle = {
    fontSize: '14px',
    color: theme.colors.textLight,
    lineHeight: '1.6',
  };

  const features = [
    {
      icon: <FiUpload />,
      title: 'Upload Resume',
      description: 'Simply drag and drop your resume (PDF or DOCX format)',
    },
    {
      icon: <FiTarget />,
      title: 'AI Analysis',
      description: 'Our AI analyzes your resume against job requirements using machine learning',
    },
    {
      icon: <FiCheckCircle />,
      title: 'Get Insights',
      description: 'Receive match score, missing skills, and personalized improvement suggestions',
    },
  ];

  return (
    <div className="container">
      <div style={heroStyle}>
        <h1 style={titleStyle}>
          AI-Powered Resume Analyzer
        </h1>
        <p style={subtitleStyle}>
          Get instant feedback on how well your resume matches job descriptions.
          Powered by machine learning and natural language processing.
        </p>
        <Button 
          onClick={() => navigate('/analyze')}
          variant="primary"
        >
          Start Analyzing →
        </Button>
      </div>

      <div style={featuresStyle}>
        {features.map((feature, index) => (
          <div 
            key={index} 
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={featureIconStyle}>{feature.icon}</div>
            <h3 style={featureTitleStyle}>{feature.title}</h3>
            <p style={featureDescStyle}>{feature.description}</p>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        padding: theme.spacing.xxl,
        backgroundColor: theme.colors.backgroundAlt,
        borderRadius: theme.radius.lg,
        marginTop: theme.spacing.xxl,
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: theme.spacing.md }}>
          How It Works
        </h2>
        <p style={{ fontSize: '16px', color: theme.colors.textLight, maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
          Our system uses <strong>TF-IDF vectorization</strong> and <strong>cosine similarity</strong> to measure how well your resume matches job descriptions.
          We extract skills using <strong>spaCy NLP</strong> and provide a hybrid score combining text similarity (70%) and exact skill matching (30%).
        </p>
      </div>
    </div>
  );
};

export default Home;