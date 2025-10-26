import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import type { FC } from "react";

interface Zone {
  id: string;
  sdt_id?: string;
  parent?: string;
  zone_name: string;
  email?: string;
  mobile1?: string;
  mobile2?: string;
  contact_name?: string;
  contact_number?: string;
  login_id?: string;
  address?: string;
  address2?: string;
  district?: string;
  thana?: string;
  zip_code?: string;
  remarks?: string;
}

export const ZoneList: FC = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [zones] = useState<Zone[]>([]); // placeholder: hook into API later

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Zones & SDT — Zone List
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage zones. Create a new zone using the top link.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => navigate("/zones/create")}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Zone
          </Button>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" message="Loading zones..." />
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No zones found
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have any zones yet. Click the button above to create
              one.
            </p>
            <Button onClick={() => navigate("/zones/create")}>
              Create Zone
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zone Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SDT ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{z.zone_name}</td>
                    <td className="px-6 py-4">{z.sdt_id || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {z.contact_name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {z.mobile1 || z.contact_number || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {[z.district, z.thana, z.zip_code]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ZoneList;
