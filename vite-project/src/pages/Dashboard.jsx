import React from 'react';


import { 
  Users, 
  UserCheck, 
  Package, 
  TestTube, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import StatsCard from '../components/UI/StatsCard';
import { FaRupeeSign } from 'react-icons/fa';


const Dashboard = () => {
  const { user } = useAuth();
  const { stats } = useData();
  const { notifications } = useNotifications();

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="up"
          trendValue="12% this month"
          color="blue"
        />
        <StatsCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={UserCheck}
          trend="up"
          trendValue="5% this month"
          color="green"
        />
        <StatsCard
          title="Products Sold"
          value={stats.productsSold}
          icon={Package}
          trend="up"
          trendValue="18% this month"
          color="purple"
        />
        <StatsCard
          title="Pending Tests"
          value={stats.pendingTests}
          icon={TestTube}
          trend="down"
          trendValue="8% this week"
          color="yellow"
        />
        <StatsCard
          title="Revenue"
          value={`₹₹{stats.revenue.toLocaleString()}`}
        icon={FaRupeeSign}

          trend="up"
          trendValue="23% this month"
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add User</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Staff</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Product</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="text-orange-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Generate Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff List Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Sarah Wilson"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">Sarah Wilson</p>
                  <p className="text-sm text-gray-500">15 assigned users</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Mike Johnson"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">Mike Johnson</p>
                  <p className="text-sm text-gray-500">12 assigned users</p>
                </div>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Busy</span>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="text-yellow-500 mt-0.5" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New user <span className="font-medium">John Doe</span> registered</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Quality test completed for <span className="font-medium">Organic Fertilizer</span></p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Payment received from <span className="font-medium">Jane Smith</span></p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StaffDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Assigned Users"
          value="15"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Pending Tests"
          value="8"
          icon={TestTube}
          color="yellow"
        />
        <StatsCard
          title="Completed Tasks"
          value="142"
          icon={Activity}
          color="green"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Tasks</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Quality test for Premium Seeds</p>
              <p className="text-sm text-gray-500">Due: Today</p>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Update user profile for John Doe</p>
              <p className="text-sm text-gray-500">Due: Tomorrow</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Profile Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Purchased Products</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-gray-700">Premium Package</span>
                <span className="text-green-600 text-sm">Active</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-700">Quality Test</span>
                <span className="text-blue-600 text-sm">Completed</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Purchases</span>
                <span className="font-medium">₹2,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pest/Disease Alerts</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-500 mr-3" size={20} />
            <div>
              <p className="text-yellow-800 font-medium">No current alerts</p>
              <p className="text-yellow-700 text-sm">Your products are healthy and pest-free</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's what's happening in your agricultural system.
        </p>
      </div>

      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'staff' && <StaffDashboard />}
      {user?.role === 'user' && <UserDashboard />}
    </div>
  );
};

export default Dashboard;