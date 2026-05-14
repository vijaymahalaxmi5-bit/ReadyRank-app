import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import { analyzeProfile, AnalysisResult, ProfileInput } from "@/lib/analyzer";
import { generateAIReport, AIReport } from "@/lib/aiReport";

const queryClient = new QueryClient();

const LOADING_STEPS = [
  "Calculating readiness score...",
  "Preparing personalized feedback...",
  "Preparing your report...",
];

function LoadingScreen({ step }: { step: string }) {
  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800" data-testid="loading-step">
            {step}
          </p>
          <p className="text-sm text-slate-500 mt-1">This takes just a moment</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-primary to-purple-600 h-1.5 rounded-full transition-all duration-700"
            style={{
              width:
                step === LOADING_STEPS[0]
                  ? "33%"
                  : step === LOADING_STEPS[1]
                  ? "66%"
                  : "95%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [appState, setAppState] = useState<"form" | "analyzing" | "results">("form");
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS[0]);
  const [inputData, setInputData] = useState<ProfileInput | null>(null);
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  const handleAnalyze = async (data: ProfileInput) => {
    setInputData(data);
    setAppState("analyzing");

    setLoadingStep(LOADING_STEPS[0]);
    const analysis = analyzeProfile(data);
    setResultData(analysis);

    await new Promise((r) => setTimeout(r, 600));
    setLoadingStep(LOADING_STEPS[1]);

    const report = await generateAIReport(data, analysis);

    await new Promise((r) => setTimeout(r, 400));
    setLoadingStep(LOADING_STEPS[2]);

    if (!report) {
      setAiUnavailable(true);
      setAiReport(null);
    } else {
      setAiUnavailable(false);
      setAiReport(report);
    }

    await new Promise((r) => setTimeout(r, 300));
    setAppState("results");
  };

  const handleReset = () => {
    setAppState("form");
    setInputData(null);
    setResultData(null);
    setAiReport(null);
    setAiUnavailable(false);
  };

  return (
    <>
      {appState === "form" && <Home onAnalyze={handleAnalyze} />}
      {appState === "analyzing" && <LoadingScreen step={loadingStep} />}
      {appState === "results" && inputData && resultData && (
        <Results
          input={inputData}
          result={resultData}
          aiReport={aiReport}
          aiUnavailable={aiUnavailable}
          onReset={handleReset}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
