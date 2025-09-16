import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Mock data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City',
      paymentStatus: 'paid',
      assignedStaff: 'Sarah Wilson',
      purchases: ['Premium Package', 'Quality Test'],
      joinDate: '2024-01-15',
      totalPurchases: 2500
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, Town',
      paymentStatus: 'pending',
      assignedStaff: 'Mike Johnson',
      purchases: ['Basic Package'],
      joinDate: '2024-02-20',
      totalPurchases: 1200
    }
  ]);

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Sarah Wilson',
      role: 'Senior Quality Inspector',
      email: 'sarah@company.com',
      assignedUsers: 15,
      completedTasks: 142,
      pendingTasks: 8,
      responseTime: '2.3 hours',
      availability: 'Available',
      performance: 95
    },
    {
      id: 2,
      name: 'Mike Johnson',
      role: 'Product Specialist',
      email: 'mike@company.com',
      assignedUsers: 12,
      completedTasks: 98,
      pendingTasks: 5,
      responseTime: '1.8 hours',
      availability: 'Busy',
      performance: 88
    }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Quality Seeds',
      category: 'Seeds',
      stock: 150,
      qualityStatus: 'Approved',
      pestInfo: 'None detected',
      assignedStaff: 'Sarah Wilson',
      price: 49.99,
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=300',
      lastTested: '2024-01-10'
    },
    {
      id: 2,
      name: 'Organic Fertilizer',
      category: 'Fertilizer',
      stock: 85,
      qualityStatus: 'Under Review',
      pestInfo: 'Minor contamination',
      assignedStaff: 'Mike Johnson',
      price: 29.99,
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=300',
      lastTested: '2024-01-12'
    }
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      userId: 1,
      userName: 'John Doe',
      amount: 2500,
      status: 'completed',
      date: '2024-01-15',
      invoice: 'INV-001',
      method: 'Credit Card'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Jane Smith',
      amount: 1200,
      status: 'pending',
      date: '2024-01-20',
      invoice: 'INV-002',
      method: 'Bank Transfer'
    }
  ]);

  const [buckets, setBuckets] = useState({
    pending: [
      { id: 1, title: 'Order #1001', user: 'John Doe', amount: 250, date: '2024-01-20' },
      { id: 2, title: 'Order #1002', user: 'Jane Smith', amount: 180, date: '2024-01-21' }
    ],
    inProgress: [
      { id: 3, title: 'Order #1003', user: 'Bob Wilson', amount: 320, date: '2024-01-18' }
    ],
    completed: [
      { id: 4, title: 'Order #1004', user: 'Alice Brown', amount: 150, date: '2024-01-15' }
    ]
  });

  const stats = {
    totalUsers: users.length,
    totalStaff: staff.length,
    productsSold: 157,
    pendingTests: 12,
    revenue: 45000,
    thisMonth: {
      users: 23,
      sales: 12500,
      tests: 89
    }
  };

  const value = {
    users,
    setUsers,
    staff,
    setStaff,
    products,
    setProducts,
    payments,
    setPayments,
    buckets,
    setBuckets,
    stats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};