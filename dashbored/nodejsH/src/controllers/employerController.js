const { EmployerProfile } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch employer profile' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const { type, company_name, sector, address, phone, website, category, tin_number  } = req.body;
    
    // Validate required fields based on type
    if (type === 'company') {
      const missing = [];
      if (!company_name) missing.push('company_name');
      if (!sector) missing.push('sector');
      if (!address) missing.push('address');
      if (!phone) missing.push('phone');
      if (!category) missing.push('category');
      if (!website) missing.push('website');
      if (!website) missing.push('license_document');
      if (missing.length) return res.status(400).json({ error: `Missing required fields for company: ${missing.join(', ')}` });
    } else if (type === 'individual') {
      const missing = [];
     if (!address) missing.push('address');
      if (!phone) missing.push('phone');
      if (!tin_number) missing.push('tin_number');
      if (!category) missing.push('category');
      if (missing.length) return res.status(400).json({ error: `Missing required fields for individual: ${missing.join(', ')}` });
    }
    
    await profile.update({ type, company_name, sector, address, phone, website, category , tin_number });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update employer profile' });
  }
};



exports.getStatus = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json({ verification_status: profile.verification_status });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get status' });
  }
};
