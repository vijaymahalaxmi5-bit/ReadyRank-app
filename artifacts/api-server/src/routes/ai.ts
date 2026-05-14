import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

interface AnalyzeRequest {
  name: string;
  targetRole: string;
  resumeText: string;
  overallScore: number;
  categories: {
    resumeQuality: number;
    technicalSkills: number;
    portfolioStrength: number;
    communicationReadiness: number;
    jobRoleFit: number;
  };
}

router.post("/ai/analyze", async (req, res) => {
  const body = req.body as AnalyzeRequest;
  const { targetRole, resumeText, overallScore, categories } = body;

  if (!resumeText || !targetRole) {
    res.status(400).json({ error: "resumeText and targetRole are required" });
    return;
  }

  const prompt = `You are an expert interview readiness evaluator for students.

Analyze this student's resume for the target role: ${targetRole}.

Resume text:
${resumeText.slice(0, 4000)}

Pre-calculated scores (do NOT change these):
Overall Score: ${overallScore}/100
Resume Quality: ${categories.resumeQuality}/25
Technical Skills Match: ${categories.technicalSkills}/25
Project/Portfolio Strength: ${categories.portfolioStrength}/20
Communication & Presentation: ${categories.communicationReadiness}/15
Job Role Fit: ${categories.jobRoleFit}/15

Rules:
- Use the scores to calibrate your feedback (high scores = strengths, low scores = weaknesses)
- Do NOT invent experience, projects, companies, certifications, or achievements not present in the resume
- If information is missing from the resume, say so clearly
- Keep suggestions beginner-friendly and specific to the target role
- Do NOT include markdown formatting inside the JSON strings
- Return ONLY valid JSON with no other text before or after it

Return exactly this JSON structure:
{
  "summary": "2-3 sentence overall summary of the candidate",
  "recruiterFirstImpression": "What a recruiter thinks within the first 10 seconds of seeing this resume",
  "topStrengths": ["strength 1", "strength 2", "strength 3"],
  "topWeaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "priorityFixes": [
    { "priority": 1, "title": "Fix title", "reason": "Why this matters to recruiters", "action": "Specific action the student should take" },
    { "priority": 2, "title": "Fix title", "reason": "Why this matters to recruiters", "action": "Specific action the student should take" },
    { "priority": 3, "title": "Fix title", "reason": "Why this matters to recruiters", "action": "Specific action the student should take" }
  ],
  "sevenDayPlan": [
    { "day": 1, "task": "Specific preparation task" },
    { "day": 2, "task": "Specific preparation task" },
    { "day": 3, "task": "Specific preparation task" },
    { "day": 4, "task": "Specific preparation task" },
    { "day": 5, "task": "Specific preparation task" },
    { "day": 6, "task": "Specific preparation task" },
    { "day": 7, "task": "Specific preparation task" }
  ],
  "suggestedInterviewQuestions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "resumeRewriteSuggestions": [
    { "before": "weak or vague phrase found in resume", "after": "stronger, results-oriented version" }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const raw = response.text ?? "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, report: parsed });
  } catch (err) {
    req.log.error({ err }, "Gemini AI analyze failed");
    res.status(500).json({ success: false, error: "AI analysis failed" });
  }
});

export default router;
