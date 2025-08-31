const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Combined storage for multiple file types
const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, path.join(process.cwd(), 'uploads', 'resumes'));
    } else if (file.fieldname === 'profile_picture') {
      cb(null, path.join(process.cwd(), 'uploads', 'pictures'));
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadFiles = multer({ 
  storage: combinedStorage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      // Accept PDF files for resume
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Resume must be a PDF file'), false);
      }
    } else if (file.fieldname === 'profile_picture') {
      // Accept image files for profile picture
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Profile picture must be an image file'), false);
      }
    } else {
      cb(new Error('Invalid field name'), false);
    }
  }
});

router.get('/me', authenticate, authorize(['job_seeker', 'employer', 'admin']), userController.getMe);

// Combined endpoint for all profile updates including file uploads
router.put('/me', 
  authenticate, 
  authorize(['job_seeker', 'employer']), 
  uploadFiles.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profile_picture', maxCount: 1 }
  ]),
  [
    body('gender').optional().isIn(['male', 'female']),
    body('education').optional().isString(),
    body('skills').optional().isString(),
    body('experience').optional().isString(),
    body('preferred_categories').optional().isString(),
    body('preferred_locations').optional().isString(),
  ], 
  userController.updateMe
);

module.exports = router;
