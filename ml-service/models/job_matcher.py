from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

class JobMatcher:
    """
    Calculates match score between resume and job description.
    Uses TF-IDF and Cosine Similarity.
    """
    
    def __init__(self):
        """
        Initialize TF-IDF vectorizer.
        
        What is TF-IDF?
        - TF (Term Frequency): How often a word appears in document
        - IDF (Inverse Document Frequency): How rare/common a word is
        - Formula: TF-IDF = TF × IDF
        
        Why TF-IDF?
        - Converts text into numbers that computers can compare
        - Important words get higher scores
        - Common words (the, is, and) get lower scores
        
        Parameters explained:
        - stop_words='english': Ignore common words like 'the', 'is'
        - max_features=1000: Consider top 1000 important words
        - ngram_range=(1,2): Consider single words AND pairs of words
          Example: "machine learning" is one ngram, "machine" is another
        """
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=1000,
            ngram_range=(1, 2)
        )
    
    def calculate_match_score(self, resume_text, job_description):
        """Calculate match score with skill bonus"""
        
        # Get base TF-IDF score
        base_score = self._calculate_tfidf_score(resume_text, job_description)
        
        # Get skill overlap bonus
        from models.resume_parser import ResumeParser
        parser = ResumeParser()
        
        resume_skills = set(parser.extract_skills(resume_text))
        job_skills = set(parser.extract_skills(job_description))
        
        if len(job_skills) > 0:
            skill_overlap = len(resume_skills & job_skills) / len(job_skills)
            # Bonus: 0-30 points based on skill overlap
            skill_bonus = skill_overlap * 30
        else:
            skill_bonus = 0
        
        # Final score: 70% TF-IDF + 30% skill match
        final_score = (base_score * 0.7) + skill_bonus
        
        return min(final_score, 100)  # Cap at 100

    def _calculate_tfidf_score(self, resume_text, job_description):
        """Original TF-IDF calculation"""
        if not resume_text or not job_description:
            return 0.0
        
        resume_clean = self._clean_text(resume_text)
        job_clean = self._clean_text(job_description)
        
        try:
            documents = [resume_clean, job_clean]
            tfidf_matrix = self.vectorizer.fit_transform(documents)
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return similarity * 100
        except Exception as e:
            print(f"Error calculating TF-IDF score: {e}")
            return 0.0
    
    def get_missing_skills(self, resume_skills, job_skills):
        """
        Find skills required by job but missing in resume.
        
        Uses set operations:
        job_skills - resume_skills = missing_skills
        
        Example:
        Resume has: ["python", "java", "sql"]
        Job needs: ["python", "docker", "aws", "sql"]
        Missing: ["docker", "aws"]
        """
        resume_skills_set = set([s.lower() for s in resume_skills])
        job_skills_set = set([s.lower() for s in job_skills])
        
        # Set subtraction: job - resume = missing
        missing = list(job_skills_set - resume_skills_set)
        return sorted(missing)
    
    def suggest_improvements(self, resume_text, job_description, match_score):
        """
        Generate personalized improvement suggestions.
        
        Checks for:
        1. Match score range (how good is the match?)
        2. Quantifiable achievements (numbers, percentages)
        3. Action verbs (developed, implemented, led)
        4. Weak phrases ("responsible for")
        5. Resume length (too short or too long?)
        """
        suggestions = []
        
        resume_lower = resume_text.lower()
        
        # Score-based feedback
        if match_score < 40:
            suggestions.append(
                "Your resume needs significant improvements to match this job. "
                "Consider tailoring it more closely to the job requirements."
            )
        elif match_score < 60:
            suggestions.append(
                "Your resume shows some relevant experience, but could be stronger. "
                "Focus on highlighting relevant skills and achievements."
            )
        elif match_score < 75:
            suggestions.append(
                "Good match! Consider adding a few more relevant keywords and "
                "specific achievements to strengthen your application."
            )
        else:
            suggestions.append(
                "Excellent match! Your resume aligns well with this job description. "
                "Make sure to highlight your most relevant experiences."
            )
        
        # Check for quantifiable achievements
        # Looks for: 30%, 5x, $50,000, etc.
        has_numbers = re.search(
            r'\d+%|\d+x|\d+\s*(?:million|thousand|hundred)|\$\d+',
            resume_lower
        )
        if not has_numbers:
            suggestions.append(
                "💡 Add quantifiable achievements (e.g., 'Improved performance by 30%', "
                "'Led team of 5 developers', 'Reduced costs by $10,000')."
            )
        
        # Check for strong action verbs
        action_verbs = [
            'developed', 'implemented', 'designed', 'led', 'created',
            'built', 'managed', 'optimized', 'achieved', 'delivered',
            'launched', 'improved', 'increased', 'reduced'
        ]
        if not any(verb in resume_lower for verb in action_verbs):
            suggestions.append(
                "💡 Use strong action verbs: developed, implemented, led, designed, "
                "optimized, achieved."
            )
        
        # Check for weak phrases
        if 'responsible for' in resume_lower:
            suggestions.append(
                "💡 Replace 'responsible for' with stronger action verbs that show impact. "
                "Instead of 'Responsible for testing', say 'Developed and executed test plans'."
            )
        
        # Check resume length
        word_count = len(resume_text.split())
        if word_count < 200:
            suggestions.append(
                "📝 Your resume seems short. Add more details about your experience, "
                "projects, and achievements."
            )
        elif word_count > 1000:
            suggestions.append(
                "📝 Your resume might be too long. Focus on the most relevant experiences "
                "for this position."
            )
        
        return suggestions
    
    def _clean_text(self, text):
        """
        Clean and normalize text for better matching.
        
        Steps:
        1. Convert to lowercase
        2. Remove URLs
        3. Remove email addresses
        4. Remove phone numbers
        5. Remove special characters (keep alphanumeric and spaces)
        6. Remove extra whitespace
        
        Why clean?
        - "Python" and "python" should be treated the same
        - Email addresses don't help with matching
        - Cleaner text = better TF-IDF results
        """
        # Step 1: Lowercase
        text = text.lower()
        
        # Step 2: Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        
        # Step 3: Remove emails
        text = re.sub(r'\S+@\S+', '', text)
        
        # Step 4: Remove phone numbers
        text = re.sub(r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}', '', text)
        text = re.sub(r'\d{10}', '', text)
        
        # Step 5: Keep only letters, numbers, spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        
        # Step 6: Remove extra spaces
        text = ' '.join(text.split())
        
        return text