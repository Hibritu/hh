const bcrypt = require('bcrypt');
const { User } = require('../models');

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seeder...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { 
        role: 'admin',
        email: 'admin@hirehub.com' 
      } 
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);
    
    const adminUser = await User.create({
      role: 'admin',
      email: 'admin@hirehub.com',
      phone: '+251911234567',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      gender: 'male',
      is_verified: true, // Admin is pre-verified
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@hirehub.com');
    console.log('🔒 Password: Admin@123456');
    console.log('🆔 Admin ID:', adminUser.id);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  const { sequelize } = require('../config/db');
  
  sequelize.authenticate()
    .then(() => {
      console.log('📡 Database connected');
      return seedAdmin();
    })
    .then(() => {
      console.log('🎉 Admin seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAdmin };