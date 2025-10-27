import React from "react";
import { Card } from "../../components/common/Card";

export const SDTRates: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SDT Rates</h1>
        <p className="text-gray-600 mt-1">
          Manage and configure SDT rate plans.
        </p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your SDT rates management interface here */}
          <p className="text-gray-500">
            SDT rates management will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SDTRates;
