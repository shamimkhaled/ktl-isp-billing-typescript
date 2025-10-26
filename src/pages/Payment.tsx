import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Search, Plus } from 'lucide-react';

export const Payment: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage zone-wise payments and transactions</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>New Payment</Button>
      </div>

      {/* Filters/Search */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Content Placeholder */}
      <Card>
        <div className="py-12 text-center text-gray-600">
          <p className="text-lg">Payment list and details will appear here.</p>
          <p className="text-sm mt-2">This is a placeholder page for the Zones & SDT → Payments section.</p>
        </div>
      </Card>
    </div>
  );
};
