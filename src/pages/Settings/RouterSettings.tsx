import React, { useState, useEffect } from 'react';
import {
  Router,
  Search,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { toast } from 'sonner';

// Router data type
interface RouterData {
  id: string;
  ip: string;
  ip2?: string;
  name: string;
  incoming: string;
  apiLogin: string;
  apiPort: string;
  apiSsl: boolean;
  backupRadiusIp?: string;
  status: 'online' | 'offline';
  onlineUsers: number;
  rosVersion: string;
  wwwPort: string;
  sstpIp?: string;
  connectStatus: 'connected' | 'disconnected';
  connectedVia: string;
  identity: string;
}

// Add Router Form Data
interface AddRouterFormData {
  ip: string;
  ip2?: string;
  backupIp?: string;
  name: string;
  radiusSecret: string;
  incomingPort: string;
  apiUsername: string;
  apiPassword: string;
  apiPort: string;
  snmp?: string;
  apiSsl: boolean;
  ipv6Enable: boolean;
  sstpIp?: string;
  apiSslPort?: string;
}

// Main Router Settings Component
export const RouterSettings: React.FC = () => {
  const [routers, setRouters] = useState<RouterData[]>([]);
  const [filteredRouters, setFilteredRouters] = useState<RouterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouter, setSelectedRouter] = useState<RouterData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRouter, setEditingRouter] = useState<RouterData | null>(null);
  const [deletingRouter, setDeletingRouter] = useState<RouterData | null>(null);
  const [formData, setFormData] = useState<AddRouterFormData>({
    ip: '',
    ip2: '',
    backupIp: '',
    name: '',
    radiusSecret: '',
    incomingPort: '1812',
    apiUsername: '',
    apiPassword: '',
    apiPort: '8728',
    snmp: '',
    apiSsl: false,
    ipv6Enable: false,
    sstpIp: '',
    apiSslPort: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddRouterFormData, string>>>({});

  useEffect(() => {
    loadRouters();
  }, []);

  useEffect(() => {
    // Filter routers based on search term
    if (searchTerm.trim() === '') {
      setFilteredRouters(routers);
    } else {
      const filtered = routers.filter((router) => {
        const search = searchTerm.toLowerCase();
        return (
          router.ip.toLowerCase().includes(search) ||
          router.ip2?.toLowerCase().includes(search) ||
          router.name.toLowerCase().includes(search) ||
          router.incoming.toLowerCase().includes(search) ||
          router.apiLogin.toLowerCase().includes(search) ||
          router.backupRadiusIp?.toLowerCase().includes(search) ||
          router.rosVersion.toLowerCase().includes(search)
        );
      });
      setFilteredRouters(filtered);
    }
  }, [searchTerm, routers]);

  const loadRouters = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await routerService.getRouters();
      // setRouters(response.data);
      
      // Mock data for development
      setRouters(getMockRouters());
      toast.success('Router data loaded');
    } catch (error: any) {
      console.warn('Failed to load routers from API, using mock data:', error);
      setRouters(getMockRouters());
      toast.warning('Using demo router data - API not available');
    } finally {
      setLoading(false);
    }
  };

  const getMockRouters = (): RouterData[] => [
    {
      id: '1',
      ip: '192.168.88.1',
      ip2: '10.0.0.1',
      name: 'Main Router',
      incoming: '1812',
      apiLogin: 'billing',
      apiPort: '6634',
      apiSsl: true,
      backupRadiusIp: '192.168.88.100',
      status: 'online',
      onlineUsers: 152,
      rosVersion: '7.11.2',
      wwwPort: '80',
      sstpIp: '192.168.88.50',
      connectStatus: 'connected',
      connectedVia: 'Ethernet',
      identity: 'main-router-ktl',
    },
    {
      id: '2',
      ip: '192.168.88.2',
      name: 'Branch Router 1',
      incoming: '1812',
      apiLogin: 'billing',
      apiPort: '8728',
      apiSsl: false,
      backupRadiusIp: '192.168.88.101',
      status: 'online',
      onlineUsers: 89,
      rosVersion: '7.11.2',
      wwwPort: '8080',
      sstpIp: '192.168.88.51',
      connectStatus: 'connected',
      connectedVia: 'PPPoE',
      identity: 'branch-router-1',
    },
    {
      id: '3',
      ip: '192.168.88.3',
      ip2: '10.0.0.3',
      name: 'Branch Router 2',
      incoming: '1813',
      apiLogin: 'billing',
      apiPort: '6634',
      apiSsl: true,
      status: 'offline',
      onlineUsers: 0,
      rosVersion: '7.10.1',
      wwwPort: '80',
      connectStatus: 'disconnected',
      connectedVia: 'N/A',
      identity: 'branch-router-2',
    },
    {
      id: '4',
      ip: '192.168.88.4',
      name: 'Core Router',
      incoming: '1812',
      apiLogin: 'admin',
      apiPort: '8729',
      apiSsl: true,
      backupRadiusIp: '192.168.88.102',
      status: 'online',
      onlineUsers: 234,
      rosVersion: '7.11.2',
      wwwPort: '443',
      sstpIp: '192.168.88.52',
      connectStatus: 'connected',
      connectedVia: 'SSTP',
      identity: 'core-router-main',
    },
  ];

  const handleRefresh = async () => {
    await loadRouters();
  };

  const handleView = (router: RouterData) => {
    setSelectedRouter(router);
    setShowDetailsModal(true);
  };

  const handleEdit = (router: RouterData) => {
    setEditingRouter(router);
    setFormData({
      ip: router.ip,
      ip2: router.ip2 || '',
      backupIp: router.backupRadiusIp || '',
      name: router.name,
      radiusSecret: '', // Keep empty for security
      incomingPort: router.incoming,
      apiUsername: router.apiLogin,
      apiPassword: '', // Keep empty for security
      apiPort: router.apiPort,
      snmp: '',
      apiSsl: router.apiSsl,
      ipv6Enable: false,
      sstpIp: router.sstpIp || '',
      apiSslPort: '',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = (router: RouterData) => {
    setDeletingRouter(router);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingRouter) return;

    try {
      // TODO: Replace with actual API call
      // await routerService.deleteRouter(deletingRouter.id);

      // Mock: Remove from local state
      setRouters(routers.filter(r => r.id !== deletingRouter.id));
      setShowDeleteModal(false);
      setDeletingRouter(null);
      toast.success(`${deletingRouter.name} deleted successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete router');
    }
  };

  const handleAddRouter = () => {
    setFormData({
      ip: '',
      ip2: '',
      backupIp: '',
      name: '',
      radiusSecret: '',
      incomingPort: '1812',
      apiUsername: '',
      apiPassword: '',
      apiPort: '8728',
      snmp: '',
      apiSsl: false,
      ipv6Enable: false,
      sstpIp: '',
      apiSslPort: '',
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const validateForm = (isEdit: boolean = false): { isValid: boolean; errors: Partial<Record<keyof AddRouterFormData, string>> } => {
    const errors: Partial<Record<keyof AddRouterFormData, string>> = {};

    // IP address validation (required)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (!formData.ip.trim()) {
      errors.ip = 'IP address is required';
    } else if (!ipRegex.test(formData.ip)) {
      errors.ip = 'Invalid IP address format (e.g., 192.168.1.1)';
    }

    // IP-2 validation (optional)
    if (formData.ip2 && formData.ip2.trim() && !ipRegex.test(formData.ip2)) {
      errors.ip2 = 'Invalid IP address format';
    }

    // Backup IP validation (optional)
    if (formData.backupIp && formData.backupIp.trim() && !ipRegex.test(formData.backupIp)) {
      errors.backupIp = 'Invalid IP address format';
    }

    // Name validation (required, alphanumeric and special chars allowed)
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      errors.name = 'Name must not exceed 50 characters';
    }

    // RADIUS Secret validation
    if (!isEdit && !formData.radiusSecret.trim()) {
      errors.radiusSecret = 'RADIUS Secret is required';
    } else if (formData.radiusSecret && formData.radiusSecret.length > 0 && formData.radiusSecret.length < 6) {
      errors.radiusSecret = 'RADIUS Secret must be at least 6 characters';
    }

    // Port validation helper
    const validatePort = (port: string): string | null => {
      if (!port.trim()) return null;
      if (!/^\d+$/.test(port)) {
        return 'Port must be a number';
      }
      const portNum = parseInt(port, 10);
      if (portNum < 1 || portNum > 65535) {
        return 'Port must be between 1 and 65535';
      }
      return null;
    };

    // Incoming Port validation (required)
    if (!formData.incomingPort.trim()) {
      errors.incomingPort = 'Incoming Port is required';
    } else {
      const portError = validatePort(formData.incomingPort);
      if (portError) errors.incomingPort = portError;
    }

    // API Port validation (optional but must be valid if provided)
    if (formData.apiPort && formData.apiPort.trim()) {
      const portError = validatePort(formData.apiPort);
      if (portError) errors.apiPort = portError;
    }

    // API-SSL Port validation (optional but must be valid if provided)
    if (formData.apiSslPort && formData.apiSslPort.trim()) {
      const portError = validatePort(formData.apiSslPort);
      if (portError) errors.apiSslPort = portError;
    }

    // API Username validation (required)
    if (!formData.apiUsername.trim()) {
      errors.apiUsername = 'API Username is required';
    } else if (formData.apiUsername.length < 3) {
      errors.apiUsername = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.apiUsername)) {
      errors.apiUsername = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    // API Password validation
    if (!isEdit && !formData.apiPassword.trim()) {
      errors.apiPassword = 'API Password is required';
    } else if (formData.apiPassword && formData.apiPassword.length > 0 && formData.apiPassword.length < 6) {
      errors.apiPassword = 'Password must be at least 6 characters';
    }

    // SSTP IP validation (optional)
    if (formData.sstpIp && formData.sstpIp.trim() && !ipRegex.test(formData.sstpIp)) {
      errors.sstpIp = 'Invalid IP address format';
    }

    // SNMP validation (optional)
    if (formData.snmp && formData.snmp.trim() && formData.snmp.length < 3) {
      errors.snmp = 'SNMP community string must be at least 3 characters';
    }

    setFormErrors(errors);
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmitRouter = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      // Show specific error if there are validation issues
      const errorFields = Object.keys(validation.errors).filter(key => validation.errors[key as keyof AddRouterFormData]);
      if (errorFields.length > 0) {
        const fieldNames = errorFields.map(field => {
          // Convert camelCase to readable format
          return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        });
        toast.error(`Validation errors in: ${fieldNames.join(', ')}`);
      } else {
        toast.error('Please fill in all required fields');
      }
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await routerService.createRouter(formData);

      // Mock: Add to local state
      const newRouter: RouterData = {
        id: `${routers.length + 1}`,
        ip: formData.ip,
        ip2: formData.ip2,
        name: formData.name,
        incoming: formData.incomingPort,
        apiLogin: formData.apiUsername,
        apiPort: formData.apiPort,
        apiSsl: formData.apiSsl,
        backupRadiusIp: formData.backupIp,
        status: 'offline',
        onlineUsers: 0,
        rosVersion: 'Unknown',
        wwwPort: '80',
        sstpIp: formData.sstpIp,
        connectStatus: 'disconnected',
        connectedVia: 'N/A',
        identity: formData.name,
      };

      setRouters([...routers, newRouter]);
      setShowAddModal(false);
      toast.success('Router added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add router');
    }
  };

  const handleSubmitEdit = async () => {
    const validation = validateForm(true);
    if (!validation.isValid) {
      // Show specific error if there are validation issues
      const errorFields = Object.keys(validation.errors).filter(key => validation.errors[key as keyof AddRouterFormData]);
      if (errorFields.length > 0) {
        const fieldNames = errorFields.map(field => {
          // Convert camelCase to readable format
          return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        });
        toast.error(`Validation errors in: ${fieldNames.join(', ')}`);
      } else {
        toast.error('Please fill in all required fields');
      }
      return;
    }

    if (!editingRouter) return;

    try {
      // TODO: Replace with actual API call
      // await routerService.updateRouter(editingRouter.id, formData);

      // Mock: Update in local state
      const updatedRouter: RouterData = {
        ...editingRouter,
        ip: formData.ip,
        ip2: formData.ip2,
        name: formData.name,
        incoming: formData.incomingPort,
        apiLogin: formData.apiUsername,
        apiPort: formData.apiPort,
        apiSsl: formData.apiSsl,
        backupRadiusIp: formData.backupIp,
        sstpIp: formData.sstpIp,
        identity: formData.name,
      };

      setRouters(routers.map(r => r.id === editingRouter.id ? updatedRouter : r));
      setShowEditModal(false);
      setEditingRouter(null);
      toast.success('Router updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update router');
    }
  };

  const handleInputChange = (field: keyof AddRouterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading router settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Router Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your Mikrotik routers
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAddRouter}
          >
            Add Router
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Router className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Routers</p>
              <p className="text-lg font-semibold text-gray-900">{routers.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-lg font-semibold text-gray-900">
                {routers.filter(r => r.status === 'online').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-lg font-semibold text-gray-900">
                {routers.filter(r => r.status === 'offline').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Online Users</p>
              <p className="text-lg font-semibold text-gray-900">
                {routers.reduce((sum, r) => sum + r.onlineUsers, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar and Table */}
      <Card>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by IP, Name, Incoming, API Login, RoS Version..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IP-2
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Incoming
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  API Login/Port
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Backup Radius IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Online Users
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  RoS Version
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRouters.length > 0 ? (
                filteredRouters.map((router) => (
                  <tr key={router.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {router.ip}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {router.ip2 || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {router.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {router.incoming}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {router.apiLogin} / {router.apiPort} / {router.apiSsl ? 'SSL' : 'No SSL'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {router.backupRadiusIp || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          router.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {router.status === 'online' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {router.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {router.onlineUsers}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {router.rosVersion}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(router)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(router)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(router)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm
                      ? 'No routers found matching your search'
                      : 'No routers configured yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        {filteredRouters.length > 0 && (
          <div className="mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <p className="text-sm text-gray-600">
              Showing {filteredRouters.length} of {routers.length} router(s)
            </p>
          </div>
        )}
      </Card>

      {/* Router Details Modal */}
      {showDetailsModal && selectedRouter && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Router Config"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.ip}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Port
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.apiPort}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WWW Port
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.wwwPort}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ROS Version
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.rosVersion}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSTP IP
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.sstpIp || '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connect Status
                </label>
                <p className="text-sm bg-gray-50 px-3 py-2 rounded-md">
                  <span
                    className={`inline-flex items-center ${
                      selectedRouter.connectStatus === 'connected'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {selectedRouter.connectStatus === 'connected' ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {selectedRouter.connectStatus}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connected Via
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.connectedVia}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identity
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {selectedRouter.name}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Router Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Router"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IP - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ip}
                  onChange={(e) => handleInputChange('ip', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.ip ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 192.168.88.1"
                />
                {formErrors.ip && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.ip}</p>
                )}
              </div>

              {/* IP-2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP-2
                </label>
                <input
                  type="text"
                  value={formData.ip2}
                  onChange={(e) => handleInputChange('ip2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10.0.0.1"
                />
              </div>

              {/* Backup IP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup IP
                </label>
                <input
                  type="text"
                  value={formData.backupIp}
                  onChange={(e) => handleInputChange('backupIp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 192.168.88.100"
                />
              </div>

              {/* Name - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Main Router"
                />
                {formErrors.name && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* RADIUS Secret - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RADIUS Secret <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  value={formData.radiusSecret}
                  onChange={(e) => handleInputChange('radiusSecret', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.radiusSecret ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter RADIUS secret"
                />
                {formErrors.radiusSecret && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.radiusSecret}</p>
                )}
              </div>

              {/* Incoming Port - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incoming Port <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.incomingPort}
                  onChange={(e) => handleInputChange('incomingPort', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.incomingPort ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1812"
                />
                {formErrors.incomingPort && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.incomingPort}</p>
                )}
              </div>

              {/* API Username - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Username <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apiUsername}
                  onChange={(e) => handleInputChange('apiUsername', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.apiUsername ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., billing"
                  autoComplete="username"
                />
                {formErrors.apiUsername && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.apiUsername}</p>
                )}
              </div>

              {/* API Password - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  value={formData.apiPassword}
                  onChange={(e) => handleInputChange('apiPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.apiPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter API password"
                  autoComplete="new-password"
                />
                {formErrors.apiPassword && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.apiPassword}</p>
                )}
              </div>

              {/* API Port */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Port
                </label>
                <input
                  type="text"
                  value={formData.apiPort}
                  onChange={(e) => handleInputChange('apiPort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8728"
                />
              </div>

              {/* SNMP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SNMP
                </label>
                <input
                  type="text"
                  value={formData.snmp}
                  onChange={(e) => handleInputChange('snmp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SNMP community string"
                />
              </div>

              {/* SSTP IP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSTP IP
                </label>
                <input
                  type="text"
                  value={formData.sstpIp}
                  onChange={(e) => handleInputChange('sstpIp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 192.168.88.50"
                />
              </div>

              {/* API-SSL Port */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API-SSL Port (SSTP)
                </label>
                <input
                  type="text"
                  value={formData.apiSslPort}
                  onChange={(e) => handleInputChange('apiSslPort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8729"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="apiSsl"
                  checked={formData.apiSsl}
                  onChange={(e) => handleInputChange('apiSsl', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="apiSsl" className="ml-2 block text-sm text-gray-900">
                  API SSL
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ipv6Enable"
                  checked={formData.ipv6Enable}
                  onChange={(e) => handleInputChange('ipv6Enable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ipv6Enable" className="ml-2 block text-sm text-gray-900">
                  IPv6 Enable
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitRouter}
              >
                Add Router
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Router Modal */}
      {showEditModal && editingRouter && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingRouter(null);
          }}
          title={`Edit Router: ${editingRouter.name}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IP - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ip}
                  onChange={(e) => handleInputChange('ip', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.ip ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 192.168.88.1"
                />
                {formErrors.ip && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.ip}</p>
                )}
              </div>

              {/* IP-2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP-2
                </label>
                <input
                  type="text"
                  value={formData.ip2}
                  onChange={(e) => handleInputChange('ip2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10.0.0.1"
                />
              </div>

              {/* Backup IP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup IP
                </label>
                <input
                  type="text"
                  value={formData.backupIp}
                  onChange={(e) => handleInputChange('backupIp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 192.168.88.100"
                />
              </div>

              {/* Name - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Main Router"
                />
                {formErrors.name && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* RADIUS Secret - Optional in Edit Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RADIUS Secret
                </label>
                <input
                  type="password"
                  value={formData.radiusSecret}
                  onChange={(e) => handleInputChange('radiusSecret', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.radiusSecret ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new RADIUS secret (leave empty to keep current)"
                />
                {formErrors.radiusSecret && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.radiusSecret}</p>
                )}
              </div>

              {/* Incoming Port - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incoming Port <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.incomingPort}
                  onChange={(e) => handleInputChange('incomingPort', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.incomingPort ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1812"
                />
                {formErrors.incomingPort && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.incomingPort}</p>
                )}
              </div>

              {/* API Username - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Username <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apiUsername}
                  onChange={(e) => handleInputChange('apiUsername', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.apiUsername ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., billing"
                  autoComplete="username"
                />
                {formErrors.apiUsername && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.apiUsername}</p>
                )}
              </div>

              {/* API Password - Optional in Edit Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Password 
                </label>
                <input
                  type="password"
                  value={formData.apiPassword}
                  onChange={(e) => handleInputChange('apiPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.apiPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new API password (leave empty to keep current)"
                  autoComplete="new-password"
                />
                {formErrors.apiPassword && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.apiPassword}</p>
                )}
              </div>

              {/* API Port */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Port
                </label>
                <input
                  type="text"
                  value={formData.apiPort}
                  onChange={(e) => handleInputChange('apiPort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8728"
                />
              </div>

              {/* SNMP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SNMP
                </label>
                <input
                  type="text"
                  value={formData.snmp}
                  onChange={(e) => handleInputChange('snmp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SNMP community string"
                />
              </div>

              {/* SSTP IP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSTP IP
                </label>
                <input
                  type="text"
                  value={formData.sstpIp}
                  onChange={(e) => handleInputChange('sstpIp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 192.168.88.50"
                />
              </div>

              {/* API-SSL Port */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API-SSL Port (SSTP)
                </label>
                <input
                  type="text"
                  value={formData.apiSslPort}
                  onChange={(e) => handleInputChange('apiSslPort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8729"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 pt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editApiSsl"
                  checked={formData.apiSsl}
                  onChange={(e) => handleInputChange('apiSsl', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editApiSsl" className="ml-2 block text-sm text-gray-900">
                  API SSL
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIpv6Enable"
                  checked={formData.ipv6Enable}
                  onChange={(e) => handleInputChange('ipv6Enable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editIpv6Enable" className="ml-2 block text-sm text-gray-900">
                  IPv6 Enable
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRouter(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitEdit}
              >
                Update Router
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRouter && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingRouter(null);
          }}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Router
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Are you sure you want to delete <strong>{deletingRouter.name}</strong>?
                </p>
                <p className="text-sm text-gray-600">
                  IP: <strong>{deletingRouter.ip}</strong>
                </p>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This action cannot be undone. All router configuration and data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingRouter(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                Delete Router
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
