import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ResumeUpload from '../components/resume/ResumeUpload';
import JobDescriptionInput from '../components/resume/JobDescriptionInput';
import apiService from '../services/api';

const AnalyzePage = () => {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleAnalyze = async () => {
    if (!resumeFile) return setError('Please upload a resume');
    if (!jobDescription.trim()) return setError('Please enter a job description');

    setLoading(true);
    setError(null);

    try {
      const user = await apiService.createUser({
        name: 'Demo User',
        email: `user${Date.now()}@demo.com`,
        phone: '0000000000',
      });

      const resume = await apiService.uploadResume(user.id, resumeFile);
      const analysis = await apiService.analyzeResume(resume.id, jobDescription);

      navigate('/results', {
        state: { analysis, resumeFileName: resumeFile.name },
      });
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Responsive inner wrapper */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 0' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 700,
            marginBottom: theme.spacing.md,
          }}>
            Analyze Your Resume
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            color: theme.colors.textLight,
          }}>
            Upload your resume and paste a job description to get AI-powered insights
          </p>
        </div>

        {error && (
          <div style={{
            padding: theme.spacing.md,
            border: `1px solid ${theme.colors.error}`,
            borderRadius: theme.radius.md,
            background: '#FFE5E5',
            color: theme.colors.error,
            textAlign: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <Card>
            <Loading message={`Processing step ${currentStep}...`} />
          </Card>
        ) : (
          <>
            <Card title="Step 1: Upload Resume">
              <ResumeUpload
                onFileSelect={setResumeFile}
                selectedFile={resumeFile}
              />
            </Card>

            <Card title="Step 2: Job Description">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />
            </Card>

            <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
              <Button
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobDescription.trim()}
              >
                Analyze Resume →
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;
