import React from 'react';
import { theme } from '../../styles/theme';
import { FiCheck, FiX } from 'react-icons/fi';

/**
 * Skills Comparison Component
 * 
 * Shows:
 * - Skills you have that match the job
 * - Skills you're missing
 * 
 * @param {Array} resumeSkills - Skills found in resume
 * @param {Array} jobSkills - Skills required by job
 * @param {Array} missingSkills - Skills you don't have
 */
const SkillsComparison = ({ resumeSkills, jobSkills, missingSkills }) => {
  const matchingSkills = resumeSkills.filter(skill => 
    jobSkills.includes(skill)
  );

  const sectionStyle = {
    marginBottom: theme.spacing.xl,
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const skillsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: theme.spacing.sm,
  };

  const skillBadgeStyle = (isMatch) => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.radius.full,
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: isMatch ? theme.colors.backgroundAlt : '#FFE5E5',
    border: `1px solid ${isMatch ? theme.colors.success : theme.colors.error}`,
    color: theme.colors.text,
  });

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };

  const statBoxStyle = {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.backgroundAlt,
    textAlign: 'center',
  };

  const statValueStyle = {
    fontSize: '36px',
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: theme.colors.textLight,
    fontWeight: '500',
  };

  return (
    <div>
      {/* Stats Overview */}
      <div style={statsContainerStyle}>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{matchingSkills.length}</div>
          <div style={statLabelStyle}>Matching Skills</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{missingSkills.length}</div>
          <div style={statLabelStyle}>Missing Skills</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{resumeSkills.length}</div>
          <div style={statLabelStyle}>Total Your Skills</div>
        </div>
      </div>

      {/* Matching Skills */}
      {matchingSkills.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={titleStyle}>
            <FiCheck style={{ color: theme.colors.success, fontSize: '24px' }} />
            Skills You Have ({matchingSkills.length})
          </h3>
          <div style={skillsGridStyle}>
            {matchingSkills.map((skill, index) => (
              <div key={index} style={skillBadgeStyle(true)}>
                <FiCheck style={{ color: theme.colors.success }} />
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={titleStyle}>
            <FiX style={{ color: theme.colors.error, fontSize: '24px' }} />
            Skills to Add ({missingSkills.length})
          </h3>
          <div style={skillsGridStyle}>
            {missingSkills.map((skill, index) => (
              <div key={index} style={skillBadgeStyle(false)}>
                <FiX style={{ color: theme.colors.error }} />
                {skill}
              </div>
            ))}
          </div>
          <p style={{ 
            marginTop: theme.spacing.md, 
            fontSize: '14px', 
            color: theme.colors.textLight 
          }}>
            💡 Consider adding these skills to your resume if you have experience with them.
          </p>
        </div>
      )}

      {/* All Resume Skills */}
      {resumeSkills.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={titleStyle}>
            All Your Skills ({resumeSkills.length})
          </h3>
          <div style={skillsGridStyle}>
            {resumeSkills.map((skill, index) => (
              <div 
                key={index} 
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  borderRadius: theme.radius.full,
                  fontSize: '14px',
                  backgroundColor: theme.colors.backgroundAlt,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.text,
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsComparison;