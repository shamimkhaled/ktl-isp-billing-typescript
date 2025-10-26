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
  copy_form?: boolean;
}

export const ZoneList: FC = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  // Placeholder zones - replace with API data when service/hook is available
  const [zones] = useState<Zone[]>([
    {
      id: "zone-1",
      sdt_id: "SDT-001",
      parent: "Central",
      zone_name: "Zone A",
      email: "zonea@example.com",
      mobile1: "01710000001",
      mobile2: "01710000002",
      contact_name: "Alice",
      contact_number: "01710000001",
      login_id: "zonea",
      address: "12 Main St",
      address2: "Block B",
      district: "Dhaka",
      thana: "Dhanmondi",
      zip_code: "1205",
      remarks: "Primary zone",
      copy_form: false,
    },
    {
      id: "zone-2",
      sdt_id: "SDT-002",
      parent: "North",
      zone_name: "Zone B",
      email: "zoneb@example.com",
      mobile1: "01710000003",
      contact_name: "Bob",
      contact_number: "01710000003",
      login_id: "zoneb",
      address: "34 Side Rd",
      district: "Chattogram",
      thana: "Pahartali",
      zip_code: "4000",
      remarks: "",
      copy_form: true,
    },
  ]);

  return (
    <div className="space-y-6 pt-8">
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
          <div className="flex items-center justify-center py-8">
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
          <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      SDT ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Parent
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Zone Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Mobile 1
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Mobile 2
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Contact Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Contact Number
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Login ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Address
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Address 2
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      District
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Thana
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Zip
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Remarks
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Copy Form
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {zones.map((z) => (
                    <tr
                      key={z.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.sdt_id || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.parent || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {z.zone_name}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.email || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.mobile1 || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.mobile2 || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.contact_name || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.contact_number || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.login_id || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {z.address || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {z.address2 || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.district || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.thana || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.zip_code || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {z.remarks || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                        {z.copy_form ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-2">
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
          </div>
        )}
      </Card>
    </div>
  );
};

export default ZoneList;
