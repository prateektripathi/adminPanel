const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  assignStaff,
  updateQualityTest,
  uploadProductImages,
  getProductStats,
  getLowStockProducts
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');
const { validateRequest, productSchemas } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Admin routes
router.post('/', authorize('admin'), validateRequest(productSchemas.create), createProduct);
router.put('/:id', authorize('admin', 'staff'), validateRequest(productSchemas.update), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);
router.post('/:id/assign-staff', authorize('admin'), assignStaff);
router.post('/:id/images', authorize('admin', 'staff'), upload.array('images', 5), uploadProductImages);
router.get('/admin/stats', authorize('admin'), getProductStats);
router.get('/admin/low-stock', authorize('admin', 'staff'), getLowStockProducts);

// Staff routes
router.put('/:id/quality-test', authorize('staff'), updateQualityTest);

module.exports = router;