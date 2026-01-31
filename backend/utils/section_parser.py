import re
from typing import Dict, List, Any, Optional, Tuple
import json

class UniversalResumeParser:
    """Universal resume parser that works for all resume formats"""
    
    def __init__(self):
        # Common section headers (case-insensitive, with variations)
        self.section_keywords = {
            'contact': [
                'contact', 'contact information', 'contact details', 
                'personal information', 'personal details', 'address',
                'phone', 'email', 'mobile', 'telephone'
            ],
            'education': [
                'education', 'academic', 'qualifications', 'academic background',
                'educational background', 'degrees', 'academic qualifications',
                'university', 'college', 'schooling'
            ],
            'experience': [
                'experience', 'work experience', 'employment', 'employment history',
                'work history', 'professional experience', 'career history',
                'employment record', 'professional background'
            ],
            'skills': [
                'skills', 'technical skills', 'core competencies', 'competencies',
                'expertise', 'areas of expertise', 'technical expertise',
                'capabilities', 'abilities', 'proficiencies'
            ],
            'projects': [
                'projects', 'project experience', 'portfolio', 'project work',
                'selected projects', 'key projects', 'project portfolio'
            ],
            'summary': [
                'summary', 'profile', 'objective', 'career objective',
                'professional summary', 'executive summary', 'profile summary',
                'about me', 'personal profile', 'career profile'
            ],
            'languages': [
                'languages', 'language skills', 'language proficiency',
                'linguistic skills'
            ],
            'certifications': [
                'certifications', 'certificates', 'licenses', 'licenses and certifications',
                'professional certifications', 'awards and certifications'
            ],
            'achievements': [
                'achievements', 'awards', 'honors', 'accomplishments',
                'recognition', 'honors and awards'
            ],
            'interests': [
                'interests', 'hobbies', 'extracurricular', 'activities',
                'personal interests'
            ]
        }
        
        # Common patterns for extraction
        self.patterns = {
            'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            'phone': r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            'url': r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+',
            'year_range': r'(?:19|20)\d{2}\s*[-–—]\s*(?:Present|(?:19|20)\d{2})',
            'year': r'\b(?:19|20)\d{2}\b',
            'gpa': r'GPA\s*[:=]?\s*[\d.]+\s*/?\s*\d*\.?\d*',
            'percentage': r'\b\d{1,3}(?:\.\d{1,2})?\s*%\b'
        }
    
    def preprocess_text(self, text: str) -> str:
        """Clean and normalize the resume text"""
        # Remove extra whitespace but preserve line breaks
        lines = []
        for line in text.split('\n'):
            line = line.strip()
            if line:
                # Normalize special characters
                line = re.sub(r'[–—]', '-', line)
                line = re.sub(r'[•▪■●○◆◇]', '-', line)
                # Replace multiple spaces with single space
                line = re.sub(r'\s+', ' ', line)
                lines.append(line)
        return '\n'.join(lines)
    
    def detect_sections(self, text: str) -> Dict[str, Tuple[int, int]]:
        """Detect section boundaries in the resume"""
        lines = text.split('\n')
        section_positions = {}
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if not line_lower:
                continue
            
            # Check if line is a section header
            for section, keywords in self.section_keywords.items():
                for keyword in keywords:
                    # Check if line starts with or contains the keyword
                    # Also check for spaced-out headers (e.g., "S K I L L S")
                    line_compressed = line_lower.replace(' ', '')
                    keyword_compressed = keyword.replace(' ', '')
                    
                    if (line_lower.startswith(keyword) or 
                        f" {keyword} " in f" {line_lower} " or
                        line_compressed == keyword_compressed or
                        keyword_compressed in line_compressed):
                        section_positions[section] = i
                        break
        
        # Sort sections by their position
        sorted_sections = sorted(section_positions.items(), key=lambda x: x[1])
        
        # Determine section boundaries
        section_boundaries = {}
        for idx, (section, start_line) in enumerate(sorted_sections):
            # Find end line (next section or end of document)
            if idx < len(sorted_sections) - 1:
                end_line = sorted_sections[idx + 1][1]
            else:
                end_line = len(lines)
            
            section_boundaries[section] = (start_line + 1, end_line)  # +1 to skip header
        
        return section_boundaries
    
    def extract_section_content(self, text: str, section: str, boundaries: Dict[str, Tuple[int, int]]) -> List[str]:
        """Extract content for a specific section"""
        if section not in boundaries:
            return []
        
        lines = text.split('\n')
        start, end = boundaries[section]
        
        content = []
        for i in range(start, end):
            if i < len(lines):
                line = lines[i].strip()
                if line:  # Skip empty lines
                    content.append(line)
        
        return content
    
    def extract_contact_info(self, text: str, contact_lines: List[str]) -> Dict[str, Any]:
        """Extract contact information from entire text and contact section"""
        contact_info = {
            "name": None,
            "email": None,
            "phone": [],
            "location": None,
            "linkedin": None,
            "portfolio": None
        }
        
        # Extract email from entire text
        email_match = re.search(self.patterns['email'], text)
        if email_match:
            contact_info["email"] = email_match.group(0)
        
        # Extract phone numbers
        phone_matches = re.findall(self.patterns['phone'], text)
        contact_info["phone"] = [self.clean_phone_number(p) for p in phone_matches]
        
        # Extract URLs
        url_matches = re.findall(self.patterns['url'], text)
        for url in url_matches:
            if 'linkedin.com' in url.lower():
                contact_info["linkedin"] = url
            elif any(domain in url.lower() for domain in ['github.com', 'portfolio', 'behance.net']):
                contact_info["portfolio"] = url
        
        # Try to extract name (multiple strategies)
        contact_info["name"] = self.extract_name(text, contact_lines)
        
        # Try to extract location
        contact_info["location"] = self.extract_location(contact_lines)
        
        return contact_info
    
    def extract_name(self, text: str, contact_lines: List[str]) -> Optional[str]:
        """Extract candidate name using multiple strategies"""
        lines = text.split('\n')
        
        # Strategy 1: Look for name patterns in first few lines
        name_patterns = [
            r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$',  # Title case
            r'^[A-Z\s]{5,30}$',  # All caps
            r'^[A-Z][a-z]+\s+[A-Z][a-z]+$',  # First Last
        ]
        
        for i, line in enumerate(lines[:10]):
            line = line.strip()
            if not line:
                continue
            
            # Skip obvious section headers
            if any(keyword in line.lower() for keyword in 
                  ['resume', 'cv', 'curriculum vitae', 'contact', 'objective']):
                continue
            
            for pattern in name_patterns:
                if re.match(pattern, line):
                    # Additional validation
                    if len(line.split()) >= 2 and not any(word.isdigit() for word in line.split()):
                        return line.title() if line.isupper() else line
        
        # Strategy 2: Look for email username as name
        email_match = re.search(self.patterns['email'], text)
        if email_match:
            email = email_match.group(0)
            username = email.split('@')[0]
            # Clean username and check if it looks like a name
            username = re.sub(r'[\._0-9]', ' ', username).title()
            words = username.split()
            if 2 <= len(words) <= 4:
                return ' '.join(words)
        
        return None
    
    def clean_phone_number(self, phone: str) -> str:
        """Clean and standardize phone number"""
        # Remove all non-digit characters except leading +
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        # Format Indian numbers
        if len(cleaned) == 10:
            return f"+91{cleaned}"
        elif len(cleaned) == 12 and cleaned.startswith('91'):
            return f"+{cleaned}"
        elif cleaned.startswith('+'):
            return cleaned
        
        return phone
    
    def extract_location(self, contact_lines: List[str]) -> Optional[str]:
        """Extract location from contact lines"""
        # Common location indicators
        location_indicators = [
            'city', 'state', 'country', 'pin', 'zip', 'address',
            'based in', 'located in', 'residing in'
        ]
        
        for line in contact_lines:
            line_lower = line.lower()
            # Look for lines that might contain location
            if any(indicator in line_lower for indicator in location_indicators):
                return line
        
        # Look for common city names or address patterns
        for line in contact_lines:
            if re.search(r'[A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+)*', line):
                # Check if it looks like a location (not an email, not a phone)
                if '@' not in line and not re.search(self.patterns['phone'], line):
                    return line
        
        return None
    
    def parse_education(self, edu_lines: List[str]) -> List[Dict[str, Any]]:
        """Parse education section"""
        education = []
        current_entry = {}
        
        for line in edu_lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if this line starts a new education entry
            # Common indicators: degree names, university names, years
            is_new_entry = (
                re.search(r'\b(?:B\.?[AS]|M\.?[AS]|PhD|Bachelor|Master|Diploma|Certificate)\b', line, re.IGNORECASE) or
                re.search(r'\b(?:University|College|Institute|School|Academy)\b', line, re.IGNORECASE) or
                re.search(self.patterns['year_range'], line) or
                re.search(self.patterns['year'], line)
            )
            
            if is_new_entry and current_entry:
                education.append(current_entry)
                current_entry = {}
            
            # Extract information from line
            self._extract_education_from_line(line, current_entry)
        
        # Add the last entry
        if current_entry:
            education.append(current_entry)
        
        return education
    
    def _extract_education_from_line(self, line: str, entry: Dict[str, Any]):
        """Extract education details from a single line"""
        # Extract degree
        degree_patterns = [
            r'(?:B\.?[AS]\.?(?:\s+[A-Z]+)?|Bachelor\s+(?:of\s+)?\w+)',
            r'(?:M\.?[AS]\.?(?:\s+[A-Z]+)?|Master\s+(?:of\s+)?\w+)',
            r'PhD|Doctorate|Doctor of Philosophy',
            r'Diploma|Certificate|Associate'
        ]
        
        for pattern in degree_patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match and 'degree' not in entry:
                entry['degree'] = match.group(0)
                break
        
        # Extract institution
        institution_patterns = [
            r'\b(?:University|College|Institute|School|Academy)\b.*',
            r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:University|College|Institute))?'
        ]
        
        for pattern in institution_patterns:
            match = re.search(pattern, line)
            if match and 'institution' not in entry:
                institution = match.group(0)
                # Make sure it's not actually a degree
                if not re.search(r'\b(?:B\.?|M\.?|Bachelor|Master)\b', institution, re.IGNORECASE):
                    entry['institution'] = institution
                    break
        
        # Extract years
        year_match = re.search(self.patterns['year_range'], line)
        if year_match:
            entry['years'] = year_match.group(0)
        else:
            year_match = re.search(self.patterns['year'], line)
            if year_match:
                entry['year'] = year_match.group(0)
        
        # Extract grades
        gpa_match = re.search(self.patterns['gpa'], line, re.IGNORECASE)
        if gpa_match:
            entry['gpa'] = gpa_match.group(0)
        
        perc_match = re.search(self.patterns['percentage'], line)
        if perc_match:
            entry['percentage'] = perc_match.group(0)
    
    def parse_experience(self, exp_lines: List[str]) -> List[Dict[str, Any]]:
        """Parse work experience section"""
        experience = []
        current_entry = {}
        buffer_lines = []
        
        for line in exp_lines:
            line = line.strip()
            if not line:
                continue
            
            # Check for new entry indicators
            is_new_entry = (
                re.search(self.patterns['year_range'], line) or
                re.search(r'\b(?:Present|Current)\b', line, re.IGNORECASE) or
                re.match(r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*[,:-]', line) or
                re.match(r'^[A-Z][A-Za-z\s&]+(?:\.com|Inc|Ltd|Corp|LLC)?$', line)
            )
            
            if is_new_entry and buffer_lines:
                # Process buffered lines as a complete entry
                entry = self._process_experience_entry(buffer_lines)
                if entry:
                    experience.append(entry)
                buffer_lines = []
            
            buffer_lines.append(line)
        
        # Process the last entry
        if buffer_lines:
            entry = self._process_experience_entry(buffer_lines)
            if entry:
                experience.append(entry)
        
        return experience
    
    def _process_experience_entry(self, lines: List[str]) -> Dict[str, Any]:
        """Process lines into an experience entry"""
        if not lines:
            return {}
        
        entry = {
            "position": None,
            "company": None,
            "duration": None,
            "location": None,
            "description": []
        }
        
        # Look for duration in first few lines
        for i, line in enumerate(lines[:3]):
            duration_match = re.search(self.patterns['year_range'], line)
            if duration_match:
                entry['duration'] = duration_match.group(0)
                break
        
        # Look for position and company
        first_line = lines[0]
        # Common patterns: "Position at Company", "Company - Position", "Position, Company"
        if ' at ' in first_line:
            parts = first_line.split(' at ', 1)
            entry['position'] = parts[0].strip()
            entry['company'] = parts[1].strip()
        elif ' - ' in first_line:
            parts = first_line.split(' - ', 1)
            entry['company'] = parts[0].strip()
            entry['position'] = parts[1].strip()
        elif ', ' in first_line:
            parts = first_line.split(', ', 1)
            entry['position'] = parts[0].strip()
            entry['company'] = parts[1].strip()
        else:
            # Assume first line is position
            entry['position'] = first_line
        
        # Collect description from remaining lines
        description_lines = []
        for line in lines[1:]:
            if not re.search(self.patterns['year_range'], line):  # Skip duration lines
                description_lines.append(line)
        
        entry['description'] = description_lines
        
        return entry
    
    def parse_skills(self, skills_lines: List[str]) -> List[str]:
        """Parse skills section"""
        skills = []
        
        # Join all lines for processing
        skills_text = ' '.join(skills_lines)
        
        # Split by common delimiters
        delimiters = r'[,;•·|/&]|\band\b'
        skill_items = re.split(delimiters, skills_text)
        
        for item in skill_items:
            item = item.strip()
            if item and 2 <= len(item) <= 50:
                # Clean up the skill
                item = re.sub(r'\([^)]*\)', '', item)  # Remove parentheses content
                item = re.sub(r'\s+', ' ', item).strip()
                if item and item not in skills:
                    skills.append(item)
        
        return skills
    
    def parse_projects(self, project_lines: List[str]) -> List[Dict[str, Any]]:
        """Parse projects section"""
        projects = []
        current_project = []
        
        for line in project_lines:
            line = line.strip()
            if not line:
                continue
            
            # Check for new project indicators
            is_new_project = (
                re.match(r'^\d+[\.\)]', line) or  # Numbered: "1.", "1)"
                re.match(r'^[•\-*]\s+[A-Z]', line) or  # Bulleted
                re.match(r'^Project\s+', line, re.IGNORECASE) or
                re.match(r'^[A-Z][a-z]+.*?:', line)  # Title with colon
            )
            
            if is_new_project and current_project:
                project = self._process_project(current_project)
                if project:
                    projects.append(project)
                current_project = []
            
            current_project.append(line)
        
        # Process the last project
        if current_project:
            project = self._process_project(current_project)
            if project:
                projects.append(project)
        
        return projects
    
    def _process_project(self, lines: List[str]) -> Dict[str, Any]:
        """Process lines into a project entry"""
        if not lines:
            return {}
        
        project = {
            "name": None,
            "description": [],
            "technologies": [],
            "duration": None
        }
        
        # First line is usually project name
        first_line = lines[0]
        # Remove numbering/bullets
        first_line = re.sub(r'^\d+[\.\)]\s*|^[•\-*]\s*', '', first_line)
        project['name'] = first_line.strip()
        
        # Process remaining lines
        for line in lines[1:]:
            line_lower = line.lower()
            
            # Check for technologies
            if any(keyword in line_lower for keyword in 
                  ['technologies', 'tech stack', 'tools', 'skills used']):
                # Extract technologies
                tech_part = line.split(':', 1)[1] if ':' in line else line
                tech_items = re.split(r'[,;]', tech_part)
                for tech in tech_items:
                    tech = tech.strip()
                    if tech and tech not in project['technologies']:
                        project['technologies'].append(tech)
            
            # Check for duration
            elif re.search(self.patterns['year_range'], line):
                project['duration'] = re.search(self.patterns['year_range'], line).group(0)
            
            # Otherwise, add to description
            else:
                project['description'].append(line)
        
        return project
    
    def parse_languages(self, lang_lines: List[str]) -> List[Dict[str, str]]:
        """Parse languages section"""
        languages = []
        
        for line in lang_lines:
            line = line.strip()
            if not line:
                continue
            
            # Handle different formats
            if ':' in line:
                parts = line.split(':', 1)
                language = parts[0].strip()
                proficiency = parts[1].strip()
            elif '(' in line and ')' in line:
                # Format: "English (Fluent)"
                match = re.search(r'([^(]+)\(([^)]+)\)', line)
                if match:
                    language = match.group(1).strip()
                    proficiency = match.group(2).strip()
                else:
                    language = line
                    proficiency = "Proficient"
            else:
                language = line
                proficiency = "Proficient"
            
            languages.append({
                "language": language,
                "proficiency": proficiency
            })
        
        return languages
    
    def parse_summary(self, summary_lines: List[str]) -> str:
        """Parse summary section"""
        return ' '.join(summary_lines)
    
    def parse(self, text: str) -> Dict[str, Any]:
        """Main parsing method"""
        # Preprocess text
        cleaned_text = self.preprocess_text(text)
        
        # Detect sections
        section_boundaries = self.detect_sections(cleaned_text)
        
        # Initialize result structure
        result = {
            "personal_info": {},
            "education": [],
            "experience": [],
            "skills": [],
            "projects": [],
            "languages": [],
            "certifications": [],
            "achievements": [],
            "summary": "",
            "interests": []
        }
        
        # Extract contact info
        contact_lines = self.extract_section_content(cleaned_text, 'contact', section_boundaries)
        result["personal_info"] = self.extract_contact_info(cleaned_text, contact_lines)
        
        # Parse each section
        for section in ['education', 'experience', 'skills', 'projects', 
                       'languages', 'certifications', 'achievements', 
                       'summary', 'interests']:
            section_lines = self.extract_section_content(cleaned_text, section, section_boundaries)
            if section_lines:
                parser_method = getattr(self, f'parse_{section}', None)
                if parser_method:
                    result[section] = parser_method(section_lines)
        
        return result
    
    def format_output(self, parsed_data: Dict[str, Any]) -> str:
        """Format parsed data for display"""
        output = []
        
        # Personal Information
        output.append("=" * 60)
        output.append("PERSONAL INFORMATION")
        output.append("=" * 60)
        personal = parsed_data.get("personal_info", {})
        for key, value in personal.items():
            if value:
                if isinstance(value, list):
                    output.append(f"{key.title()}: {', '.join(value)}")
                else:
                    output.append(f"{key.title()}: {value}")
        
        # Summary
        if parsed_data.get("summary"):
            output.append("\n" + "=" * 60)
            output.append("SUMMARY")
            output.append("=" * 60)
            output.append(parsed_data["summary"])
        
        # Education
        if parsed_data.get("education"):
            output.append("\n" + "=" * 60)
            output.append("EDUCATION")
            output.append("=" * 60)
            for edu in parsed_data["education"]:
                output.append(f"\n• {edu.get('degree', 'Education')}")
                if edu.get('institution'):
                    output.append(f"  {edu['institution']}")
                if edu.get('years'):
                    output.append(f"  {edu['years']}")
                if edu.get('gpa'):
                    output.append(f"  {edu['gpa']}")
        
        # Experience
        if parsed_data.get("experience"):
            output.append("\n" + "=" * 60)
            output.append("EXPERIENCE")
            output.append("=" * 60)
            for exp in parsed_data["experience"]:
                output.append(f"\n• {exp.get('position', 'Position')}")
                if exp.get('company'):
                    output.append(f"  {exp['company']}")
                if exp.get('duration'):
                    output.append(f"  {exp['duration']}")
                if exp.get('description'):
                    for desc in exp['description']:
                        output.append(f"  - {desc}")
        
        # Skills
        if parsed_data.get("skills"):
            output.append("\n" + "=" * 60)
            output.append("SKILLS")
            output.append("=" * 60)
            # Group skills for better readability
            skills = parsed_data["skills"]
            chunk_size = 5
            for i in range(0, len(skills), chunk_size):
                output.append(f"  {', '.join(skills[i:i+chunk_size])}")
        
        # Projects
        if parsed_data.get("projects"):
            output.append("\n" + "=" * 60)
            output.append("PROJECTS")
            output.append("=" * 60)
            for i, project in enumerate(parsed_data["projects"], 1):
                output.append(f"\n{i}. {project.get('name', 'Project')}")
                if project.get('technologies'):
                    output.append(f"   Technologies: {', '.join(project['technologies'])}")
                if project.get('description'):
                    for desc in project['description'][:3]:  # Limit to 3 description lines
                        output.append(f"   - {desc}")
        
        # Languages
        if parsed_data.get("languages"):
            output.append("\n" + "=" * 60)
            output.append("LANGUAGES")
            output.append("=" * 60)
            for lang in parsed_data["languages"]:
                output.append(f"• {lang['language']}: {lang['proficiency']}")
        
        return '\n'.join(output)


def test_with_sample_resumes():
    """Test the parser with different resume formats"""
    
    # Test with your resume
    technical_resume = """C O N T A C T
+91 - 8866505360
shahporiaharsh@gmail.com
Surat, Gujarat
SDJ INTERNATIONAL COLLEGE
Bachelor of Computer
Application (Mobile App
Developement)
2022 - 2025
E D U C A T I O N
S K I L L S
Flutter & Dart
Android App Development (Java) 
Version Control (Git/GitHub)
ASP.NET (VB
Logical Thinking
English : Fluent
Hindi : Fluent
Gujarati : Native
L A N G U A G E S
P R O F I L E  S U M M A R Y
Motivated Computer Applications graduate with a solid foundation in
mobile and web development. Skilled in Flutter, Android (Java), PHP,
ASP.NET, HTML, and CSS. Experienced in building user-friendly apps
through hands-on projects like an e-commerce app and career platform.
Strong in problem-solving, time management, and teamwork.
P R O J E C T S
HARSH SHAHPORIA
Aspiring Front-End Developer | Mobile App Developer (Flutter & Android)
GPA : 8.73 
1. Exhibition Management System – Full-Stack Developer
Technologies: PHP, MySQL, HTML/CSS, JavaScript
 Developed a web platform for managing exhibitions, covering visitor
registration, exhibitor details, and stall assignments. Implemented both
client and server sides with an admin dashboard for efficient exhibition
and attendee management.
2. E-Commerce Clothing App – Android Developer
Technologies: Java, Android SDK, Razorpay API
 Designed and developed a mobile app for clothing retail, allowing users
to browse products, add items to the cart, and complete secure
payments via Razorpay API. Focused on providing an intuitive and
seamless shopping experience.
3. Tutorial Website – ASP.NET Developer
Technologies: ASP.NET (VB), SQL Server, HTML/CSS
 Built a tutorial platform with distinct admin and client panels. Admins
can manage users and tutorials, while clients can easily explore
structured tutorials.
4. French Language Tutor (Minor College Project) – Flutter
Developer
Technologies: Flutter, Gemini API, Firebase
 Developed a French learning app with login/registration, chatbot
functionality, section-wise lessons, quizzes, profile management, and
detailed user progress analysis powered by the Gemini API.
5. KaziGo – Career Companion App (Major College Project) –
Resume Builder & UI Developer
Technologies: Flutter, Firebase, Cloud Firestore
 Built a career platform with three modules: Employer, Employee, and
Admin. Employers can post jobs and company insights (subject to admin
approval), while employees can apply for jobs, create resumes, and
manage profiles. Developed a fully functional resume builder with
download capability and premium templates."""
    
    # Test with a non-technical resume (Marketing)
    marketing_resume = """JANE SMITH
Marketing Professional
New York, NY
jsmith@email.com | (123) 456-7890 | linkedin.com/in/janesmith

PROFESSIONAL SUMMARY
Dynamic marketing professional with 5+ years of experience in digital marketing,
brand strategy, and campaign management. Proven track record of increasing
brand awareness and driving sales growth.

WORK EXPERIENCE
Senior Marketing Specialist
ABC Corporation, New York, NY
June 2020 - Present
- Developed and executed digital marketing campaigns across multiple channels
- Increased website traffic by 40% through SEO optimization
- Managed social media accounts with 50K+ followers
- Coordinated with cross-functional teams for product launches

Marketing Coordinator
XYZ Inc, Boston, MA
January 2018 - May 2020
- Assisted in planning and implementing marketing strategies
- Created content for blogs, newsletters, and social media
- Analyzed campaign performance using Google Analytics
- Supported event planning and execution

EDUCATION
Bachelor of Business Administration in Marketing
University of New York, NY
2014 - 2018
GPA: 3.8/4.0

SKILLS
Digital Marketing, Social Media Management, SEO/SEM, Content Creation,
Google Analytics, Market Research, Brand Strategy, Project Management

CERTIFICATIONS
Google Analytics Certified
HubSpot Inbound Marketing Certified"""
    
    # Test with a simple resume (Fresh Graduate)
    fresh_graduate_resume = """RAJ PATEL
Mumbai, India
raj.patel@email.com | +91 9876543210

OBJECTIVE
Seeking an entry-level position in business administration where I can apply
my organizational skills and contribute to company success.

EDUCATION
Bachelor of Commerce
University of Mumbai
2020 - 2024
Percentage: 78%

INTERNSHIP
Business Administration Intern
Reliance Industries, Mumbai
Summer 2023
- Assisted in daily administrative tasks
- Helped prepare business reports
- Supported team in data entry and documentation

SKILLS
Microsoft Office Suite, Communication, Time Management,
Teamwork, Problem Solving, Data Entry

LANGUAGES
English (Fluent)
Hindi (Native)
Gujarati (Native)

ACTIVITIES
Class Representative (2022-2023)
Volunteer, Local NGO (2021-present)"""
    
    print("=" * 70)
    print("UNIVERSAL RESUME PARSER - TESTING WITH MULTIPLE RESUMES")
    print("=" * 70)
    
    parser = UniversalResumeParser()
    
    # Test 1: Technical Resume
    print("\n" + "=" * 70)
    print("TEST 1: TECHNICAL RESUME")
    print("=" * 70)
    result1 = parser.parse(technical_resume)
    print(parser.format_output(result1))
    
    # Test 2: Marketing Resume
    print("\n" + "=" * 70)
    print("TEST 2: MARKETING RESUME")
    print("=" * 70)
    result2 = parser.parse(marketing_resume)
    print(parser.format_output(result2))
    
    # Test 3: Fresh Graduate Resume
    print("\n" + "=" * 70)
    print("TEST 3: FRESH GRADUATE RESUME")
    print("=" * 70)
    result3 = parser.parse(fresh_graduate_resume)
    print(parser.format_output(result3))
    
    # Show JSON output for first resume
    print("\n" + "=" * 70)
    print("JSON OUTPUT FOR TECHNICAL RESUME (First few sections)")
    print("=" * 70)
    print(json.dumps({
        "personal_info": result1["personal_info"],
        "education": result1["education"],
        "skills": result1["skills"][:10],  # First 10 skills
        "languages": result1["languages"]
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    test_with_sample_resumes()