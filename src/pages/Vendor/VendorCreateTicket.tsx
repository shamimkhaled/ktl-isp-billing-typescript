import React from "react";
import { Card } from "../../components/common/Card";

export const VendorCreateTicket: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Ticket (Vendor)
          </h1>
          <p className="text-gray-600 mt-1">
            Create a support ticket as a vendor
          </p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          Vendor ticket creation form will be implemented here.
        </div>
      </Card>
    </div>
  );
};

export default VendorCreateTicket;
