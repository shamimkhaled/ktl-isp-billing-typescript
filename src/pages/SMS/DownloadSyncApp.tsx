import React from "react";
import { Card } from "../../components/common/Card";

export const DownloadSyncApp: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Download Sync App
          </h1>
          <p className="text-gray-600 mt-1">
            Links to download SMS sync application
          </p>
        </div>
      </div>

      <Card>
        <div className="p-6">Download links and instructions go here.</div>
      </Card>
    </div>
  );
};

export default DownloadSyncApp;
