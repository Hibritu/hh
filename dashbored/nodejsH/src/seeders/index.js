const { seedAdmin } = require('./adminSeeder');

async function runAllSeeders() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Run admin seeder
    await seedAdmin();
    
    console.log('✅ All seeders completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run all seeders if called directly
if (require.main === module) {
  const { sequelize } = require('../config/db');
  
  sequelize.authenticate()
    .then(() => {
      console.log('📡 Database connected');
      return runAllSeeders();
    })
    .then(() => {
      console.log('🎉 Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { runAllSeeders, seedAdmin };