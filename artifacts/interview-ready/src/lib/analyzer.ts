export interface ProfileInput {
  name: string;
  targetRole: string;
  experienceLevel: string;
  resumeText: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface AnalysisResult {
  totalScore: number;
  readinessLevel: "Not Ready" | "Almost Ready" | "Interview Ready" | "Strong Candidate";
  categories: {
    resumeQuality: number;
    technicalSkills: number;
    portfolioStrength: number;
    communicationReadiness: number;
    jobRoleFit: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  sevenDayPlan: { day: string; task: string }[];
  interviewQuestions: string[];
}

const ROLES_KEYWORDS: Record<string, string[]> = {
  "Software Developer": ["javascript", "python", "java", "c++", "algorithms", "data structures", "git", "sql", "api", "backend", "frontend"],
  "Frontend Developer": ["react", "html", "css", "javascript", "typescript", "vue", "angular", "tailwind", "responsive", "ui", "ux"],
  "Backend Developer": ["node", "express", "python", "django", "java", "spring", "api", "database", "sql", "postgresql", "mongodb", "rest"],
  "Data Analyst": ["python", "sql", "excel", "tableau", "power bi", "statistics", "data analysis", "pandas", "numpy", "visualization"],
  "Machine Learning Engineer": ["python", "tensorflow", "pytorch", "sklearn", "machine learning", "deep learning", "neural", "nlp", "data", "model"],
  "UI/UX Designer": ["figma", "sketch", "adobe xd", "wireframe", "prototype", "user research", "ui", "ux", "design system", "accessibility"],
  "Digital Marketing Intern": ["seo", "social media", "google analytics", "content", "campaign", "marketing", "email", "ads", "analytics"],
};

const ACTION_VERBS = ["led", "built", "developed", "managed", "designed", "implemented", "created", "achieved"];
const VAGUE_PHRASES = ["hardworking", "team player", "fast learner"];

export function analyzeProfile(input: ProfileInput): AnalysisResult {
  const resumeLower = input.resumeText.toLowerCase();

  // 1. Resume Quality (0-25)
  let resumeQuality = 0;
  if (/(summary|objective)/.test(resumeLower)) resumeQuality += 4;
  if (/(education|university|college)/.test(resumeLower)) resumeQuality += 3;
  if (/(skills|technologies)/.test(resumeLower)) resumeQuality += 4;
  if (/(projects|experience)/.test(resumeLower)) resumeQuality += 5;
  if (/\d+[%$]?/.test(resumeLower)) resumeQuality += 5;
  
  const wordCount = input.resumeText.trim().split(/\s+/).length;
  if (wordCount >= 300) resumeQuality += 4;
  else if (wordCount < 100) resumeQuality -= 5;
  
  resumeQuality = Math.max(0, Math.min(25, resumeQuality));

  // 2. Technical Skills Match (0-25)
  const keywords = ROLES_KEYWORDS[input.targetRole] || [];
  const matchedKeywords = keywords.filter(k => resumeLower.includes(k));
  const technicalSkills = keywords.length > 0 ? Math.min(25, (matchedKeywords.length / keywords.length) * 25) : 15;

  // 3. Portfolio Strength (0-20)
  let portfolioStrength = 0;
  if (input.githubUrl) portfolioStrength += 5;
  if (input.portfolioUrl) portfolioStrength += 5;
  if (input.linkedinUrl) portfolioStrength += 3;
  if (resumeLower.includes("github.com") || resumeLower.includes("portfolio")) portfolioStrength += 3;
  
  let projectMentions = 0;
  ["built", "developed", "created", "implemented"].forEach(verb => {
    const matches = (resumeLower.match(new RegExp(verb, "g")) || []).length;
    projectMentions += matches;
  });
  portfolioStrength += Math.min(8, Math.floor(projectMentions / 1) * 4);
  portfolioStrength = Math.min(20, portfolioStrength);

  // 4. Communication Readiness (0-15)
  let communicationReadiness = 0;
  const verbMatches = ACTION_VERBS.filter(v => resumeLower.includes(v)).length;
  communicationReadiness += Math.min(3, verbMatches);
  
  let vagueDeduction = 0;
  VAGUE_PHRASES.forEach(p => {
    if (resumeLower.includes(p)) vagueDeduction += 2;
  });
  communicationReadiness -= Math.min(6, vagueDeduction);
  
  if (/(education|experience|projects|skills)/.test(resumeLower)) communicationReadiness += 3;
  if (!/(lol|gonna|wanna|stuff)/.test(resumeLower)) communicationReadiness += 3; // basic slang check
  if (/\d+[%$]?/.test(resumeLower) && verbMatches > 0) communicationReadiness += 4;
  
  communicationReadiness = Math.max(0, Math.min(15, communicationReadiness));

  // 5. Job Role Fit (0-15)
  let jobRoleFit = 0;
  jobRoleFit += keywords.length > 0 ? (matchedKeywords.length / keywords.length) * 10 : 5;
  if (resumeLower.includes(input.targetRole.toLowerCase())) jobRoleFit += 3;
  if (input.experienceLevel) jobRoleFit += 2; // basic addition for filling it out
  jobRoleFit = Math.min(15, jobRoleFit);

  // Totals
  const totalScore = Math.round(resumeQuality + technicalSkills + portfolioStrength + communicationReadiness + jobRoleFit);

  let readinessLevel: "Not Ready" | "Almost Ready" | "Interview Ready" | "Strong Candidate";
  if (totalScore <= 40) readinessLevel = "Not Ready";
  else if (totalScore <= 70) readinessLevel = "Almost Ready";
  else if (totalScore <= 85) readinessLevel = "Interview Ready";
  else readinessLevel = "Strong Candidate";

  // Strengths and Weaknesses
  const categoryMap = [
    { name: "Resume Quality", score: resumeQuality, max: 25 },
    { name: "Technical Skills", score: technicalSkills, max: 25 },
    { name: "Portfolio Strength", score: portfolioStrength, max: 20 },
    { name: "Communication", score: communicationReadiness, max: 15 },
    { name: "Role Fit", score: jobRoleFit, max: 15 },
  ];

  const sortedCategories = [...categoryMap].sort((a, b) => (b.score / b.max) - (a.score / a.max));
  const strengths = sortedCategories.slice(0, 3).map(c => `Strong ${c.name}`);
  const weaknesses = sortedCategories.slice(-3).map(c => `Needs improvement in ${c.name}`);

  // Suggestions & Plan & Questions based on weakest
  const weakest = sortedCategories[sortedCategories.length - 1].name;
  const secondWeakest = sortedCategories[sortedCategories.length - 2].name;

  const suggestions = [];
  const sevenDayPlan = [];
  const interviewQuestions = [];

  if (weakest === "Portfolio Strength" || secondWeakest === "Portfolio Strength") {
    suggestions.push("Add a GitHub profile with pinned repositories showing your best projects.");
    suggestions.push("Include a link to a live portfolio or deployed projects.");
    sevenDayPlan.push({ day: "Day 1", task: "Create a GitHub account or update your pinned repos." });
    sevenDayPlan.push({ day: "Day 2", task: "Deploy at least one project live (e.g., using Vercel or Netlify)." });
    interviewQuestions.push("Can you walk me through a project you've deployed and the challenges you faced?");
  }

  if (weakest === "Technical Skills" || secondWeakest === "Technical Skills") {
    suggestions.push(`Include more keywords related to ${input.targetRole}.`);
    suggestions.push("Mention specific frameworks and tools you used in your projects.");
    sevenDayPlan.push({ day: "Day 3", task: `Take a quick refresher course on key ${input.targetRole} concepts.` });
    sevenDayPlan.push({ day: "Day 4", task: "Add missing technical keywords to your resume's skills section." });
    interviewQuestions.push(`What is your experience with the core technologies required for a ${input.targetRole}?`);
  }

  if (weakest === "Resume Quality" || secondWeakest === "Resume Quality") {
    suggestions.push("Quantify your achievements with numbers (e.g., 'improved performance by 20%').");
    suggestions.push("Ensure your resume is well-structured with clear sections.");
    sevenDayPlan.push({ day: "Day 5", task: "Rewrite 3 bullet points to include measurable numbers." });
    interviewQuestions.push("Tell me about a time you made a measurable impact in your previous work or projects.");
  }

  if (weakest === "Communication" || secondWeakest === "Communication") {
    suggestions.push("Replace vague phrases like 'hardworking' with concrete examples.");
    suggestions.push("Start bullet points with strong action verbs.");
    sevenDayPlan.push({ day: "Day 6", task: "Replace passive voice with action verbs in your experience section." });
    interviewQuestions.push("Tell me about a time you explained a complex technical concept simply.");
  }

  // Fill in any missing plan days
  if (!sevenDayPlan.find(p => p.day === "Day 1")) sevenDayPlan.push({ day: "Day 1", task: "Review your overall formatting." });
  if (!sevenDayPlan.find(p => p.day === "Day 2")) sevenDayPlan.push({ day: "Day 2", task: "Ask a peer to proofread your resume." });
  if (!sevenDayPlan.find(p => p.day === "Day 3")) sevenDayPlan.push({ day: "Day 3", task: "Practice your elevator pitch." });
  if (!sevenDayPlan.find(p => p.day === "Day 4")) sevenDayPlan.push({ day: "Day 4", task: "Research the companies you are applying to." });
  if (!sevenDayPlan.find(p => p.day === "Day 5")) sevenDayPlan.push({ day: "Day 5", task: "Prepare stories for common behavioral questions." });
  if (!sevenDayPlan.find(p => p.day === "Day 6")) sevenDayPlan.push({ day: "Day 6", task: "Do a mock interview with a friend." });
  if (!sevenDayPlan.find(p => p.day === "Day 7")) sevenDayPlan.push({ day: "Day 7", task: "Final review and start submitting applications!" });

  if (interviewQuestions.length < 3) {
    interviewQuestions.push("Why are you interested in this role?");
    interviewQuestions.push("Where do you see yourself in 5 years?");
  }

  return {
    totalScore,
    readinessLevel,
    categories: {
      resumeQuality,
      technicalSkills,
      portfolioStrength,
      communicationReadiness,
      jobRoleFit,
    },
    strengths,
    weaknesses,
    suggestions,
    sevenDayPlan: sevenDayPlan.sort((a, b) => a.day.localeCompare(b.day)).slice(0, 7),
    interviewQuestions: interviewQuestions.slice(0, 5),
  };
}
