import React from "react";
import { Card } from "../../components/common/Card";

export const HomeSohoCustomerList: React.FC = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">Customer List</h1>
      <p className="text-sm text-gray-500">
        HOME/SOHO customers list with search and filters will be implemented
        here.
      </p>
    </Card>
  );
};

export default HomeSohoCustomerList;
