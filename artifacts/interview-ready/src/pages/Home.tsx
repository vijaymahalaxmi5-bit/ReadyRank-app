import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProfileInput } from "@/lib/analyzer";
import { Loader2, ArrowRight } from "lucide-react";

interface HomeProps {
  onAnalyze: (data: ProfileInput) => void;
}

export default function Home({ onAnalyze }: HomeProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing resume...");
  
  const [formData, setFormData] = useState<ProfileInput>({
    name: "",
    targetRole: "",
    experienceLevel: "Fresher",
    resumeText: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetRole || !formData.resumeText) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => setLoadingText("Checking technical skills..."), 600);
    setTimeout(() => setLoadingText("Generating your report..."), 1200);
    
    setTimeout(() => {
      onAnalyze(formData);
    }, 1800);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-3xl shadow-xl border-white/50 backdrop-blur-sm bg-white/90">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Check Your Interview Readiness in 2 Minutes
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Get instant, actionable feedback on your resume and profile tailored to your dream role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="name" 
                    placeholder="Jane Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    data-testid="input-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Target Job Role <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.targetRole} 
                    onValueChange={(val) => setFormData({...formData, targetRole: val})}
                    required
                  >
                    <SelectTrigger data-testid="select-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Developer">Software Developer</SelectItem>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                      <SelectItem value="Digital Marketing Intern">Digital Marketing Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Experience Level <span className="text-destructive">*</span></Label>
                <RadioGroup 
                  value={formData.experienceLevel} 
                  onValueChange={(val) => setFormData({...formData, experienceLevel: val})}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Fresher" id="r1" data-testid="radio-fresher" />
                    <Label htmlFor="r1">Fresher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intern" id="r2" data-testid="radio-intern" />
                    <Label htmlFor="r2">Intern</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Entry-level" id="r3" data-testid="radio-entry" />
                    <Label htmlFor="r3">Entry-level</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume Text <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="resume" 
                  placeholder="Paste your full resume text here..." 
                  className="min-h-[200px] resize-y"
                  value={formData.resumeText}
                  onChange={(e) => setFormData({...formData, resumeText: e.target.value})}
                  required
                  data-testid="textarea-resume"
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Optional Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input 
                      id="portfolio" 
                      placeholder="https://" 
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                      data-testid="input-portfolio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input 
                      id="github" 
                      placeholder="https://github.com/..." 
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      data-testid="input-github"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input 
                      id="linkedin" 
                      placeholder="https://linkedin.com/in/..." 
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      data-testid="input-linkedin"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg transition-all" 
              disabled={isAnalyzing || !formData.name || !formData.targetRole || !formData.resumeText}
              data-testid="button-analyze"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {loadingText}
                </>
              ) : (
                <>
                  Analyze My Readiness
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
