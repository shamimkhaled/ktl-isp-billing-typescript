import React from "react";
import { Card } from "../../components/common/Card";

export const TicketTopics: React.FC = () => {
  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Topics</h1>
          <p className="text-gray-600 mt-1">
            Manage ticket topics and categories
          </p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <p>Topics/categories management will be implemented here.</p>
        </div>
      </Card>
    </div>
  );
};

export default TicketTopics;
