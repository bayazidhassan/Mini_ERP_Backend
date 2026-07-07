import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import connectDB from './config/db';
import { seedAdmin } from './config/seedAdmin';
import { initSocket } from './socket';

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initSocket(httpServer);

const startServer = async () => {
  try {
    await connectDB();

    await seedAdmin();

    httpServer.listen(PORT, () =>
      console.log(`Mini ERP server running on port ${process.env.PORT}`),
    );
  } catch (error) {
    console.error('❌ Failed to start server: ', error);
    process.exit(1);
  }
};

startServer();
