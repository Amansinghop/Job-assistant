from flask import Flask, request, jsonify
from flask_cors import CORS
from models.resume_parser import ResumeParser
from models.job_matcher import JobMatcher
import logging

# Configure logging to see what's happening
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

# Enable CORS - allows Spring Boot (port 8080) to call this service (port 5000)
CORS(app)

# Initialize ML models once when server starts
# This is more efficient than creating new instances for each request
parser = ResumeParser()
matcher = JobMatcher()

logger.info("ML models initialized successfully")


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    Spring Boot can ping this to verify service is running.
    
    Test with: curl http://localhost:5000/health
    """
    return jsonify({
        'status': 'healthy',
        'service': 'Python ML Service',
        'version': '1.0.0'
    }), 200


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Main ML endpoint - analyzes resume against job description.
    
    Expected input (JSON):
    {
        "resume_text": "Full resume text here...",
        "job_description": "Job requirements here..."
    }
    
    Returns (JSON):
    {
        "matchScore": 75.5,
        "resumeSkills": ["python", "java", "sql"],
        "jobSkills": ["python", "docker", "aws"],
        "missingSkills": ["docker", "aws"],
        "suggestions": ["Add quantifiable achievements..."]
    }
    """
    try:
        # Step 1: Get data from request
        data = request.get_json()
        
        if not data:
            logger.error("No data provided in request")
            return jsonify({'error': 'No data provided'}), 400
        
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        # Step 2: Validate input
        if not resume_text or not job_description:
            logger.error("Missing resume_text or job_description")
            return jsonify({
                'error': 'Both resume_text and job_description are required'
            }), 400
        
        logger.info(f"Processing analysis - Resume: {len(resume_text)} chars, Job: {len(job_description)} chars")
        
        # Step 3: Calculate match score using TF-IDF + Cosine Similarity
        match_score = matcher.calculate_match_score(resume_text, job_description)
        logger.info(f"Match score calculated: {match_score}%")
        
        # Step 4: Extract skills from both texts
        resume_skills = parser.extract_skills(resume_text)
        job_skills = parser.extract_skills(job_description)
        logger.info(f"Skills extracted - Resume: {len(resume_skills)}, Job: {len(job_skills)}")
        
        # Step 5: Find missing skills
        missing_skills = matcher.get_missing_skills(resume_skills, job_skills)
        logger.info(f"Missing skills identified: {len(missing_skills)}")
        
        # Step 6: Generate personalized suggestions
        suggestions = matcher.suggest_improvements(resume_text, job_description, match_score)
        
        # Step 7: Prepare response
        response = {
            'matchScore': round(match_score, 2),
            'resumeSkills': resume_skills,
            'jobSkills': job_skills,
            'missingSkills': missing_skills,
            'suggestions': suggestions
        }
        
        logger.info("Analysis complete, sending response")
        return jsonify(response), 200
        
    except Exception as e:
        # Log the full error for debugging
        logger.error(f"Error in analysis: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    logger.info("Starting Python ML Service on port 5000...")
    app.run(
        host='0.0.0.0',  # Listen on all network interfaces
        port=5000,        # Port number
        debug=True        # Enable debug mode (auto-reload on code changes)
    )