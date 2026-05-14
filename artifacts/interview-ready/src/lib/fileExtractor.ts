export type SupportedFileType = "pdf" | "docx" | "image" | "unsupported";

export interface ExtractionResult {
  success: boolean;
  text: string;
  error?: string;
}

export function getFileType(file: File): SupportedFileType {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  )
    return "docx";
  if (
    type.startsWith("image/") ||
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  )
    return "image";
  return "unsupported";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function extractFromPdf(file: File): Promise<ExtractionResult> {
  try {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
    GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const textParts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: unknown) => (item as { str: string }).str)
        .join(" ");
      textParts.push(pageText);
    }

    const text = textParts.join("\n").trim();
    if (!text) {
      return {
        success: false,
        text: "",
        error: "We could not read this file. Please upload a clearer PDF/DOCX or paste your resume text.",
      };
    }
    return { success: true, text };
  } catch {
    return {
      success: false,
      text: "",
      error: "We could not read this file. Please upload a clearer PDF/DOCX or paste your resume text.",
    };
  }
}

async function extractFromDocx(file: File): Promise<ExtractionResult> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) {
      return {
        success: false,
        text: "",
        error: "We could not read this file. Please upload a clearer PDF/DOCX or paste your resume text.",
      };
    }
    return { success: true, text };
  } catch {
    return {
      success: false,
      text: "",
      error: "We could not read this file. Please upload a clearer PDF/DOCX or paste your resume text.",
    };
  }
}

function simulateOcr(file: File): Promise<ExtractionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        text: "",
        error:
          "We could not read this file. Please upload a clearer PDF/DOCX or paste your resume text.",
      });
    }, 800);
  });
}

export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  const fileType = getFileType(file);

  switch (fileType) {
    case "pdf":
      return extractFromPdf(file);
    case "docx":
      return extractFromDocx(file);
    case "image":
      return simulateOcr(file);
    default:
      return {
        success: false,
        text: "",
        error: "Unsupported file type. Please upload a PDF, DOCX, PNG, or JPG file.",
      };
  }
}
