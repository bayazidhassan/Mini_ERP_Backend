import cors from 'cors';
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './routes';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://mini-erp-bd.vercel.app'],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello Mini ERP!');
});

app.use(globalErrorHandler);

export default app;
