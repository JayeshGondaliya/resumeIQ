/**
 * Mock data for ResumeIQ application
 * This simulates backend responses for the frontend UI
 */

// Mock ATS Score
export const mockATSScore = { overall: 75 };

// Mock Role Recommendations
export const mockRoleRecommendations = [
  {
    id: '1',
    title: 'Frontend Developer',
    matchPercentage: 92,
    confidence: 'High',
    description: 'Build user interfaces with React, Vue, or Angular',
    keySkills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    matchPercentage: 78,
    confidence: 'Medium',
    description: 'End-to-end application development',
    keySkills: ['Node.js', 'React', 'MongoDB', 'AWS'],
  },
  {
    id: '3',
    title: 'Backend Developer',
    matchPercentage: 65,
    confidence: 'Medium',
    description: 'Server-side logic and database management',
    keySkills: ['Python', 'PostgreSQL', 'REST APIs', 'Docker'],
  },
  {
    id: '4',
    title: 'Data Analyst',
    matchPercentage: 45,
    confidence: 'Low',
    description: 'Analyze data to drive business decisions',
    keySkills: ['SQL', 'Python', 'Tableau', 'Statistics'],
  },
  {
    id: '5',
    title: 'Python Developer',
    matchPercentage: 58,
    confidence: 'Low',
    description: 'Python-focused application development',
    keySkills: ['Python', 'Django', 'FastAPI', 'ML Libraries'],
  },
];

// Mock Improvement Suggestions
export const mockSuggestions = [
  {
    id: '1',
    category: 'critical',
    title: 'Add quantifiable achievements',
    description:
      'Include specific metrics like "Increased performance by 40%" or "Reduced load time by 2 seconds"',
    impact: 'Can boost ATS score by 15-20 points',
  },
  {
    id: '2',
    category: 'critical',
    title: 'Missing key technical keywords',
    description: 'Add keywords: REST API, CI/CD, Agile, Unit Testing to match job descriptions',
    impact: 'Essential for passing ATS filters',
  },
  {
    id: '3',
    category: 'important',
    title: 'Optimize work experience format',
    description: 'Use action verbs and bullet points. Start with "Developed", "Implemented", "Led"',
    impact: 'Improves readability and keyword detection',
  },
  {
    id: '4',
    category: 'important',
    title: 'Add relevant certifications',
    description: 'Include AWS, Google Cloud, or relevant industry certifications',
    impact: 'Can improve education score by 10 points',
  },
  {
    id: '5',
    category: 'optional',
    title: 'Include a professional summary',
    description: 'Add a 2-3 sentence summary highlighting your key strengths',
    impact: 'Makes a strong first impression',
  },
  {
    id: '6',
    category: 'optional',
    title: 'Link to portfolio or GitHub',
    description: 'Add links to showcase your work and projects',
    impact: 'Provides evidence of skills',
  },
];

// Mock Interview Roadmap
export const mockRoadmap = [
  {
    week: 1,
    title: 'Foundation & Fundamentals',
    topics: [
      {
        name: 'Data Structures',
        subtopics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues'],
        tasks: ['Solve 5 easy array problems', 'Implement a linked list from scratch'],
        resources: [
          { title: 'LeetCode Arrays 101', url: '#' },
          { title: 'Visualgo Data Structures', url: '#' },
        ],
      },
      {
        name: 'Time & Space Complexity',
        subtopics: ['Big O Notation', 'Common Patterns'],
        tasks: ['Practice analyzing algorithm complexity'],
        resources: [{ title: 'Big O Cheat Sheet', url: '#' }],
      },
    ],
  },
  {
    week: 2,
    title: 'Core Algorithms',
    topics: [
      {
        name: 'Searching & Sorting',
        subtopics: ['Binary Search', 'Quick Sort', 'Merge Sort'],
        tasks: ['Implement binary search variations', 'Solve 10 medium problems'],
        resources: [
          { title: 'Sorting Algorithms Visualized', url: '#' },
          { title: 'Binary Search Guide', url: '#' },
        ],
      },
      {
        name: 'Recursion & Backtracking',
        subtopics: ['Recursive patterns', 'Backtracking problems'],
        tasks: ['Solve N-Queens problem', 'Practice subset generation'],
        resources: [{ title: 'Recursion Masterclass', url: '#' }],
      },
    ],
  },
  {
    week: 3,
    title: 'Advanced Data Structures',
    topics: [
      {
        name: 'Trees & Graphs',
        subtopics: ['Binary Trees', 'BST', 'Graph Traversals', 'DFS/BFS'],
        tasks: ['Implement tree traversals', 'Solve graph connectivity problems'],
        resources: [
          { title: 'Tree Problems Collection', url: '#' },
          { title: 'Graph Algorithm Patterns', url: '#' },
        ],
      },
      {
        name: 'Dynamic Programming',
        subtopics: ['Memoization', 'Tabulation', 'Common DP patterns'],
        tasks: ['Master the classic DP problems'],
        resources: [{ title: 'DP Problem Patterns', url: '#' }],
      },
    ],
  },
  {
    week: 4,
    title: 'System Design & Behavioral',
    topics: [
      {
        name: 'System Design Basics',
        subtopics: ['Scalability', 'Load Balancing', 'Caching', 'Database Design'],
        tasks: ['Design a URL shortener', 'Design a social media feed'],
        resources: [
          { title: 'System Design Primer', url: '#' },
          { title: 'Grokking System Design', url: '#' },
        ],
      },
      {
        name: 'Behavioral Interview',
        subtopics: ['STAR Method', 'Common Questions', 'Company Research'],
        tasks: ['Prepare 5 STAR stories', 'Research target companies'],
        resources: [{ title: 'Behavioral Interview Guide', url: '#' }],
      },
    ],
  },
];
