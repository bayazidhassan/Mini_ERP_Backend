import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import { seedAdmin } from './config/seedAdmin';

const startServer = async () => {
  try {
    await connectDB();

    await seedAdmin();

    app.listen(process.env.PORT, () => {
      console.log(`Mini ERP is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server: ', error);
    process.exit(1);
  }
};

startServer();
