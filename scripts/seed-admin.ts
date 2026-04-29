import connectDB from '../lib/db';
import User from '../models/User';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    console.error('Missing ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_NAME');
    process.exit(1);
  }

  await connectDB();

  const existingAdmin = await User.findOne({
    email: adminEmail.trim().toLowerCase(),
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await User.create({
    name: adminName.trim(),
    email: adminEmail.trim().toLowerCase(),
    password: adminPassword,
    role: 'admin',
  });

  console.log('Admin created successfully');
  process.exit(0);
}

main().catch((error) => {
  console.error('Failed to seed admin:', error);
  process.exit(1);
});