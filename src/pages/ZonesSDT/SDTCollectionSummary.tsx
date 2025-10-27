import React from "react";
import { Card } from "../../components/common/Card";

export const SDTCollectionSummary: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          SDT Collection Summary
        </h1>
        <p className="text-gray-600 mt-1">
          View collection summary reports for SDTs.
        </p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your SDT collection summary reports here */}
          <p className="text-gray-500">
            SDT collection summary reports will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SDTCollectionSummary;
