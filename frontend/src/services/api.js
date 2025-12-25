import axios from 'axios';

// Base URL - change this when deploying
const BASE_URL = 'desirable-encouragement-production.up.railway.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * API Service
 * 
 * Concept: Service Layer Pattern
 * - All API calls in one place
 * - Easy to test and maintain
 * - Single source of truth for endpoints
 * 
 * Analogy: Like a receptionist who handles all external communication
 */
const apiService = {
  
  // ========== USER ENDPOINTS ==========
  
  /**
   * Create a new user
   * @param {Object} userData - {name, email, phone}
   * @returns {Promise} User object with ID
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get user by ID
   * @param {number} userId
   * @returns {Promise} User object
   */
  getUser: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all users
   * @returns {Promise} Array of users
   */
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // ========== RESUME ENDPOINTS ==========

  /**
   * Upload resume file
   * @param {number} userId
   * @param {File} file - PDF or DOCX file
   * @returns {Promise} Resume object with extracted text
   */
  uploadResume: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', file);

      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Analyze resume against job description
   * @param {number} resumeId
   * @param {string} jobDescription
   * @returns {Promise} Analysis results with match score
   */
  analyzeResume: async (resumeId, jobDescription) => {
    try {
      const response = await api.post('/resumes/analyze', {
        resumeId,
        jobDescription,
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get resume by ID
   * @param {number} resumeId
   * @returns {Promise} Resume object
   */
  getResume: async (resumeId) => {
    try {
      const response = await api.get(`/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all resumes for a user
   * @param {number} userId
   * @returns {Promise} Array of resumes
   */
  getUserResumes: async (userId) => {
    try {
      const response = await api.get(`/resumes/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all analyses for a resume
   * @param {number} resumeId
   * @returns {Promise} Array of analysis results
   */
  getResumeAnalyses: async (resumeId) => {
    try {
      const response = await api.get(`/resumes/${resumeId}/analyses`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all analyses for a user
   * @param {number} userId
   * @returns {Promise} Array of analysis results
   */
  getUserAnalyses: async (userId) => {
    try {
      const response = await api.get(`/resumes/analyses/user/${userId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Delete a resume
   * @param {number} resumeId
   * @returns {Promise}
   */
  deleteResume: async (resumeId) => {
    try {
      await api.delete(`/resumes/${resumeId}`);
      return { success: true };
    } catch (error) {
      throw handleError(error);
    }
  },
};

/**
 * Error handler
 * Extracts meaningful error messages from API responses
 */
function handleError(error) {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    return new Error(message);
  } else if (error.request) {
    // Request made but no response
    return new Error('Server is not responding. Please check if the backend is running.');
  } else {
    // Something else happened
    return new Error(error.message || 'An unexpected error occurred');
  }
}

export default apiService;