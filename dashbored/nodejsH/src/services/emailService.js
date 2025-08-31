const nodemailer = require('nodemailer');

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail app-specific password
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 60000      // 60 seconds
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service configuration error:', error);
    console.error('Please check GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
  } else {
    console.log('Email service ready');
  }
});

// Send OTP email
async function sendOtpEmail(email, otp, firstName) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'HireHub - Email Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">HireHub Email Verification</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>Hello ${firstName},</p>
              <p>Thank you for registering with HireHub! Please use the following OTP to verify your email address:</p>
              <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p><strong>This OTP will expire in 30 minutes.</strong></p>
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p> 2025 HireHub. All rights reserved.</p>
            </div>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully to:', email);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      lastError = error;
      console.error(`Failed to send OTP email (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('All OTP email attempts failed:', lastError);
  return { success: false, error: lastError.message };
}

// Send password reset email
async function sendPasswordResetEmail(email, resetToken, firstName) {
  try {
    const resetUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'HireHub - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">HireHub Password Reset</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hello ${firstName},</p>
            <p>You requested a password reset for your HireHub account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>Or copy this link manually: <a href="${resetUrl}">${resetUrl}</a></p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p> 2025 HireHub. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail
};