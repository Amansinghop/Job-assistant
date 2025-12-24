import React from 'react';
import { theme } from '../../styles/theme';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

/**
 * Match Score Display with Visual Chart
 * 
 * Concept: Data Visualization
 * - Numbers are boring, charts are engaging
 * - Pie chart shows match percentage visually
 * 
 * @param {number} score - Match score (0-100)
 */
const MatchScore = ({ score }) => {
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 70) return theme.colors.success;
    if (score >= 40) return theme.colors.warning;
    return theme.colors.error;
  };

  // Determine message based on score
  const getScoreMessage = (score) => {
    if (score >= 70) return 'Excellent Match!';
    if (score >= 40) return 'Good Match';
    return 'Needs Improvement';
  };

  const scoreColor = getScoreColor(score);
  const scoreMessage = getScoreMessage(score);

  // Data for pie chart
  const data = [
    { name: 'Match', value: score },
    { name: 'Gap', value: 100 - score },
  ];

  const containerStyle = {
    textAlign: 'center',
    padding: theme.spacing.lg,
  };

  const scoreValueStyle = {
    fontSize: '72px',
    fontWeight: '800',
    color: scoreColor,
    marginBottom: theme.spacing.sm,
    lineHeight: '1',
  };

  const scoreMessageStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: theme.colors.textLight,
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  return (
    <div style={containerStyle}>
      <div style={scoreValueStyle}>
        {score.toFixed(1)}%
      </div>
      <div style={scoreMessageStyle}>
        {scoreMessage}
      </div>
      
      {/* Visual Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill={scoreColor} />
            <Cell fill={theme.colors.backgroundAlt} />
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <p style={descriptionStyle}>
        {score >= 70 && "Your resume is a strong match for this position. Highlight your relevant experiences in your cover letter."}
        {score >= 40 && score < 70 && "Your resume shows relevant experience. Consider emphasizing skills mentioned in the job description."}
        {score < 40 && "Your resume could be better tailored to this position. Focus on adding relevant skills and experiences."}
      </p>
    </div>
  );
};

export default MatchScore;