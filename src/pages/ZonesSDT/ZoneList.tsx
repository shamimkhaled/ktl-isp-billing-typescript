import React, { useState, useEffect } from "react";
import { Plus, MoreVertical, Edit3, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FC } from "react";
import { Zone, districtData } from "./types";
import { useDebounce } from "../../hooks/useDebounce";

export const ZoneList: FC = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [openMenu, setMenuOpen] = useState<string | null>(null);
  const [deletingZone, setDeletingZone] = useState<Zone | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  // Default sample zones
  const defaultZones: Zone[] = [
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
  ];

  const [zones, setZones] = useState<Zone[]>(() => {
    try {
      const saved = localStorage.getItem("demo_zones");
      if (saved) return JSON.parse(saved) as Zone[];
    } catch (e) {
      // ignore
    }
    return defaultZones;
  });

  // persist to localStorage when zones change
  useEffect(() => {
    try {
      localStorage.setItem("demo_zones", JSON.stringify(zones));
    } catch (e) {
      console.warn("Failed to save zones to localStorage", e);
    }
  }, [zones]);

  // Delete handler
  const handleDeleteZone = () => {
    if (!deletingZone) return;
    const id = deletingZone.id;
    setZones((prev) => prev.filter((z) => z.id !== id));
    setDeletingZone(null);
    toast.success("Zone deleted successfully");
  };

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

  // --- Inline create/edit form schema and hooks ---
  const zoneSchema = z
    .object({
      sdt_id: z.string().optional(),
      parent: z.string().optional(),
      zone_name: z.string().min(2, "Zone name is required"),
      email: z.string().email("Invalid email").optional(),
      mobile1: z.string().optional(),
      mobile2: z.string().optional(),
      contact_name: z.string().optional(),
      contact_number: z.string().optional(),
      login_id: z.string().optional(),
      address: z.string().optional(),
      address2: z.string().optional(),
      district: z.string().optional(),
      thana: z.string().optional(),
      zip_code: z.string().optional(),
      remarks: z.string().optional(),
      copy_form: z.boolean().optional(),
    })
    .required();

  type ZoneFormValues = z.infer<typeof zoneSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      sdt_id: "",
      parent: "",
      zone_name: "",
      email: "",
      mobile1: "",
      mobile2: "",
      contact_name: "",
      contact_number: "",
      login_id: "",
      address: "",
      address2: "",
      district: "",
      thana: "",
      zip_code: "",
      remarks: "",
      copy_form: false,
    },
  });

  // When opening the modal for edit, populate form
  useEffect(() => {
    if (showCreateModal && editingZone) {
      // copy editingZone into form
      const { id, ...rest } = editingZone as any;
      reset({ ...rest });
    } else if (!showCreateModal) {
      // clear form when modal closed
      reset();
    }
  }, [showCreateModal, editingZone, reset]);

  // Reset thana when district changes
  const currentDistrict = watch("district");
  useEffect(() => {
    setValue("thana", "");
  }, [currentDistrict, setValue]);

  const onSubmitZone = async (data: ZoneFormValues) => {
    try {
      if (editingZone) {
        // update
        setZones((prev) =>
          prev.map((z) => (z.id === editingZone.id ? { ...z, ...data } : z))
        );
        toast.success("Zone updated successfully");
        // If there was an active search, clear it so updated zone becomes visible
        setSearchTerm("");
        // Ensure we show the first page so users see the updated item
        setCurrentPage(1);
      } else {
        // create
        const newZone: Zone = {
          id: `zone-${Date.now()}`,
          sdt_id: data.sdt_id || "",
          parent: data.parent || "",
          zone_name: data.zone_name,
          email: data.email || "",
          mobile1: data.mobile1 || "",
          mobile2: data.mobile2 || "",
          contact_name: data.contact_name || "",
          contact_number: data.contact_number || "",
          login_id: data.login_id || "",
          address: data.address || "",
          address2: data.address2 || "",
          district: data.district || "",
          thana: data.thana || "",
          zip_code: data.zip_code || "",
          remarks: data.remarks || "",
          copy_form: !!data.copy_form,
        };
        setZones((prev) => [newZone, ...prev]);
        toast.success("Zone created successfully");
        // Clear search and reset to first page so the new zone is visible immediately
        setSearchTerm("");
        setCurrentPage(1);
      }

      setShowCreateModal(false);
      setEditingZone(null);
      reset();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save zone");
    }
  };

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
            onClick={() => {
              setEditingZone(null);
              setShowCreateModal(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Zone
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="flex justify-between items-center space-x-4">
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
            <Button
              onClick={() => {
                setEditingZone(null);
                setShowCreateModal(true);
              }}
            >
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
                                  setEditingZone(z);
                                  setShowCreateModal(true);
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

      {/* Create / Edit Zone Modal */}
      {(showCreateModal || editingZone) && (
        <Modal
          isOpen={showCreateModal || !!editingZone}
          onClose={() => {
            setShowCreateModal(false);
            setEditingZone(null);
          }}
          title={editingZone ? "Edit Zone" : "Create Zone"}
          size="xl"
        >
          <form onSubmit={handleSubmit(onSubmitZone)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SDT ID"
                {...register("sdt_id")}
                error={(errors as any).sdt_id?.message}
              />
              <Input
                label="Parent"
                {...register("parent")}
                error={(errors as any).parent?.message}
              />
              <Input
                label="Zone Name"
                {...register("zone_name")}
                error={(errors as any).zone_name?.message}
              />
              <Input
                label="Email"
                type="email"
                {...register("email")}
                error={(errors as any).email?.message}
              />
              <Input
                label="Mobile 1"
                {...register("mobile1")}
                error={(errors as any).mobile1?.message}
              />
              <Input
                label="Mobile 2"
                {...register("mobile2")}
                error={(errors as any).mobile2?.message}
              />
              <Input
                label="Contact Name"
                {...register("contact_name")}
                error={(errors as any).contact_name?.message}
              />
              <Input
                label="Contact Number"
                {...register("contact_number")}
                error={(errors as any).contact_number?.message}
              />
              <Input
                label="Login ID"
                {...register("login_id")}
                error={(errors as any).login_id?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  {...register("district")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">Select District</option>
                  {Object.keys(districtData).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thana
                </label>
                <select
                  {...register("thana")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">Select Thana</option>
                  {(
                    (watch("district") && districtData[watch("district")]) ||
                    []
                  ).map((t: string) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Address"
                {...register("address")}
                error={(errors as any).address?.message}
              />
              <Input
                label="Address 2"
                {...register("address2")}
                error={(errors as any).address2?.message}
              />
              <Input
                label="Zip Code"
                {...register("zip_code")}
                error={(errors as any).zip_code?.message}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  {...register("remarks")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    {...register("copy_form")}
                  />
                  <span className="ml-2 text-sm text-gray-700">Copy form</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingZone(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editingZone ? "Update Zone" : "Create Zone"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

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
              <Button variant="danger" onClick={handleDeleteZone}>
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
