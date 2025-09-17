const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const upload = require('multer')({ dest: process.env.UPLOAD_DIR || 'uploads/' });
const { list, get, create, update, remove, bulkUpload } = require('../controllers/userController');

router.use(protect);
router.get('/', rbac(['admin','staff']), list);
router.post('/', rbac(['admin']), create);
router.get('/:id', rbac(['admin','staff']), get);
router.put('/:id', rbac(['admin','staff']), update);
router.delete('/:id', rbac(['admin']), remove);
router.post('/bulk', rbac(['admin']), upload.single('file'), bulkUpload);

module.exports = router;
