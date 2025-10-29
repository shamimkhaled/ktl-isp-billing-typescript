import React from "react";
import { Card } from "../../components/common/Card";

export const MyTickets: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-1">
            Tickets assigned to or created by you
          </p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <p>My tickets list will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
};

export default MyTickets;
