import express from 'express';
import path from 'path';
import AppError from './utils/AppError';
import globalErrorHandler from './controllers/errorController';
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

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(STATIC_URL));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// * 404 Middleware
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `The Path ${req.originalUrl} is not found in this server`,
            404
        )
    );
});

// * Error Handling Middleware.
app.use(globalErrorHandler);

module.exports = app;
