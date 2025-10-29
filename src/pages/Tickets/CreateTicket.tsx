import React from "react";
import { Card } from "../../components/common/Card";

export const CreateTicket: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Ticket</h1>
          <p className="text-gray-600 mt-1">Create a new ticket</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <p>Ticket creation form will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
};

export default CreateTicket;
