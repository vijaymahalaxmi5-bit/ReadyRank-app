import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProfileInput } from "@/lib/analyzer";
import {
  Loader2,
  ArrowRight,
  UploadCloud,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import {
  extractTextFromFile,
  getFileType,
  formatFileSize,
  SupportedFileType,
} from "@/lib/fileExtractor";

interface HomeProps {
  onAnalyze: (data: ProfileInput) => void;
}

const FILE_TYPE_LABELS: Record<SupportedFileType, string> = {
  pdf: "PDF",
  docx: "DOCX",
  image: "Image",
  unsupported: "Unsupported",
};

export default function Home({ onAnalyze }: HomeProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("Reading your resume...");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileInput>({
    name: "",
    targetRole: "",
    experienceLevel: "Fresher",
    resumeText: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  const acceptFile = useCallback((file: File) => {
    const type = getFileType(file);
    if (type === "unsupported") {
      setUploadError("Unsupported file type. Please upload a PDF, DOCX, PNG, or JPG.");
      return;
    }
    setUploadError(null);
    setUploadedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) acceptFile(file);
    },
    [acceptFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const hasFile = !!uploadedFile;
    const hasPastedText = formData.resumeText.trim().length > 0;

    if (!hasFile && !hasPastedText) {
      setSubmitError("Please upload a resume file or paste your resume text below.");
      return;
    }

    if (!formData.name || !formData.targetRole) return;

    setIsAnalyzing(true);
    setLoadingText("Reading your resume...");

    let resolvedText = formData.resumeText;

    if (hasFile) {
      const result = await extractTextFromFile(uploadedFile!);
      if (!result.success) {
        if (hasPastedText) {
          resolvedText = formData.resumeText;
        } else {
          setIsAnalyzing(false);
          setUploadError(
            result.error ??
              "We could not read this file. Please upload a clearer PDF/DOCX or paste your resume text."
          );
          return;
        }
      } else {
        resolvedText = result.text;
      }
    }

    setTimeout(() => setLoadingText("Analyzing interview readiness..."), 600);
    setTimeout(() => setLoadingText("Generating your report..."), 1200);

    setTimeout(() => {
      onAnalyze({ ...formData, resumeText: resolvedText });
    }, 1800);
  };

  const fileType = uploadedFile ? getFileType(uploadedFile) : null;
  const hasResume = !!uploadedFile || formData.resumeText.trim().length > 0;

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-3xl shadow-xl border-white/50 backdrop-blur-sm bg-white/90">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">ReadyRank</span>
            </div>
            <p className="text-xs font-medium text-primary/70 uppercase tracking-widest">Know before you interview.</p>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Check Your Interview Readiness in 2 Minutes
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Upload your resume and get a clear readiness score, recruiter-style feedback, and a personalized improvement plan before your real interview.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Name + Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Target Job Role <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.targetRole}
                    onValueChange={(val) => setFormData({ ...formData, targetRole: val })}
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

              {/* Experience Level */}
              <div className="space-y-3">
                <Label>Experience Level <span className="text-destructive">*</span></Label>
                <RadioGroup
                  value={formData.experienceLevel}
                  onValueChange={(val) => setFormData({ ...formData, experienceLevel: val })}
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

              {/* Resume Upload */}
              <div className="space-y-3">
                <Label>
                  Resume <span className="text-destructive">*</span>
                </Label>

                {/* Drop zone */}
                {!uploadedFile ? (
                  <div
                    data-testid="upload-dropzone"
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative flex flex-col items-center justify-center gap-3
                      border-2 border-dashed rounded-xl p-8 cursor-pointer
                      transition-all duration-200 select-none
                      ${isDragging
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5"
                      }
                    `}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        Drag &amp; drop your resume here
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PDF, DOCX, PNG, JPG — up to 10 MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="pointer-events-none"
                      data-testid="button-choose-file"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
                      className="sr-only"
                      onChange={handleFileInput}
                      data-testid="input-file"
                    />
                  </div>
                ) : (
                  /* File preview card */
                  <div
                    data-testid="file-preview"
                    className="flex items-center gap-4 p-4 rounded-xl border border-green-200 bg-green-50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate" data-testid="file-name">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {fileType ? FILE_TYPE_LABELS[fileType] : ""} &bull;{" "}
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      data-testid="button-remove-file"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload error */}
                {uploadError && (
                  <div
                    data-testid="upload-error"
                    className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Paste fallback toggle */}
                <button
                  type="button"
                  onClick={() => setShowPasteArea((v) => !v)}
                  data-testid="button-toggle-paste"
                  className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {showPasteArea ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide paste area
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Paste resume text instead (optional)
                    </>
                  )}
                </button>

                {showPasteArea && (
                  <div className="space-y-2">
                    <Textarea
                      id="resume"
                      placeholder="Paste your full resume text here as a fallback..."
                      className="min-h-[160px] resize-y text-sm"
                      value={formData.resumeText}
                      onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                      data-testid="textarea-resume"
                    />
                    <p className="text-xs text-slate-500">
                      Used as a fallback if the uploaded file cannot be read, or as the only source if no file is uploaded.
                    </p>
                  </div>
                )}
              </div>

              {/* Optional Links */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                  Optional Links
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      placeholder="https://"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      data-testid="input-portfolio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/..."
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      data-testid="input-github"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      data-testid="input-linkedin"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div
                data-testid="submit-error"
                className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full h-14 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg transition-all"
                disabled={isAnalyzing || !formData.name || !formData.targetRole || !hasResume}
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
              <p className="text-center text-xs text-slate-400">
                No login required. Resume reviewed instantly.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
