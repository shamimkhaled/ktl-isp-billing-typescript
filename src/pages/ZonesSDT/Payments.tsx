import React from "react";
import { Card } from "../../components/common/Card";

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">
          View and manage all payment transactions.
        </p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your payments management interface here */}
          <p className="text-gray-500">
            Payments management interface will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Payments;
