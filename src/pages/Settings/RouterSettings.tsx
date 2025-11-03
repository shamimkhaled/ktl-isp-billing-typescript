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

// Main Router Settings Component
export const RouterSettings: React.FC = () => {
  const [routers, setRouters] = useState<RouterData[]>([]);
  const [filteredRouters, setFilteredRouters] = useState<RouterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouter, setSelectedRouter] = useState<RouterData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
    toast.info(`Editing ${router.name}`);
    // TODO: Implement edit modal or navigation
  };

  const handleDelete = (router: RouterData) => {
    toast.info(`Delete ${router.name}`);
    // TODO: Implement delete confirmation modal
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
            onClick={() => toast.info('Add new router')}
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
    </div>
  );
};
