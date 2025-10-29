import React from "react";
import { Card } from "../../components/common/Card";

export const SalesQuery: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Query</h1>
          <p className="text-gray-600 mt-1">
            Sales-related ticket queries and reporting
          </p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <p>Sales queries interface will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
};

export default SalesQuery;
