import { AnalysisResult, ProfileInput } from "./analyzer";

export interface AIReport {
  summary: string;
  recruiterFirstImpression: string;
  topStrengths: string[];
  topWeaknesses: string[];
  priorityFixes: {
    priority: number;
    title: string;
    reason: string;
    action: string;
  }[];
  sevenDayPlan: {
    day: number;
    task: string;
  }[];
  suggestedInterviewQuestions: string[];
  resumeRewriteSuggestions: {
    before: string;
    after: string;
  }[];
}

export async function generateAIReport(
  input: ProfileInput,
  result: AnalysisResult
): Promise<AIReport | null> {
  try {
    const BASE = import.meta.env.BASE_URL ?? "/";
    const url = new URL("api/ai/analyze", `${location.origin}${BASE}`).toString();

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        targetRole: input.targetRole,
        resumeText: input.resumeText,
        overallScore: result.totalScore,
        categories: result.categories,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (!data.success || !data.report) return null;
    return data.report as AIReport;
  } catch {
    return null;
  }
}
