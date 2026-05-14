import { AnalysisResult, ProfileInput } from "@/lib/analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircularScore } from "@/components/CircularScore";
import { CategoryBar } from "@/components/CategoryBar";
import { CheckCircle2, AlertTriangle, ArrowLeft, Download, Lightbulb, Calendar, MessageSquare } from "lucide-react";

interface ResultsProps {
  input: ProfileInput;
  result: AnalysisResult;
  onReset: () => void;
}

export default function Results({ input, result, onReset }: ResultsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center no-print">
          <Button variant="ghost" onClick={onReset} data-testid="button-reset">
            <ArrowLeft className="mr-2 h-4 w-4" /> Analyze Another
          </Button>
          <Button onClick={handlePrint} className="bg-slate-900 text-white hover:bg-slate-800" data-testid="button-print">
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </div>

        {/* Score Header */}
        <Card className="border-t-4 border-t-primary shadow-md overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-8 flex flex-col items-center justify-center bg-slate-50/50 border-r border-slate-100">
                <CircularScore score={result.totalScore} label={result.readinessLevel} />
              </div>
              <div className="p-8 col-span-2 flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {input.name}'s Readiness Report
                </h1>
                <p className="text-lg text-slate-600 mb-6 flex items-center gap-2">
                  Target Role: <span className="font-semibold text-primary">{input.targetRole}</span>
                  <span className="text-sm px-2 py-1 bg-slate-100 rounded-full">{input.experienceLevel}</span>
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
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">{i+1}</span>
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
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">{i+1}</span>
                    <span className="text-slate-700 leading-tight">{w}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Suggestions */}
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
                <div key={i} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex gap-3 items-start">
                  <div className="mt-0.5 text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <p className="text-slate-700 text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Plan */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <Calendar className="mr-2 h-5 w-5 text-indigo-600" /> 7-Day Improvement Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.sevenDayPlan.map((plan, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
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
              {result.interviewQuestions.map((q, i) => (
                <div key={i} className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-slate-800 font-medium">
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
