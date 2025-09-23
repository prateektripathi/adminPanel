import React, { useState } from 'react';
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
import { FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import StatsCard from '../components/UI/StatsCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, setStats } = useData();
  const { notifications } = useNotifications();

  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', additional: '' });

  const openModal = (type) => {
    setFormType(type);
    setFormData({ name: '', email: '', additional: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (formType === 'user') res = await axios.post('/api/users', formData);
      if (formType === 'staff') res = await axios.post('/api/staff', formData);
      if (formType === 'product') res = await axios.post('/api/products', formData);

      // Refresh stats from backend
      const statsRes = await axios.get('/api/dashboard');
      setStats(statsRes.data.stats);

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Error adding ' + formType);
    }
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} trend="up" trendValue="12% this month" color="blue" />
        <StatsCard title="Total Staff" value={stats.totalStaff} icon={UserCheck} trend="up" trendValue="5% this month" color="green" />
        <StatsCard title="Products Sold" value={stats.productsSold} icon={Package} trend="up" trendValue="18% this month" color="purple" />
        <StatsCard title="Pending Tests" value={stats.pendingTests} icon={TestTube} trend="down" trendValue="8% this week" color="yellow" />
        <StatsCard title="Revenue" value={`₹${stats.revenue?.toLocaleString()}`} icon={FaRupeeSign} trend="up" trendValue="23% this month" color="green" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => openModal('user')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add User</span>
          </button>
          <button onClick={() => openModal('staff')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Staff</span>
          </button>
          <button onClick={() => openModal('product')} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Product</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="text-orange-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Staff Overview & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
          {/* Example staff cards */}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          {/* Render notifications */}
          {notifications.slice(0,3).map(n => (
            <div key={n.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <AlertTriangle className="text-yellow-500 mt-0.5" size={16} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {/* Static example */}
      </div>
    </div>
  );

  const StaffDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Assigned Users" value={stats.assignedUsers} icon={Users} color="blue" />
        <StatsCard title="Pending Tests" value={stats.pendingTests} icon={TestTube} color="yellow" />
        <StatsCard title="Completed Tasks" value={stats.completedTasks} icon={Activity} color="green" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Tasks</h3>
        {/* Render staff tasks */}
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Profile Overview</h3>
        {/* User profile, purchases & account status */}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pest/Disease Alerts</h3>
        {/* Pest alerts */}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Here's what's happening in your agricultural system.</p>
      </div>

      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'staff' && <StaffDashboard />}
      {user?.role === 'user' && <UserDashboard />}

      {/* Modal for Quick Actions */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Add {formType}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg"
                required
              />
              {(formType === 'user' || formType === 'staff') && (
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              )}
              {formType === 'product' && (
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.additional}
                  onChange={e => setFormData({ ...formData, additional: e.target.value })}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              )}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
