import React from "react";
import { Card } from "../../components/common/Card";

export const UnauthorizedCustomers: React.FC = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">UnAuthorized Customers</h1>
      <p className="text-sm text-gray-500">
        List of unauthorized customer accounts will be implemented here.
      </p>
    </Card>
  );
};
