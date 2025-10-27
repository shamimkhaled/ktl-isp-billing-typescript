import React from "react";
import { Card } from "../../components/common/Card";

export const CustomerPayments: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Payments</h1>
        <p className="text-gray-600 mt-1">
          Manage and track customer payment records.
        </p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your customer payments table/form here */}
          <p className="text-gray-500">
            Customer payments functionality will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CustomerPayments;
