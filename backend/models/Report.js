const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a report title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['sales', 'inventory', 'user', 'staff', 'pest', 'quality', 'financial'],
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filters: {
    dateRange: {
      startDate: Date,
      endDate: Date
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    staff: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    categories: [String],
    status: [String]
  },
  data: {
    summary: {
      totalRecords: Number,
      totalAmount: Number,
      averageValue: Number,
      growthPercentage: Number
    },
    charts: [{
      type: {
        type: String,
        enum: ['bar', 'line', 'pie', 'doughnut', 'area']
      },
      title: String,
      data: mongoose.Schema.Types.Mixed,
      config: mongoose.Schema.Types.Mixed
    }],
    tables: [{
      title: String,
      headers: [String],
      rows: [[String]]
    }],
    metrics: [{
      name: String,
      value: mongoose.Schema.Types.Mixed,
      unit: String,
      trend: {
        type: String,
        enum: ['up', 'down', 'stable']
      },
      change: Number
    }]
  },
  exports: [{
    format: {
      type: String,
      enum: ['pdf', 'csv', 'excel'],
      required: true
    },
    filePath: String,
    size: Number,
    generatedAt: {
      type: Date,
      default: Date.now
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  }],
  schedule: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextRun: Date,
    lastRun: Date,
    recipients: [String]
  },
  visibility: {
    type: String,
    enum: ['private', 'staff', 'admin', 'public'],
    default: 'private'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ generatedBy: 1, type: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ 'schedule.nextRun': 1, 'schedule.isScheduled': 1 });

module.exports = mongoose.model('Report', reportSchema);