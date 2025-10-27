import React from "react";
import { Card } from "../../components/common/Card";

export const ZoneCustomerSummary: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Zone Customer Summary
        </h1>
        <p className="text-gray-600 mt-1">
          View customer summary reports by zone.
        </p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your zone customer summary reports here */}
          <p className="text-gray-500">
            Zone customer summary reports will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ZoneCustomerSummary;
