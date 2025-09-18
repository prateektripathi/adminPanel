import React, { useState } from 'react';
import { Eye, Edit, Trash2, UserPlus, Star } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/UI/Modal';

const StaffManagement = () => {
  const { staff } = useData();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);

  const handleViewStaff = (staffData) => {
    setSelectedStaff(staffData);
    setShowStaffModal(true);
  };

  const StaffDetailModal = () => (
    <Modal
      isOpen={showStaffModal}
      onClose={() => setShowStaffModal(false)}
      title="Staff Details"
      size="lg"
    >
      {selectedStaff && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-medium">{selectedStaff.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <p className="font-medium">{selectedStaff.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Availability</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
                    selectedStaff.availability === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedStaff.availability}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Assigned Users</label>
                  <p className="font-medium text-blue-600">{selectedStaff.assignedUsers}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Completed Tasks</label>
                  <p className="font-medium text-green-600">{selectedStaff.completedTasks}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Pending Tasks</label>
                  <p className="font-medium text-yellow-600">{selectedStaff.pendingTasks}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Response Time</label>
                  <p className="font-medium">{selectedStaff.responseTime}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Performance Score</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(selectedStaff.performance / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{selectedStaff.performance}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Edit Staff
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Assign Users
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Update Role
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Remove Staff
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  const AddStaffModal = () => (
    <Modal
      isOpen={showAddStaff}
      onClose={() => setShowAddStaff(false)}
      title="Add New Staff Member"
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
              Role
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>Quality Inspector</option>
              <option>Product Specialist</option>
              <option>Customer Support</option>
              <option>Field Agent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>Quality Control</option>
              <option>Customer Service</option>
              <option>Field Operations</option>
              <option>Laboratory</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <textarea
            rows={3}
            placeholder="Enter areas of expertise..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddStaff(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Staff
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">
            Manage staff members, roles, and performance metrics
          </p>
        </div>
        
        <button
          onClick={() => setShowAddStaff(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus size={16} />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {staffMember.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                  <p className="text-sm text-gray-600">{staffMember.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
                staffMember.availability === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {staffMember.availability}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assigned Users:</span>
                <span className="font-medium">{staffMember.assignedUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Tasks:</span>
                <span className="font-medium text-green-600">{staffMember.completedTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Tasks:</span>
                <span className="font-medium text-yellow-600">{staffMember.pendingTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-medium">{staffMember.responseTime}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Performance</span>
                <span className="text-sm font-medium">{staffMember.performance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `₹{staffMember.performance}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => handleViewStaff(staffMember)}
                className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <StaffDetailModal />
      <AddStaffModal />
    </div>
  );
};

export default StaffManagement;