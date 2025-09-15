import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Payment Overdue',
      message: '3 users have overdue payments',
      time: '5 mins ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Quality Test Completed',
      message: 'Organic Fertilizer batch #123 passed quality test',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'New User Registration',
      message: 'Alice Johnson has registered as a new user',
      time: '2 hours ago',
      read: true
    }
  ]);

  const addNotification = (notification) => {
    setNotifications(prev => [
      { ...notification, id: Date.now(), time: 'Just now', read: false },
      ...prev
    ]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const value = {
    notifications,
    addNotification,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};