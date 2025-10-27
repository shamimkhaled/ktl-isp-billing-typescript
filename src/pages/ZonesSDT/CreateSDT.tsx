import React from "react";
import { Card } from "../../components/common/Card";

export const CreateSDT: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create SDT</h1>
        <p className="text-gray-600 mt-1">
          Create a new SDT entry in the system.
        </p>
      </div>

      <Card>
        <div className="p-6">
          {/* Add your SDT creation form here */}
          <p className="text-gray-500">
            SDT creation form will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CreateSDT;
