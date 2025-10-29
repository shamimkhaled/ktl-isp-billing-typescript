import React from "react";
import { Card } from "../../components/common/Card";

export const CustomerCounts: React.FC = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">Customer Counts</h1>
      <div className="space-y-4">
        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="font-medium mb-2">Active Customers</h2>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <h2 className="font-medium mb-2">Inactive Customers</h2>
          <p className="text-2xl font-bold text-red-600">0</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="font-medium mb-2">New Customers</h2>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>
      </div>
    </Card>
  );
};
