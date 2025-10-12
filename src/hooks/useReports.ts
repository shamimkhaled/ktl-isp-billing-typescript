import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { reportService } from "../services/report.service";
import type { ReportData, SavedReport } from "../types";

export const useReports = () => {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved reports from localStorage
  const loadSavedReports = useCallback(() => {
    try {
      setIsLoading(true);
      const reports = reportService.getAllReports();
      const reportPreviews: SavedReport[] = reports.map((report) => ({
        id: report.id,
        title: report.title,
        author: report.author,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        preview:
          report.content.substring(0, 150) +
          (report.content.length > 150 ? "..." : ""),
      }));
      setSavedReports(reportPreviews);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load saved reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a new report
  const saveReport = useCallback(
    async (reportData: Omit<ReportData, "id" | "createdAt" | "updatedAt">) => {
      try {
        setIsLoading(true);
        const newReport: ReportData = {
          ...reportData,
          id: reportService.generateReportId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        reportService.saveReport(newReport);
        await loadSavedReports();
        toast.success("Report saved successfully!");
        return newReport;
      } catch (error) {
        console.error("Error saving report:", error);
        toast.error("Failed to save report");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loadSavedReports]
  );

  // Get a specific report by ID
  const getReport = useCallback((reportId: string): ReportData | null => {
    try {
      return reportService.getReportById(reportId);
    } catch (error) {
      console.error("Error loading report:", error);
      toast.error("Failed to load report");
      return null;
    }
  }, []);

  // Delete a report
  const deleteReport = useCallback(
    async (reportId: string) => {
      try {
        setIsLoading(true);
        reportService.deleteReport(reportId);
        await loadSavedReports();
        toast.success("Report deleted successfully");
      } catch (error) {
        console.error("Error deleting report:", error);
        toast.error("Failed to delete report");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loadSavedReports]
  );

  // Export a report
  const exportReport = useCallback(
    (reportData: ReportData, filename?: string) => {
      try {
        const exportData = {
          title: reportData.title,
          content: reportData.content,
          author: reportData.author,
          createdAt: reportData.createdAt,
          tags: reportData.tags,
        };

        reportService.exportReport(exportData, filename);
        toast.success("Report exported successfully!");
      } catch (error) {
        console.error("Error exporting report:", error);
        toast.error("Failed to export report");
        throw error;
      }
    },
    []
  );

  // Search reports
  const searchReports = useCallback((query: string) => {
    try {
      return reportService.searchReports(query);
    } catch (error) {
      console.error("Error searching reports:", error);
      toast.error("Failed to search reports");
      return [];
    }
  }, []);

  // Get reports by tag
  const getReportsByTag = useCallback((tag: string) => {
    try {
      return reportService.getReportsByTag(tag);
    } catch (error) {
      console.error("Error getting reports by tag:", error);
      toast.error("Failed to get reports by tag");
      return [];
    }
  }, []);

  // Get all tags
  const getAllTags = useCallback(() => {
    try {
      return reportService.getAllTags();
    } catch (error) {
      console.error("Error getting tags:", error);
      return [];
    }
  }, []);

  // Get report statistics
  const getReportStats = useCallback(() => {
    try {
      return reportService.getReportStats();
    } catch (error) {
      console.error("Error getting report stats:", error);
      return {
        totalReports: 0,
        totalTags: 0,
        averageContentLength: 0,
        mostUsedTags: [],
      };
    }
  }, []);

  // Load reports on hook initialization
  useEffect(() => {
    loadSavedReports();
  }, [loadSavedReports]);

  return {
    savedReports,
    isLoading,
    loadSavedReports,
    saveReport,
    getReport,
    deleteReport,
    exportReport,
    searchReports,
    getReportsByTag,
    getAllTags,
    getReportStats,
  };
};
