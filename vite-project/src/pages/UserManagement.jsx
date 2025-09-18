import React, { useState } from 'react';
import { Eye, Edit, Trash2, UserPlus, Upload, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/UI/DataTable';
import Modal from '../components/UI/Modal';

const UserManagement = () => {
  const { user } = useAuth();
  const { users, staff } = useData();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  // Filter users based on role
  const displayUsers = isAdmin ? users : users.filter(u => u.assignedStaff === user?.name);

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {value.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
          value === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'assignedStaff', label: 'Assigned Staff' },
    {
      key: 'totalPurchases',
      label: 'Total Purchases',
      render: (value) => `₹₹{value.toLocaleString()}`
    }
  ];

  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const UserDetailModal = () => (
    <Modal
      isOpen={showUserModal}
      onClose={() => setShowUserModal(false)}
      title="User Details"
      size="lg"
    >
      {selectedUser && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium">{selectedUser.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Join Date</label>
                  <p className="font-medium">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Payment Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
                    selectedUser.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.paymentStatus}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Assigned Staff</label>
                  <p className="font-medium">{selectedUser.assignedStaff}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Purchases</label>
                  <p className="font-medium text-green-600">₹{selectedUser.totalPurchases.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Purchase History</h4>
            <div className="space-y-2">
              {selectedUser.purchases.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{purchase}</span>
                  <span className="text-sm text-gray-500">Active</span>
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Edit User
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Assign Staff
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Update Payment
              </button>
            </div>
          )}

          {isStaff && (
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Update Task
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Mark Completed
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );

  const AddUserModal = () => (
    <Modal
      isOpen={showAddUser}
      onClose={() => setShowAddUser(false)}
      title="Add New User"
      size="lg"
    >
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Staff
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              {staff.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddUser(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Manage all users in the system' : 'Manage your assigned users'}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload size={16} />
              <span>Bulk Upload</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <UserPlus size={16} />
              <span>Add User</span>
            </button>
          </div>
        )}
      </div>

      {/* Custom table with action buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isAdmin ? 'All Users' : 'My Assigned Users'}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(userData[column.key], userData) : userData[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewUser(userData)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      {isAdmin && (
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailModal />
      <AddUserModal />
    </div>
  );
};

export default UserManagement;