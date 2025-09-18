# MadhuMitra Panel - Agricultural Management System

A comprehensive React-based administrative panel for agricultural businesses with role-based access control, user management, product tracking, and analytics.

## 🌟 Features

### 1. Dashboard (Landing Page)
- **Admin View**: Complete overview with stats cards, quick actions, staff preview, alerts, and activity timeline
- **Staff View**: Personalized dashboard with assigned users, pending tests, and task management
- **User View**: Profile overview, purchased products, and pest/disease alerts

### 2. User Management
- **Admin**: Full CRUD operations, bulk upload, staff assignment, payment management
- **Staff**: View and manage assigned users only
- **User**: Personal profile management and support tickets

### 3. Staff Management (Admin Only)
- Staff performance analytics and metrics
- Task assignment and workload management
- Staff availability and shift management
- Internal messaging system

### 4. Product/Service Management
- **Admin**: Complete product lifecycle management
- **Staff**: Update quality tests, pest reports for assigned products
- **User**: View purchased products and receive pest alerts

### 5. Payments/Orders
- **Admin**: Full payment management, invoice generation, refunds
- **Staff**: View payments for assigned users
- **User**: Personal payment history and invoice downloads

### 6. Reports/Analytics
- Interactive charts and data visualization
- Custom report builder with filters
- Export functionality (PDF, Excel, CSV)
- Role-based data access

### 7. Bucket Management
- Kanban-style order management
- Drag-and-drop functionality
- Order status tracking
- Real-time updates

### 8. Global Features
- **RBAC**: Comprehensive role-based access control
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: User preference toggle
- **Search & Filter**: Global search functionality
- **Notifications**: Real-time in-app notifications
- **Audit Logs**: Track all system activities

## 🚀 Technology Stack

- **Frontend**: React 18 with JSX
- **Styling**: Tailwind CSS (Professional level)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **State Management**: Context API
- **Build Tool**: Vite

## 📱 Demo Accounts

### Admin Account
- **Email**: admin@example.com
- **Password**: password
- **Access**: Full system access

### Staff Account
- **Email**: staff@example.com
- **Password**: password
- **Access**: Limited to assigned users and tasks

### User Account
- **Email**: user@example.com
- **Password**: password
- **Access**: Personal data only

## 🎨 Design Features

- **Apple-level aesthetics** with attention to detail
- **Professional color system** with 6 color ramps
- **Consistent 8px spacing system**
- **Modern typography** with proper line spacing
- **Smooth animations** and micro-interactions
- **Responsive breakpoints** for all devices
- **Accessible design** with proper contrast ratios

## 📊 Key Components

### Layout Components
- `Layout/Layout.jsx` - Main application layout
- `Layout/Sidebar.jsx` - Navigation sidebar with role filtering
- `Layout/Header.jsx` - Top header with notifications and profile

### UI Components
- `UI/StatsCard.jsx` - Reusable statistics display cards
- `UI/DataTable.jsx` - Advanced data table with search, filter, pagination
- `UI/Modal.jsx` - Flexible modal component

### Pages
- `Dashboard.jsx` - Role-based dashboard views
- `UserManagement.jsx` - User CRUD operations
- `StaffManagement.jsx` - Staff performance and management
- `ProductManagement.jsx` - Product lifecycle management
- `PaymentsOrders.jsx` - Payment processing and history
- `Reports.jsx` - Analytics and reporting
- `BucketManagement.jsx` - Kanban-style order management

### Context Providers
- `AuthContext.jsx` - Authentication and user management
- `DataContext.jsx` - Application data state
- `NotificationContext.jsx` - Real-time notifications

## 🔐 Security Features

- Role-based route protection
- Component-level access control
- Secure authentication flow
- Audit trail logging
- Input validation and sanitization

## 📱 Responsive Design

- **Mobile**: Optimized for screens < 768px
- **Tablet**: Enhanced experience for 768px - 1024px
- **Desktop**: Full feature access for > 1024px
- **Touch-friendly**: Optimized for mobile interactions

## 🛠️ Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 File Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── ProtectedRoute.jsx
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   └── UI/
│       ├── StatsCard.jsx
│       ├── DataTable.jsx
│       └── Modal.jsx
├── contexts/
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   └── NotificationContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── UserManagement.jsx
│   ├── StaffManagement.jsx
│   ├── ProductManagement.jsx
│   ├── PaymentsOrders.jsx
│   ├── Reports.jsx
│   └── BucketManagement.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 Key Features by Role

### Admin Capabilities
- Complete system oversight
- User and staff management
- Financial operations
- Report generation
- System configuration

### Staff Capabilities
- Assigned user management
- Task completion tracking
- Quality test updates
- Limited reporting access

### User Capabilities
- Profile management
- Purchase history
- Payment tracking
- Support requests

## 🔄 Data Flow

1. **Authentication**: Context-based user state management
2. **Authorization**: Component-level role checking
3. **Data Management**: Centralized state with Context API
4. **Notifications**: Real-time system alerts
5. **Routing**: Protected routes based on user roles

## 🌐 Production Ready

- Optimized bundle size
- Code splitting for better performance
- Error boundaries for graceful error handling
- Loading states and user feedback
- Accessibility compliance (WCAG guidelines)

## 📈 Future Enhancements

- Real-time WebSocket integration
- Progressive Web App (PWA) capabilities
- Multi-language support
- Advanced analytics with AI insights
- Mobile app companion

## 🤝 Contributing

This is a demonstration project showcasing modern React development practices with professional-grade UI/UX design principles.

## 📞 Support

For questions or support regarding this agricultural management system, please refer to the documentation or contact the development team.

---

**Built with ❤️ using React, Tailwind CSS, and modern web development best practices.**