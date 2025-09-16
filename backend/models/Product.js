const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify product category'],
    enum: ['pesticide', 'fertilizer', 'seeds', 'equipment', 'service'],
  },
  subcategory: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    currentStock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative']
    },
    minStock: {
      type: Number,
      default: 10
    },
    maxStock: {
      type: Number,
      default: 1000
    },
    unit: {
      type: String,
      enum: ['kg', 'litre', 'piece', 'packet'],
      default: 'piece'
    }
  },
  qualityStatus: {
    status: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor', 'expired'],
      default: 'good'
    },
    lastTested: Date,
    testedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    testNotes: String,
    expiryDate: Date
  },
  pestInfo: {
    targetPests: [String],
    effectiveAgainst: [String],
    applicationMethod: String,
    safetyInstructions: String,
    toxicityLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'low'
    }
  },
  assignedStaff: [{
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['quality-tester', 'inventory-manager', 'sales-rep'],
      default: 'quality-tester'
    }
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  manufacturer: {
    name: String,
    contact: String,
    address: String
  },
  salesCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ 'stock.currentStock': 1 });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  const current = this.stock.currentStock;
  const min = this.stock.minStock;
  
  if (current === 0) return 'out-of-stock';
  if (current <= min) return 'low-stock';
  if (current <= min * 2) return 'medium-stock';
  return 'in-stock';
});

// Pre-save middleware to update stock status
productSchema.pre('save', function(next) {
  // Auto-update quality status if expired
  if (this.qualityStatus.expiryDate && this.qualityStatus.expiryDate < new Date()) {
    this.qualityStatus.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);