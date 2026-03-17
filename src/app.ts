import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './modules/user/user.routes';
import authRouter from './modules/auth/auth.routes';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/api', (_req, res, next) => {
  return res.json({ message: 'API is working' });
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/', (_req, res) => {
  res.send('API is running');
});

export default app;