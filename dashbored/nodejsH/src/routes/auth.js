const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('role').isIn(['job_seeker', 'employer']).withMessage('role must be job_seeker or employer'),
  body('email').isEmail().withMessage('Must be a valid email').custom(value => {
    if (!value.endsWith('@gmail.com')) {
      throw new Error('Only Gmail addresses (@gmail.com) are allowed');
    }
    return true;
  }),
  body('phone').optional().isLength({ min: 10 }).withMessage('Phone must be at least 10 characters'),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isString(),
], authController.login);

router.post('/forgot-password', [
  body('email').isEmail(),
], authController.forgotPassword);

router.get('/reset-password', authController.serveResetForm);

router.post('/reset-password', [
  body('token').isString(),
  body('password').isLength({ min: 6 }),
], authController.resetPassword);

router.post('/verify-email', [
  body('email').isEmail(),
  body('otp').isLength({ min: 4 }),
], authController.verifyEmail);



// Dev only: GET /auth/debug-otp?email=...
router.get('/debug-otp', authController.debugCurrentOtp);
// Dev only: GET /auth/debug-reset-token?email=...


module.exports = router;
