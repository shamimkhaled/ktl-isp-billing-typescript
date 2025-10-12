// Report service for handling report operations
import type { ReportData, ReportExportData } from "../types";

const STORAGE_KEY = "ktl-reports";

export class ReportService {
  /**
   * Save a report to localStorage
   */
  static saveReport(reportData: ReportData): void {
    try {
      const existingReports = this.getAllReports();
      existingReports.push(reportData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingReports));
    } catch (error) {
      console.error("Error saving report:", error);
      throw new Error("Failed to save report");
    }
  }

  /**
   * Get all saved reports from localStorage
   */
  static getAllReports(): ReportData[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading reports:", error);
      return [];
    }
  }

  /**
   * Get a specific report by ID
   */
  static getReportById(id: string): ReportData | null {
    try {
      const reports = this.getAllReports();
      return reports.find((report) => report.id === id) || null;
    } catch (error) {
      console.error("Error loading report:", error);
      return null;
    }
  }

  /**
   * Delete a report by ID
   */
  static deleteReport(id: string): void {
    try {
      const reports = this.getAllReports();
      const filteredReports = reports.filter((report) => report.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReports));
    } catch (error) {
      console.error("Error deleting report:", error);
      throw new Error("Failed to delete report");
    }
  }

  /**
   * Update an existing report
   */
  static updateReport(updatedReport: ReportData): void {
    try {
      const reports = this.getAllReports();
      const reportIndex = reports.findIndex(
        (report) => report.id === updatedReport.id
      );

      if (reportIndex === -1) {
        throw new Error("Report not found");
      }

      reports[reportIndex] = {
        ...updatedReport,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error("Error updating report:", error);
      throw new Error("Failed to update report");
    }
  }

  /**
   * Export report as JSON file
   */
  static exportReport(reportData: ReportExportData, filename?: string): void {
    try {
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        filename ||
        `${reportData.title
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase()}_report.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting report:", error);
      throw new Error("Failed to export report");
    }
  }

  /**
   * Generate unique report ID
   */
  static generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Search reports by title or content
   */
  static searchReports(query: string): ReportData[] {
    try {
      const reports = this.getAllReports();
      const lowercaseQuery = query.toLowerCase();

      return reports.filter(
        (report) =>
          report.title.toLowerCase().includes(lowercaseQuery) ||
          report.content.toLowerCase().includes(lowercaseQuery) ||
          report.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error("Error searching reports:", error);
      return [];
    }
  }

  /**
   * Get reports by tag
   */
  static getReportsByTag(tag: string): ReportData[] {
    try {
      const reports = this.getAllReports();
      return reports.filter((report) =>
        report.tags.some(
          (reportTag) => reportTag.toLowerCase() === tag.toLowerCase()
        )
      );
    } catch (error) {
      console.error("Error getting reports by tag:", error);
      return [];
    }
  }

  /**
   * Get all unique tags from all reports
   */
  static getAllTags(): string[] {
    try {
      const reports = this.getAllReports();
      const allTags = reports.flatMap((report) => report.tags);
      return [...new Set(allTags)].sort();
    } catch (error) {
      console.error("Error getting all tags:", error);
      return [];
    }
  }

  /**
   * Clear all reports (with confirmation)
   */
  static clearAllReports(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing reports:", error);
      throw new Error("Failed to clear reports");
    }
  }

  /**
   * Get report statistics
   */
  static getReportStats(): {
    totalReports: number;
    totalTags: number;
    averageContentLength: number;
    mostUsedTags: Array<{ tag: string; count: number }>;
  } {
    try {
      const reports = this.getAllReports();
      const allTags = reports.flatMap((report) => report.tags);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostUsedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const averageContentLength =
        reports.length > 0
          ? Math.round(
              reports.reduce((sum, report) => sum + report.content.length, 0) /
                reports.length
            )
          : 0;

      return {
        totalReports: reports.length,
        totalTags: Object.keys(tagCounts).length,
        averageContentLength,
        mostUsedTags,
      };
    } catch (error) {
      console.error("Error getting report stats:", error);
      return {
        totalReports: 0,
        totalTags: 0,
        averageContentLength: 0,
        mostUsedTags: [],
      };
    }
  }
}

export const reportService = ReportService;
