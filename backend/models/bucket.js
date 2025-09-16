const mongoose = require('mongoose');

const bucketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide bucket name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['orders', 'tasks', 'products', 'users', 'payments'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    role: String
  }],
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      enum: ['order', 'product', 'user', 'payment', 'task'],
      required: true
    },
    quantity: Number,
    value: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    notes: String,
    addedDate: {
      type: Date,
      default: Date.now
    },
    processedDate: Date
  }],
  timeline: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  metrics: {
    totalItems: {
      type: Number,
      default: 0
    },
    completedItems: {
      type: Number,
      default: 0
    },
    totalValue: {
      type: Number,
      default: 0
    },
    averageProcessingTime: Number,
    completionRate: Number
  },
  deadlines: {
    startDate: Date,
    dueDate: Date,
    estimatedCompletion: Date,
    actualCompletion: Date
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
bucketSchema.index({ type: 1, status: 1 });
bucketSchema.index({ 'assignedTo.user': 1 });
bucketSchema.index({ createdAt: -1 });

// Update metrics before saving
bucketSchema.pre('save', function(next) {
  this.metrics.totalItems = this.items.length;
  this.metrics.completedItems = this.items.filter(item => item.status === 'completed').length;
  this.metrics.totalValue = this.items.reduce((total, item) => total + (item.value || 0), 0);
  
  if (this.metrics.totalItems > 0) {
    this.metrics.completionRate = (this.metrics.completedItems / this.metrics.totalItems) * 100;
  }
  
  next();
});

module.exports = mongoose.model('Bucket', bucketSchema);