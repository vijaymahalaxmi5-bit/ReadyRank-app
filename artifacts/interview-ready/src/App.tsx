import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import { analyzeProfile, AnalysisResult, ProfileInput } from "@/lib/analyzer";

const queryClient = new QueryClient();

function AppContent() {
  const [appState, setAppState] = useState<"form" | "results">("form");
  const [inputData, setInputData] = useState<ProfileInput | null>(null);
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (data: ProfileInput) => {
    const analysis = analyzeProfile(data);
    setInputData(data);
    setResultData(analysis);
    setAppState("results");
  };

  const handleReset = () => {
    setAppState("form");
    setInputData(null);
    setResultData(null);
  };

  return (
    <>
      {appState === "form" && <Home onAnalyze={handleAnalyze} />}
      {appState === "results" && inputData && resultData && (
        <Results input={inputData} result={resultData} onReset={handleReset} />
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
