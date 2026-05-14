import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CircularScoreProps {
  score: number;
  label: string;
  className?: string;
}

export function CircularScore({ score, label, className }: CircularScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  let colorClass = "text-red-500";
  if (score >= 41) colorClass = "text-amber-500";
  if (score >= 71) colorClass = "text-green-500";
  if (score >= 86) colorClass = "text-purple-500";

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)} data-testid={`score-${score}`}>
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{animatedScore}</span>
        </div>
      </div>
      <div className={cn("mt-4 text-lg font-medium", colorClass)}>
        {label}
      </div>
    </div>
  );
}
