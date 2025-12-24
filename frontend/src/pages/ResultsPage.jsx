import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import MatchScore from '../components/analysis/MatchScore';
import SkillsComparison from '../components/analysis/SkillsComparison';
import Suggestions from '../components/analysis/Suggestions';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { analysis, resumeFileName } = location.state || {};

  if (!analysis) {
    navigate('/analyze');
    return null;
  }

  const {
    matchScore,
    resumeSkills,
    jobSkills,
    missingSkills,
    suggestions,
    analyzedAt,
  } = analysis;

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  };

  const titleStyle = {
    fontSize: 'clamp(28px, 5vw, 36px)',
    fontWeight: 700,
    marginBottom: theme.spacing.sm,
  };

  const metaStyle = {
    fontSize: '14px',
    color: theme.colors.textLight,
  };

  const actionsStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  };

  const handleDownloadReport = () => {
    const report = `
RESUME ANALYSIS REPORT
Generated: ${new Date(analyzedAt).toLocaleString()}
Resume: ${resumeFileName}

MATCH SCORE: ${matchScore.toFixed(1)}%

MISSING SKILLS:
${missingSkills.join(', ')}

AI SUGGESTIONS:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      {/* Inner responsive wrapper */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 0' }}>

        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Analysis Results</h1>
            <div style={metaStyle}>
              Resume: <strong>{resumeFileName}</strong> •{' '}
              Analyzed: <strong>{new Date(analyzedAt).toLocaleString()}</strong>
            </div>
          </div>

          <div style={actionsStyle}>
            <Button
              variant="secondary"
              onClick={() => navigate('/analyze')}
            >
              <FiArrowLeft /> New Analysis
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadReport}
            >
              <FiDownload /> Download Report
            </Button>
          </div>
        </div>

        <Card>
          <MatchScore score={matchScore} />
        </Card>

        <Card title="Skills Analysis">
          <SkillsComparison
            resumeSkills={resumeSkills}
            jobSkills={jobSkills}
            missingSkills={missingSkills}
          />
        </Card>

        <Card>
          <Suggestions suggestions={suggestions} />
        </Card>

        <details style={{
          marginTop: theme.spacing.xl,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.backgroundAlt,
          borderRadius: theme.radius.md,
        }}>
          <summary style={{ fontWeight: 600 }}>
            🔬 Technical Details
          </summary>
          <p style={{ marginTop: theme.spacing.md, fontSize: '14px', color: theme.colors.textLight }}>
            TF-IDF + Cosine Similarity (70%)<br />
            Exact Skill Matching (30%)<br />
            NLP Engine: spaCy
          </p>
        </details>

        <div style={{
          marginTop: theme.spacing.xl,
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.primary,
          color: theme.colors.secondary,
          borderRadius: theme.radius.lg,
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>
            What’s Next?
          </h3>
          <p style={{ margin: `${theme.spacing.md} 0` }}>
            Improve your resume using these insights and re-analyze.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/analyze')}
          >
            Analyze Another Resume
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;
