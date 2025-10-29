import React from "react";
import { Card } from "../../components/common/Card";

export const Invoices: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Corporate Invoices
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all corporate invoices
          </p>
        </div>
      </div>

      <Card>
        {/* Add your invoices implementation here */}
        <div className="p-6">
          <p>Corporate invoices list will be implemented here</p>
        </div>
      </Card>
    </div>
  );
};
