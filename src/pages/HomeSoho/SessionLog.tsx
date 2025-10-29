import React from "react";
import { Card } from "../../components/common/Card";

export const SessionLog: React.FC = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">Session Log</h1>
      <p className="text-sm text-gray-500">
        Customer session logging and history will be implemented here.
      </p>
    </Card>
  );
};
