const { prisma } = require('../lib/db');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.users.findFirst({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('Test user already exists!');
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Create user
    const user = await prisma.users.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      }
    });

    console.log('Test user created successfully:', user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 