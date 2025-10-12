// Report-related type definitions
export interface ReportData {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface SavedReport {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  preview: string;
}

export interface ReportFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface ReportExportData {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
}
