const express = require('express');
const multer = require('multer');
const path = require('path');
const employerController = require('../controllers/employerController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const licenseStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads', 'licenses')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadLicense = multer({ storage: licenseStorage });


router.get('/me', authenticate, authorize(['employer', 'admin']), employerController.getMe);
router.put('/me', authenticate, authorize(['employer']), employerController.updateMe);

router.get('/me/status', authenticate, authorize(['employer', 'admin']), employerController.getStatus);

module.exports = router;


