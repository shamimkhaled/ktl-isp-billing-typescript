import React from "react";
import { Card } from "../../components/common/Card";

export const DueReport: React.FC = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">Due Report</h1>
      <p className="text-sm text-gray-500">
        Customer due amounts and payment reports will be implemented here.
      </p>
    </Card>
  );
};
