import React from "react";
import { Card } from "../../components/common/Card";

export const SDTList: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SDT List</h1>
        <p className="text-gray-600 mt-1">View and manage all SDT entries.</p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your SDT list table here */}
          <p className="text-gray-500">
            SDT list table will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SDTList;
