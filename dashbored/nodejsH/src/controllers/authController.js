const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { User, EmployerProfile } = require('../models');
const { sendOtpEmail, sendPasswordResetEmail } = require('../services/emailService');

// Configurable expirations (defaults increased)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';
const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || '30');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { role, email, phone, password, first_name, last_name } = req.body;
    
    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    
    // Check if phone already exists (if phone is provided)
    if (phone && phone.trim() !== '') {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) return res.status(409).json({ error: 'Phone number already registered' });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      role, 
      email, 
      phone: phone && phone.trim() !== '' ? phone : null, // Set to null if empty string
      password: hashed, 
      first_name, 
      last_name,
      is_verified: false // Account starts as unverified
    });
    
    if (role === 'employer') {
      await EmployerProfile.create({ user_id: user.id, type: 'individual', verification_status: 'pending' });
    }
    
    // Generate OTP for email verification
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
    await user.update({ email_otp: otp, email_otp_expires_at: expires });
    
    // Send OTP email
    const emailResult = await sendOtpEmail(email, otp, first_name);
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      // Don't fail registration, but log the error
    }
    
    return res.status(201).json({ 
      message: 'Account created successfully! Please check your email and verify your account before logging in.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: false
      },
      needsVerification: true,
      emailSent: emailResult.success
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: err.errors.map(e => e.message) 
      });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors[0]?.path;
      return res.status(409).json({ 
        error: `${field} already exists`,
        details: `The ${field} you provided is already registered`
      });
    }
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email' });
    
    // Check if email is verified
    if (!user.is_verified) {
      return res.status(401).json({ 
        error: 'Email not verified. Please check your email and verify your account before logging in.',
        needsVerification: true,
        email: user.email
      });
    }
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid password' });
    return res.json({ token: signToken(user), user });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Invalid email' });
    
    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await user.update({ reset_token: token, reset_token_expires_at: expires });
    
    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, token, user.first_name);
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }
    
    return res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    return res.status(500).json({ error: 'Request failed', details: err.message });
  }
};


exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Invalid email' });
    if (!user.email_otp || !user.email_otp_expires_at || user.email_otp_expires_at < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    if (user.email_otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    await user.update({ is_verified: true, email_otp: null, email_otp_expires_at: null });
    return res.json({ message: 'Email verified' });
  } catch (err) {
    return res.status(500).json({ error: 'Verification failed', details: err.message });
  }
};


exports.serveResetForm = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send(`
      <html>
        <head><title>Invalid Reset Link</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Invalid Reset Link</h2>
          <p>The reset link is missing or invalid.</p>
        </body>
      </html>
    `);
  }

  try {
    // Verify token exists and is not expired
    const user = await User.findOne({ where: { reset_token: token } });
    if (!user || !user.reset_token_expires_at || user.reset_token_expires_at < new Date()) {
      return res.status(400).send(`
        <html>
          <head><title>Expired Reset Link</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2>Reset Link Expired</h2>
            <p>This reset link has expired. Please request a new password reset.</p>
          </body>
        </html>
      `);
    }

    // Serve the reset form
    res.send(`
      <html>
        <head>
          <title>Reset Password - HireHub</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 400px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { color: #333; text-align: center; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; color: #555; font-weight: bold; }
            input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
            button { width: 100%; background-color: #007bff; color: white; padding: 12px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
            button:hover { background-color: #0056b3; }
            .error { color: #dc3545; margin-top: 10px; display: none; }
            .success { color: #28a745; margin-top: 10px; display: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Reset Your Password</h2>
            <form id="resetForm">
              <div class="form-group">
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" required minlength="6" placeholder="Enter new password (min 6 characters)">
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm new password">
              </div>
              <button type="submit">Reset Password</button>
              <div id="error" class="error"></div>
              <div id="success" class="success"></div>
            </form>
          </div>

          <script>
            document.getElementById('resetForm').addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const password = document.getElementById('password').value;
              const confirmPassword = document.getElementById('confirmPassword').value;
              const errorDiv = document.getElementById('error');
              const successDiv = document.getElementById('success');
              
              // Hide previous messages
              errorDiv.style.display = 'none';
              successDiv.style.display = 'none';
              
              // Validate passwords match
              if (password !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match';
                errorDiv.style.display = 'block';
                return;
              }
              
              // Validate password length
              if (password.length < 6) {
                errorDiv.textContent = 'Password must be at least 6 characters long';
                errorDiv.style.display = 'block';
                return;
              }
              
              try {
                const response = await fetch('/auth/reset-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    token: '${token}',
                    password: password
                  })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                  successDiv.textContent = 'Password reset successful! You can now login with your new password.';
                  successDiv.style.display = 'block';
                  document.getElementById('resetForm').style.display = 'none';
                } else {
                  errorDiv.textContent = data.error || 'Failed to reset password';
                  errorDiv.style.display = 'block';
                }
              } catch (error) {
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.style.display = 'block';
              }
            });
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send(`
      <html>
        <head><title>Server Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Server Error</h2>
          <p>Something went wrong. Please try again later.</p>
        </body>
      </html>
    `);
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({ where: { reset_token: token } });
    if (!user || !user.reset_token_expires_at || user.reset_token_expires_at < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await user.update({ password: hashed, reset_token: null, reset_token_expires_at: null });
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(500).json({ error: 'Reset failed', details: err.message });
  }
};

exports.debugCurrentOtp = async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).end();
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Invalid email' });
    return res.json({ otp: user.email_otp, expires_at: user.email_otp_expires_at });
  } catch (err) {
    return res.status(500).json({ error: 'Lookup failed', details: err.message });
  }
};
