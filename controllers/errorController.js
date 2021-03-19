import AppError from '../utils/AppError';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    // const value = err.errmsg.match(/(["'])(.*?[^\\])\1/);
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use a different Value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((error) => error.message);
    const message = `Invalid Input Data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please Login Again', 401);
const handleTokenExpiredError = () =>
    new AppError('Session Expired.Please Login Again!', 401);

const sendErrorDev = (req, err, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went Wrong',
            message: err.message,
        });
    }
};

const sendErrorProd = (req, err, res) => {
    if (req.originalUrl.startsWith('api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // * Programming Error - Not to be disclosed to the Client!
        console.error('ERROR 😢', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
    // * For Rendered Website.
    if (err.isOperational) {
        res.status(err.statusCode).render('error', {
            title: 'Something went Wrong',
            message: err.message,
        });
    } else {
        // * Programming Error - Not to be disclosed to the Client!
        console.error('ERROR 😢', err);
        res.status(err.statusCode).render('error', {
            title: 'Something went Wrong',
            message: 'Please Try Again Later',
        });
    }
};

// * Error Handling Middleware.
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(req, err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        if (err.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        if (err.name === 'TokenExpiredError') {
            error = handleTokenExpiredError();
        }
        sendErrorProd(req, error, res);
    }
};
