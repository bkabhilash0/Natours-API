import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitizer from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import moment from 'moment';
import path from 'path';
import AppError from './utils/AppError';
import globalErrorHandler from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import reviewRouter from './routes/reviewRoutes';
import morgan from 'morgan';

const time = moment().format('Do MMMM YYYY - HH:mm:ss');
console.log(time);
const app = express();
const STATIC_URL = path.join(__dirname, 'public');

// * Middlewares
app.use((req, _res, next) => {
    req.requestTime = moment().format('Do MMMM YYYY - HH:mm:ss');
    next();
});

// * Global Middlewares.
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// ? 100 Requests from same IP for an Hour.
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP! Please try again after an hour.',
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));

// * Data-Sanitization against NoSQL Injection and XSS.
app.use(mongoSanitizer());
app.use(xss());
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);
app.use(express.static(STATIC_URL));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
