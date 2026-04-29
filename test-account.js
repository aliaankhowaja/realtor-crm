const mongoose = require('mongoose');

async function createTestAccounts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/realtor-crm');
    
    const User = require('./models/User.ts').default;
    
    // Create admin
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✓ Admin account created: admin@test.com / password123');
    } else {
      console.log('✓ Admin account already exists');
    }

    // Create agent
    const agentExists = await User.findOne({ email: 'agent@test.com' });
    if (!agentExists) {
      await User.create({
        name: 'Agent User',
        email: 'agent@test.com',
        password: 'password123',
        role: 'agent'
      });
      console.log('✓ Agent account created: agent@test.com / password123');
    } else {
      console.log('✓ Agent account already exists');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createTestAccounts();
