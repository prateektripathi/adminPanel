# Pest Management System Backend

A comprehensive Node.js backend API for agricultural pest management system with role-based access control.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Staff, User)
- Password hashing with bcrypt
- Password reset functionality
- Email verification

### User Management
- User registration and profile management
- Staff assignment to users
- Bulk user upload via CSV/Excel
- User statistics and analytics
- Export user data

### Product Management
- Product catalog with categories
- Stock management and alerts
- Quality testing and status tracking
- Product image uploads
- Pest information tracking

### Payment System
- Order management
- Payment tracking and status
- Invoice generation (PDF)
- Payment reminders
- Refund processing

### Reporting & Analytics
- Sales reports
- User analytics
- Staff performance metrics
- Custom report generation
- Data export (CSV, Excel, PDF)

### Bucket Management
- Task organization
- Order tracking
- Status management
- Timeline tracking

### Notification System
- Email notifications
- In-app notifications
- Payment reminders
- Task assignments

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Excel Processing**: excel4node
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
pest-management-backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── productController.js # Product management
│   ├── paymentController.js # Payment processing
│   ├── reportController.js  # Reports & analytics
│   ├── bucketController.js  # Bucket management
│   ├── staffController.js   # Staff management
│   └── notificationController.js # Notifications
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── validation.js       # Request validation
│   ├── errorHandler.js     # Error handling
│   └── upload.js           # File upload handling
├── models/
│   ├── User.js             # User schema
│   ├── Product.js          # Product schema
│   ├── Payment.js          # Payment schema
│   ├── Report.js           # Report schema
│   └── Bucket.js           # Bucket schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User routes
│   ├── products.js         # Product routes
│   ├── payments.js         # Payment routes
│   ├── reports.js          # Report routes
│   ├── buckets.js          # Bucket routes
│   ├── staff.js            # Staff routes
│   └── notifications.js    # Notification routes
├── utils/
│   └── sendEmail.js        # Email utility
├── uploads/                # File uploads directory
├── .env                    # Environment variables
├── server.js               # Main server file
└── package.json            # Dependencies
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pest-management-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pest-management
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_NAME=Pest Management System

# File Upload
MAX_FILE_SIZE=5000000
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Management Endpoints

#### Get All Users (Admin/Staff)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210"
}
```

#### Assign Staff to User
```http
POST /api/users/:id/assign-staff
Authorization: Bearer <token>
Content-Type: application/json

{
  "staffIds": ["staff_id_1", "staff_id_2"]
}
```

### Product Management Endpoints

#### Get All Products
```http
GET /api/products
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pesticide XYZ",
  "description": "Effective against common pests",
  "category": "pesticide",
  "subcategory": "insecticide",
  "price": 299.99,
  "stock": {
    "currentStock": 100,
    "minStock": 10,
    "unit": "litre"
  }
}
```

#### Update Quality Test (Staff)
```http
PUT /api/products/:id/quality-test
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "excellent",
  "testNotes": "Quality test passed",
  "expiryDate": "2024-12-31"
}
```

### Payment Endpoints

#### Create Payment
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "user": "user_id",
  "amount": 599.98,
  "paymentMethod": "card",
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "unitPrice": 299.99
    }
  ]
}
```

#### Get Payment History
```http
GET /api/payments
Authorization: Bearer <token>
```

### Staff Management Endpoints

#### Get All Staff (Admin)
```http
GET /api/staff
Authorization: Bearer <token>
```

#### Assign Tasks to Staff
```http
POST /api/staff/:id/assign-tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "tasks": [
    {
      "type": "quality_test",
      "productId": "product_id",
      "dueDate": "2024-01-15"
    }
  ]
}
```

### Report Endpoints

#### Generate Sales Report (Admin)
```http
POST /api/reports/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "sales",
  "filters": {
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  }
}
```

#### Export Report
```http
GET /api/reports/:id/export?format=pdf
Authorization: Bearer <token>
```

## 🔐 Role-Based Access Control

### Admin Permissions
- Full access to all endpoints
- User management (create, read, update, delete)
- Staff management and assignment
- Product management
- Payment processing and refunds
- Report generation and analytics
- System configuration

### Staff Permissions
- View assigned users only
- Update quality tests
- Manage assigned products
- View payment status of assigned users
- Generate reports for assigned resources
- Update task status

### User Permissions
- View own profile and update personal info
- View purchased products
- View payment history and invoices
- Raise support tickets
- View pest alerts for owned products

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **File Upload Security**: Type and size restrictions

## 📊 Database Schema

### User Schema
- Personal information (name, email, phone, address)
- Authentication (password, role, tokens)
- Profile data (farm size, crop types, occupation)
- Payment status and purchase history
- Staff assignments and notifications

### Product Schema
- Product details (name, description, category, price)
- Stock management (current, min, max stock)
- Quality status and test results
- Pest information and effectiveness
- Staff assignments and images

### Payment Schema
- Order information and items
- Payment status and method
- Invoice generation and tracking
- Billing and shipping details
- Refund processing

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pest-management
JWT_SECRET=super-secure-production-secret
CLIENT_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "pest-management-api"
pm2 startup
pm2 save
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "next": { "page": 2, "limit": 25 },
    "prev": { "page": 1, "limit": 25 }
  },
  "data": [
    // Array of results
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact:
- Email: support@pestmanagement.com
- Documentation: [API Docs](https://api.pestmanagement.com/docs)

## 🔄 Changelog

### v1.0.0 (2024-01-01)
- Initial release
- User authentication and authorization
- Product management system
- Payment processing
- Report generation
- Staff management
- Notification system