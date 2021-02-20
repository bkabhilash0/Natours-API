import express from 'express';
import path from 'path';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import morgan from 'morgan';

const app = express();
const STATIC_URL = path.join(__dirname, 'public');

// * Middlewares
app.use((req, _res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(STATIC_URL));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
