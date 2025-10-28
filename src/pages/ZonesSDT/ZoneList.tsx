import React, { useState } from "react";
import { Plus, MoreVertical, Edit3, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Modal } from "../../components/common/Modal";
import type { FC } from "react";
import { Zone } from "./types";
import { useDebounce } from "../../hooks/useDebounce";

export const ZoneList: FC = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [openMenu, setMenuOpen] = useState<string | null>(null);
  const [deletingZone, setDeletingZone] = useState<Zone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

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

  // Filter & paginate
  const filteredZones = zones.filter((z) => {
    const q = (debouncedSearch || "").toLowerCase().trim();
    if (!q) return true;
    return [
      z.zone_name,
      z.sdt_id,
      z.parent,
      z.email,
      z.mobile1,
      z.mobile2,
      z.contact_name,
      z.contact_number,
      z.login_id,
      z.address,
      z.district,
      z.thana,
    ]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(q));
  });

  const totalItems = filteredZones.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  // Ensure current page is within bounds when search/perPage changes
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [debouncedSearch]);

  const paginatedZones = filteredZones.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Zones / SDT — Zone List
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

      {/* Search */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Per page</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-xl"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" message="Loading zones..." />
          </div>
        ) : totalItems === 0 ? (
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
                  {paginatedZones.map((z) => (
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
                          <button
                            onClick={() => setMenuOpen(z.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === z.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                              <button
                                onClick={() => {
                                  setMenuOpen(null);
                                  navigate(`/zones/edit/${z.id}`);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit Zone</span>
                              </button>
                              <button
                                onClick={() => {
                                  setMenuOpen(null);
                                  setDeletingZone(z);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Zone</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="flex items-center justify-between py-3 px-2">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1} -{" "}
                  {Math.min(currentPage * perPage, totalItems)} of {totalItems}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {/* Simple page numbers - show up to 5 pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2)
                    )
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded-md border ${
                          p === currentPage
                            ? "bg-gray-200 font-medium"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {deletingZone && (
        <Modal
          isOpen={!!deletingZone}
          onClose={() => setDeletingZone(null)}
          title="Delete Zone"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Delete Zone</h4>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{deletingZone.zone_name}</strong>? This will permanently
              remove the zone and all associated data.
            </p>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setDeletingZone(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  // Add your delete logic here
                  // For now, just close the modal
                  setDeletingZone(null);
                }}
              >
                Delete Zone
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ZoneList;
