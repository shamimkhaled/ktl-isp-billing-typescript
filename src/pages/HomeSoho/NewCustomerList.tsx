import React from "react";
import { Card } from "../../components/common/Card";

export const NewCustomerList: React.FC = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">New Customer List</h1>
      <p className="text-sm text-gray-500">
        Recently added customers list will be implemented here.
      </p>
    </Card>
  );
};
