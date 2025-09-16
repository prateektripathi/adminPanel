import React, { useState } from 'react';
import { Plus, MoreVertical, Calendar, DollarSign, User, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Modal from '../components/UI/Modal';

const BucketManagement = () => {
  const { user } = useAuth();
  const { buckets } = useData();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const bucketConfig = [
    { id: 'pending', title: 'Pending Orders', color: 'border-yellow-200 bg-yellow-50', headerColor: 'bg-yellow-100' },
    { id: 'inProgress', title: 'In Progress', color: 'border-blue-200 bg-blue-50', headerColor: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', color: 'border-green-200 bg-green-50', headerColor: 'bg-green-100' }
  ];

  const handleDragStart = (e, item, sourceStatus) => {
    setDraggedItem({ ...item, sourceStatus });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    // Handle moving items between buckets
    console.log(`Moving item from ${draggedItem?.sourceStatus} to ${targetStatus}`);
    setDraggedItem(null);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const OrderDetailModal = () => (
    <Modal
      isOpen={showOrderModal}
      onClose={() => setShowOrderModal(false)}
      title="Order Details"
      size="lg"
    >
      {selectedOrder && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Order ID</label>
                  <p className="font-medium">{selectedOrder.title}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Customer</label>
                  <p className="font-medium">{selectedOrder.user}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Order Date</label>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Amount</label>
                  <p className="font-medium text-green-600">${selectedOrder.amount}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="font-medium capitalize">{selectedOrder.status || 'pending'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Priority</label>
                  <p className="font-medium">Medium</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Premium Seeds (2kg)</span>
                <span className="font-medium">$99.98</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Quality Test Service</span>
                <span className="font-medium">$50.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="font-medium">$15.00</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${selectedOrder.amount}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Order Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Order Placed</span>
                <span className="text-blue-600">{selectedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Payment Confirmed</span>
                <span className="text-blue-600">{selectedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Processing Started</span>
                <span className="text-blue-600">In Progress</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {!isUser && (
              <>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Update Status
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Add Notes
                </button>
              </>
            )}
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              Print Order
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  // Filter buckets for users to show only their orders
  const displayBuckets = isUser ? {
    pending: buckets.pending.filter(order => order.user === user?.name || order.user === 'John Doe'),
    inProgress: buckets.inProgress.filter(order => order.user === user?.name || order.user === 'John Doe'),
    completed: buckets.completed.filter(order => order.user === user?.name || order.user === 'John Doe')
  } : buckets;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isUser ? 'My Orders' : 'Bucket Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isUser 
              ? 'Track your order status and progress'
              : 'Manage orders with drag-and-drop Kanban board'
            }
          </p>
        </div>
        
        {!isUser && (
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={16} />
            <span>Add Order</span>
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(displayBuckets).flat().length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{displayBuckets.pending.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{displayBuckets.inProgress.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{displayBuckets.completed.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="text-green-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bucketConfig.map((bucket) => (
          <div
            key={bucket.id}
            className={`rounded-xl border-2 ${bucket.color} min-h-96`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, bucket.id)}
          >
            <div className={`${bucket.headerColor} p-4 rounded-t-xl border-b border-gray-200`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{bucket.title}</h3>
                <span className="bg-white text-gray-700 text-sm px-2 py-1 rounded-full">
                  {displayBuckets[bucket.id].length}
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {displayBuckets[bucket.id].map((order) => (
                <div
                  key={order.id}
                  draggable={!isUser}
                  onDragStart={(e) => handleDragStart(e, order, bucket.id)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{order.title}</h4>
                    {!isUser && (
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User size={14} />
                      <span>{order.user}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign size={14} />
                      <span>${order.amount}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar size={14} />
                      <span>{order.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        High Priority
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      <Eye size={14} />
                      <span className="text-xs">View</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {displayBuckets[bucket.id].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <OrderDetailModal />
    </div>
  );
};

export default BucketManagement;