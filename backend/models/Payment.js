const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque'],
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  invoice: {
    invoiceNumber: {
      type: String,
      unique: true
    },
    generatedAt: Date,
    pdfPath: String,
    sentToEmail: {
      type: Boolean,
      default: false
    }
  },
  transaction: {
    transactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    paymentDate: Date,
    bankReference: String
  },
  billing: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  shipping: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  refund: {
    amount: Number,
    reason: String,
    processedDate: Date,
    refundId: String
  },
  notes: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reminders: [{
    sentAt: Date,
    type: {
      type: String,
      enum: ['email', 'sms', 'call'],
      default: 'email'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }]
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ 'invoice.invoiceNumber': 1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save middleware to generate invoice number
paymentSchema.pre('save', function(next) {
  if (!this.invoice.invoiceNumber && this.status === 'completed') {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoice.invoiceNumber = `INV-${year}${month}-${random}`;
    this.invoice.generatedAt = new Date();
  }
  next();
});

// Calculate total amount virtual
paymentSchema.virtual('totalAmount').get(function() {
  const itemsTotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  return itemsTotal + (this.shipping ? this.shipping.cost : 0);
});

module.exports = mongoose.model('Payment', paymentSchema);