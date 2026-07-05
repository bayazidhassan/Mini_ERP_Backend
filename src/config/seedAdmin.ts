import { User } from '../modules/users/user_model';

export const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not set in .env file.');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin is already exists.');
      return;
    }

    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      role: 'admin',
      password: process.env.ADMIN_PASSWORD || '12345678',
    });
    console.log('Admin user is seeded successfully.');
  } catch (error) {
    console.error('Failed to seed admin:', error);
  }
};
