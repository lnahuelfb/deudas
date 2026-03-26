import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Routes from './routes';
import { env } from './config/env';

const app = express();

const allowedOrigins = [env.ORIGIN, 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/api', (_req, res) => {
  return res.json({ message: 'API is working' });
});


app.use('/api', Routes);

app.get('/', (_req, res) => {
  res.send('API is running');
});

export default app;