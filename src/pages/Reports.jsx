import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, Filter, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('overview');

  const isAdmin = user?.role === 'admin';

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 12000 },
    { month: 'Feb', sales: 3000, revenue: 9000 },
    { month: 'Mar', sales: 5000, revenue: 15000 },
    { month: 'Apr', sales: 4500, revenue: 13500 },
    { month: 'May', sales: 6000, revenue: 18000 },
    { month: 'Jun', sales: 5500, revenue: 16500 }
  ];

  const productData = [
    { name: 'Premium Seeds', value: 400, color: '#3B82F6' },
    { name: 'Organic Fertilizer', value: 300, color: '#10B981' },
    { name: 'Pesticides', value: 200, color: '#F59E0B' },
    { name: 'Tools', value: 100, color: '#EF4444' }
  ];

  const staffPerformanceData = [
    { name: 'Sarah Wilson', completed: 142, pending: 8, efficiency: 95 },
    { name: 'Mike Johnson', completed: 98, pending: 12, efficiency: 88 },
    { name: 'Alice Brown', completed: 156, pending: 4, efficiency: 97 },
    { name: 'Bob Davis', completed: 89, pending: 15, efficiency: 82 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Analytics & Reports' : 'My Reports'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin 
              ? 'Comprehensive insights and analytics for your business'
              : 'View reports for your assigned tasks and users'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          {isAdmin && (
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Download size={16} />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Categories</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'overview', name: 'Overview', icon: TrendingUp },
            { id: 'sales', name: 'Sales Report', icon: BarChart },
            { id: 'products', name: 'Product Analysis', icon: PieChart },
            { id: 'staff', name: 'Staff Performance', icon: BarChart }
          ].filter(item => isAdmin || item.id === 'overview' || item.id === 'staff').map((item) => (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                reportType === item.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={16} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts and Analytics */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales & Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" name="Sales" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue ($)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">$84,000</p>
                </div>
                <div className="text-green-600 text-sm font-medium">+12.5%</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600">Total Orders</p>
                  <p className="text-2xl font-bold text-green-900">1,247</p>
                </div>
                <div className="text-green-600 text-sm font-medium">+8.3%</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-purple-600">Active Users</p>
                  <p className="text-2xl font-bold text-purple-900">342</p>
                </div>
                <div className="text-green-600 text-sm font-medium">+15.2%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'sales' && isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" name="Units Sold" />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {reportType === 'products' && isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {productData.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: product.color }}
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product.value} units</p>
                    <p className="text-sm text-gray-500">#{index + 1} seller</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === 'staff' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAdmin ? 'Staff Performance Overview' : 'My Performance'}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={isAdmin ? staffPerformanceData : [staffPerformanceData[0]]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending Tasks" />
              <Bar dataKey="efficiency" fill="#3B82F6" name="Efficiency %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Export Options */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={20} className="text-blue-600" />
              <span>Export as PDF</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={20} className="text-green-600" />
              <span>Export as Excel</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={20} className="text-purple-600" />
              <span>Export as CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;