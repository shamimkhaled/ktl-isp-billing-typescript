import React, { useState, useCallback, useEffect } from "react";
import {
  FileText,
  Save,
  Download,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import type { ReportData, SavedReport } from "../types";

export const Report: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved reports from localStorage on component mount
  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = useCallback(() => {
    try {
      const saved = localStorage.getItem("ktl-reports");
      if (saved) {
        const reports: ReportData[] = JSON.parse(saved);
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
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load saved reports");
    }
  }, []);

  const generateReportId = () => {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSaveReport = useCallback(async () => {
    if (!title.trim()) {
      toast.error("Please enter a report title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter report content");
      return;
    }

    setIsSaving(true);

    try {
      const reportData: ReportData = {
        id: generateReportId(),
        title: title.trim(),
        content: content.trim(),
        author: user?.name || "Unknown User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: tags,
      };

      // Get existing reports
      const existingReports = localStorage.getItem("ktl-reports");
      const reports: ReportData[] = existingReports
        ? JSON.parse(existingReports)
        : [];

      // Add new report
      reports.push(reportData);

      // Save to localStorage
      localStorage.setItem("ktl-reports", JSON.stringify(reports));

      // Clear form
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");

      // Reload saved reports list
      loadSavedReports();

      toast.success("Report saved successfully!");
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Failed to save report");
    } finally {
      setIsSaving(false);
    }
  }, [title, content, tags, user?.name, loadSavedReports]);

  const handleDownloadReport = useCallback(() => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter title and content before downloading");
      return;
    }

    try {
      const reportData = {
        title: title.trim(),
        content: content.trim(),
        author: user?.name || "Unknown User",
        createdAt: new Date().toISOString(),
        tags: tags,
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title
        .trim()
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_report.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  }, [title, content, tags, user?.name]);

  const handleAddTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleViewReport = useCallback((reportId: string) => {
    try {
      const saved = localStorage.getItem("ktl-reports");
      if (saved) {
        const reports: ReportData[] = JSON.parse(saved);
        const report = reports.find((r) => r.id === reportId);
        if (report) {
          setSelectedReport(report);
          setShowPreviewModal(true);
        }
      }
    } catch (error) {
      console.error("Error loading report:", error);
      toast.error("Failed to load report");
    }
  }, []);

  const handleDeleteReport = useCallback(
    (reportId: string) => {
      try {
        const saved = localStorage.getItem("ktl-reports");
        if (saved) {
          const reports: ReportData[] = JSON.parse(saved);
          const filteredReports = reports.filter((r) => r.id !== reportId);
          localStorage.setItem("ktl-reports", JSON.stringify(filteredReports));
          loadSavedReports();
          toast.success("Report deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        toast.error("Failed to delete report");
      }
    },
    [loadSavedReports]
  );

  const handleLoadReport = useCallback((reportId: string) => {
    try {
      const saved = localStorage.getItem("ktl-reports");
      if (saved) {
        const reports: ReportData[] = JSON.parse(saved);
        const report = reports.find((r) => r.id === reportId);
        if (report) {
          setTitle(report.title);
          setContent(report.content);
          setTags(report.tags || []);
          toast.success("Report loaded successfully");
        }
      }
    } catch (error) {
      console.error("Error loading report:", error);
      toast.error("Failed to load report");
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mt-3 mb-2">
            Report Writer
          </h1>
          <p className="text-white/80">
            Create, save, and manage your reports locally
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            onClick={handleDownloadReport}
            variant="secondary"
            className="flex items-center space-x-2"
            disabled={!title.trim() || !content.trim()}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          <Button
            onClick={handleSaveReport}
            className="flex items-center space-x-2"
            disabled={isSaving || !title.trim() || !content.trim()}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Report"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Input */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Report Details
              </h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Report Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter report title..."
                required
              />

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button
                    onClick={handleAddTag}
                    variant="secondary"
                    size="sm"
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Content Editor */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Report Content
              </h3>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your report content here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Characters: {content.length}</span>
              <span>
                Words:{" "}
                {
                  content
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }
              </span>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Report Info
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Author
                </label>
                <p className="text-gray-900">{user?.name || "Unknown User"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date
                </label>
                <p className="text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="flex items-center space-x-2">
                  {title.trim() && content.trim() ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 text-sm">
                        Ready to save
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 text-sm">Draft</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Saved Reports */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Saved Reports
              </h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedReports.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No saved reports yet
                </p>
              ) : (
                savedReports.map((report) => (
                  <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {report.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {report.preview}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(report.createdAt)}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View report"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleLoadReport(report.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Load report"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete report"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Report Preview"
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedReport.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>By {selectedReport.author}</span>
                <span>Created: {formatDate(selectedReport.createdAt)}</span>
                {selectedReport.updatedAt !== selectedReport.createdAt && (
                  <span>Updated: {formatDate(selectedReport.updatedAt)}</span>
                )}
              </div>
              {selectedReport.tags && selectedReport.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedReport.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                {selectedReport.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
