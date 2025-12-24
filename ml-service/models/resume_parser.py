import spacy
import re
import json
import os

class ResumeParser:
    """
    Extracts structured information from resume text.
    Uses spaCy for NLP and regex for pattern matching.
    """

    def __init__(self):
        # Load spaCy model (must be preinstalled)
        self.nlp = spacy.load("en_core_web_sm")

        # Load skills database
        skills_path = os.path.join(
            os.path.dirname(__file__),
            "../data/skills.json"
        )

        with open(skills_path, "r") as f:
            skills_data = json.load(f)

        self.skills_db = []
        for _, skills in skills_data.items():
            self.skills_db.extend(skill.lower() for skill in skills)

    
    def extract_skills(self, text):
        """
        Extract technical skills mentioned in the text.
        
        How it works:
        1. Convert text to lowercase
        2. Search for each skill from our database
        3. Use word boundaries (\b) to match whole words only
        4. Return unique skills found
        
        Example:
        Input: "I know Python and Java"
        Output: ["python", "java"]
        """
        if not text:
            return []
        
        text_lower = text.lower()
        found_skills = set()  # Use set to avoid duplicates
        
        for skill in self.skills_db:
            # \b ensures we match whole words
            # e.g., "java" matches but not "javascript" 
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
        
        return sorted(list(found_skills))
    
    def extract_email(self, text):
        """
        Extract email address using regex pattern.
        
        Pattern explanation:
        [A-Za-z0-9._%+-]+ : username part
        @ : literal @ symbol
        [A-Za-z0-9.-]+ : domain name
        \.[A-Z|a-z]{2,} : .com, .org, etc.
        """
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else None
    
    def extract_phone(self, text):
        """
        Extract phone number in various formats.
        
        Matches:
        - 1234567890
        - 123-456-7890
        - 123.456.7890
        - 123 456 7890
        - +91-1234567890
        """
        phone_patterns = [
            r'\b\d{10}\b',                          # 10 digits
            r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',  # With separators
            r'\+\d{1,3}[-.\s]?\d{10}\b'            # With country code
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                return phones[0]
        return None
    
    def extract_years_of_experience(self, text):
        """
        Extract years of experience from phrases like:
        - "3 years of experience"
        - "5+ years experience"
        - "experience: 7 years"
        """
        patterns = [
            r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience',
            r'experience[:\s]+(\d+)\+?\s*(?:years?|yrs?)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        return None
    
    def parse_resume(self, resume_text):
        """
        Main parsing function - extracts all information.
        
        Returns dictionary with:
        - skills: list of technical skills
        - email: email address
        - phone: phone number
        - text: original text
        """
        return {
            'skills': self.extract_skills(resume_text),
            'email': self.extract_email(resume_text),
            'phone': self.extract_phone(resume_text),
            'years_of_experience': self.extract_years_of_experience(resume_text),
            'text': resume_text
        }