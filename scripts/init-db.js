// Database initialization script for Vercel deployment
// This ensures tables are created if they don't exist

const { PrismaClient } = require('@prisma/client');

async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Initializing database...');
    
    // Try to create a test record to ensure tables exist
    // This will trigger Prisma to create tables if they don't exist
    await prisma.gameState.upsert({
      where: { id: 'current' },
      update: {},
      create: { id: 'current', currentHole: 1 }
    });
    
    await prisma.courseSetup.upsert({
      where: { id: 'current' },
      update: {},
      create: { id: 'current' }
    });
    
    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { initializeDatabase };