const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const multer = require('multer');
const storage = multer.diskStorage({ destination: (req,file,cb)=>cb(null, process.env.UPLOAD_DIR||'uploads'), filename:(req,file,cb)=>cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage });

const { list, create, update, addTestLog } = require('../controllers/productController');

router.use(protect);
router.get('/', rbac(['admin','staff']), list);
router.post('/', rbac(['admin']), upload.fields([{name:'images'}]), create);
router.put('/:id', rbac(['admin','staff']), update);
router.post('/:id/test', rbac(['admin','staff']), addTestLog);

module.exports = router;
