import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CategoryBarProps {
  label: string;
  score: number;
  maxScore: number;
  className?: string;
}

export function CategoryBar({ label, score, maxScore, className }: CategoryBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress((score / maxScore) * 100), 100);
    return () => clearTimeout(timer);
  }, [score, maxScore]);

  return (
    <div className={cn("w-full space-y-2", className)} data-testid={`category-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex justify-between items-center text-sm font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{Math.round(score)} / {maxScore} pts</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
