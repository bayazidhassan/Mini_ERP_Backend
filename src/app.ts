import express from 'express';
import router from './routes';
const app = express();

app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello Mini ERP!');
});

export default app;
