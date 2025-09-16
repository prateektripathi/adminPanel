import React, { useState } from 'react';
import { Eye, Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Modal from '../components/UI/Modal';

const PaymentsOrders = () => {
  const { user } = useAuth();
  const { payments } = useData();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  const isUser = user?.role === 'user';

  // Filter payments based on role
  const displayPayments = isUser 
    ? payments.filter(p => p.userId === user.id) 
    : isStaff 
    ? payments.filter(p => p.assignedStaff === user.name)
    : payments;

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const PaymentDetailModal = () => (
    <Modal
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      title="Payment Details"
      size="lg"
    >
      {selectedPayment && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Invoice Number</label>
                  <p className="font-medium">{selectedPayment.invoice}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Customer</label>
                  <p className="font-medium">{selectedPayment.userName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Amount</label>
                  <p className="font-medium text-green-600">${selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Payment Method</label>
                  <p className="font-medium">{selectedPayment.method}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Status & Date</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Payment Status</label>
                  <span className={`block px-2 py-1 rounded-full text-xs font-medium w-fit ${
                    selectedPayment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Payment Date</label>
                  <p className="font-medium">{selectedPayment.date}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Transaction ID</label>
                  <p className="font-medium text-gray-600">TXN-{selectedPayment.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Items Purchased</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Premium Package</span>
                <span className="font-medium">$1,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Quality Test Service</span>
                <span className="font-medium">$500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Processing Fee</span>
                <span className="font-medium">$50.00</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${selectedPayment.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Download size={16} />
              <span>Download Invoice</span>
            </button>
            {isAdmin && selectedPayment.status === 'pending' && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Mark as Paid
              </button>
            )}
            {isAdmin && (
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Refund Payment
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isUser ? 'My Payments' : 'Payments & Orders'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isUser 
              ? 'View your payment history and download invoices'
              : isAdmin 
              ? 'Manage all payments and generate invoices'
              : 'View payments for your assigned users'
            }
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <CreditCard size={16} />
              <span>Process Payment</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              <Download size={16} />
              <span>Export Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {!isUser && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$45,000</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">$12,500</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isUser ? 'Payment History' : 'All Payments'}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{payment.invoice}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{payment.userName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-green-600">${payment.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download Invoice"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentDetailModal />
    </div>
  );
};

export default PaymentsOrders;