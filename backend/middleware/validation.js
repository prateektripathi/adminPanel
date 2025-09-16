const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: errorMessage
      });
    }
    
    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string().default('India')
    }),
    role: Joi.string().valid('admin', 'staff', 'user').default('user')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
    profile: Joi.object({
      dateOfBirth: Joi.date(),
      occupation: Joi.string(),
      farmSize: Joi.number().min(0),
      cropTypes: Joi.array().items(Joi.string())
    })
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).required(),
    category: Joi.string().valid('pesticide', 'fertilizer', 'seeds', 'equipment', 'service').required(),
    subcategory: Joi.string().required(),
    price: Joi.number().min(0).required(),
    stock: Joi.object({
      currentStock: Joi.number().min(0).required(),
      minStock: Joi.number().min(0).default(10),
      maxStock: Joi.number().min(0).default(1000),
      unit: Joi.string().valid('kg', 'litre', 'piece', 'packet').default('piece')
    }).required()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500),
    category: Joi.string().valid('pesticide', 'fertilizer', 'seeds', 'equipment', 'service'),
    subcategory: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.object({
      currentStock: Joi.number().min(0),
      minStock: Joi.number().min(0),
      maxStock: Joi.number().min(0),
      unit: Joi.string().valid('kg', 'litre', 'piece', 'packet')
    })
  })
};

// Payment validation schemas
const paymentSchemas = {
  create: Joi.object({
    user: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    paymentMethod: Joi.string().valid('cash', 'card', 'upi', 'bank_transfer', 'cheque').required(),
    items: Joi.array().items(Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required()
    })).min(1).required()
  })
};

module.exports = {
  validateRequest,
  userSchemas,
  productSchemas,
  paymentSchemas
};