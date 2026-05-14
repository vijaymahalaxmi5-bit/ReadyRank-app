import { AnalysisResult, ProfileInput } from "@/lib/analyzer";
import { AIReport } from "@/lib/aiReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircularScore } from "@/components/CircularScore";
import { CategoryBar } from "@/components/CategoryBar";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Download,
  Lightbulb,
  Calendar,
  MessageSquare,
  Sparkles,
  Eye,
  Zap,
  PenLine,
} from "lucide-react";

interface ResultsProps {
  input: ProfileInput;
  result: AnalysisResult;
  aiReport: AIReport | null;
  aiUnavailable: boolean;
  onReset: () => void;
}

export default function Results({ input, result, aiReport, aiUnavailable, onReset }: ResultsProps) {
  const handlePrint = () => window.print();

  const strengths = aiReport?.topStrengths ?? result.strengths;
  const weaknesses = aiReport?.topWeaknesses ?? result.weaknesses;
  const sevenDayPlan = aiReport?.sevenDayPlan
    ? aiReport.sevenDayPlan.map((p) => ({ day: `Day ${p.day}`, task: p.task }))
    : result.sevenDayPlan;
  const interviewQuestions = aiReport?.suggestedInterviewQuestions ?? result.interviewQuestions;

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Actions */}
        <div className="flex justify-between items-center no-print">
          <Button variant="ghost" onClick={onReset} data-testid="button-reset">
            <ArrowLeft className="mr-2 h-4 w-4" /> Analyze Another
          </Button>
          <div className="flex items-center gap-3">
            {aiReport && (
              <span
                data-testid="badge-ai-powered"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Report
              </span>
            )}
            <Button
              onClick={handlePrint}
              className="bg-slate-900 text-white hover:bg-slate-800"
              data-testid="button-print"
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </div>
        </div>

        {/* AI unavailable notice */}
        {aiUnavailable && (
          <div
            data-testid="ai-unavailable-notice"
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              AI feedback is temporarily unavailable, but your rule-based readiness report is ready.
            </span>
          </div>
        )}

        {/* Score Header */}
        <Card className="border-t-4 border-t-primary shadow-md overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-8 flex flex-col items-center justify-center bg-slate-50/50 border-r border-slate-100">
                <CircularScore score={result.totalScore} label={result.readinessLevel} />
              </div>
              <div className="p-8 col-span-2 flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="text-report-title">
                  {input.name}'s Readiness Report
                </h1>
                <p className="text-lg text-slate-600 mb-6 flex items-center gap-2">
                  Target Role:{" "}
                  <span className="font-semibold text-primary">{input.targetRole}</span>
                  <span className="text-sm px-2 py-1 bg-slate-100 rounded-full">
                    {input.experienceLevel}
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CategoryBar label="Resume Quality" score={result.categories.resumeQuality} maxScore={25} />
                  <CategoryBar label="Technical Skills" score={result.categories.technicalSkills} maxScore={25} />
                  <CategoryBar label="Portfolio Strength" score={result.categories.portfolioStrength} maxScore={20} />
                  <CategoryBar label="Communication" score={result.categories.communicationReadiness} maxScore={15} />
                  <CategoryBar label="Job Role Fit" score={result.categories.jobRoleFit} maxScore={15} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary + Recruiter First Impression */}
        {aiReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary text-base">
                  <Sparkles className="w-4 h-4" /> AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm leading-relaxed" data-testid="text-ai-summary">
                  {aiReport.summary}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-700 text-base">
                  <Eye className="w-4 h-4" /> Recruiter First Impression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-slate-700 text-sm leading-relaxed italic"
                  data-testid="text-recruiter-impression"
                >
                  "{aiReport.recruiterFirstImpression}"
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-green-100 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 flex items-center text-lg">
                <CheckCircle2 className="mr-2 h-5 w-5" /> Top Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start" data-testid={`text-strength-${i}`}>
                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-700 leading-tight">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-700 flex items-center text-lg">
                <AlertTriangle className="mr-2 h-5 w-5" /> Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start" data-testid={`text-weakness-${i}`}>
                    <span className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-700 leading-tight">{w}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Priority Fixes (AI only) */}
        {aiReport && aiReport.priorityFixes.length > 0 && (
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Zap className="mr-2 h-5 w-5 text-orange-500" /> Priority Fixes
              </CardTitle>
              <CardDescription>Address these in order for the fastest improvement.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiReport.priorityFixes.map((fix) => (
                  <div
                    key={fix.priority}
                    className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                    data-testid={`card-priority-fix-${fix.priority}`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center">
                      {fix.priority}
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800 text-sm">{fix.title}</p>
                      <p className="text-slate-500 text-xs">{fix.reason}</p>
                      <p className="text-primary text-sm font-medium">{fix.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rule-based suggestions (shown when no AI report) */}
        {!aiReport && (
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" /> Actionable Suggestions
              </CardTitle>
              <CardDescription>Based on your profile, here's what you should fix immediately.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex gap-3 items-start"
                  >
                    <div className="mt-0.5 text-primary">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-slate-700 text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Rewrite Suggestions (AI only) */}
        {aiReport && aiReport.resumeRewriteSuggestions.length > 0 && (
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <PenLine className="mr-2 h-5 w-5 text-purple-500" /> Resume Rewrite Suggestions
              </CardTitle>
              <CardDescription>Replace weak phrases with stronger, results-oriented language.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiReport.resumeRewriteSuggestions.map((s, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    data-testid={`card-rewrite-${i}`}
                  >
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Before</p>
                      <p className="text-sm text-slate-700">{s.before}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">After</p>
                      <p className="text-sm text-slate-700 font-medium">{s.after}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7-Day Plan */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <Calendar className="mr-2 h-5 w-5 text-indigo-600" /> 7-Day Improvement Plan
            </CardTitle>
            {aiReport && (
              <CardDescription className="flex items-center gap-1 text-indigo-600">
                <Sparkles className="w-3 h-3" /> Personalized by AI
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sevenDayPlan.map((plan, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
                  data-testid={`card-day-plan-${i + 1}`}
                >
                  <div className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-md text-sm whitespace-nowrap min-w-[70px] text-center">
                    {plan.day}
                  </div>
                  <p className="text-slate-700 text-sm font-medium">{plan.task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interview Questions */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-500" /> Tailored Interview Questions
            </CardTitle>
            <CardDescription>Practice these questions as they relate to your weak areas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interviewQuestions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-slate-800 font-medium"
                  data-testid={`card-interview-question-${i}`}
                >
                  "{q}"
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
