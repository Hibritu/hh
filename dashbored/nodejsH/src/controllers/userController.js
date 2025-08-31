const { User } = require('../models');
const { validationResult } = require('express-validator');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateMe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Extract profile updates from body
    const {
      gender,
      education,
      skills,
      experience,
      preferred_categories,
      preferred_locations
    } = req.body;

    const updates = {};
    
    // Add profile fields if provided
    if (gender !== undefined) updates.gender = gender;
    if (education !== undefined) updates.education = education;
    if (skills !== undefined) updates.skills = skills;
    if (experience !== undefined) updates.experience = experience;
    
    // Handle array fields - parse if string, use as-is if already array
    if (preferred_categories !== undefined) {
      try {
        updates.preferred_categories = typeof preferred_categories === 'string' 
          ? preferred_categories.split(',').map(cat => cat.trim())
          : Array.isArray(preferred_categories) 
            ? preferred_categories 
            : [preferred_categories];
      } catch (err) {
        console.error('Error parsing preferred_categories:', err);
        updates.preferred_categories = [];
      }
    }
    
    if (preferred_locations !== undefined) {
      try {
        updates.preferred_locations = typeof preferred_locations === 'string'
          ? preferred_locations.split(',').map(loc => loc.trim())
          : Array.isArray(preferred_locations)
            ? preferred_locations
            : [preferred_locations];
      } catch (err) {
        console.error('Error parsing preferred_locations:', err);
        updates.preferred_locations = [];
      }
    }

    // Handle file uploads if present
    if (req.files) {
      if (req.files.resume) {
        updates.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
      if (req.files.profile_picture) {
        updates.profile_picture = `/uploads/pictures/${req.files.profile_picture[0].filename}`;
      }
    }

    // Update user with all changes
    await user.update(updates);
    
    // Prepare response
    const response = {
      message: 'Profile updated successfully',
      user: user,
      updated_fields: Object.keys(updates)
    };

    // Add file upload confirmations
    if (updates.resume) response.resume_uploaded = true;
    if (updates.profile_picture) response.picture_uploaded = true;

    return res.json(response);
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};
